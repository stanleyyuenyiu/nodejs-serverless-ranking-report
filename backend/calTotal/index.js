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
    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body);
        qtys = typeof(body.qtys) == "undefined" ? []:body.qtys;
        group = typeof(body.group) == "undefined" ? "":body.group;
    }else{
        callback(null,null);
    }
	let query = [];
	
	qtys.map((item) => { 
	    totalQty += item.qty
	    query.push(item.sku)
	 })
	 
    getProducts(query,group,qtys, function(products){
        getRules(function(rules) {
            rules.map((rule) => {
                products.map( (p) => { applyRules(rule, p, group) })
            });
            let total = 0;
            products.map( (p) => {
                if(typeof(p.discountedQty) != "undefined")
                {
                    total +=  ((p.finalPrice * 100 * p.discountedQty)/100);
                }else{
                    
                    total += ((p.finalPrice * 100 * p.qty)/100);
                }
            });
            
            total = total.toDec(2)
            
            callback(null, {
		        "statusCode": 200,
		        "headers": {
			        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
			        "Access-Control-Allow-Headers": "content-type,origin,text,startlower",
			        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
			      },
		        "body": JSON.stringify({"total":total})
		    });
        });
    });     

}
Number.prototype.toDec = function (decCount) {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    
    if(this.toString().split(".").length < decCount)
    {
        return this.valueOf();
    }
    
    let int = this.toString().split(".")[0];
    let dec = this.toString().split(".")[1];
    
    if(dec.length <= decCount)
    {
        return this.valueOf();
    }
    return parseFloat(int + "." + dec.substring(0, decCount));
}
function applyRules(rule, p, group){
       if(filterRules(rule.action, group, p.sku))
       {
           switch(rule.action.type)
           {
               case "buy_x_get_y":
                   if(rule.action.discount_step != "" && p.qty >= rule.action.discount_step)
                   {
                       let reminder = p.qty%rule.action.discount_step;
                       
                       if(reminder == 0)
                        {
                            p.discountedQty = p.qty - ((p.qty/rule.action.discount_step) * rule.action.discount);
                        }
                        else{
                            p.discountedQty = p.qty - ( ( (p.qty-reminder) / rule.action.discount_step) * rule.action.discount);
                        }
                   }
                   break;
           }
       }
}

function getProducts(query,group,qtys, callback){
    var productParams = {
		TableName : process.env.TABLE_NAME_PRODUCT,
		FilterExpression: 'contains (:q, sku)',
        ExpressionAttributeValues : {   
            ':q' : query
        }
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

function getRules(callback){
    var rulesParam = {
		TableName : process.env.TABLE_NAME_RULES
	};
    return documentClient.scan(rulesParam, function(err, data){
		if(err){
		    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
		    throw new Error(err)
		}else{
		   let result = data.Items.filter((r) => filterRules(r, group));
		    callback(result)
		}
	});
}

function filterRules(rule, customerGroup, sku){
    
    if(rule.conditions.length == 0) {
        return true;
    }
    let con = true;
    
    for (var i = 0, len = rule.conditions.length; i < len; i++) {
        switch(rule.conditions[i].entity)
        {
            case "customer_group":
                con = filterCondition(rule.conditions[i], customerGroup);
                break;
            case "total_qty":
                con = filterCondition(rule.conditions[i], totalQty);
                break;
            case "sku":
                con = filterCondition(rule.conditions[i], sku);
                break;
        }
        
        if(!con)
           return false;
    }
    
    return con;
}

function filterCondition(condition, val){
    switch(condition.operation)
    {
        case "eq":
            return val == condition.value;
        case "ne":
            return val != condition.value;
        case "gt":
            return val > condition.value;
        case "ge":
            return val >= condition.value;
        case "lt":
            return val < condition.value;
        case "le":
            return val <= condition.value;
    }
}
