import { combineReducers } from 'redux'
import { getBalance } from '../reducers/loadbalance'
const rootReducer = combineReducers({ getBalance })
export default rootReducer
