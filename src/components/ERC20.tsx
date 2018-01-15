import * as React from 'react'
import { Header, Input, Button } from 'semantic-ui-react'
import { balanceOf, handleEthereum, transferToken, approve, allowance } from '../API/cryptocurrencyAPI/Ethereum'

interface IERC20State {
  gasPrice: number,
  gasLimit: number,
  tokenAdress: string,
  amountToBuy: number,
  userBalance: number,
  totalSupply: number,
  spenderAdress: string,
  transferAmount: number,
  adressToApprove: string,
  amountToApprove: number,
  ownerAdressToCheck: string,
  spenderAdressToCheck: string
}

export class ERC20 extends React.Component <any,IERC20State> {
  constructor(props: any) {
    super(props)
    this.state = {
      gasPrice : 30000000000,
      gasLimit : 25000,
      tokenAdress: '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367',
      amountToBuy: 0,
      userBalance: 0,
      totalSupply: 0,
      spenderAdress: '',
      transferAmount: 0,
      adressToApprove: '',
      amountToApprove: 0,
      ownerAdressToCheck: '',
      spenderAdressToCheck: ''
    }

    this.buyToken = this.buyToken.bind(this)
    this.checkBalance = this.checkBalance.bind(this)
    this.transfer = this.transfer.bind(this)
    this.handleGasPriceChange = this.handleGasPriceChange.bind(this)
    this.handleGasLimitChange = this.handleGasLimitChange.bind(this)
    this.handleTransferAmountChange = this.handleTransferAmountChange.bind(this)
    this.handleSpenderAdressChange = this.handleSpenderAdressChange.bind(this)
    this.handleAmountToBuyChange = this.handleAmountToBuyChange.bind(this)
    this.handleTokenAdressChange = this.handleTokenAdressChange.bind(this)
    this.handleAdressToApproveChange = this.handleAdressToApproveChange.bind(this)
    this.handleAmountToApproveChange = this.handleAmountToApproveChange.bind(this)
    this.approveTransfer = this.approveTransfer.bind(this)
    this.handleOwnerAdressToCheckChange = this.handleOwnerAdressToCheckChange.bind(this)
    this.handleSpenderAdressToCheckChange = this.handleSpenderAdressToCheckChange.bind(this)
    this.checkAllowance = this.checkAllowance.bind(this)
  }

  handleTokenAdressChange(e: any, data: any) {
    console.log(e.target.value)
    console.log('New token Adress: ' + data.value)
    this.setState({ tokenAdress: data.value })
  }
  buyToken() {
    handleEthereum(this.state.tokenAdress, this.state.amountToBuy, this.state.gasPrice, this.state.gasLimit)
  }
  handleAmountToBuyChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ amountToBuy: data.value })
    console.log('Amount to buy: ' + this.state.amountToBuy)
  }
  handleGasPriceChange(data: any) {
    this.setState({ gasPrice: data.value })
  }
  handleGasLimitChange(data: any) {
    this.setState({ gasLimit: data.value })
  }
  handleSpenderAdressChange(data: any) {
    this.setState({ spenderAdress: data.value })
  }
  handleTransferAmountChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ transferAmount: data.value })
    console.log('Transfer amount: ' + data.value)
  }
  handleAdressToApproveChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ adressToApprove: data.value })
  }
  handleAmountToApproveChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ amountToApprove: data.value })
  }
  transfer() {
    transferToken(this.state.tokenAdress, this.state.spenderAdress, this.state.transferAmount)
  }
  checkBalance() {
    balanceOf(this.state.tokenAdress).then(balance => {
      console.log(balance)
      this.setState({ userBalance: balance })
    })
  }
  approveTransfer() {
    approve(this.state.tokenAdress,this.state.adressToApprove,this.state.amountToApprove)
  }
  handleOwnerAdressToCheckChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ ownerAdressToCheck: data.value })
  }
  handleSpenderAdressToCheckChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ spenderAdressToCheck: data.value })
  }
  checkAllowance() {
    allowance(this.state.tokenAdress, this.state.ownerAdressToCheck, this.state.spenderAdressToCheck)
  }

  render() {
    return (
        <div>
          <div>
            <Header> Enter token contract adress: </Header>
              <Input style = {{ width: 370 }} type = 'text' placeholder = 'Token adress' value = {this.state.tokenAdress} onChange = {this.handleTokenAdressChange}></Input>
          </div>
          <div>
            <Header> Total supply: </Header>
              <p>Total supply is: {this.state.totalSupply}</p>
          </div>
          <div>
            <Header> Buy token</Header>
              <Input type = 'number' placeholder = 'Amount' onChange = {this.handleAmountToBuyChange}></Input>
              <Input type = 'number' placeholder = 'Gas price' onChange = {this.handleGasPriceChange}></Input>
              <Input type = 'number' placeholder = 'Gas limit' onChange = {this.handleGasLimitChange}></Input>
              <Button onClick = {this.buyToken}>Buy</Button>
          </div>
          <div>
            <Header>Check balance</Header>
              <Button onClick = {this.checkBalance}>Check</Button>
              <p>Your balance: {this.state.userBalance}</p>
          </div>
          <div>
            <Header>Transfer</Header>
            <Input style = {{ width: 370 }} type = 'text' paceholder = 'Transfer to ..' value = {this.state.spenderAdress} onChange = {this.handleSpenderAdressChange}></Input>
            <Input type = 'number' placeholder = 'Amount' value = {this.state.transferAmount} onChange = {this.handleTransferAmountChange}></Input>
            <Button onClick = {this.transfer}>Transfer</Button>
          </div>
          <div>
            <Header>Approve:</Header>
            <Input type = 'text' style = {{ width: 370 }} placeholder = 'Spender address' value = {this.state.adressToApprove} onChange = {this.handleAdressToApproveChange}></Input>
            <Input type = 'number' placeholder = 'Amount to approve' value = {this.state.amountToApprove} onChange = {this.handleAmountToApproveChange}></Input>
            <Button onClick = {this.approveTransfer}>Approve</Button>
          </div>
          <div>
            <Header>Check allowance:</Header>
            <Input type = 'text' style = {{ width: 370 }} placeholder = 'Owner`s adress' value = {this.state.ownerAdressToCheck} onChange = {this.handleOwnerAdressToCheckChange}></Input>
            <Input type = 'text' style = {{ width: 370 }} placeholder = 'Spender adress' value = {this.state.spenderAdressToCheck} onChange = {this.handleSpenderAdressToCheckChange}></Input>
            <Button onClick = {this.checkAllowance}>Check</Button>
          </div>
        </div>
    )

  }
}
