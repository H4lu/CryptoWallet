import * as types from '../actions/actionTypes'
import initialState from '../reducers/initialState'

export const REQUEST_BALANCE = 'REQUEST_BALANCE'
export const RECEIVE_BALANCE = 'RECEIVE_BALANCE'

export default function bitcoinBalanceReducer(state = initialState.balances, action: any) {
  switch (action.type) {
  case types.LOAD_BITCON_BALANCE_SUCCESS: {
    return action.balances
  }
  default: {
    return state
  }
  }
}
