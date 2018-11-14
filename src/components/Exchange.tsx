/* import * as React from 'react'
import { Header, Input, Button, Dropdown } from 'semantic-ui-react'
import { initialTransaction, getMarketInfo } from '../API/cryptocurrencyAPI/Exchange'
import { getBitCoinAddress } from '../API/hardwareAPI/GetAddress'

interface IEchangeState {
  changeFrom: string,
  changeTo: string,
  minimum: number,
  maximum: number,
  fee: number,
  amount: number
}
export class Exchange extends React.Component<any, IEchangeState> {
  options = [
    { key: 'bitcoin', text: <span><img src = 'https://shapeshift.io/images/coins-sm/bitcoin.png'/>BTC</span>, value: 'btc' },
    { key: 'litecoin', text: <span><img src = 'https://shapeshift.io/images/coins-sm/litecoin.png'/>LTC</span>, value: 'ltc' },
    { key: 'ethereum', text: <span><img src = 'https://shapeshift.io/images/coins-sm/ether.png'/>ETH</span>, value: 'eth' }
  ]
  constructor(props: any) {
    super(props)
   //  this.requestSupportedCoins = this.requestSupportedCoins.bind(this)
    this.initialRequest = this.initialRequest.bind(this)
    this.handleChangeToChange = this.handleChangeToChange.bind(this)
    this.handleChangeFromChange = this.handleChangeFromChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.getInfo = this.getInfo.bind(this)
    this.state = {
      changeFrom: 'btc',
      changeTo: 'eth',
      amount: 0,
      fee: 0,
      minimum: 0,
      maximum: 0
    }

  }
  // Почему-то состояние обновляется позже вызова getInfo, поэтому вот так
  handleChangeToChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ changeTo: data.value })
    this.getInfo(this.state.changeFrom, data.value)
  }

  handleChangeFromChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ changeFrom: data.value })
    this.getInfo(data.value ,this.state.changeTo)
  }
  handleAmountChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ amount: data.value })
  }
  getInfo(changeFrom: string, changeTo: string) {
    getMarketInfo(changeFrom, changeTo).then(value => {
      console.log('Change from: ' + this.state.changeFrom)
      if (value !== undefined) {
        let parsedResponse = JSON.parse(value.content)
        console.log(parsedResponse)
        this.setState({ minimum: parsedResponse.minimum, maximum: parsedResponse.limit, fee: parsedResponse.minerFee })
      }
    })
  }
  componentWillMount() {
    this.getInfo(this.state.changeFrom, this.state.changeTo)
  }
  /* componentWillMount() {
    this.requestSupportedCoins()
  }
  requestSupportedCoins() {
    let self = this
    getSupportedCoins().then(Response => {
      if (Response !== undefined) {
        let parsedCoins = JSON.parse(Response.content)
        for (let coins in parsedCoins) {
          if (parsedCoins[coins].status === 'available') {
            let coin = {
              key: String(parsedCoins[coins].name),
              text: String(parsedCoins[coins].symbol),
              image: parsedCoins[coins].imageSmall
            }
            self.pairs.push(coin)
          }
        }
        console.log(self.pairs)
      } else {
        alert('Problems with internet connection')
      }
    }).catch(error => {
      console.log(error)
    })
  }
*/
/*
  initialRequest() {
    initialTransaction('0xC7f0d18EdfF316A9cAA5d98fF26369216b38d9e1','btc_eth', 0.001, getBitCoinAddress(1, true))
  }

  render() {
    return(
      <div>
        <div>
         <Header>Choose market pairs:</Header>
         <Dropdown className = 'ui dropdown currency_dropdown' options = {this.options} value = {this.state.changeFrom} onChange = {this.handleChangeFromChange}/>
         <Dropdown className = 'ui dropdown currency_dropdown' options = {this.options} value = {this.state.changeTo} onChange = {this.handleChangeToChange}/>
         <Input type ='number' onChange = {this.handleAmountChange}/>
         <Button onClick = {this.initialRequest}>Next</Button>
         <p>Minimum depost: {this.state.minimum}</p>
         <p>Maximum deposit: {this.state.maximum}</p>
         <p>Miner fee: {this.state.fee}</p>
        </div>
      </div>
    )
  }
}
*/
