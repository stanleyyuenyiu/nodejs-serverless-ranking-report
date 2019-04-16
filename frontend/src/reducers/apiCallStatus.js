const apiCallStatus = ({ types, mapActionToKey }) => {

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected types to be an array of three elements.')
    }
    if (!types.every(t => typeof t === 'string')) {
        throw new Error('Expected types to be strings.')
    }
    if (typeof mapActionToKey !== 'function') {
        throw new Error('Expected mapActionToKey to be a function.')
    }

    const [ requestType, successType, failureType ] = types

    const updateStatus = (state = {}, action) => {

        const defaultState = {
            isFetching: false,
            hasError: false,
            axiosSource: null,
            error: null
        }

        switch(action.type) {
            case requestType:
                return {
                    ...defaultState,
                    isFetching: true,
                    axiosSource: action.axiosSource
                }
            case successType:
                return {
                    ...defaultState
                }
            case failureType:
                return {
                    ...defaultState,
                    hasError: true,
                    error: action.error || { message: 'Unexpected error occured' }
                }
            default:
                return state
        }
    }

    return (state = {}, action) => {
        switch(action.type) {
            case requestType:
            case successType:
            case failureType:
                const key = mapActionToKey(action)
                if (typeof key !== 'string') {
                    throw new Error('Expected key to be a string.')
                }
                const newState = updateStatus(state[key], action)
                return {
                    ...state,
                    [key]: newState
                }
            default:
                return state
        }
    }
}

export default apiCallStatus