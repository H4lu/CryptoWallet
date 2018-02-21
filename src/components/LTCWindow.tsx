import * as React from 'react'
import {Link} from 'react-router-dom'
import CreateQR from '../core/CreateQR'
import getAddress from '../API/hardwareAPI/GetAddress'

interface ILTCWindowState {
  address: string,
  qrcodeAddress: string
}

export class LTCWindow extends React.Component<any, ILTCWindowState> {
  constructor(props: any) {
    super (props)

    this.state = {
      address: getAddress(2),
      qrcodeAddress: ''
    }
  }

  componentWillMount() {
    this.setState({ qrcodeAddress: CreateQR(this.state.address) })
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
            <p>1232 LTC</p>
            <p>329479186810$</p>
            <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          </div>
          <Link to ='/ltc-transaction'>
            <button type = 'submit' className = 'button-send'>Send LTC</button>
          </Link>
          <div className = 'currency-address-container'>
            <div className = 'currency-address'>
              <img src = {this.state.qrcodeAddress}/>
              <div className = 'address-with-button'>
                <header className = 'text-header'>Your Litecoin Address:</header>
                <p>{this.state.address}</p>
                <button type = 'submit' className = 'button-copy'>Copy</button>
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
                  <th>0.587 LTC</th>
                  <th>sdfsdgsf213eqwerwsd</th>
                  <th className = 'text-unconfirmed'>Not confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/11</th>
                  <th>0.587 LTC</th>
                  <th>sdfrewwersfdqwwrwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/01</th>
                  <th>0.3 LTC</th>
                  <th>sdfasfeeeeeww@erwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/21</th>
                  <th>0.5187 LTC</th>
                  <th>XHRTqweTFDSWER@erwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/03/01</th>
                  <th>17 LTC</th>
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
