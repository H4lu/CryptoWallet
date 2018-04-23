import { handle } from '../API/cryptocurrencyAPI/BitCoin'
import { handleEthereum } from '../API/cryptocurrencyAPI/Ethereum'
import { handleLitecoin } from '../API/cryptocurrencyAPI/Litecoin'

export function sendTransaction(currency: string, paymentAddress: string, amount: number, fee: number, redirect: any) {
  console.log('GOT THIS AMOUNT')
  switch (currency) {
  case 'bitcoin':
    console.log('BTC fee: ' + fee)
    handle(paymentAddress, amount, fee, redirect)
    break
  case 'litecoin':
    handleLitecoin(paymentAddress, amount, fee,redirect)
    break
  case 'ethereum':
    handleEthereum(paymentAddress, amount, fee, 21000,redirect)
    break
  }
}
