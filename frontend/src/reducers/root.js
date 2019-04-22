import { combineReducers } from 'redux'
import report from './report'
export const CLEAR = 'CLEAR';

const appReducer = combineReducers({
    report
})

const rootReducer = (state = {}, action) => {
  if (action.type === CLEAR) {
        delete state[action.payload.entityGroup].entities[action.payload.entityKey];
  }
  return appReducer(state, action)
}
export default rootReducer
