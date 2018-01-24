import * as React from 'react'
import { Header, Input, Button, Dropdown } from 'semantic-ui-react'
import { initialTransaction, getSupportedCoins } from '../API/cryptocurrencyAPI/Exchange'
import { getBitCoinAddress } from '../API/hardwareAPI/GetAddress'

export class Exchange extends React.Component<any, any> {
  pairs: Object

  constructor(props: any) {
    super(props)

    this.requestSupportedCoins = this.requestSupportedCoins.bind(this)
    this.initialRequest = this.initialRequest.bind(this)
  }

  componentWillMount() {
    this.requestSupportedCoins()
    this.pairs = [{
      key: '12'
    }]
  }

  requestSupportedCoins() {
    getSupportedCoins()
  }

  initialRequest() {
    initialTransaction('0xC7f0d18EdfF316A9cAA5d98fF26369216b38d9e1','btc_eth', 0.001, getBitCoinAddress(1, true))
  }

  render() {
    return(
      <div>
        <div>
         <Header>Choose market pairs:</Header>
         <Dropdown className = 'ui dropdown'/>
         <Input type ='number'/>
         <Button onClick = {this.initialRequest}>Next</Button>
        </div>
      </div>
    )
  }
}
