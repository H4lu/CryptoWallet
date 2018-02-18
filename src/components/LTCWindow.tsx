import * as React from 'react'
import {Link} from 'react-router-dom'

export class LTCWindow extends React.Component<any, any> {
  constructor(props: any) {
    super (props)
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
            <button type = 'submit'>Send</button>
          </Link>
          <div className = 'currency-address-container'>
            <header className = 'text-header'>Your Litecoin Address:</header>
            <p>sdfkjwur98fdskfl2rfwhssdf</p>
            <button type = 'submit'>Copy</button>
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
                  <th>Not confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/11</th>
                  <th>0.587 LTC</th>
                  <th>sdfrewwersfdqwwrwsd</th>
                  <th>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/01</th>
                  <th>0.3 LTC</th>
                  <th>sdfasfeeeeeww@erwsd</th>
                  <th>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/02/21</th>
                  <th>0.5187 LTC</th>
                  <th>XHRTqweTFDSWER@erwsd</th>
                  <th>Confirmed</th>
                </tr>
                <tr>
                  <th>2018/03/01</th>
                  <th>17 LTC</th>
                  <th>XHRqweDSWER@erwsd</th>
                  <th>Confirmed</th>
                </tr>
              </table>
          </div>
        </div>
      </div>
    )
  }
}
