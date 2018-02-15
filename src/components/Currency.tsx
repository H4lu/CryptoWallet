import * as React from 'react'

export class Currency extends React.Component<any, any> {
  constructor(props: any) {
    super (props)
  }
  render () {
    return (
      <div className = 'main'>
        <button type = 'submit' className = 'button-refresh'>Return</button>
        <div className = 'currency-content'>
          <header className = 'text-header'>Your Bitcoin</header>
          <div className = 'currency-info-container'>
            <p>1232 BTC</p>
            <p>329479186819740$</p>
            <img src = 'https://shapeshift.io/images/coins/bitcoin.png'/>
          </div>
          <div className = 'currency-address-container'>
          <header className = 'text-header'>Your Bitcoin Address:</header>
          <p>ABWRARARWFS@#$24323434234234</p>
          <button type = 'submit'>Copy</button>
          </div>
        </div>
      </div>
    )
  }
}