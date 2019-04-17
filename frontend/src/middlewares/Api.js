export const CALL_API = 'CallAPI'
export const API_RES_JSON = 'API_RES_JSON';
export const API_METHOD_POST = 'API_METHOD_POST';
export const API_METHOD_GET = 'API_METHOD_GET';
export const API_METHOD_PUT = 'API_METHOD_PUT';

import { spinnerService } from 'Components/Common/Spinner';
import API  from '@aws-amplify/api';
import Auth  from '@aws-amplify/auth';

const DEFAULT_API_ERR = {
    code: "0000"
}


async function callAPI2(callback){
    let apiName = window.__initialState.awsConfig.API.endpoints[0].name;
    let path = '/'+apiName; 
    let myInit = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true
    }
    return await API.get(apiName, path, myInit)
        .then(callback)
        .catch(error => {
            console.log(error.response)
        });
}



async function  callApi({endpoint, resType, method, payload})  {
  
    let myInit = { 
        headers: {}, 
        response: true
    }
    
    spinnerService.show('mainSpinner');

    if(method == API_METHOD_POST)
    {
        myInit.body = payload;
        return await API.post(endpoint, '/'+endpoint, myInit)
            .then((response) => { 
                spinnerService.hide('mainSpinner');
                return handleJsonRes(response)}
            )
            .catch(error => {
                spinnerService.hide('mainSpinner');
                return Promise.reject(DEFAULT_API_ERR);
            });
    }

   
    let path = endpoint;
    let query = "";
    if(JSON.stringify(payload) != "{}")
    {
        for(var key in payload) {
            query +=  ((query == "" ? "?" : "&") + (key+"="+payload[key]))
        }
        
    }else{
        var d = new Date();
        var n = d.getTime();
        query+=  "?s="+n.toString()
    }

    path += query;
    return await API.get("rest_api", '/'+path, myInit)
        .then((response) => { 
            spinnerService.hide('mainSpinner');
            return handleJsonRes(response)}
        )
        .catch(error => {
            spinnerService.hide('mainSpinner');
            return Promise.reject(DEFAULT_API_ERR);
        });

}

const handleJsonRes = (response) => {

    if (response.data) {
        return Promise.resolve({ data: response.data });
    }
    return Promise.reject(response.data.error || DEFAULT_API_ERR);

}


export default store => next => action => {

    const callAPI = action[CALL_API]

    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { endpoint} = callAPI
    const { types,
            resType,
            method = API_METHOD_GET,
            payload = {}
    } = callAPI

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof resType !== 'string') {
        throw new Error('Specify a string API response content type.')
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }

    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [ requestType, successType, failureType ] = types


    next(actionWith({ type: requestType}))

    const callApiPayload = {
        endpoint,
        resType,
        payload,
        method
    }

    return callApi(callApiPayload).then(
        response =>  next(actionWith({
            response,
            type: successType
        })),
        error => {
            next(actionWith({
                type: failureType,
                error: error || DEFAULT_API_ERR
            }))
        }
    )
}