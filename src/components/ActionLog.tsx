import * as React from 'react'
import { getBalance } from '../API/cryptocurrencyAPI/BitCoin'

interface IActionLogState {
  balance: number
}

export class ActionLog extends React.Component<any, IActionLogState> {
  constructor(props: any) {
    super(props)
  // Инициализируем начальное состояние как 0
    this.state = {
      balance: 0
    }
  }

  // Вызываем функциб запроса баланса и устанавливаем состояние
  componentWillMount() {
    let self = this
    getBalance().then(Response => {
      let balance = JSON.parse(Response.content).data.confirmed_balance
      self.setState({ balance: balance })
    })
  }
  // Функция рендера
  render() {
    return(
      <div>
        <p>Hello!</p>
        <p>Your current balance = { this.state.balance } BTC</p>
      </div>
    )
  }
}
