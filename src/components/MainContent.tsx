import React from 'react'
import {Link} from 'react-router-dom'

export class MainContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render () {
    return (
    <div className = 'main'>
      <button type = 'submit' className = 'button-refresh'>Refresh</button>
      <div className = 'currency-block'>
      <header className = 'text-header'>Available Cryptocurrency: </header>
      <div className = 'currencies-container'>
        <Link to = '/btc-window' className = 'card'>
          <header>Bitcoin</header>
          <img src = 'https://shapeshift.io/images/coins/bitcoin.png' className = 'main-image'/>
          <p>1111 BTC</p>
          <p>10000000000$</p>
        </Link>
        <Link to = '/eth-window' className = 'card'>
          <header>Ethereum</header>
          <img src = 'https://shapeshift.io/images/coins/ether.png' className = 'main-image'/>
          <p>1111231 ETH</p>
          <p>10000000000$</p>
        </Link>
        <Link to = '/ltc-window' className = 'card'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png' className = 'main-image'/>
          <p>111211 LTC</p>
          <p>10000000000$</p>
        </Link>
      </div>
      <div className = 'transaction-history'>
            <header className = 'text-header'>Transaction History:</header>
              <table>
                <tr>
                  <th>Date</th>
                  <th>How much</th>
                  <th>To/from address</th>
                  <th className = 'text-unconfirmed'>Not confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/01</th>
                  <th>0.587 BTC</th>
                  <th>XHRTETFDSWER@erwsd</th>
                  <th className = 'text-confirmed'>Confirmed</th>
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
