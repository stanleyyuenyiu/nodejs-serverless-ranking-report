'use strict';
 
var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 
 var lambda = new AWS.Lambda({
          region: 'ap-southeast-1' //change to your region
        });
let group = "";
let totalQty = 0;
let qtys = [];      
exports.handler = function(event, context, callback){
	if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        group = typeof(event.queryStringParameters.group) == "undefined" ? "":event.queryStringParameters.group;
    }
    
	getProducts(group,qtys, function(products){
			callback(null, {
	        "statusCode": 200,
	        "headers": {
		        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
		        "Access-Control-Allow-Headers": "content-type,origin,text,startlower",
		        "Access-Control-Allow-Methods": "GET, POST,OPTIONS"
		      },
	        "body": JSON.stringify(products)
	    });
	})
		    
		

}

function getProducts(group,qtys, callback){
    var productParams = {
		TableName : process.env.TABLE_NAME
	};
	
		  
	let result = [];
	documentClient.scan(productParams, function(err, data){
		if(err){
		    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
		    throw new Error(err)
		}else{

		    lambda.invoke({
              FunctionName: process.env.INVOKE_FUNCTION,
              Payload: JSON.stringify({"items":data.Items, "group":group, "qtys":qtys}, null, 2) // pass params
            }, function(e, d) {
                		 
              if (e) {
                 throw new Error(e)
              }
              
              if(d){
                callback(JSON.parse(d.Payload))
              }
            });
            
		}
	});
}