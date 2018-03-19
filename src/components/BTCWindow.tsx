import * as React from 'react'
import CreateQR from '../core/CreateQR'
import getBitcoinAddress from '../API/cryptocurrencyAPI/BitCoin'
import { clipboard } from 'electron'
import { Table } from './Table'
import { sendTransaction } from '../core/SendTransaction'

interface IBTCWindowState {
  address: string,
  qrcodeAddress: string,
  paymentAddress: string,
  amount: number,
  fee: number
}

export class BTCWindow extends React.Component<any, IBTCWindowState> {
  constructor(props: any) {
    super(props)

    this.handleCopyClick = this.handleCopyClick.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      address: getBitcoinAddress(),
      qrcodeAddress: '',
      paymentAddress: '',
      amount: 0,
      fee: 0
    }
  }
  componentWillMount() {
    this.setState({ qrcodeAddress: CreateQR(this.state.address) })
    // this.props.transactions()
    console.log('PROPERTY: ' + this.props.lastTx)
  }
  handleCopyClick() {
    clipboard.writeText(this.state.address)
  }
  handleClick() {
    sendTransaction('bitcoin', this.state.paymentAddress, this.state.amount, this.state.fee)
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  handleAddressChange(e: any) {
    this.setState({ paymentAddress: e.target.value })
  }
  handleFeeChange(e: any) {
    this.setState({ fee: e.target.value })
  }
  render () {
    return (
      <div className = 'main'>
      <div className = 'main-content'>
        <div className = 'currency-content'>
          <div className = 'currency-block-container'>
            <div className = 'currency-block-card'>
              <p className = 'default-font-colored'>Your Bitcoin</p>
              <div className = 'card-container-second-block'>
              <div className = 'card-upper-block'>
                <img src = 'data:image/png;base64,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'/>
                <p className = 'currency-name'> Bitcoin</p>
              </div>
              <hr/>
              <div className = 'card-bottom-block'>
              <div>
                   <p className = 'currency-amount-crypto text-inline'>{this.props.balance}</p>
                   <p className = 'currency-short-name text-inline'>BTC</p>
                  </div>
                  <div className = 'wrap'>
                    {(this.props.hourChange > 0) ? (
                      <p className = 'positive-percentage text-inline'>{this.props.hourChange}%</p>
                    ) : (
                      <p className = 'negative-percentage text-inline'>{this.props.hourChange}%</p>
                    )}
                   <p className = 'currency-amount-fiat text-inline'>{this.props.price}$</p>
                   </div>
              </div>
            </div>
            </div>
            <div className = 'currency-block-transaction'>
            <header className = 'default-font-colored'>Send Bitcoin</header>
              <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' value = {this.state.paymentAddress} onChange = {this.handleAddressChange}/>
              <input type = 'text' className = 'input-amount' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
              <input type = 'text' className = 'input-fee-amount' placeholder = 'Fee'/>
              <button type = 'submit' className = 'button-send' onClick = {this.handleClick}>Send</button>
            </div>
          </div>
          </div>
          <div className = 'currency-address-container'>
            <div className = 'currency-address'>
              <p className = 'default-font-colored'>Your Bitcoin Address:</p>
              <img src = {this.state.qrcodeAddress} className = 'address-qrcode'/>
              <div className = 'address-with-button'>
                <p className = 'address-with-button-address'>{this.state.address}</p>
                <button type = 'submit' className = 'button-copy' onClick = {this.handleCopyClick}>Copy</button>
              </div>
            </div>
          </div>
          <Table data = {this.props.lastTx}/>
        </div>
      </div>
    )
  }
}
