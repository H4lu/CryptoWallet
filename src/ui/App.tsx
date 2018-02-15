import React from 'react'
import { Currency } from '../components/Currency'
// import { Switch, Route } from 'react-router'
import {Route, Redirect} from 'react-router'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
import {Sidebar} from '../components/Sidebar'
import { ERC20 } from '../components/ERC20'
import {Main} from '../components/Main'
import { TransactionComponent } from '../components/TransactionComponent'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { SignIn } from './signin'
// import { MainLayout } from './MainLayout'
// import { SignIn } from './SignIn'
/* import { NavBar } from './NavBar'
import { Switch, Route } from 'react-router'
import { ActionLog } from '../components/ActionLog'
import { TransactionComponent } from '../components/TransactionComponent'
import { ERC20 } from '../components/ERC20'
import { Exchange } from '../components/Exchange'
*/
/* import { Routes } from './Routes'
import { Switch } from 'react-router'
*/
import '../components/style.css'
export class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <Sidebar/>
        <Redirect from ='/' to ='/main'/> 
          <Route path = '/main'  component = {Main}/>
          <Route path = '/currency' component = {Currency}/>
          <Route path = '/erc20' component = {ERC20}/>
          <Route path = '/send' component = {TransactionComponent}/>
        <Footer/>
      </div>
    )
  }
}
/* export class App extends React.Component {
  render() {
    return(
      <div >
        <Switch>
          <Route path = '/home/currency' component = {Currency}/>
        </Switch>
      <div className = 'header'>
          <div className = 'header-content'>
            <header>Braitberry</header>
          </div>
      </div>
      <div className = 'content'>
      <div className = 'main'>
           <button type = 'submit' className = 'button-refresh'>Refresh</button>
           <div className = 'currency-block'>
             <header className = 'text-header'>Available Cryptocurrency: </header>
             <div className = 'currencies-container'>
             <div className = 'card'>
               <Link to  = '/home/currency' className = 'box-link'>
                 <header>Bitcoin</header>
                 <img src = 'https://shapeshift.io/images/coins/bitcoin.png'/>
                 <p>1 BTC </p>
                 <p>10000000000$</p>
               </Link>
               </div>
               <div className = 'card'>
               <Link to  = '/home/currency' className = 'box-link'>
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
            </div>

        </div>
        <div className = 'sidebar'>
          <button type = 'submit' className = 'button-menu'>Menu</button>
            <div className = 'sidebar-content'>
              <header className = 'text-header'>Total:</header>
              <header className = 'text-header'>123148293648234$:</header>
              <header className = 'text-header'>Additional:</header>
              <div className = 'nav-buttons-container'>
              <Link to = 'somewhere' className = 'box-link'>
                  <button className = 'nav-buttons'>Cryptocurrency exchange</button>
                </Link>
                <Link to = 'somewhere' className = 'box-link'>
                  <button className = 'nav-buttons'>Your addresses</button>
                </Link>
                <Link to = 'somewhere' className = 'box-link'>
                  <button className = 'nav-buttons'>ERC20</button>
                </Link>
              </div>
              <header className = 'text-header'>Your Braitberry:</header>
                <div className = 'info'>
                 <p>-ID:1337</p>
                 <p>-8 currency available</p>
                 <p>-2 currency can add</p>
                </div>
            </div>
        </div>

        </div>
        <div className = 'footer'>
          <div className = 'footer-content'>
            <p className = 'status'>Status:<span className = 'footer-status-span'> OK</span></p>
            <p className = 'version'>Braitberry v 0.1</p>
          </div>
        </div>
        </div>
    )
  }
}
/* <div className = 'main'>
          main content here
          </div>
          <div className = 'sidebar'>
          Sidebar here
          </div>
        <div className = 'footer'>
          <div className = 'footer-content'>
             Footer
          </div>
        </div>
*/
// <Route path = '/' component = {MainLayout}/>
