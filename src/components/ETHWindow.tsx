import * as React from 'react'
import {Link} from 'react-router-dom'
import CreateQR from '../core/CreateQR'
import {getEthereumAddres} from '../API/hardwareAPI/GetAddress'
interface IBTCWindowState {
  address: string,
  qrcodeAddress: string
}

export class ETHWIndow extends React.Component<any, IBTCWindowState> {
  constructor(props: any) {
    super (props)

    this.state = {
      address: getEthereumAddres(2),
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
            <p>{this.props.balance} ETH</p>
            <p>{this.props.price}$</p>
            {(this.props.hourChange > 0) ? (
                <p className = 'positive-percentage'>{this.props.hourChange}%</p>
              ): (
                <p className = 'negative-percentage'>{this.props.hourChange}%</p>
              )}
            <img src = 'https://shapeshift.io/images/coins/ether.png'/>
          </div>
          <Link to ='/eth-transaction'>
            <button type = 'submit' className = 'button-send'>Send ETH</button>
          </Link>
          <div className = 'currency-address-container'>
            <div className = 'currency-address'>
              <img src = {this.state.qrcodeAddress}/>
              <div className = 'address-with-button'>
                <header className = 'text-header'>Your Ethereum Address:</header>
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
                  <th>0.587 ETH</th>
                  <th>sdfsdgsf213eqwerwsd</th>
                  <th className = 'text-unconfirmed'>Not confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/11</th>
                  <th>0.587 ETH</th>
                  <th>sdfrewwersfdqwwrwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/01</th>
                  <th>0.3 ETH</th>
                  <th>sadadasdqweqeqsdsss</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/21</th>
                  <th>0.5187 ETH</th>
                  <th>XHRTqweTFDSWER@erwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/03/01</th>
                  <th>17 ETH</th>
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
