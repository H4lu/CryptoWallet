import * as React from 'react'
import { Link } from 'react-router-dom';
import {  handleEthereum } from '../API/cryptocurrencyAPI/Ethereum'

interface IETHTransactionState {
  paymentAdress: string,
  amount: number,
  fee: number,
  gasLimit: number
}

export class ETHTransaction extends React.Component<any, IETHTransactionState> {
  constructor(props: any) {
    super(props)
    
    this.state = {
      paymentAdress: '',
      amount: 0,
      fee: 30000000000,
      gasLimit: 21000
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this)
  }

  handleClick() {
    handleEthereum(this.state.paymentAdress, this.state.amount,this.state.fee, this.state.gasLimit)
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
  handleGasLimitChange(e: any) {
    this.setState({ gasLimit: e.target.value })
  }
  render(){
    return(
    <div className = 'sidebar'>
    <Link to = '/eth-window'>
      <button type = 'submit' className = 'button-menu'>Close</button>
    </Link>
      <div className = 'sidebar-content'>
        <header className = 'text-header'>Send Ethereum</header>
        <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' onChange = {this.handleAddressChange} value = {this.state.paymentAdress}/>
        <input type = 'text' className = 'payment_address' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
      <div>
          <p>Transaction fee: </p>
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Limit' onChange = {this.handleGasLimitChange} value = {this.state.gasLimit}/><span>Gas Limit</span>
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Price' onChange = {this.handleFeeChange} value = {this.state.fee}/><span>Gas Price</span>
      </div>
        <button type = 'submit' onClick = {this.handleClick}>Send ETH</button>
      </div>
    </div>
    )
  }
}
