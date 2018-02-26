import * as React from 'react'
import {Link} from 'react-router-dom'
import CreateQR from '../core/CreateQR'
import getAddress from '../API/hardwareAPI/GetAddress'
import { clipboard } from 'electron'

interface IBTCWindowState {
  address: string,
  qrcodeAddress: string
}

export class BTCWindow extends React.Component<any, IBTCWindowState> { 
  constructor(props: any) {
    super (props)
    this.handleCopyClick = this.handleCopyClick.bind(this)

    this.state = {
      address: getAddress(0),
      qrcodeAddress: ''
    }
  }
  componentWillMount() {
    this.setState({ qrcodeAddress: CreateQR(this.state.address) })
  }
  handleCopyClick() {
    clipboard.writeText(this.state.address)
  }
  render () {
    return (
      <div className = 'main'>
      <Link to = '/main'>
        <button type = 'submit' className = 'button-refresh'>Return</button>
      </Link>
        <div className = 'currency-content'>
          <header className = 'text-header'>Your Bitcoin</header>
          <div className = 'currency-info-container'>
              <p>{this.props.balance} BTC</p>
              <p>{this.props.price}</p>
              {(this.props.hourChange > 0) ? (
                <p className = 'positive-percentage'>{this.props.hourChange}%</p>
              ): (
                <p className = 'negative-percentage'>{this.props.hourChange}%</p>
              )}
              <img src = 'https://shapeshift.io/images/coins/bitcoin.png'/>
          </div>
          <Link to ='/btc-transaction'>
            <button type = 'submit' className = 'button-send'>Send BTC</button>
          </Link>
          <div className = 'currency-address-container'>
            <div className = 'currency-address'>
              <img src = {this.state.qrcodeAddress}/>
              <div className = 'address-with-button'>
                <header className = 'text-header'>Your Bitcoin Address:</header>
                <p>{this.state.address}</p>
                <button type = 'submit' className =  'button-copy' onClick = {this.handleCopyClick}>Copy</button>
              </div>
            </div>
          </div>
          <div className = 'transaction-history'>
            <header className = 'text-header'>Transaction History:</header>
              <table>
                <tr>
                  <th>Date</th>
                  <th>How much</th>
                  <th>To/from address</th>
                  <th>Status</th>
                </tr>
                <tr>
                  <th>2018/02/01</th>
                  <th>0.587 BTC</th>
                  <th>sdfsdgsf213eqwerwsd</th>
                  <th className = 'text-unconfirmed'>Not confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/11</th>
                  <th>0.587 BTC</th>
                  <th>sdfrewwersfdqwwrwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/01</th>
                  <th>0.3 BTC</th>
                  <th>sadadasdqweqeqsdsss</th>
                   <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/21</th>
                  <th>0.5187 BTC</th>
                  <th>XHRTqweTFDSWER@erwsd</th>
                   <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/03/01</th>
                  <th>17 BTC</th>
                  <th>XHRqweDSWER@erwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
              </table>
          </div>
        </div>
      </div>
    )
  }
}
