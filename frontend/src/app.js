import API  from '@aws-amplify/api';
import Auth  from '@aws-amplify/auth';
// retrieve temporary AWS credentials and sign requests
API.configure({
        endpoints: window.__initialState.awsConfig.API.endpoints
});
Auth.configure(window.__initialState.awsConfig.Auth);

let click = false
async function callAPI(){
	let apiName = window.__initialState.awsConfig.API.endpoints[0].name;
	let path = '/'+apiName; 
	let myInit = { // OPTIONAL
	    headers: {}, // OPTIONAL
	    response: true
	}
	return await API.get(apiName, path, myInit).then(response => {
	    try{
	    //	var obj = JSON.parse(response)
	    	var products = response.data
	    	if(products != null && products.length >0)
	    	{
	    		var html = "";
	    		for(var i=0;i<products.length; i++)
	    		{
	    			 html += "<div><h3>"+products[i].name+"</h3><button>+</button><span>"+products[i].qty+"</span><button>-</button></div>"

	    		}
	    		document.getElementById("Result").innerHTML = html;
	    	}
	    	console.log(products)
	    }catch(e){
	    	console.log(e);
	    	document.getElementById("Result").innerHTML = "Fail to fetch IP, please retry";
	    }
	    click = false;
	}).catch(error => {
		document.getElementById("Result").innerHTML = "Fail to fetch IP, please retry";
	    console.log(error.response)
	    click = false;
	});
}

callAPI();

