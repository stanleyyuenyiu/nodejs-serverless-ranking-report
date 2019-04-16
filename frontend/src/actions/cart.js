import { CALL_API,
    API_RES_JSON, API_METHOD_POST
} from 'Middlewares/api'


export const REQUEST = 'CART_REQUEST'
export const SUCCESS = 'CART_SUCCESS'
export const FAILURE = 'CART_FAILURE'
export const ADD_TO_CART = 'ADD_TO_CART';
export const INIT_CART = 'INIT_CART';

export function addToCart({qty, sku,  ...payload}) {
	 return {
        type: ADD_TO_CART,
        key: sku,
        payload: {
            qty,
            sku
        }
    };
}


export function initCart({qty, sku,  ...payload}) {
	 return {
        type: INIT_CART,
        key: sku,
        payload: {
            qty,
            sku
        }
    };
}

export const calTotal = ({...payload}) => (dispatch, getState) => {
    
    return dispatch({
        key:"total",
        [CALL_API]: {
            endpoint: 'cart',
            payload,
            resType: API_RES_JSON,
            method: API_METHOD_POST,
            types: [REQUEST, SUCCESS, FAILURE]
        }
    })
}
