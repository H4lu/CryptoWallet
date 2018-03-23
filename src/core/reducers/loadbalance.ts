import { REQUEST_BALANCE, RECEIVE_BALANCE } from '../actions/balance'
import initialState from './initialState'
export function getBalance(state = initialState, action: any) {
  switch (action.type) {
  case REQUEST_BALANCE:
    return Object.assign({},state, {
      isFetching: true
    })
  case RECEIVE_BALANCE:
    return Object.assign({}, state, {
      isFetching: false
    })
  }
}
