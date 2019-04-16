#!/bin/sh

profile=$1
if [ -z "$profile" ]
then
    profile="default"
fi 
export S3Bucket=backendbucket-api-$RANDOM
export GITClonedPath=$(pwd)
export AWS_DEFAULT_REGION=ap-southeast-1

 
echo "---------------------------------------------------------------------------------------------------"
echo "Pack File"
echo "---------------------------------------------------------------------------------------------------"
rm $GITClonedPath/backend/getProductsPrice/getProductsPrice.zip
rm $GITClonedPath/backend/getProducts/getProducts.zip
rm $GITClonedPath/backend/calTotal/calTotal.zip
cd $GITClonedPath/backend/getProductsPrice && zip getProductsPrice.zip index.js
cd $GITClonedPath/backend/getProducts && zip getProducts.zip index.js
cd $GITClonedPath/backend/calTotal && zip calTotal.zip index.js
cd $GITClonedPath
echo "---------------------------------------------------------------------------------------------------"
echo "Make S3Bucket"
echo "---------------------------------------------------------------------------------------------------"
aws s3 mb s3://$S3Bucket --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Uploading API"
echo "---------------------------------------------------------------------------------------------------"
aws s3 cp $GITClonedPath/backend/calTotal/calTotal.zip s3://$S3Bucket/calTotal.zip --profile=$profile
aws s3 cp $GITClonedPath/backend/getProducts/getProducts.zip s3://$S3Bucket/getProducts.zip --profile=$profile
aws s3 cp $GITClonedPath/backend/getProductsPrice/getProductsPrice.zip s3://$S3Bucket/getProductsPrice.zip --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Creating cloudformation stack for backend"
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation create-stack --stack-name backend --template-body file://$GITClonedPath/cf/backend.json --capabilities CAPABILITY_IAM --parameters ParameterKey=S3Bucket,ParameterValue=$S3Bucket --profile=my
echo "---------------------------------------------------------------------------------------------------"
echo "Wait cloudformation stack finish..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation wait stack-create-complete --stack-name backend --profile=$profile


echo "---------------------------------------------------------------------------------------------------"
echo "Insert demo data to Database"
echo "---------------------------------------------------------------------------------------------------"
aws dynamodb batch-write-item --request-items file://$GITClonedPath/data/products.json --profile=$profile
aws dynamodb batch-write-item --request-items file://$GITClonedPath/data/sales.json --profile=$profile

echo "---------------------------------------------------------------------------------------------------"
echo "Apply cloudformation output to frontend config..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation describe-stacks --stack-name backend --query Stacks[0].Outputs --profile=$profile | jq -r '.[] | .OutputKey + ";"+ .OutputValue' | while IFS='' read -r data; do \
K="$(cut -d';' -f1 <<<"$data")"; \
V="$(cut -d';' -f2 <<<"$data")"; \
file=$GITClonedPath/frontend/dist/config.js; \
sed -i '' -e 's|'{$K}'|'$V'|g' $file ; \
done;

echo "---------------------------------------------------------------------------------------------------"
echo "Creating cloudformation stack for frontend"
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation create-stack --stack-name frontend --template-body file://$GITClonedPath/cf/frontend.json --capabilities CAPABILITY_IAM --profile=$profile

echo "---------------------------------------------------------------------------------------------------"
echo "Wait cloudformation stack finish..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation wait stack-create-complete --stack-name frontend --profile=$profile

echo "---------------------------------------------------------------------------------------------------"
echo "Export output of the cloudformation"
echo "---------------------------------------------------------------------------------------------------"

aws cloudformation describe-stacks --stack-name frontend --query Stacks[0].Outputs --profile=$profile | jq -r '.[] | .OutputKey + ";"+ .OutputValue' >> frontend_output.json
while IFS='' read -r data; do \
K="$(cut -d';' -f1 <<<"$data")"; \
V="$(cut -d';' -f2 <<<"$data")"; \

    if [ "$K" == "BucketName" ]
    then
        export S3BucketFrontend=$V
    elif [ "$K" == "CloudFrontUrl" ]
    then
        export CloudFrontUrl=$V
    elif [ "$K" == "CloudFrontId" ]
    then
        export CloudFrontId=$V
    elif [ "$K" == "BucketUrlForOAIVerify" ]
    then
        export BucketUrlForOAIVerify=$V
    fi
done < frontend_output.json;
rm frontend_output.json

echo "Uploading frontend file to S3"
aws s3 cp $GITClonedPath/frontend/dist/index.html s3://$S3BucketFrontend/index.html --profile=$profile
aws s3 cp $GITClonedPath/frontend/dist/config.js s3://$S3BucketFrontend/config.js --profile=$profile
aws s3 cp $GITClonedPath/frontend/dist/build.js s3://$S3BucketFrontend/build.js --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "--------------------------------------------Final Output-------------------------------------------"
echo "Bucket URL For OAI Verify: "$BucketUrlForOAIVerify;
echo "Cloud Front URL For Verify(it may delay caused by the distribution of cloudfront): "$CloudFrontUrl;

echo "---------------------------------------------------------------------------------------------------"
echo "Finish"
echo "---------------------------------------------------------------------------------------------------"
