import React from 'react'
// import { Switch, Route } from 'react-router'
import { Route, Redirect } from 'react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SidebarContent } from '../components/SidebarContent'
// import { ERC20 } from '../components/ERC20'
// import {Main} from '../components/Main'
// import { TransactionComponent } from '../components/TransactionComponent'
import { BTCWindow } from '../components/BTCWindow'
import { ETHWIndow } from '../components/ETHWindow'
import { LTCWindow } from '../components/LTCWindow'
import '../components/style.css'
import { MainContent } from '../components/MainContent'
import { getBalance, getBitcoinLastTx, initBitcoinAddress } from '../API/cryptocurrencyAPI/BitCoin'
import { getLitecoinBalance, getLitecoinLastTx, initLitecoinAddress } from '../API/cryptocurrencyAPI/Litecoin'
import { getEthereumBalance, convertFromWei, initEthereumAddress, getEthereumLastTx } from '../API/cryptocurrencyAPI/Ethereum'
import GetCurrencyRate from '../core/GetCurrencyRate'
import { SidebarNoButtons } from '../components/SidebarNoButtons'
import { MainWindow } from '../components/MainWindow'
import { findDevice } from '../API/hardwareAPI/GetWalletInfo'
// import { wrapper } from '../API/hardwareAPI/GetWalletInfo'
/* import SerialPort from 'serialport'
SerialPort.list().then(value => {
  console.log('Serialport list value: ' + JSON.stringify(value))
})
let firstBuff = Buffer.from([0x9c,0x9c,0x53,0x00])
let hashBuff = Buffer.from('8ac74ce78eda742ee94099da1f80ebf34da00dd65e26f65b189fdcfb18efc9bb', 'hex')
let intBuff = new Buffer(4)
intBuff.writeInt32LE(1.5 * 100000000, 0)
console.log('Int buff: ' + Buffer.from(intBuff.readInt32LE(0).toString()))
let addrBuff = Buffer.from('mgWZCzn4nv7noRwnbThqQ2hD2wT3YAKTJH', 'hex')
console.log(addrBuff)
let lastBuff = Buffer.from([0x9a,0x9a])
let arr = Buffer.concat([firstBuff, hashBuff,intBuff, addrBuff, lastBuff])
let port = new SerialPort('COM5', { autoOpen: false, baudRate: 115200 })
getSig().then(value => {
  console.log('FINALLY THIS VALUE: ' + value)
})
function getData() {
  return new Promise((resolve, reject) => {
    port.write(arr)
    console.log('Attempt to read')
    port.on('data', data => {
      resolve(data.toString('hex'))
    })
    port.on('error', data => {
      reject(data)
    })
  })
}
export async function getSig() {
  try {
    port.open(err => {
      if (err) {
        return console.log('Error opening port: ' + err.message)
      }
      getData().then(value => {
        console.log('IN PROMISE: ' + value)
      })
    })
  } catch (err) {
    console.log(err)
  }
}
*/
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
  LTCLastTx: Array<any>,
  connection: boolean,
  status: boolean,
  redirect: boolean,
  ETHLastTx: Array<any>
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
      sidebar: () => <SidebarContent total = {this.state.totalBalance} refresh = {this.getValues}/>,
      main: () => <MainContent btcBalance = {this.state.BTCBalance} ltcBalance = {this.state.LTCBalance} ethBalance = {this.state.ETHBalance}
      btcPrice = {this.state.BTCPrice} ltcPrice = {this.state.LTCPrice} ethPrice = {this.state.ETHPrice} btcHourChange = {this.state.BTCHourChange}
      ltcHourChange = {this.state.LTCHourChange} ethHourChange = {this.state.ETHHourChange} btcLastTx = {this.state.BTCLastTx} transactions = {this.getTransactions}/>
    },
    {
      path: '/btc-window',
      exact: true,
      sidebar: () => <SidebarNoButtons total = {this.state.totalBalance}/>,
      main: () => <BTCWindow balance = {this.state.BTCBalance} price = {this.state.BTCPrice} hourChange = {this.state.BTCHourChange} lastTx = {this.state.BTCLastTx} transactions = {this.getTransactions}/>
    },
    {
      path: '/eth-window',
      exact: true,
      sidebar: () => <SidebarNoButtons total = {this.state.totalBalance}/>,
      main: () => <ETHWIndow balance = {this.state.ETHBalance} price = {this.state.ETHPrice} hourChange = {this.state.ETHHourChange}/>
    },
    {
      path: '/ltc-window',
      exact: true,
      sidebar: () => <SidebarNoButtons total = {this.state.totalBalance}/>,
      main: () => <LTCWindow balance = {this.state.LTCBalance} price = {this.state.LTCPrice} hourChange = {this.state.LTCHourChange} lastTx = {this.state.LTCLastTx} transactions = {this.getTransactions}/>
    }
  ]
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
      BTCLastTx: [],
      ETHLastTx: [],
      connection: false,
      status: false,
      redirect: false
    }
    this.waitForConnection = this.waitForConnection.bind(this)
    this.getValues = this.getValues.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
  }
  componentDidMount() {
    this.waitForConnection()
    /* setTimeout(() => {
      initBitcoinAddress()
      initEthereumAddress()
      initLitecoinAddress()
      this.getValues()
      this.getTransactions()
    }, 3000)
    setTimeout(() => {
      this.setState({ status: true })
    }, 6000)
    */
  }
  waitForConnection() {
    while (!this.state.connection) {
      findDevice().then(value => {
        if (value !== undefined) {
          console.log(value)
          console.log('CONNECTED')
          this.setState({ connection: true })
          initLitecoinAddress()
          initBitcoinAddress()
          initEthereumAddress()
          return
        } else {
          console.log('DISCONNECTED')
        }
      })
    }
  }
  getValues() {
    Promise.all([getBalance(), getEthereumBalance(), getLitecoinBalance(), GetCurrencyRate()]).then(value => {
      for (let val in value) {
        console.log('In getvalues')
        if (typeof(value[val]) === 'object') {
          if (Number(val) !== value.length - 1) {
            switch (JSON.parse(value[val].content).data.network) {
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
      let total = this.state.BTCPrice + this.state.ETHPrice + this.state.LTCPrice
      this.setState({ totalBalance: Number((total).toFixed(2)) })
    })
  }
  componentWillMount() {
    this.setState({ redirect: true })

  }

  getTransactions() {
    Promise.all([getBitcoinLastTx(), getLitecoinLastTx(), getEthereumLastTx()]).then(value => {
      JSON.stringify(value)
      for (let index in value) {
        console.log('Parsed: ' + JSON.parse(value[index].content))
        console.log('Stringify: ' + JSON.stringify(value[index].content))
        let parsedResponse = JSON.parse(value[index].content).data
        for (let tx in parsedResponse.txs) {
          switch (parsedResponse.network) {
          case 'BTCTEST': {
            this.setState({ BTCLastTx: [...this.state.BTCLastTx, parsedResponse.txs[tx]] })
            break
          }
          case 'LTCTEST': {
            this.setState({ LTCLastTx: [...this.state.LTCLastTx, parsedResponse.txs[tx]] })
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
        {(this.state.redirect) ? (
          <Redirect to = '/start'/>
        ) : (
          null
        )}
        <Route path = '/start' component = {() => <MainWindow connection = {this.state.connection} status = {this.state.status}/>}/>
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
        <Footer status = {this.state.status} connection = {this.state.connection}/>
      </div>
    )
  }
}
