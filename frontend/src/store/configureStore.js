import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from 'Middlewares/api'
import rootReducer from 'Reducers/root'

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk, api)
)

export default configureStore