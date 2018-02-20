import * as React from 'react'
import { Link } from 'react-router-dom';
import {sendTransaction} from '../core/SendTransaction'

interface IETHTransactionState {
  paymentAdress: string,
  amount: number,
  fee: number
}

export class ETHTransaction extends React.Component<any, IETHTransactionState> {
  constructor(props: any) {
    super(props)
    
    this.state = {
      paymentAdress: '',
      amount: 0,
      fee:0
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
  }

  handleClick() {
    sendTransaction('ethereum', this.state.paymentAdress, this.state.amount, this.state.fee)
  }
  handleAddressChange(e: any) {
    this.setState({ paymentAdress: e.target.value })
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  handleFeeChange(e: any) {
    this.setState({ fee: e.target.value })
  }
  render(){
    return(
    <div className = 'sidebar'>
    <Link to = '/eth-window'>
      <button type = 'submit' className = 'button-menu'>Close</button>
    </Link>
      <div className = 'sidebar-content'>
        <header className = 'text-header'>Send Ethereum</header>
        <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' onChange = {this.handleAddressChange}/>
        <input type = 'text' className = 'payment_address' placeholder = 'Amount' onChange = {this.handleAmountChange}/>
      <div>
          <p>Transaction fee: </p>
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Limit'/><span>Gas Limit</span>
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Price' onChange = {this.handleFeeChange}/><span>Gas Price</span>
      </div>
        <button type = 'submit' onClick = {this.handleClick}>Send ETH</button>
      </div>
    </div>
    )
  }
}
