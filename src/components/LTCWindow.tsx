import * as React from 'react'
import CreateQR from '../core/CreateQR'
import getAddres from '../API/cryptocurrencyAPI/Litecoin'
import { sendTransaction } from '../core/SendTransaction'
import { clipboard } from 'electron'
import { Table } from './Table'

interface ILTCWindowState {
  address: string,
  qrcodeAddress: string,
  paymentAddress: string,
  amount: number,
  fee: number
}

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
    sendTransaction('litecoin', this.state.paymentAddress, this.state.amount, this.state.fee)
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
                  <img src = 'data:image/png;base64,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'/>
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
                <input type = 'text' className = 'input-amount' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
                <input type = 'text' className = 'input-fee-amount' placeholder = 'Fee'/>
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
            <Table data = {this.props.lastTx}/>
        </div>
      </div>
    )
  }
}
