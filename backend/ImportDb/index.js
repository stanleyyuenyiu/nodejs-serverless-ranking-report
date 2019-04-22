	const AWS = require('aws-sdk');
	const csv = require('csvtojson');
	const md5 = require('md5');
	const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
	AWS.config.update({region: 'ap-southeast-1'});
	
	exports.handler = async (event, context, callback) => {
		
		if(typeof(event.data) == "undefined" || typeof(event.data.bucket) == "undefined" || typeof(event.data.key) == "undefined")
        	throw new Error("input data incorrect")

		const params = {
		  Bucket: event.data.bucket,
		  Key: event.data.key
		};

		let requests = await csvToJSON(params);
		await toDb(requests);
		console.log("import done");
		return new Promise((resolve, reject) => resolve( {"success":true} ) );
	};
	
	async function csvToJSON(params)  {
		  const S3 = new AWS.S3();
		  const stream = S3.getObject(params).createReadStream();
		  const json = await csv().fromStream(stream);
		  let requests = [];
		  json.map((v,k) => {
			let oKey = Object.keys(v)[0].split("|");
			
			let oVal = Object.values(v)[0].split("|");
			
			if(oKey.length != 3)
			  throw new Error("data format incorrect")
			  
			if(oKey.indexOf("date") < 0 || oKey.indexOf("website") < 0 || oKey.indexOf("visits") < 0)
			  throw new Error("data format incorrect")
			
			
			let o = {PutRequest : {Item: {}}}
			
			let domain =  getDomain(oVal[oKey.indexOf("website")]);
			
			let key = oVal[oKey.indexOf("date")]+oVal[oKey.indexOf("website")]+oVal[oKey.indexOf("visits")];
			
			o.PutRequest.Item = {
				id : {"S": md5(key)},
				_date : {"S":oVal[oKey.indexOf("date")]},
				_domain : {"S":domain},
				_website : {"S":oVal[oKey.indexOf("website")]},
				_visits : {"N":oVal[oKey.indexOf("visits")]}
			}
			
			requests.push(o);
		  })
		  return requests;
	}
	
	async function toDb(requests){
		let dataset = [], slice = 25;
		  
		let request = {
			RequestItems: {
			}
		}
		
		request.RequestItems[process.env.TABLE_NAME] = [];

		while(requests.length > slice)
		{
			request.RequestItems[process.env.TABLE_NAME] = requests.slice(0, slice);

			await ddb.batchWriteItem(request, function(e, d) {
				if (e) {
				  throw new Error(e)
				}
			});

			requests = requests.slice(slice, requests.length);

			if(requests.length < slice)
			{
				request.RequestItems[process.env.TABLE_NAME] = requests;
				
				await ddb.batchWriteItem(request, function(e, d) {
					if (e) {
					  throw new Error(e)
					}
				});
			}
		}
	}

	const getHostName = (url) => {
	    var match = url.match(/(www[0-9]?\.)?(.[^/:]+)/i);
	    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
	    return match[2];
	    }
	    else {
	        return null;
	    }
	}
	
	const getDomain = (url) => {
	    var hostName = getHostName(url);
	    var domain = hostName;
	   
	    if (hostName != null) {
	        var parts = hostName.split('.').reverse();
	        if (parts != null && parts.length > 1) {
	            domain = parts[1] + '.' + parts[0];
	            if (parts.length > 2 && ["com", "org" , "net", "int", "edu" , "gov" , "mil", "arpa"].indexOf(parts[1]) !== -1) {
	              domain = parts[2] + '.' + domain;
	            }
	        }
	    }
	    
	    return domain;
	}