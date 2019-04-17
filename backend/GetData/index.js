const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient(); 
const lambda = new AWS.Lambda({
  region: 'ap-southeast-1'
});
const LIMIT = 5;
let from = "";
let to = "";

exports.handler = function(event, context, callback){
	if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        from = typeof(event.queryStringParameters.startDate) == "undefined" ? "":event.queryStringParameters.startDate;
        to = typeof(event.queryStringParameters.endDate) == "undefined" ? "":event.queryStringParameters.endDate;
    }

    from = from == "" ? formatDate("1970-01-01") : formatDate(from);
    to = to == "" ? formatDate(new Date().toString()) : formatDate(to);

	getDBData(from,to, function(data){
			if(data != null && data.length > 0) {
				data.sort(sortData({property: "_visits", isNumeric : true}));
				data = getMostVisitsData(data,LIMIT)
			}else{
				data = [];
			}

			callback(null, {
	        "statusCode": 200,
	        "headers": {
		        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
		        "Access-Control-Allow-Headers": "content-type,origin,text,startlower",
		        "Access-Control-Allow-Methods": "GET, POST,OPTIONS"
		      },
	        "body": JSON.stringify(data)
	    });
	})
}

const getDBData = (from , to, callback) => {
	var params = {
		TableName : process.env.TABLE_NAME,
		FilterExpression: "#dt between :from and :to",
        ExpressionAttributeNames: {
			"#dt": "_date"
		},
		ExpressionAttributeValues: {
			 ":from": from,
			 ":to": to
		}
	};
	
    ddb.scan(params, function(err, data){
		if(err){
		    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
		    throw new Error(err)
		}else{
			return getFilteredData(data.Items, callback)
		}
	});
}

const getFilteredData = (data, callback) => {
	lambda.invoke({
      FunctionName: process.env.INVOKE_FUNCTION,
      Payload: JSON.stringify({"data":data }, null, 2) // pass params
    }, function(e, d) {
      if (e) {
         throw new Error(e)
      }
      if(d){
        callback(JSON.parse(d.Payload));
      }
    });	  
}

const sortData = ({property, desc = true, isNumeric = false}) => {
    return function (a,b) {
        if(desc){
            return b[property].toString().localeCompare(a[property].toString(), undefined, {'numeric': isNumeric});
        }else{
            return a[property].toString().localeCompare(b[property].toString(), undefined, {'numeric': isNumeric});
        }        
    }
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

const getMostVisitsData = (data , limit) => {
	let topFive = []
	data = data.filter((d) =>{
		if(topFive.length < limit && topFive.indexOf(d._website) == -1)
		{
			topFive.push(d._website);
			return true;
		}
		else
		{
			return false;
		}
	})
	return data;
} 