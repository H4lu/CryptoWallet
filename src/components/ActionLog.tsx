import * as React from 'react'
import { getBalance } from '../API/cryptocurrencyAPI/BitCoin'

interface IActionLogState {
  balance: number
}

export class ActionLog extends React.Component<any, IActionLogState> {
  constructor(props: any) {
    super(props)

    this.state = {
      balance: 0
    }
  }
  componentWillMount() {
    let self = this
    getBalance().then(Response => {
      console.log('JSON data: ' + JSON.parse(Response.content).data)
      let balance = JSON.parse(Response.content).data.confirmed_balance
      self.setState({ balance: balance })
    })
  }
  render() {
    return(
      <div>
        <p>Hello!</p>
        <p>Your current balance = { this.state.balance } BTC</p>
      </div>
    )
  }
}
