import * as React from 'react'
import { getFee } from '../API/cryptocurrencyAPI/BitCoin'
import {Dropdown} from 'semantic-ui-react'
import {sendTransaction} from '../core/SendTransaction'
import { Link } from 'react-router-dom';

interface IPayComponentState {
  paymentAdress: string,
  amount: number,
  fee: Array<any>,
  value: number
}

export class BTCTransaction extends React.Component<any, IPayComponentState> {
  constructor(props: any) {
    super(props)
    this.state = {
       paymentAdress: '',
       amount: 0,
       fee : [],
       value : 0
    }

    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.getBitcoinFees = this.getBitcoinFees.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }


  componentWillMount() {
    this.getBitcoinFees()
  }
  handleFeeChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({value: data.value})
    console.log('Current value: ' + this.state.value)
  }
  handleClick() {
    sendTransaction('bitcoin', this.state.paymentAdress, this.state.amount, this.state.value)
  }
  handleAddressChange(e: any) {
    this.setState({ paymentAdress: e.target.value })
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  async getBitcoinFees() {
    let get = await getFee()
    if (get !== undefined) {
      let parsed = JSON.parse(get)
      for (let fee in parsed) {
        console.log('First parsed: ' + parsed[fee])
        console.log('Value:' + fee)
        this.state.fee.push({
          key: fee,
          text: fee + ' : ' + parsed[fee],
          value: parsed[fee]
        })
      }
      for (let elem in this.state.fee) {
        console.log(this.state.fee[elem])
        console.log('Value of fee: ' + this.state.value)
      }
    }
  }
  render() {
    return(
    <div className = 'sidebar'>
    <Link to ='/btc-window'>
      <button type = 'submit' className = 'button-menu'>Close</button>
    </Link>
      <div className = 'sidebar-content'>
          <header className = 'text-header'>Send Bitcoin</header>
          <div className = 'send-block-container'>
            <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' onChange = {this.handleAddressChange} value = {this.state.paymentAdress}/>
            <input type = 'number' className = 'payment_address' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
          </div>
        <div className = 'fee-block'>
          <p>Transaction fee: </p>
          <Dropdown options = {this.state.fee} onChange = {this.handleFeeChange} placeholder = 'Choose fee'/><span>satoshi/byte</span>
        </div>
        <button type = 'submit' onClick = {this.handleClick} className = 'send-currency-button'>Send BTC</button>
      </div>
    </div>
    )
  }
}
