// import { getBTCBalance } from '../../API/cryptocurrencyAPI/BitCoin'
// import { Dispatch } from 'react-redux'
// import * as types from './actionTypes'

// function loadBitcoinBalanceSuccess(value: any) {
//   console.log('Value in dispatch: ' + value)
//   console.log('TYPE: ' + types.LOAD_BITCON_BALANCE_SUCCESS)
//   return { type: types.LOAD_BITCON_BALANCE_SUCCESS, value }
// }

// export function loadBitcoinBalance() {
//   return function(dispatch: Dispatch<any>) {
//     return getBTCBalance().then(value => {
//       console.log('LOADING BALANCE')
//       dispatch(loadBitcoinBalanceSuccess(value))
//     }).catch(error => {
//       throw(error)
//     })
//   }
// }
