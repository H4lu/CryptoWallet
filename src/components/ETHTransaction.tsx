import * as React from 'react'
import { Link } from 'react-router-dom';
import {  handleEthereum } from '../API/cryptocurrencyAPI/Ethereum'

interface IETHTransactionState {
  paymentAdress: string,
  amount: number,
  fee: number,
  gasLimit: number,
  calculatedFee: number
}

export class ETHTransaction extends React.Component<any, IETHTransactionState> {
  constructor(props: any) {
    super(props)
    
    this.state = {
      paymentAdress: '',
      amount: 0,
      fee: 30,
      gasLimit: 21000,
      calculatedFee: 0
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this)
    this.calculateFee = this.calculateFee.bind(this)
  }
  componentWillMount() {
    this.calculateFee()
  }
  handleClick() {
    handleEthereum(this.state.paymentAdress, this.state.amount,this.state.fee, this.state.gasLimit)
  }
  calculateFee() {
    let calc = this.state.gasLimit*this.state.fee/1000000000
    this.setState({ calculatedFee: calc })
  }
  handleAddressChange(e: any) {
    this.setState({ paymentAdress: e.target.value })
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  handleFeeChange(e: any) {
    this.setState({ fee: e.target.value })
    this.calculateFee()
  }
  handleGasLimitChange(e: any) {
    this.setState({ gasLimit: e.target.value })
    this.calculateFee()
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
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Price' onChange = {this.handleFeeChange} value = {this.state.fee}/><span>Gas Price(gwei)</span>
          <p>Your fee: {this.state.calculatedFee} ETH</p>
      </div>
        <button type = 'submit' onClick = {this.handleClick}>Send ETH</button>
      </div>
    </div>
    )
  }
}
