import { CALL_API,
    API_RES_JSON
} from 'Middlewares/api'


export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'
export const SET_DATE = 'SET_DATE';

export const loadReport = ({key, ...payload}) => (dispatch, getState) => {
    return dispatch({
        key,
        [CALL_API]: {
            endpoint: 'data',
            resType: API_RES_JSON,
            payload,
            types: [REQUEST, SUCCESS, FAILURE]
        }
    })
}

export function setDate({startDate, endDate,  ...payload}) {
     return {
        type: SET_DATE,
        key: 'reportQuery',
        payload: {
            startDate,
            endDate
        }
    };
}
