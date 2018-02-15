import * as React from 'react'
import {Link,  Route} from 'react-router-dom'
import {Currency} from './Currency'

export class Main extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
    <div className = 'main'>
        
    <Link to ='/currency'>Link</Link>
      <button type = 'submit' className = 'button-refresh'>Refresh</button>
      <div className = 'currency-block'>

      <header className = 'text-header'>Available Cryptocurrency: </header>
      <div className = 'currencies-container'>
      <div className = 'card'>
        <Link to  = '/currency' className = 'box-link'>
          <header>Bitcoin</header>
          <img src = 'https://shapeshift.io/images/coins/bitcoin.png'/>
          <p>1 BTC </p>
          <p>10000000000$</p>
        </Link>
        </div>
        <div className = '/card'>
        <Link to  = '/currency' className = 'box-link'>
          <header>Ethereum</header>
          <img src = 'https://shapeshift.io/images/coins/ether.png'/>
          <p>1 ETH </p>
          <p>10000000000$</p>
        </Link>
        </div>
        <div className = 'card'>
        <Link to  = '/home/currency' className = 'box-link'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          <p>1 LTC </p>
          <p>10000000000$</p>
        </Link>
      </div>
      <div className = 'card'>
        <Link to  = '/home/currency' className = 'box-link'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          <p>1 LTC </p>
          <p>10000000000$</p>
        </Link>
      </div>
      <div className = 'card'>
        <Link to  = '/home/currency' className = 'box-link'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          <p>1 LTC </p>
          <p>10000000000$</p>
        </Link>
      </div>
      <div className = 'card'>
        <Link to  = '/home/currency' className = 'box-link'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          <p>1 LTC </p>
          <p>10000000000$</p>
        </Link>
      </div>
      <div className = 'card'>
        <Link to  = '/home/currency' className = 'box-link'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          <p>1 LTC </p>
          <p>10000000000$</p>
        </Link>
      </div>
      <div className = 'card'>
        <Link to  = '/home/currency' className = 'box-link'>
          <header>Litecoin</header>
          <img src = 'https://shapeshift.io/images/coins/litecoin.png'/>
          <p>1 LTC </p>
          <p>10000000000$</p>
        </Link>
      </div>
    </div>
    <Route path = '/currency' component = {Currency}/>
      </div>

      </div>)
  }

}
