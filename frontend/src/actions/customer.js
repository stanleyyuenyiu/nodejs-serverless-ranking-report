export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
import { actions } from 'react-redux-form';
export function login({ group,  ...payload}) {
	 return {
        type: LOGIN,
        key: "group",
        payload: {
            group
        }
    };
}


export function logout({ ...payload}) {

     return {
        type: LOGOUT,
        key: "group"
    };
}


export const reset = () => (dispatch, getState) => {
    return dispatch(actions.reset("login"))
}