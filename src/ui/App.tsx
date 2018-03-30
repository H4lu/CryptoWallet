import React from 'react'
import pcsclite from 'pcsclite'
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
import MainContent from '../components/MainContent'
import { getBitcoinLastTx, initBitcoinAddress } from '../API/cryptocurrencyAPI/BitCoin'
import { getLitecoinBalance, initLitecoinAddress, getLitecoinLastTx } from '../API/cryptocurrencyAPI/Litecoin'
import { getEthereumBalance, convertFromWei, initEthereumAddress, getEthereumLastTx, getEthereumAddress } from '../API/cryptocurrencyAPI/Ethereum'
import GetCurrencyRate from '../core/GetCurrencyRate'
import { SidebarNoButtons } from '../components/SidebarNoButtons'
import { MainWindow } from '../components/MainWindow'
// import { checkPin } from '../API/hardwareAPI/GetWalletInfo'
// import { wrapper } from '../API/hardwareAPI/GetWalletInfo'
import { TransactionSuccess } from '../components/TransactionSuccess'
// import SerialPort from 'serialport'
import { loadBitcoinBalance } from '../core/actions/load'
let pcsc = new pcsclite()

// import { connect } from 'react-redux'
/*
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
/* interface IAppProps {
  store: any,
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
  ETHLastTx: Array<any>,
  connection: boolean,
  status: boolean,
  redirect: boolean,
  tempState: Array<any>,
  allowInit: boolean,
  redirectToTransactionSuccess: boolean,
  totalPercentage: number
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
  ETHLastTx: Array<any>,
  connection: boolean,
  status: boolean,
  redirect: boolean,
  tempState: Array<any>,
  allowInit: boolean,
  redirectToTransactionSuccess: boolean,
  totalPercentage: number
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

export default class App extends React.Component<any, IAPPState> {
  routes = [
    {
      path: '/main',
      exact: true,
      sidebar: () => <SidebarContent total = {this.state.totalBalance} refresh = {this.updateData} totalPercent = {this.state.totalPercentage}/>,
      main: () => <MainContent btcBalance = {this.props.balance} ltcBalance = {this.state.LTCBalance} ethBalance = {this.state.ETHBalance}
      btcPrice = {this.state.BTCPrice} ltcPrice = {this.state.LTCPrice} ethPrice = {this.state.ETHPrice} btcHourChange = {this.state.BTCHourChange}
      ltcHourChange = {this.state.LTCHourChange} ethHourChange = {this.state.ETHHourChange} lastTx = {this.state.BTCLastTx.concat(this.state.ETHLastTx, this.state.LTCLastTx).sort((a: any, b: any) => {
        let c = new Date(a.Date).getTime()
        let d = new Date(b.Date).getTime()
        return d - c
      })} transactions = {this.getTransactions}/>
    },
    {
      path: '/btc-window',
      exact: true,
      sidebar: () => <SidebarNoButtons total = {this.state.totalBalance} totalPercent = {this.state.totalPercentage}/>,
      main: () => <BTCWindow balance = {this.props.balance} price = {this.state.BTCPrice} hourChange = {this.state.BTCHourChange} lastTx = {this.state.BTCLastTx.sort((a: any, b: any) => {
        let c = new Date(a.Date).getTime()
        let d = new Date(b.Date).getTime()
        return d - c
      })} transactions = {this.getTransactions} redirect = {this.redirectToTransactionsuccess} reset = {this.resetRedirect}/>
    },
    {
      path: '/eth-window',
      exact: true,
      sidebar: () => <SidebarNoButtons total = {this.state.totalBalance} totalPercent = {this.state.totalPercentage}/>,
      main: () => <ETHWIndow balance = {this.state.ETHBalance} price = {this.state.ETHPrice} hourChange = {this.state.ETHHourChange} lastTx = {this.state.ETHLastTx.sort((a: any, b: any) => {
        let c = new Date(a.Date).getTime()
        let d = new Date(b.Date).getTime()
        return d - c
      })} redirect = {this.redirectToTransactionsuccess} reset = {this.resetRedirect}/>
    },
    {
      path: '/ltc-window',
      exact: true,
      sidebar: () => <SidebarNoButtons total = {this.state.totalBalance} totalPercent = {this.state.totalPercentage}/>,
      main: () => <LTCWindow balance = {this.state.LTCBalance} price = {this.state.LTCPrice} hourChange = {this.state.LTCHourChange} lastTx = {this.state.LTCLastTx.sort((a: any, b: any) => {
        let c = new Date(a.Date).getTime()
        let d = new Date(b.Date).getTime()
        return d - c
      })} transactions = {this.getTransactions} redirect = {this.redirectToTransactionsuccess} reset = {this.resetRedirect}/>
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
      redirect: false,
      tempState: [],
      allowInit: true,
      redirectToTransactionSuccess: false,
      totalPercentage: 0
    }
    this.resetRedirect = this.resetRedirect.bind(this)
    this.redirectToTransactionsuccess = this.redirectToTransactionsuccess.bind(this)
    this.parseETHTransactions = this.parseETHTransactions.bind(this)
    this.parseTransactionDataETH = this.parseTransactionDataETH.bind(this)
    this.parseBTCLikeTransactions = this.parseBTCLikeTransactions.bind(this)
    this.parseTransactionDataBTC = this.parseTransactionDataBTC.bind(this)
    // this.waitForPin = this.waitForPin.bind(this)
    this.initAll = this.initAll.bind(this)
    this.getValues = this.getValues.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
    this.updateData = this.updateData.bind(this)
    this.connectionERROR = this.connectionERROR.bind(this)
    this.connectionOK = this.connectionOK.bind(this)
  }
  redirectToTransactionsuccess() {
    this.resetRedirect()
    this.setState({ redirectToTransactionSuccess: true })
  }
  resetRedirect() {
    this.setState({ redirectToTransactionSuccess: false })
  }
  connectionOK() {
    this.setState({ connection: true })
  }
  connectionERROR() {
    this.setState({ connection: false })
  }
  componentDidMount() {
    /*
    setInterval(() => {
      SerialPort.list().then(value => {
        for (let item in value) {
          if (value[item].manufacturer === 'NXP') {
            if (this.state.connection) {
              return
            } else {
              this.waitForPin()
              return this.setState({ connection: !this.state.connection })
            }
          }
        }
        if (this.state.connection) {
          console.log('FLI FLOP')
          this.setState({ connection: !this.state.connection })
        }
      })
    }, 1000, [])
  }
  waitForPin() {
    let timer = setInterval(() => {
      if (checkPin()) {
        this.setState({ status: true })
        clearInterval(timer)
      }
    },1000,[])
  */
    pcsc.on('reader', (reader) => {

      console.log('New reader detected', reader.name)

      reader.on('error', function(err) {
        console.log('Error(', this.name, '):', err.message)
      })

      reader.on('status', (status) => {
        console.log('Status(', status.name, '):', status)
          /* check what has changed */
        const changes = reader.state ^ status.state
        if (changes) {
          if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
            console.log('card removed')/* card removed */
            this.connectionERROR()
            reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
              if (err) {
                console.log(err)
              } else {
                console.log('Disconnected')
              }
            })
          } else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
            console.log('card inserted')/* card inserted */
            this.connectionOK()
            reader.connect({ share_mode : reader.SCARD_SHARE_SHARED }, function(err, protocol) {
              if (err) {
                console.log(err)
              } else {
                console.log('Protocol(', reader.name, '):', protocol)
              }
            })
          }
        }
      })

      reader.on('end', function() {
        console.log('Reader', this.name, 'removed')
      })
    })

    pcsc.on('error', function(err) {
      console.log('PCSC error', err.message)
    })
  }
  initAll() {
    if (this.state.allowInit) {
      this.setState({ allowInit: false })
      initBitcoinAddress()
      initEthereumAddress()
      initLitecoinAddress()
      this.props.store.dispatch(loadBitcoinBalance())
      this.getValues()
      this.getTransactions()
    }

  }
  updateData() {
    this.getTransactions()
    this.getValues()
  }
  getValues() {
    Promise.all([getEthereumBalance(), getLitecoinBalance(), GetCurrencyRate()]).then(value => {
      for (let val in value) {
        if (typeof(value[val]) === 'object') {
          if (Number(val) !== value.length - 1) {
            switch (JSON.parse(value[val].content).data.network) {
            case 'BTCTEST': {
              let balance: number = Number(JSON.parse(value[val].content).data.confirmed_balance)
              this.setState({ BTCBalance:  Number(balance.toFixed(8)) })
              break
            }
            case 'LTCTEST': {
              let balance: number = Number(JSON.parse(value[val].content).data.confirmed_balance)
              this.setState({ LTCBalance: Number(balance.toFixed(8)) })
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
          this.setState({ ETHBalance: Number(balance.toFixed(8)) })
        }
      }
      let total = this.state.BTCPrice + this.state.ETHPrice + this.state.LTCPrice
      this.setState({ totalBalance: Number((total).toFixed(8)) })
      let totalPercentage = this.state.BTCHourChange + this.state.ETHHourChange + this.state.LTCHourChange
      this.setState({ totalPercentage: Number((totalPercentage).toFixed(2)) })
    })
  }
  componentWillMount() {
    console.log('SETTING REDIRECT')
    this.setState({ redirect: true })
  }
  getTransactions() {
    Promise.all([getBitcoinLastTx(),getLitecoinLastTx(), getEthereumLastTx()]).then(value => {
      for (let index in value) {
        if (Object.prototype.hasOwnProperty.call(JSON.parse(value[index].content),'data')) {
          this.parseBTCLikeTransactions(value[index].content)
        } else {
          this.parseETHTransactions(value[index].content)
        }
      }
    }).catch(error => {
      console.log(error)
    })
  }
  parseETHTransactions(value: any) {
    let transactionsObject = JSON.parse(value)
    transactionsObject.map((value: any) => {
      let parsedTx = this.parseTransactionDataETH(value, getEthereumAddress())
      let findResp = this.state.ETHLastTx.find(function (obj) {
        return obj.Hash === Object(parsedTx).Hash
      })
      if (findResp === undefined) {
        this.setState({ ETHLastTx: [...this.state.ETHLastTx, parsedTx] })
      } else if (Object(parsedTx).Status !== findResp.Status) {
        for (let index in this.state.ETHLastTx) {
          if (this.state.ETHLastTx[index].Hash === Object(parsedTx).Hash) this.state.ETHLastTx[index].Status = Object(parsedTx).Status
        }
      }
    })

  }

  parseBTCLikeTransactions(value: any) {
    let parsedResponse = JSON.parse(value).data
    for (let tx in parsedResponse.txs) {
      switch (parsedResponse.network) {
      case 'BTCTEST': {
        let parsedTx = this.parseTransactionDataBTC(parsedResponse.txs[tx], 'BTC')
        let findResp = this.state.BTCLastTx.find(function (obj) {
          return obj.Hash === Object(parsedTx).Hash
        })
        if (findResp === undefined) {
          this.setState({ BTCLastTx: [...this.state.BTCLastTx, parsedTx] })
        } else if (Object(parsedTx).Status !== findResp.Status) {
          for (let index in this.state.BTCLastTx) {
            if (this.state.BTCLastTx[index].Hash === Object(parsedTx).Hash) this.state.BTCLastTx[index].Status = Object(parsedTx).Status
          }
        }
        break
      }
      case 'LTCTEST': {
        console.log('IN LTC')
        let parsedTx = this.parseTransactionDataBTC(parsedResponse.txs[tx], 'LTC')
        let findResp = this.state.LTCLastTx.find(function (obj) {
          return obj.Hash === Object(parsedTx).Hash
        })
        if (findResp === undefined) {
          this.setState({ LTCLastTx: [...this.state.LTCLastTx, parsedTx] })
        } else if (Object(parsedTx).Status !== findResp.Status) {
          for (let index in this.state.LTCLastTx) {
            if (this.state.LTCLastTx[index].Hash === Object(parsedTx).Hash) this.state.LTCLastTx[index].Status = Object(parsedTx).Status
          }
        }
        break
      }
      }
    }
  }
  parseTransactionDataETH(transaction: any, ethAddress: string) {
    let date = new Date(transaction.timestamp * 1000)
    let dateCell = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
    let amount = transaction.value
    let type = ''
    let hash = transaction.hash
    { (transaction.from === ethAddress.toLowerCase()) ? (type = 'outgoing') : (type = 'incoming') }
    let address = ''
    { (type === 'outgoing') ? (address = transaction.to) : (address = transaction.from) }
    let status = transaction.success ? 'Confirmed' : 'Unconfirmed'
    let returnedObject = {
      Date: dateCell,
      Currency: 'ETH',
      Amount: amount,
      Address: address,
      Status: status,
      Type: type,
      Hash: hash
    }
    return returnedObject

  }
  parseTransactionDataBTC(transaction: any, currency: string): Object {
    let returnedObject = {}
    if (transaction.outgoing !== undefined) {
      let date = new Date(transaction.time * 1000)
      let dateCell = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      let amount = transaction.outgoing.outputs[0].value
      let address = transaction.outgoing.outputs[0].address
      let type = 'outgoing'
      let status = (transaction.confirmations === 0) ? 'Uncofirmed' : 'Confirmed'
      let hash = transaction.txid
      let dataToPass = {
        Date: dateCell,
        Currency: currency,
        Amount: amount,
        Address: address,
        Status: status,
        Type: type,
        Hash: hash
      }
      returnedObject = dataToPass
    } else {
      let date = new Date(transaction.time * 1000)
      let dateCell = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      let amount = transaction.incoming.value
      let address = transaction.incoming.inputs[0].address
      let type = 'incoming'
      let status = (transaction.confirmations === 0) ? 'Uncofirmed' : 'Confirmed'
      let hash = transaction.txid
      let dataToPass = {
        Date: dateCell,
        Currency: currency,
        Amount: amount,
        Address: address,
        Status: status,
        Type: type,
        Hash: hash
      }
      returnedObject = dataToPass
    }
    return returnedObject
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
        {(this.state.redirectToTransactionSuccess) ? (
          <Redirect to = '/transaction_success'/>
        ) : (
          null
        )}
        <Route path = '/transaction_success' component = {() => <TransactionSuccess refresh = {this.updateData} resetState = {this.redirectToTransactionsuccess}/> }/>
        <Route path = '/start' component = {() => <MainWindow connection = {this.state.connection} status = {this.state.status} init = {this.initAll}/>}/>
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
/* function mapStateToProps(state: any, store: any) {
  console.log(store)
  return {
    balance: state.getBalance
  }
}

export default connect(mapStateToProps)(App)
*/
