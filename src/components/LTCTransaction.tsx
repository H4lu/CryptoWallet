import * as React from 'react'
import { Link } from 'react-router-dom';
import {sendTransaction} from '../core/SendTransaction'

interface ILTCTRansactionState {
  fee: number,
  paymentAddress: string,
  amount: number
}

export class LTCTransaction extends React.Component<any, ILTCTRansactionState> {
  constructor(props: any) {
    super(props)
    
    this.state = {
      fee: 1,
      paymentAddress: '',
      amount: 0
    }

    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
  }
  handleFeeChange(e: any) {
    this.setState({ fee: e.target.value })
  }
  handleClick() {
    sendTransaction('litecoin', this.state.paymentAddress, this.state.amount, this.state.fee)
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  handleAddressChange(e: any) {
    this.setState({  paymentAddress: e.target.value })
  }
  render(){
    return(
    <div className = 'sidebar'>
    <Link to = '/ltc-window'>
      <button type = 'submit' className = 'button-menu'>Close</button>
    </Link>
      <div className = 'sidebar-content'>
        <header className = 'text-header'>Send Bitcoin</header>
        <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' value = {this.state.paymentAddress} onChange = {this.handleFeeChange}/>
        <input type = 'text' className = 'payment_address' placeholder = 'Amount' />
        <p>Transaction Fee:</p>
      </div>
        <p>Transactioin fee:</p>
        <input type = 'number' value = {this.state.fee} onChange = {this.handleFeeChange}/>  
        <p>Transaction fee {this.state.fee}%</p>
        <button type = 'submit' onClick = {this.handleClick}>Send LTC</button>
    </div>
    )
  }
}
