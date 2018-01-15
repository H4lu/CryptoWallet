import * as React from 'react'
import { getAdress } from '../API/cryptocurrencyAPI/Litecoin'
import { getBalance } from '../API/cryptocurrencyAPI/BitCoin'
import { getEthereumBalance } from '../API/cryptocurrencyAPI/Ethereum'
import Web3 from 'web3'
const web3 = new Web3(new Web3.providers.HttpProvider('https://api.myetherapi.com/rop'))
interface IActionLogState {
  balance: number,
  ethereumBalance: number
}

export class ActionLog extends React.Component<any, IActionLogState> {
  constructor(props: any) {
    super(props)
  // Инициализируем начальное состояние как 0
    this.state = {
      balance: 0,
      ethereumBalance: 0
    }
  }

  // Вызываем функциб запроса баланса и устанавливаем состояние
  componentWillMount() {
    let self = this
    getBalance().then(Response => {
      let balance = JSON.parse(Response.content).data.confirmed_balance
      self.setState({ balance: balance })
    })
    getEthereumBalance().then((value: number) => {
      self.setState({ ethereumBalance: web3.utils.fromWei(value,'ether') })
    })
    getAdress()
  }
  // Функция рендера
  render() {
    return(
      <div>
        <p>Hello!</p>
        <p>Your current BitCoin balance = { this.state.balance } BTC</p>
        <p>Also {this.state.ethereumBalance} ETH</p>
      </div>
    )
  }
}
