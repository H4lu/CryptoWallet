import { getBalance } from '../../API/cryptocurrencyAPI/BitCoin'
import { Dispatch } from 'react-redux'
import * as types from './actionTypes'
function loadBitcoinBalanceSuccess(value: any) {
  console.log('Value in dispatch: ' + value)
  return { type: types.LOAD_BITCON_BALANCE_SUCCESS, value }
}
export function loadBitcoinBalance() {
  return function(dispatch: Dispatch<any>) {
    return getBalance().then(value => {
      dispatch(loadBitcoinBalanceSuccess(value))
    }).catch(error => {
      throw(error)
    })
  }
}
