import { combineReducers } from 'redux'
import apiCallStatus from './apiCallStatus'
import { REQUEST, SUCCESS, FAILURE, ADD_TO_CART,INIT_CART } from 'Actions/cart'


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
        

const cartaction = (state = {}, action) =>{
    if(action.type == ADD_TO_CART){
            return {
                ...state,
                [action.key]: action.payload.qty
            }
    }
    if(action.type == INIT_CART){
            return {
                ...state,
                [action.key]: action.payload.qty
            }
    }
    return state;
}


const cart = combineReducers({
    entities,
    cartaction,
    apiStatus: apiCallStatus({
        mapActionToKey: action => action.key,
        types: [
            REQUEST,
            SUCCESS,
            FAILURE
        ]
    })
})
export default cart