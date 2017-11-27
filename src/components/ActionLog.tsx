import * as React from 'react'
import { getBalance } from '../API/cryptocurrencyAPI/BitCoin'

interface IActionLogState {
  balance: number
}

export class ActionLog extends React.Component<any, IActionLogState> {
  constructor(props: any) {
    super(props)

    this.state = {
      balance: getBalance()
    }
  }
  render() {
    return(
      <div>
        <p>Hello!</p>
        <p>Your current balance = { this.state.balance }</p>
      </div>
    )
  }
}
