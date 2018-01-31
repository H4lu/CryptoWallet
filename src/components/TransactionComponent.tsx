import * as React from 'react'
// import { handle } from '../API/cryptocurrencyAPI/BitCoin'
import { handleEthereum } from '../API/cryptocurrencyAPI/Ethereum'
import { Input, Button, Dropdown, Label } from 'semantic-ui-react'
import { handle } from '../API/cryptocurrencyAPI/BitCoin'
import { handleLitecoin } from '../API/cryptocurrencyAPI/Litecoin'

const options = [
  { key: 'bitcoin', text: 'BitCoin', value: 'bitcoin' },
  { key: 'ethereum', text: 'Ethereum', value: 'ethereum' },
  { key: 'litecoin', text: 'Litecoin', value: 'litecoin' }
]

interface IPayComponentProps {
  balance: number
}

interface IPayComponentState {
  paymentAdress: string
  transactionFee: number
  cryptocurrency: string
  amount: number
  showPinEnter: boolean,
  gasPrice: number,
  gasLimit: number
}

export class TransactionComponent extends React.Component<IPayComponentProps, IPayComponentState> {
  constructor(props: any) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.state = {
      showPinEnter: false,
      paymentAdress: '',
      transactionFee: 0.01,
      cryptocurrency: 'ethereum',
      amount: 0,
      gasPrice: 30000000000,
      gasLimit: 100000
    }

    this.handleAdressChange = this.handleAdressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleCryptocurrencyChange = this.handleCryptocurrencyChange.bind(this)
    this.handleByScroll = this.handleByScroll.bind(this)
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this)
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this)
    this.renderFee = this.renderFee.bind(this)
  }

  handleByScroll(e: any) {
    this.setState({ transactionFee: e.target.value })
  }
  handleAmountChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ amount: data.value })
  }
  handleAdressChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ paymentAdress: data.value })
  }
  handleFeeChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ transactionFee: data.value })
  }
  handleClick() {
    // sendTransaction(this.state.cryptocurrency, this.state.paymentAdress, this.state.amount, this.state.transactionFee)
    switch (this.state.cryptocurrency) {
    case 'bitcoin':
      console.log('in bitcoin')
      handle(this.state.paymentAdress, this.state.amount, this.state.transactionFee)
      break
    case 'ethereum':
      handleEthereum(this.state.paymentAdress, this.state.amount, this.state.gasPrice)
      break
    case 'litecoin':
      handleLitecoin(this.state.paymentAdress, this.state.amount, this.state.transactionFee)
      break
    }
  }
  handleCryptocurrencyChange(e: any, data: any) {
    console.log('Value: ' + e.target.value)
    this.setState({ cryptocurrency: data.value })
  }
  handleGasPriceChange(e: any) {
    this.setState({ gasPrice: e.target.value })
  }
  handleGasLimitChange(e: any) {
    this.setState({ gasLimit: e.target.value })
  }
  renderFee() {
    switch (this.state.cryptocurrency) {
    case 'bitcoin':
      return <div><Input type = 'number' value = {this.state.transactionFee} min = {0} onChange = { this.handleFeeChange } onScroll = {this.handleByScroll}></Input></div>
    case 'ethereum':
      return <div><div><Input type = 'number' value = {this.state.gasLimit} onChange = {this.handleGasLimitChange}></Input></div>
        <div><Input type = 'number' value = {this.state.gasPrice} onChange = {this.handleGasPriceChange}></Input></div></div>
    case 'litecoin':
      return <div><Input type = 'number' value = {this.state.transactionFee} min = {0} onChange = { this.handleFeeChange } onScroll = {this.handleByScroll}></Input></div>
    }
  }

  render() {
    return(
      <div>
        <div>
        <Label>Choose currency:</Label>
        <Dropdown name = 'pay' value = { this.state.cryptocurrency } onChange = { this.handleCryptocurrencyChange } className = 'ui dropdown' options = {options}/>
        </div>
        <div>
        <Label>Amount: </Label>
        <Input type = 'number' name = 'amount' placeholder = 'Enter transaction amount' onChange = {this.handleAmountChange} style = {{ width: '270px' }}></Input>
        {(() => {
          switch (this.state.cryptocurrency) {
          case 'bitcoin':
            return 'BTC'
          case 'ethereum':
            return 'ETH'
          }
        })()}
       </div>
       {(() => {
         switch (this.state.cryptocurrency) {
         case 'bitcoin':
           return <div><Label>Transaction fee: </Label><Input type = 'number' value = {this.state.transactionFee} min = {0} onChange = { this.handleFeeChange }></Input> BTC </div>
         case 'ethereum':
           return <div><div><Label>Gas limit: </Label><Input type = 'number' value = {this.state.gasLimit} onChange = {this.handleGasLimitChange}></Input> wei</div>
              <div><Label>Gas price: </Label><Input type = 'number' value = {this.state.gasPrice} onChange = {this.handleGasPriceChange}></Input> wei</div></div>
         case 'litecoin':
           return <div><Label>Transaction fee: </Label><Input type = 'number' value = {this.state.transactionFee} min = {0} onChange = { this.handleFeeChange }></Input> LTC </div>
         }
       })()}
       <div>
        <Label>Payment adress: </Label>
       <Input type = 'text' name = 'payment address' placeholder = 'Enter payment purpose'
        onChange = {this.handleAdressChange} style = {{ width: 370 }}></Input>
        </div>
        <div>
       <Button name = 'payButton' onClick = {this.handleClick}>Send</Button>
       </div>
       <div id = 'compay'> Transaction fee {this.state.transactionFee}%	</div>
     </div>
    )
  }
}
