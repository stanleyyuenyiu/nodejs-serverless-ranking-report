import { combineReducers } from 'redux'
import apiCallStatus from './apiCallStatus'
import { REQUEST, SUCCESS, FAILURE, SET_DATE } from 'Actions/report'


const entities = (state = {
}, action) => {
    if (action.response && action.response.data) {
        return {
            ...state,
            [action.key]: action.response.data
        }
    }

   return state
}


const reportAction = (state = {}, action) =>{
    if(action.type == SET_DATE){
            return {
                ...state,
                [action.key]: action.payload
            }
    }
    return state;
}

const report = combineReducers({
    entities,
    reportAction,
    apiStatus: apiCallStatus({
        mapActionToKey: action => action.key,
        types: [
            REQUEST,
            SUCCESS,
            FAILURE
        ]
    })
})
export default report