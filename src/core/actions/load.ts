import { getBalance } from '../../API/cryptocurrencyAPI/BitCoin'
import { Dispatch } from 'react-redux'
import * as types from './actionTypes'

function loadBitcoinBalanceSuccess(value: any) {
  console.log('Value in dispatch: ' + value)
  console.log('TYPE: ' + types.LOAD_BITCON_BALANCE_SUCCESS)
  return { type: types.LOAD_BITCON_BALANCE_SUCCESS, value }
}

export function loadBitcoinBalance() {
  return function(dispatch: Dispatch<any>) {
    return getBalance().then(value => {
      console.log('LOADING BALANCE')
      console.log(JSON.parse(value.content).data.confirmed_balance)
      let parsedResponse = JSON.parse(value.content).data.confirmed_balance
      dispatch(loadBitcoinBalanceSuccess(parsedResponse))
    }).catch(error => {
      throw(error)
    })
  }
}
