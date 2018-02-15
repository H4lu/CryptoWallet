import React from 'react'
import {Link} from 'react-router-dom'

export class MainContent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render () {
    return (
    <div className = 'main'>
        
    <Link to ='/currency'>Link</Link>
      <button type = 'submit' className = 'button-refresh'>Refresh</button>
      <div className = 'currency-block'>

      <header className = 'text-header'>Available Cryptocurrency: </header>
      <div className = 'currencies-container'>
               <Link to = '/currency' className = 'card'>
               <header>Bitcoin</header>
               <img src = 'https://shapeshift.io/images/coins/bitcoin.png' className = 'currency-img'/>
               <p>1111 BTC</p>
               <p>10000000000$</p>
               </Link>
               <Link to = '/currency' className = 'card'>
               <header>Bitcoin</header>
               <img src = 'https://shapeshift.io/images/coins/ether.png' className = 'currency-img'/>
               <p>1111231 ETH</p>
               <p>10000000000$</p>
               </Link>
               <Link to = '/currency' className = 'card'>
               <header>Bitcoin</header>
               <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
               <p>111211 LTC</p>
               <p>10000000000$</p>
               </Link>
               </div>

      </div>

      </div>
    )}
}
