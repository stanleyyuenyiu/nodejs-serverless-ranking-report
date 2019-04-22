# Auto Deploy & Installation

## prerequisite

MAC OS only

Install aws-cli 
https://docs.aws.amazon.com/en_us/cli/latest/userguide/cli-chap-install.html

Install jq
https://stedolan.github.io/jq/download/

Install zip

Configurate default aws profile
https://docs.aws.amazon.com/en_us/cli/latest/userguide/cli-chap-configure.html

## How to use
1. Clone the project from https://github.com/stanleyyuenyiu/simple-serverless-ranking-report

2. Navigate to the project clone path, run below command, it will use your default aws profile to execute
```
sh run.sh
```
Optional: 
To execute with other aws profile, replace below "[my_profile_name]" with your aws profile
```
sh run.sh [my_profile_name]
```

## Output
The setup script will output 2 items at the very bottom of the terminal

e.g
```
--------------------------------------------Final Output-------------------------------------------
Bucket URL Verify: https://s3-ap-southeast-1.amazonaws.com/frontend-frontendbucket-1k9ej1478kae/index.html
Bucket for upload csv: backendbucket-upload-18922
```

# Application Usage

## Upload Data with profile
```
aws s3 cp {your csv path} s3://{the Bucket for Upload that output by above process}/data.csv --profile=$profile
```
## Upload Data without profile
```
aws s3 cp {your csv path} s3://{the Bucket for Upload that output by above process}/data.csv
```






