import * as React from 'react'
import { handle } from '../API/cryptocurrencyAPI/BitCoin'
/* interface IPayComponentProps {
  paymentAdress: string
  transactionFee: number
  cryptocurrency: string
}
*/
interface IPayComponentState {
  paymentAdress: string
  transactionFee: number
  cryptocurrency: string
  amount: number
}

export class TransactionComponent extends React.Component<any, IPayComponentState> {
  constructor(props: any) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.state = {
      paymentAdress: '',
      transactionFee: 30,
      cryptocurrency: 'bitcoin',
      amount: 0
    }

    this.handleAdressChange = this.handleAdressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleCryptocurrencyChange = this.handleCryptocurrencyChange.bind(this)
    this.handleByScroll = this.handleByScroll.bind(this)
  }

  handleByScroll(e: any) {
    this.setState({ transactionFee: e.target.value })
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  handleAdressChange(e: any) {
    this.setState({ paymentAdress: e.target.value })
  }
  handleFeeChange(e: any) {
    this.setState({ transactionFee: e.target.value })
  }
  handleClick() {
    handle(this.state.paymentAdress, this.state.amount, this.state.transactionFee)
  }
  handleCryptocurrencyChange(e: any) {
    this.setState({ cryptocurrency: e.target.value })
  }

  render() {
    return(
      <div>
        <select name = 'pay' value = { this.state.cryptocurrency } onChange = { this.handleCryptocurrencyChange }>
          <option>select currency for payment</option>
          <option value = 'bitcoin'>BitCoin</option>
          <option value = 'etherium'>Ethereum</option>
          <option value = 'litecoin'>Litecoin</option>
          <option value = 'ripple'>Ripple</option>
          <option value = 'dash'>Dash</option>
          <option value = 'monero'>Monero</option>
          <option value = 'iota'>IOTA</option>
          <option value = 'stratis'>Stratis</option>
          <option value = 'neo'>NEO</option>
          <option value = 'zcash'>Zcash</option>
       </select>
       <input type = 'number' name = 'amount' placeholder = 'Enter transaction amount' onChange = {this.handleAmountChange}></input>
       <input type = 'number' value = {this.state.transactionFee} min = {0} onChange = { this.handleFeeChange } onScroll = {this.handleByScroll}></input>
       <input type = 'text' name = 'payment address' placeholder = 'Enter payment purpose'
        onChange = {this.handleAdressChange} style = {{ width: 300 }}></input>
       <button name = 'payButton' onClick = {this.handleClick}>OK</button>
       <div id = 'compay'> Transaction fee {this.state.transactionFee}%	</div>
     </div>
    )
  }
}
