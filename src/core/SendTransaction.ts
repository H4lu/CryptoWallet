import { handle } from '../API/cryptocurrencyAPI/BitCoin'
import { handleEthereum } from '../API/cryptocurrencyAPI/Ethereum'
import { handleLitecoin } from '../API/cryptocurrencyAPI/Litecoin'

export function sendTransaction(currency: string, paymentAddress: string, amount: number, fee: number, redirect: any) {
  console.log('GOT THIS AMOUNT',amount.toString())
  if (amount.toString().includes(',')) amount = Number(amount.toString().replace(',','.'))
  switch (currency) {
  case 'bitcoin':
    console.log('AMOUNT IN SENDBITON', amount)
    handle(paymentAddress, amount, fee, redirect)
    break
  case 'litecoin':
    console.log('AMOUNT IN SEND LTC', amount)
    handleLitecoin(paymentAddress, amount, fee,redirect)
    break
  case 'ethereum':
    console.log('AMOUNT IN SEND ETH', amount)
    handleEthereum(paymentAddress, amount, fee, 21000,redirect)
    break
  }
}
