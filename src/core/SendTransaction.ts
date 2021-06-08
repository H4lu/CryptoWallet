import { DisplayTransactionCurrency } from '../api/cryptocurrencyApi/utils'
import { handleBitcoin } from '../api/cryptocurrencyApi/bitcoin'
import {handleLitecoin} from "../api/cryptocurrencyApi/litecoin"
import { handleEthereum } from '../api/cryptocurrencyApi/ethereum'


export async function sendTransaction(
  currency: DisplayTransactionCurrency, 
  paymentAddress: string, 
  amount: number, 
  fee: number, 
  redirect: any, 
  course: number, 
  balance: number
  ) {
    console.log('GOT THIS AMOUNT',amount.toString())
    if (amount.toString().includes(',')) amount = Number(amount.toString().replace(',','.'))
    switch (currency) {
      case 'BTC':
      console.log('AMOUNT IN SENDBITON', amount)
      await handleBitcoin(paymentAddress, amount, fee, redirect, course, balance)
      break
    case 'LTC':
      console.log('AMOUNT IN SEND LTC', amount)
      await handleLitecoin(paymentAddress, amount, fee, redirect, course, balance)
      break
    case 'ETH':
      console.log('AMOUNT IN SEND ETH', amount)
      await handleEthereum(paymentAddress, amount, fee, 21000, redirect, course, balance)
      break
    }
}
