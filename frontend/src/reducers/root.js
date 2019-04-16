import { combineReducers } from 'redux'
import report from './report'
import cart from './cart'
import customer from './customer'
import form from './form'
export const CLEAR = 'CLEAR';

const appReducer = combineReducers({
    report,
    ...form
})

const rootReducer = (state = {}, action) => {
  if (action.type === CLEAR) {
        delete state[action.payload.entityGroup].entities[action.payload.entityKey];
  }
  return appReducer(state, action)
}
export default rootReducer
