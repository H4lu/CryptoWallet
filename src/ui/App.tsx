import { info } from 'electron-log'
import React from 'react'
import { Route, Redirect } from 'react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SidebarContent } from '../components/SidebarContent'

import { BTCWindow } from '../components/BTCWindow'
import { ETHWIndow } from '../components/ETHWindow'
import { LTCWindow } from '../components/LTCWindow'
import '../components/style.css'
import MainContent from '../components/MainContent'
import { getBitcoinLastTx, initBitcoinAddress, getBTCBalance,setBTCBalance,setBTCPrice, isBTCOutgoing } from '../API/cryptocurrencyAPI/BitCoin'
import { getLTCBalance, initLitecoinAddress, getLitecoinLastTx,setLTCBalance,setLTCPrice, isLTCOutgoing } from '../API/cryptocurrencyAPI/Litecoin'
import { getETHBalance, initEthereumAddress, getEthereumLastTx, getEthereumAddress,setETHBalance,setETHPrice } from '../API/cryptocurrencyAPI/Ethereum'
import GetCurrencyRate from '../core/GetCurrencyRate'
import { SidebarNoButtons } from '../components/SidebarNoButtons'
import { MainWindow } from '../components/MainWindow'
import * as satoshi from 'satoshi-bitcoin'
import { TransactionSuccess } from '../components/TransactionSuccess'

import pcsclite from 'pcsclite'
import { setReader } from '../API/hardwareAPI/Reader'
let pcsc = new pcsclite()
import { getInfoPCSC } from '../API/hardwareAPI/GetWalletInfo'
import { UpdateHWStatusPCSC } from '../API/hardwareAPI/UpdateHWStatus'

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
  totalPercentage: number,
  isInitialized: boolean,
  walletStatus: number,
  redirectToMain: boolean
}

