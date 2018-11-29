import * as React from 'react'
import CreateQR from '../core/CreateQR'
import getAddres from '../API/cryptocurrencyAPI/Litecoin'
import { sendTransaction } from '../core/SendTransaction'
import { clipboard, remote } from 'electron'
import { Table } from './Table'
import { LITECOIN_PATH } from '../core/paths'
interface ILTCWindowState {
  address: string,
  qrcodeAddress: string,
  paymentAddress: string,
  amount: number,
  fee: number
}

let currentWindow = remote.BrowserWindow.getFocusedWindow()
console.log(currentWindow)
export class LTCWindow extends React.Component<any, ILTCWindowState> {
  constructor(props: any) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.handleCopyClick = this.handleCopyClick.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)

    this.state = {
      address: getAddres(),
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
  handleClick() {
    sendTransaction('litecoin', this.state.paymentAddress, this.state.amount, this.state.fee, this.props.redirect)
  }
  handleCopyClick() {
    clipboard.writeText(this.state.address)
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
                <p className = 'default-font-colored'>Your Litecoin</p>
                <div className = 'card-container-second-block'>
                <div className = 'card-upper-block'>
                  <img src = {LITECOIN_PATH}/>
                  <p className = 'currency-name'> Litecoin</p>
                </div>
                <hr/>
                <div className = 'card-bottom-block'>
                <div>
                    <p className = 'currency-amount-crypto text-inline'>{this.props.balance}</p>
                    <p className = 'currency-short-name text-inline'>LTC</p>
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
                <input type = 'text' className = 'payment_address' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
                <button type = 'submit' className = 'button-send' onClick = {this.handleClick}>Send</button>
              </div>
            </div>
            </div>
            <div className = 'currency-address-container'>
              <div className = 'currency-address'>
                <p className = 'default-font-colored'>Your Litecoin Address:</p>
                <img src = {this.state.qrcodeAddress} className = 'address-qrcode'/>
                <div className = 'address-with-button'>
                  <p className = 'address-with-button-address'>{this.state.address}</p>
                  <button type = 'submit' className = 'button-copy' onClick = {this.handleCopyClick}>Copy</button>
                </div>
              </div>
            </div>

        </div>
      </div>
    )
  }
}
