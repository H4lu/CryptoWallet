import { REQUEST_BALANCE, RECEIVE_BALANCE } from '../actions/balance'
import initialState from './initialState'
import * as types from '../actions/actionTypes'
export function getBalance(state = initialState.balances, action: any) {
  switch (action.type) {
  case REQUEST_BALANCE:
    return Object.assign({},state, {
      isFetching: true
    })
  case RECEIVE_BALANCE:
    return Object.assign({}, state, {
      isFetching: false
    })
  case types.LOAD_BITCON_BALANCE_SUCCESS: {
    console.log('IN LOAD_BITCOIN_BALANCE' + action.value)
    console.log(action)
    return action.value
  }
  default:
    console.log('IN DEFAULT')
    return state
  }
}
