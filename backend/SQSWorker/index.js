var AWS = require('aws-sdk')
var lambda = new AWS.Lambda({
  region: 'ap-southeast-1'
});
var sqs = new AWS.SQS({
   region: 'ap-southeast-1'
}); 
const NUM_OF_RETRIES = 3;

exports.handler = function(event, context, callback) {
  
  try{
      console.log("Start Worker");
      
      let sqsMessage = JSON.parse(event.Records[0].body);
      
      console.log("reading queue body", sqsMessage.Records);
      
      sqsMessage.Records.forEach(item => {
        importDB({bucket: item.s3.bucket.name, key: item.s3.object.key}, function(d){
          console.log("Finish importDB")
          console.log("Result", d)
        })
      });
    }catch(e){
      console.log("error", e)
      console.log("Retry")
      retry(event);
    }
}

const retry = (event) =>{
  
  var message = JSON.parse(event.Records[0].body); 
  var retried =  message.retryCount | 0;
  
  if (retried > NUM_OF_RETRIES-1) {
      const response = "Failed after retries";
      console.log(response);
  } else {
      retried++;
      message.retryCount = retried;
      var queueUrl = process.env.SQS;
      var params = {
          MessageBody: JSON.stringify(message),
          QueueUrl: queueUrl,
          DelaySeconds: 10
      };

      sqs.sendMessage(params, function (err, data) {
          if (err) {
              console.log("Failed to retry after error", err);
          } else {
              const response =  "Failed, but will retry " + retried + " time";
              console.log(response);
          }
      });
  }
}

const importDB = (data, callback) => {
  console.log("Start importDB")
  console.log("Param", data)
    lambda.invoke({
      FunctionName: process.env.INVOKE_FUNCTION,
      Payload: JSON.stringify({"data":data }, null, 2) // pass params
    }, function(e, d) {
      if (e) {
         throw new Error(e)
      }
      callback(JSON.parse(d.Payload));
  });     
}
