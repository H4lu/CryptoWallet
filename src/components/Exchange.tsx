import * as React from 'react'
import { Header, Input, Button, Dropdown } from 'semantic-ui-react'
import { initialTransaction } from '../API/cryptocurrencyAPI/Exchange'
import { getBitCoinAddress } from '../API/hardwareAPI/GetAddress'

export class Exchange extends React.Component<any, any> {
  pairs = [
    { key: 'bitcoin', text: 'BTC', image: 'https://shapeshift.io/images/coins-sm/bitcoin.png' },
    { key: 'litecoin', text: 'LTC', image: 'https://shapeshift.io/images/coins-sm/litecoin.png' },
    { key: 'ethereum', text: 'ETH', image: 'https://shapeshift.io/images/coins-sm/ether.png' }
  ]

  constructor(props: any) {
    super(props)

   //  this.requestSupportedCoins = this.requestSupportedCoins.bind(this)
    this.initialRequest = this.initialRequest.bind(this)
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
  initialRequest() {
    initialTransaction('0xC7f0d18EdfF316A9cAA5d98fF26369216b38d9e1','btc_eth', 0.001, getBitCoinAddress(1, true))
  }

  render() {
    return(
      <div>
        <div>
         <Header>Choose market pairs:</Header>
         <Dropdown className = 'ui dropdown' options = {this.pairs} value = {this.pairs[0].text}/>
         <Dropdown className = 'ui dropdown' options = {this.pairs} value = {this.pairs[1].text}/>
         <Input type ='number'/>
         <Button onClick = {this.initialRequest}>Next</Button>
        </div>
      </div>
    )
  }
}
