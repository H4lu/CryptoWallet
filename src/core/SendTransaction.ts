import { handleBitcoin } from '../API/cryptocurrencyAPI/BitCoin'
import { handleEthereum } from '../API/cryptocurrencyAPI/Ethereum'
import { handleLitecoin } from '../API/cryptocurrencyAPI/Litecoin'

export async function sendTransaction(
  currency: string, 
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
  case 'bitcoin':
    console.log('AMOUNT IN SENDBITON', amount)
    await handleBitcoin(paymentAddress, amount, fee, redirect, course, balance)
    break
  case 'litecoin':
    console.log('AMOUNT IN SEND LTC', amount)
    await handleLitecoin(paymentAddress, amount, fee, redirect, course, balance)
    break
  case 'ethereum':
    console.log('AMOUNT IN SEND ETH', amount)
    await handleEthereum(paymentAddress, amount, fee, 21000, redirect, course, balance)
    break
  }
}
