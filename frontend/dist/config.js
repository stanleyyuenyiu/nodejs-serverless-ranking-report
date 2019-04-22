var awsConfig = {
    API:{
        endpoints: [
            {
                name: "RestAPI",
                endpoint: "https://o6mr4aunn9.execute-api.ap-southeast-1.amazonaws.com/v1",
                region: "ap-southeast-1"
            }
        ]
    },
    Auth:{
        identityPoolId: "ap-southeast-1:b4436e22-426b-48df-b327-ccd93a201e6b", 
        userPoolId: "ap-southeast-1_gpKTFKSqa",
        UserPoolWebClientId: "6qh50r5i0ljmln4kqlaki5l3jo",
        region: "ap-southeast-1"
    }
}