export default class App extends React.Component<any, IAPPState> {
  routes = [
    {
      path: '/main',
      exact: true,
      sidebar: () => <SidebarContent total = {this.state.totalBalance} refresh = {this.updateData} totalPercent = {this.state.totalPercentage}/>,
      main: () => <MainContent btcBalance = {this.state.BTCBalance} ltcBalance = {this.state.LTCBalance} ethBalance = {this.state.ETHBalance}
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
      main: () => <BTCWindow balance = {this.state.BTCBalance} price = {this.state.BTCPrice} hourChange = {this.state.BTCHourChange} lastTx = {this.state.BTCLastTx.sort((a: any, b: any) => {
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
      totalPercentage: 0,
      isInitialized: false,
      walletStatus: 3,
      redirectToMain: false
    }
    this.resetRedirect = this.resetRedirect.bind(this)
    this.redirectToTransactionsuccess = this.redirectToTransactionsuccess.bind(this)
    this.parseETHTransactions = this.parseETHTransactions.bind(this)
    this.parseTransactionDataETH = this.parseTransactionDataETH.bind(this)
    //this.parseBTCLikeTransactions = this.parseBTCLikeTransactions.bind(this)
    this.parseTransactionDataBTC = this.parseTransactionDataBTC.bind(this)
    // this.waitForPin = this.waitForPin.bind(this)
    this.initAll = this.initAll.bind(this)
    this.getBalances = this.getBalances.bind(this)
    this.getTransactions = this.getTransactions.bind(this)
    this.updateData = this.updateData.bind(this)
    this.connectionERROR = this.connectionERROR.bind(this)
    this.connectionOK = this.connectionOK.bind(this)
    this.addUnconfirmedTx = this.addUnconfirmedTx.bind(this)
    this.changeBalance = this.changeBalance.bind(this)
    this.getWalletInfo = this.getWalletInfo.bind(this)
    this.setRedirectToMain = this.setRedirectToMain.bind(this)
    this.getRates = this.getRates.bind(this)
    this.setValues = this.setValues.bind(this)
  }
  redirectToTransactionsuccess() {
    let self = this
    self.resetRedirect()
    self.setState({ redirectToTransactionSuccess: true })
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

  getWalletInfo() {
    let interval = setInterval(async () => {
      try {
        info('START GETWALLET INFO')
        let data = await getInfoPCSC()
        info('GOT THIS DATA',data)
        switch (data) {
        case 0: {
          clearInterval(interval)
          info('SETTING WALLET STATUS 0')
          this.initAll()
          this.setState({ walletStatus: 0 })
          break
        }
        case 1: {
          this.setState({ walletStatus: 1 })
          break
        }
        case 2: {
          this.setState({ walletStatus: 2 })
          break
        }
        case 3: {
          this.setState({ walletStatus: 3 })
          break
        }
        case 4: {
          this.setState({ walletStatus: 4 })
          break
        }
        }
      } catch (error) {
        info('GOT ERROR',error)
        clearInterval(interval)
      }
    },500,[])
   
  }

  componentDidMount() {
    // handleLitecoin('mw3nwmeux9gEghMezCjfiepTtzXrDoFg6a',0.0002,10,this.redirectToTransactionsuccess)
    // handle('mgWZCzn4nv7noRwnbThqQ2hD2wT3YAKTJH',0.00002,10,this.redirectToTransactionsuccess())
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
          log('FLI FLOP')
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

info('APP PROPS:', this.props)
info('APP:', App)
pcsc.on('reader', async (reader) => {
  info('READER DETECTED', reader.name)
  if (reader.name.includes('PN7462AU')) {
    info('setting')
    setReader(reader)
    reader.on('status', (status) => {
      info('READER STATE', reader.state)
      let changes = reader.state ^ status.state
      info(status)
      if (changes) {
        if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
          info('ASD')
        } else if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
          info('card inserted')
          reader.connect({ share_mode : reader.SCARD_SHARE_SHARED }, async (err, protocol) => {
            if (err) {
              info('ERROR OCCURED', err)
              info(err)
            } else {
              info('CONNECTED')
              this.setState({ connection: true })
              this.getWalletInfo()
              info('Protocol(', reader.name, '):', protocol)
            }
          })
        }
      }
    })
  }
  reader.on('error', function(err) {
    info('Error(', this.name, '):', err.message)
  })
  reader.on('end', () => {
    info('Reader', reader.name, 'removed')
    this.setState({ connection: false })
  })
})

  pcsc.on('error', function(err) {
    info('PCSC error', err.message)
  })


  }
  setRedirectToMain() {
    this.setState({ redirectToMain: true })
  }
  initAll() {
    info('INITING')
    if (this.state.allowInit) {
      this.setState({ allowInit: false })
      initBitcoinAddress()
      .then(initEthereumAddress)
      .then(initLitecoinAddress)
      .then(this.getBalances)
      .then(this.getRates)
      .then(this.getTransactions)
      .then(() => UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice))
      .then(() => {
        this.setRedirectToMain()
        this.setValues()
      })
      /*initBitcoinAddress()
      .then(() => initEthereumAddress()).then(() => initLitecoinAddress()).then(() => this.setState({ status: true }))
      .then(() => this.getValues()).then(() => this.getTransactions())
      .then(() => UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice))
      */
    }
  }
    
  

  setValues() {
    setBTCBalance(this.state.BTCBalance)
    setBTCPrice(this.state.BTCPrice)
    setETHBalance(this.state.ETHBalance)
    setETHPrice(this.state.ETHPrice)
    setLTCBalance(this.state.LTCBalance)
    setLTCPrice(this.state.LTCPrice)
  }

  updateData() {
    info('REFRESHING')
    this.getTransactions().then(this.getBalances)
    .then(() => {
      UpdateHWStatusPCSC(this.state.BTCBalance, this.state.BTCPrice, this.state.ETHBalance, this.state.ETHPrice, this.state.LTCBalance, this.state.LTCPrice)
    }).then(this.getRates)
  }

  changeBalance(currency: string, amount: number) {
    switch (currency) {
    case 'BTC': {
      this.setState({ BTCBalance: (this.state.BTCBalance - amount) })
      break
    }
    case 'ETH': {
      this.setState({ ETHBalance: (this.state.ETHBalance - amount) })
      break
    }
    case 'LTC': {
      this.setState({ LTCBalance: (this.state.LTCBalance - amount) })
    }
    }
  }

  addUnconfirmedTx(currency: string, amount: number, address: string, hash: string) {
    let currentDate = new Date()
    let tx = {
      Date: currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + ' ' + currentDate.getHours() + ':' + currentDate.getMinutes(),
      Currency: currency,
      Amount: amount,
      Address: address,
      Status: 'Unconfirmed',
      Type: 'outgoing',
      Hash: hash
    }
    switch (currency) {
    case 'BTC' : {
      this.setState({ BTCLastTx: [...this.state.BTCLastTx, tx] })
      break
    }
    case 'ETH': {
      this.setState({ ETHLastTx: [...this.state.ETHLastTx, tx] })
      break
    }
    case 'LTC': {
      this.setState({ LTCLastTx: [...this.state.LTCLastTx, tx] })
      break
    }
    }
  }
  getRates() {
    return new Promise((resolve) => {
      console.log('IN GET RATES')
      GetCurrencyRate().then(value => {
        const parsedValue = JSON.parse(value.content)
        for (let item in parsedValue) {
          switch (parsedValue[item].id) {
          case 'bitcoin': {
            console.log('BTC PRICE')
            this.setState({ BTCPrice: Number((parsedValue[item].price_usd * this.state.BTCBalance).toFixed(2)),
              BTCHourChange: Number(parsedValue[item].percent_change_1h)}, () => {
                console.log('got this btc price', this.state.BTCPrice)
                console.log('got this btc balance', this.state.BTCBalance)
                console.log('btc price usd',  Number((parsedValue[item].price_usd)))
              }
              )
              console.log('RATES', parsedValue[item].price_usd,parsedValue[item].percent_change_1h)
            break
          }
          case 'ethereum': {
            console.log('ETH PRICE')
            this.setState({ ETHPrice: Number((parsedValue[item].price_usd * this.state.ETHBalance).toFixed(2)),
              ETHHourChange: Number(parsedValue[item].percent_change_1h)})
              console.log(this.state.ETHPrice, this.state.ETHHourChange)
            break
          }
          case 'litecoin': {
            this.setState({ LTCPrice: Number((parsedValue[item].price_usd * this.state.LTCBalance).toFixed(2)),
              LTCHourChange: Number(parsedValue[item].percent_change_1h)})
              console.log('LTC PRICE', this.state.LTCPrice,this.state.LTCHourChange)
            break
          }
          }
        }
        let total = this.state.BTCPrice + this.state.ETHPrice + this.state.LTCPrice
        console.log('TOTAL', total)
        console.log(Number((total).toFixed(8)))
        this.setState({ totalBalance: Number((total).toFixed(8)) })
        let totalPercentage = this.state.BTCHourChange + this.state.ETHHourChange + this.state.LTCHourChange
        console.log('TOTAL PERCENTAGE', totalPercentage)
        this.setState({ totalPercentage: Number((totalPercentage).toFixed(2)) })
        resolve()
      })
    })
  }
  getBalances() {
    return Promise.all([getBTCBalance(),getETHBalance(), getLTCBalance()]).then(value => {
      console.log('got this value', value)
      for (let item in value) {
        info('SUBSTRING' + value[item][0])
        info('VALUE OF SUB', value[item][1])
        switch (value[item][0]) {
        case 'BTC': {
          info('SETTING BTC BALANCE', value[item][1])
          this.setState({ BTCBalance:  value[item][1] })
          info('BTC STATE', this.state.BTCBalance)
          break
        }
        case 'ETH': {
          info('SETTING ETH BALANCE', value[item][1])
          this.setState({ ETHBalance: value[item][1] })
          info('ETH STATE', this.state.ETHBalance)
          break
        }
        case 'LTC': {
          info('SETTING LTC BALANCE', value[item][1])
          this.setState({ LTCBalance: value[item][1] })
          info('LTC STATE', this.state.LTCBalance)
          break
        }
        }
      }
    })
  }
   
  
  componentWillMount() {
    info('SETTING REDIRECT')
    this.setState({ redirect: true })
  }

  getTransactions() {
    return Promise.all([getBitcoinLastTx(), getLitecoinLastTx(), getEthereumLastTx()]).then(value => {
      console.log('PROMISE ALL VALUE', value)
      console.log('value length', value.length)
      for (let index in value) {
        console.log('looping', index)
        if (Number(index) == 0) {
          let parsed = JSON.parse(value[index].content)
          for (let i in parsed.txs) {
            if (parsed.txs[i].inputs[0].addresses == undefined) {
              continue
            }
            console.log('tx in txs', parsed.txs[i])
            let parsedTx = this.parseTransactionDataBTC(parsed.txs[i], 'BTC')
            console.log('got this parsed tx', parsedTx)
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
            console.log('last tx state', this.state.BTCLastTx)
          }
          
        } else if (Number(index) == 1) {
          let parsed = JSON.parse(value[index].content)
          for (let i in parsed.txs) {
            console.log('tx in txs', parsed.txs[i])
            if (parsed.txs[i].inputs[0].addresses == undefined) {
              continue
            }
            let parsedTx = this.parseTransactionDataBTC(parsed.txs[i], 'LTC')
           
            let findResp = this.state.LTCLastTx.find(function (obj) {
              return obj.Hash === Object(parsedTx).Hash
            })
            if (findResp === undefined) {
              this.setState({ LTCLastTx: [...this.state.LTCLastTx, parsedTx] })
            } else if (Object(parsedTx).Status !== findResp.Status) {
              for (let index in this.state.BTCLastTx) {
                if (this.state.LTCLastTx[index].Hash === Object(parsedTx).Hash) this.state.BTCLastTx[index].Status = Object(parsedTx).Status
              }
            }
         
          }
        } else {
          console.log('PArsing eth tx', value[index].content)
          this.parseETHTransactions(value[index].content)
        }
        // switch(Number(index)) {
        //   case 0: {
             
        //       break
        //   }
        //   case 1: {
           
        //       break
              
        //   }
        //   case 2: { 
           
        //     break
        //   }

        // }
        // if (Object.prototype.hasOwnProperty.call(JSON.parse(value[index].content),'txs')) {
        //   console.log('Parsing btc-like tx')
        //   this.parseBTCLikeTransactions(value[index].content)
        // } else {
          
        // }
      }
    }).catch(error => {
      console.log(error)
    })
  }

  parseETHTransactions(value: any) {
    let transactionsObject = JSON.parse(value)
    if (transactionsObject === undefined) {
      info('RETURNING')
      return
    }
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
    let type = ''
 
   // transaction = JSON.parse(transaction)
    console.log('checking type', transaction)
    if (currency == 'BTC') {
        if (isBTCOutgoing(transaction.inputs[0].addresses)) {
          type = 'outgoing'
        } else {
          type = 'incoming'
        } 
    } else {
        if (isLTCOutgoing(transaction.inputs[0].addresses)) {
          type = 'outgoing'
        } else {
          type = 'incoming'
        }
    }    
    console.log('got this type', type)
      let dateCell = transaction.received
     // let date = new Date(transaction.time * 1000)
     // let dateCell = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      let amount = type == 'outgoing' ? satoshi.toBitcoin(transaction.outputs[0].value) : satoshi.toBitcoin(transaction.inputs[0].output_value)
      let address = type == 'outgoing' ? transaction.outputs[0].addresses[0] : transaction.inputs[0].addresses[0]
      
      let status = (transaction.confirmations === 0) ? 'Uncofirmed' : 'Confirmed'
      let hash = transaction.hash
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
    console.log('got this returned object ', returnedObject)
    
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
        <Route path = '/start' component = {() => <MainWindow connection = {this.state.connection} status = {this.state.status} init = {this.initAll} isInitialized = {this.state.isInitialized} walletStatus = {this.state.walletStatus} redirectToMain = {this.state.redirectToMain}/> }/>
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
