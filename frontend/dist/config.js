var awsConfig = {
    API:{
        endpoints: [
            {
                name: "{ApiId}",
                endpoint: "{ApiBaseUrl}",
                region: "{Region}"
            }
        ]
    },
    Auth:{
        identityPoolId: "{IdPoolId}", 
        userPoolId: "{UserPoolId}",
        UserPoolWebClientId: "{UserPoolWebClientId}",
        region: "{Region}"
    }
}
