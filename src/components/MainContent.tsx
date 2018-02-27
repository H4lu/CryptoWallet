import React from 'react'
import {Link} from 'react-router-dom'

export class MainContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.props.refresh()
  }
  render () {
    return (
    <div className = 'main'>
      <button type = 'submit' className = 'button-refresh' onClick = {this.handleClick}>Refresh</button>
          <div className = 'currency-block'>
            <header className = 'text-header'>Available Cryptocurrency: </header>
          <div className = 'currencies-container'>
            <Link to = '/btc-window' className = 'card'>
              <header>Bitcoin</header>
              <img src = 'https://shapeshift.io/images/coins/bitcoin.png' className = 'main-image'/>
              <p>{this.props.btcBalance} BTC</p>
              <p>{this.props.btcPrice}$</p>
              {(this.props.btcHourChange > 0) ? (
                <p className = 'positive-percentage text-inline'>{this.props.btcHourChange}%</p>
              ): (
                <p className = 'negative-percentage text-inline'>{this.props.btcHourChange}%</p>
              )}
            </Link>
            <Link to = '/eth-window' className = 'card'>
              <header>Ethereum</header>
              <img src = 'https://shapeshift.io/images/coins/ether.png' className = 'main-image'/>
              <p>{this.props.ethBalance} ETH</p>
              <p>{this.props.ethPrice}$</p>
              {(this.props.ethHourChange > 0) ? (
                <p className = 'positive-percentage'>{this.props.ethHourChange}%</p>
              ): (
                <p className = 'negative-percentage'>{this.props.ethHourChange}%</p>
              )}
            </Link>
            <Link to = '/ltc-window' className = 'card'>
              <header>Litecoin</header>
              <img src = 'https://shapeshift.io/images/coins/litecoin.png' className = 'main-image'/>
              <p>{this.props.ltcBalance} LTC</p>
              <p>{this.props.ltcPrice}$</p>
              {(this.props.ltcHourChange > 0) ? (
                <p className = 'positive-percentage'>{this.props.ltcHourChange}%</p>
              ): (
                <p className = 'negative-percentage'>{this.props.ltcHourChange}%</p>
              )}
            </Link>
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
                      <th>XHRTETFDSWER@erwsd</th>
                      <th className = 'text-unconfirmed'>Not confirmed</th>
                    </tr>
                    <tr>
                      <th>2018/02/11</th>
                      <th>0.587 BTC</th>
                      <th>XHRTETFDSWER@erwsd</th>
                      <th className = 'text-confirmed'>Confirmed</th>
                    </tr>
                    <tr>
                      <th>2018/02/01</th>
                      <th>0.3 BTC</th>
                      <th>XHRTqqTFDSWER@erwsd</th>
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
    )}
}
