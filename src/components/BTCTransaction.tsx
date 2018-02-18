import * as React from 'react'
import { getFee } from '../API/cryptocurrencyAPI/BitCoin'
import {Dropdown} from 'semantic-ui-react'
import {sendTransaction} from '../core/SendTransaction'
import { Link } from 'react-router-dom';

interface IPayComponentState {
  paymentAdress: string,
  amount: number,
  fee: Array<any>
}

export class BTCTransaction extends React.Component<any, IPayComponentState> {
  constructor(props: any) {
    super(props)
    this.state = {
       paymentAdress: '',
       amount: 0,
       fee : [{
       }]
    }

    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.getBitcoinFees = this.getBitcoinFees.bind(this)
  }


  componentWillMount() {
    this.getBitcoinFees()
  }
  handleFeeChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ fee: data.value})
  }
  handleClick() {
    sendTransaction('bitcoin', this.state.paymentAdress, this.state.amount, this.state.fee[0])
  }

  async getBitcoinFees() {
    let get = await getFee()
    if (get !== undefined) {
      let parsed = JSON.parse(get)
      for (let fee in parsed) {
        console.log('First parsed: ' + parsed[fee])
        console.log('Value:' + fee)
        this.state.fee.push({
          text: fee + ' :' + parsed[fee],
          value: parsed[fee]
        })
      }
      for (let elem in this.state.fee) {
        console.log(this.state.fee[elem])
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
          <input type = 'text' className = 'payment_address' placeholder = 'Payment Address'/>
          <input type = 'text' className = 'payment_address' placeholder = 'Amount'/>
          <p>Transaction Fee:</p>
        <div>
          <p>Transaction fee: </p>
          <Dropdown options = {this.state.fee} value = {this.state.fee} onChange = {this.handleFeeChange} defaultValue = {this.state.fee[0]}/><span>satoshi/byte</span>
        </div>
        <button type = 'submit' onClick = {this.handleClick}>Send BTC</button>
      </div>
    </div>)
  }
}
