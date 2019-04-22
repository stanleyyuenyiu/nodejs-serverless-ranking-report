#!/bin/sh

profile=$1
if [ -z "$profile" ]
then
    profile="default"
fi 
export S3Bucket=backendbucket-api-$RANDOM
export S3Bucket_upload=backendbucket-upload-$RANDOM
export GITClonedPath=$(pwd)
export AWS_DEFAULT_REGION=ap-southeast-1


echo "---------------------------------------------------------------------------------------------------"
echo "Pack File"
echo "---------------------------------------------------------------------------------------------------"
rm $GITClonedPath/backend/GetData/GetData.zip
rm $GITClonedPath/backend/FilterData/FilterData.zip
rm $GITClonedPath/backend/ImportDb/ImportDb.zip
rm $GITClonedPath/backend/SQSWorker/SQSWorker.zip
cd $GITClonedPath/backend/GetData && zip GetData.zip index.js
cd $GITClonedPath/backend/FilterData && zip FilterData.zip index.js
cd $GITClonedPath/backend/ImportDb && zip -r ImportDb.zip ./
cd $GITClonedPath/backend/SQSWorker && zip -r SQSWorker.zip ./
cd $GITClonedPath
echo "---------------------------------------------------------------------------------------------------"
echo "Make S3Bucket"
echo "---------------------------------------------------------------------------------------------------"
aws s3 mb s3://$S3Bucket --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Uploading API"
echo "---------------------------------------------------------------------------------------------------"
aws s3 cp $GITClonedPath/backend/GetData/GetData.zip s3://$S3Bucket/GetData.zip --profile=$profile
aws s3 cp $GITClonedPath/backend/FilterData/FilterData.zip s3://$S3Bucket/FilterData.zip --profile=$profile
aws s3 cp $GITClonedPath/backend/ImportDb/ImportDb.zip s3://$S3Bucket/ImportDb.zip --profile=$profile
aws s3 cp $GITClonedPath/backend/SQSWorker/SQSWorker.zip s3://$S3Bucket/SQSWorker.zip --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Creating cloudformation stack for Auth"
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation create-stack --stack-name auth --template-body file://$GITClonedPath/cf/auth.json --capabilities CAPABILITY_NAMED_IAM --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Wait cloudformation stack finish..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation wait stack-create-complete --stack-name auth --profile=$profile

echo "---------------------------------------------------------------------------------------------------"
echo "Apply cloudformation output to frontend config..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation describe-stacks --stack-name auth --query Stacks[0].Outputs --profile=$profile | jq -r '.[] | .OutputKey + ";"+ .OutputValue' | while IFS='' read -r data; do \
K="$(cut -d';' -f1 <<<"$data")"; \
V="$(cut -d';' -f2 <<<"$data")"; \
file=$GITClonedPath/frontend/dist/config.js; \
sed -i '' -e 's|'{$K}'|'$V'|g' $file ; \
done;

echo "---------------------------------------------------------------------------------------------------"
echo "Creating cloudformation stack for backend"
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation create-stack --stack-name backend --template-body file://$GITClonedPath/cf/backend.json --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=S3Bucket,ParameterValue=$S3Bucket --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Wait cloudformation stack finish..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation wait stack-create-complete --stack-name backend --profile=$profile
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
echo "Creating cloudformation stack for background_job"
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation create-stack --stack-name background-job --template-body file://$GITClonedPath/cf/background_job.json --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=S3BucketName,ParameterValue=$S3Bucket_upload --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "Wait cloudformation stack finish..."
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation wait stack-create-complete --stack-name background-job --profile=$profile


echo "---------------------------------------------------------------------------------------------------"
echo "Creating cloudformation stack for frontend"
echo "---------------------------------------------------------------------------------------------------"
aws cloudformation create-stack --stack-name frontend --template-body file://$GITClonedPath/cf/frontend.json --capabilities CAPABILITY_NAMED_IAM --profile=$profile

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
    elif [ "$K" == "BucketUrl" ]
    then
        export BucketUrl=$V
    fi
done < frontend_output.json;
rm frontend_output.json
echo $BucketUrl;
echo "Uploading frontend file to S3"
aws s3 cp $GITClonedPath/frontend/dist/index.html s3://$S3BucketFrontend/index.html --profile=$profile
aws s3 cp $GITClonedPath/frontend/dist/config.js s3://$S3BucketFrontend/config.js --profile=$profile
aws s3 cp $GITClonedPath/frontend/dist/index.js s3://$S3BucketFrontend/index.js --profile=$profile
aws s3api put-object-acl --bucket $S3BucketFrontend --key index.html --acl public-read
aws s3api put-object-acl --bucket $S3BucketFrontend --key config.js --acl public-read
aws s3api put-object-acl --bucket $S3BucketFrontend --key index.js --acl public-read

echo "---------------------------------------------------------------------------------------------------"
echo "Import CSV to bucket"
echo "---------------------------------------------------------------------------------------------------"
aws s3 cp $GITClonedPath/data.csv s3://$S3Bucket_upload/data.csv --profile=$profile
sleep 10
aws s3 cp $GITClonedPath/data.csv s3://$S3Bucket_upload/data.csv --profile=$profile
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "---------------------------------------------------------------------------------------------------"
echo "--------------------------------------------Final Output-------------------------------------------"
echo "Bucket URL For Verify: "$BucketUrl;
echo "Bucket For Upload csv: "$S3Bucket_upload;
echo "---------------------------------------------------------------------------------------------------"
echo "Finish"
echo "---------------------------------------------------------------------------------------------------"
