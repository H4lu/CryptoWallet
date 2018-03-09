import { combineReducers } from 'redux'
import { getBalance } from '../reducers/loadbalance'
const rootReducer = combineReducers({ balances: getBalance })
export default rootReducer
