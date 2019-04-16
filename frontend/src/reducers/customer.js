import { combineReducers } from 'redux'
import { LOGIN, LOGOUT } from 'Actions/customer'



const customerstatus = (state = {}, action) =>{
    if(action.type == LOGIN){
            return {
                ...state,
                [action.key]: action.payload.group
            }
    }
    if(action.type == LOGOUT){
        delete state[action.key];
    }
    return state;
}


const customer = combineReducers({
    customerstatus
})
export default customer