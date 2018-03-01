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
import {getBalance, getBitcoinLastTx} from '../API/cryptocurrencyAPI/BitCoin'
import {getLitecoinBalance, getLitecoinLastTx} from '../API/cryptocurrencyAPI/Litecoin'
import {getEthereumBalance, convertFromWei} from '../API/cryptocurrencyAPI/Ethereum'
import GetCurrencyRate from '../core/GetCurrencyRate'

interface IAPPState {
  BTCBalance: number,
  ETHBalance: number,
  LTCBalance: number,
  BTCPrice: number,
  ETHPrice: number,
  LTCPrice: number,
  totalBalance: number,
  BTCHourChange: number,
  ETHHourChange: number,
  LTCHourChange: number,
  BTCLastTx: Array<any>,
  LTCLastTx: Array<any>
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
      sidebar: () => <SidebarContent total = {this.state.totalBalance}/>,
      main: () => <MainContent btcBalance = {this.state.BTCBalance} ltcBalance = {this.state.LTCBalance} ethBalance = {this.state.ETHBalance}
      btcPrice = {this.state.BTCPrice} ltcPrice = {this.state.LTCPrice} ethPrice = {this.state.ETHPrice} refresh = {this.getValues} btcHourChange = {this.state.BTCHourChange}
      ltcHourChange = {this.state.LTCHourChange} ethHourChange = {this.state.ETHHourChange}/>
    },
    {
      path: '/btc-window',
      exact: true,
      sidebar: () => <SidebarContent total = {this.state.totalBalance}/>,
      main: () => <BTCWindow balance = {this.state.BTCBalance} price = {this.state.BTCPrice} hourChange = {this.state.BTCHourChange} lastTx = {this.state.BTCLastTx}/>
    },
    {
      path: '/eth-window',
      exact: true,
      sidebar: () => <SidebarContent total = {this.state.totalBalance}/>,
      main: () => <ETHWIndow balance = {this.state.ETHBalance} price = {this.state.ETHPrice} hourChange = {this.state.ETHHourChange}/>
    },
    {
      path: '/ltc-window',
      exact: true,
      sidebar: () => <SidebarContent total = {this.state.totalBalance}/>,
      main: () => <LTCWindow balance = {this.state.LTCBalance} price = {this.state.LTCPrice} hourChange = {this.state.LTCHourChange} lastTx = {this.state.LTCLastTx}/>
    },
    {
      path: '/btc-transaction',
      exact: true,
      sidebar: BTCTransaction,
      main: () => <BTCWindow balance = {this.state.BTCBalance} price = {this.state.BTCPrice} hourChange = {this.state.BTCHourChange}/>
    },
    {
      path: '/eth-transaction',
      exact: true,
      sidebar: ETHTransaction,
      main: () => <ETHWIndow balance = {this.state.ETHBalance} price = {this.state.ETHPrice} hourChange = {this.state.ETHHourChange}/>
    },
    {
      path: '/ltc-transaction',
      exact: true,
      sidebar: LTCTransaction,
      main: () => <LTCWindow balance = {this.state.LTCBalance} price = {this.state.LTCPrice} hourChange = {this.state.LTCHourChange}/>
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
      totalBalance: 0,
      BTCHourChange: 0,
      LTCHourChange: 0,
      ETHHourChange: 0,
      LTCLastTx: [],
      BTCLastTx: []
    }
    this.getValues = this.getValues.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
  }
  getValues() {
    Promise.all([getBalance(), getEthereumBalance(), getLitecoinBalance(), GetCurrencyRate()]).then(value => {
      for (let val in value) {
        if (typeof(value[val]) == 'object') {
          if(Number(val) !== value.length-1) {
            switch(JSON.parse(value[val].content).data.network) {
              case 'BTCTEST': {
                let balance: number = Number(JSON.parse(value[val].content).data.confirmed_balance)
                this.setState({ BTCBalance:  Number(balance.toFixed(4)) })
                break
              }
              case 'LTCTEST': {
                let balance: number = Number(JSON.parse(value[val].content).data.confirmed_balance)
                this.setState({ LTCBalance: Number(balance.toFixed(4)) })
                break
              }
            }
          } else {
              const parsedRate = JSON.parse(value[val].content)
              for (let item in parsedRate) {
                switch (parsedRate[item].id) {
                  case 'bitcoin': {
                    this.setState({ BTCPrice: Number((parsedRate[item].price_usd * this.state.BTCBalance).toFixed(2)),
                                    BTCHourChange: Number(parsedRate[item].percent_change_1h) })
                    break
                  }
                  case 'ethereum': {
                    this.setState({ ETHPrice: Number((parsedRate[item].price_usd * this.state.ETHBalance).toFixed(2)),
                                    ETHHourChange: Number(parsedRate[item].percent_change_1h) })
                    break
                  }
                  case 'litecoin': {
                    this.setState({ LTCPrice: Number((parsedRate[item].price_usd * this.state.LTCBalance).toFixed(2)),
                                    LTCHourChange: Number(parsedRate[item].percent_change_1h) })
                    break
                  }
                }
              }
          } 
        } else {
          let balance: number = Number(convertFromWei(value[val]))
          this.setState({ ETHBalance: Number(balance.toFixed(4)) })
        }
      }
      console.log('Promise all value: ' + value)
      let total = this.state.BTCPrice +  this.state.ETHPrice + this.state.LTCPrice
      this.setState({ totalBalance: total})
    })
  }
  componentWillMount() {
    this.getValues()
    this.getTransactions()
  }
  getTransactions() {
    Promise.all([getBitcoinLastTx(), getLitecoinLastTx()]).then(value => {
      for (let index in value) {
          let parsedResponse = JSON.parse(value[index].content).data
          console.log('Parsed res: ' + JSON.stringify(parsedResponse))
          for (let tx in parsedResponse.txs) {
            console.log('NETWORK: ' + parsedResponse.network)
            switch (parsedResponse.network) {
              case 'BTCTEST': {
                this.setState({ BTCLastTx:[...this.state.BTCLastTx, parsedResponse.txs[tx]] })
                break
              }
              case 'LTCTEST': {
                this.setState({ LTCLastTx: [...this.state.LTCLastTx, parsedResponse.txs[tx]] })
                console.log('Parsed resp: ' + JSON.stringify(parsedResponse.txs[tx]))
                console.log('LTCLastTxState: ' + JSON.stringify(this.state.LTCLastTx))
                break
              }
          }
        }
      }
    }).catch(error => {
      console.log(error)
    })
  }
  render() {
    return(
      <div className = 'container'>
        <Header/>
        <Redirect from = '/' to = '/main'/>
         {this.routes.map((route, index) => (
          <Route
            exact = {route.exact}
            key = {index}
            path={route.path}
            component= {route.sidebar}
          />
        ))}
         {this.routes.map((route, index) => (
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
