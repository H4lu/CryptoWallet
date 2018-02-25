import React from 'react'
// import { Switch, Route } from 'react-router'
import {Route, Redirect} from 'react-router'
import {Header} from '../components/Header'
import {Footer} from '../components/Footer'
import {SidebarContent} from '../components/SidebarContent'
// import { ERC20 } from '../components/ERC20'
// import {Main} from '../components/Main'
// import { TransactionComponent } from '../components/TransactionComponent'
import {BTCTransaction} from '../components/BTCTransaction'
import {LTCTransaction} from '../components/LTCTransaction'
import {ETHTransaction} from '../components/ETHTransaction'
import {BTCWindow} from '../components/BTCWindow'
import {ETHWIndow} from '../components/ETHWindow'
import {LTCWindow} from '../components/LTCWindow'
import '../components/style.css'
import { MainContent } from '../components/MainContent'

import {getBalance} from '../API/cryptocurrencyAPI/BitCoin'
import {getLitecoinBalance} from '../API/cryptocurrencyAPI/Litecoin'
import {getEthereumBalance} from '../API/cryptocurrencyAPI/Ethereum'
import GetCurrencyRate from '../core/GetCurrencyRate'
interface IAPPState {
  BTCBalance: number,
  ETHBalance: number,
  LTCBalance: number,
  BTCPrice: number,
  ETHPrice: number,
  LTCPrice: number,
  totalBalance: number
}
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


export class App extends React.Component<any, IAPPState> {

  routes = [
    {
      path: '/main',
      exact: true,
      sidebar: SidebarContent,
      main: () => <MainContent btcBalance = {this.state.BTCBalance}/>
    },
    {
      path: '/btc-window',
      exact: true,
      sidebar: SidebarContent,
      main: BTCWindow
    },
    {
      path: '/eth-window',
      exact: true,
      sidebar: SidebarContent,
      main: ETHWIndow
    },
    {
      path: '/ltc-window',
      exact: true,
      sidebar: SidebarContent,
      main: LTCWindow
    },
    {
      path: '/btc-transaction',
      exact: true,
      sidebar: BTCTransaction,
      main: BTCWindow
    },
    {
      path: '/eth-transaction',
      exact: true,
      sidebar: ETHTransaction,
      main: ETHWIndow
    },
    {
      path: '/ltc-transaction',
      exact: true,
      sidebar: LTCTransaction,
      main: LTCWindow
    }
  ]
  /*render() {
    return (
      <div>
        <Header/>
        <Redirect from ='/' to ='/main'/>
        <Route path = '/transaction-window' component = {TransactionWindow}/>
        <Route  component = {SidebarContent}/>
        <Route path = '/main'  component = {Main}/>
        <Route path = '/currency' component = {Currency}/>
        <Route path = '/erc20' component = {ERC20}/>
        <Route path = '/send' component = {TransactionComponent}/>
        <Footer/>
      </div>
    )
  }*/
  constructor(props: any) {
    super(props)

    this.state = {
      BTCBalance: 0,
      ETHBalance: 0,
      LTCBalance: 0,
      BTCPrice: 0,
      ETHPrice: 0,
      LTCPrice: 0,
      totalBalance: 0
    }
    this.getValues = this.getValues.bind(this)
  }
  getValues() {
    Promise.all([getBalance(), getEthereumBalance(), getLitecoinBalance(), GetCurrencyRate()]).then(value => {
      for (let val in value) {
        if (typeof(value[val]) == 'object') {
          if(Number(val) !== value.length-1) {
            continue
          } else {
            console.log(value[val].content)
            const parsedRate = JSON.parse(value[val].content)
            console.log(parsedRate)
            console.log(parsedRate.id)
            console.log(parsedRate['BTC'])
          }
          console.log('Not number: ' + value[val].content)
          console.log(typeof(value[val]))
          console.log(JSON.parse(value[val].content).data.confirmed_balance)
          switch(JSON.parse(value[val].content).data.network) {
            case 'BTCTEST': {
              console.log('In BTCTEST')
              this.setState({ BTCBalance:  JSON.parse(value[val].content).data.confirmed_balance})
              break
            }
            case 'LTCTEST': {
              this.setState({ LTCBalance: JSON.parse(value[val].content).data.confirmed_balance })
              break
            }
          }
        } else {
          console.log('Type in else: ' + typeof(value))
          console.log('Its number: ' + value[val])
          this.setState({ ETHBalance: value[val] })
        }
      }
      console.log('Promise all value: ' + value)
    })
  }
  componentWillMount() {
    this.getValues()
  }
  render() {
    return(
      <div>
        <Header/>
        <Redirect from = '/' to = '/main'/>
         {this.routes.map((route, index) => (
          // You can render a <Route> in as many places
          // as you want in your app. It will render along
          // with any other <Route>s that also match the URL.
          // So, a sidebar or breadcrumbs or anything else
          // that requires you to render multiple things
          // in multiple places at the same URL is nothing
          // more than multiple <Route>s.
          <Route
            exact = {route.exact}
            key = {index}
            path={route.path}
            component= {route.sidebar}
          />
        ))}
         {this.routes.map((route, index) => (
          // You can render a <Route> in as many places
          // as you want in your app. It will render along
          // with any other <Route>s that also match the URL.
          // So, a sidebar or breadcrumbs or anything else
          // that requires you to render multiple things
          // in multiple places at the same URL is nothing
          // more than multiple <Route>s.
          <Route
            key = {index}
            exact = {route.exact}
            path={route.path}
            component= {route.main}
          />
        ))}
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
