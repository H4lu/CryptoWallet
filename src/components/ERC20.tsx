import * as React from 'react'
import { Header, Input, Button } from 'semantic-ui-react'
import { balanceOf, handleEthereum, transferToken, approve, allowance, transferFrom } from '../API/cryptocurrencyAPI/Ethereum'

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
  spenderAdressToCheck: string,
  addressFrom: string,
  addressTo: string,
  amountTransferFrom: number
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
      spenderAdressToCheck: '',
      addressFrom: '',
      addressTo: '',
      amountTransferFrom: 0
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
    this.handleAdressFromChange = this.handleAdressFromChange.bind(this)
    this.handleAdressToChange = this.handleAdressToChange.bind(this)
    this.handleAmountTransferFromChange = this.handleAmountTransferFromChange.bind(this)
    this.transferFrom = this.transferFrom.bind(this)
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
  handleGasPriceChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ gasPrice: data.value })
  }
  handleGasLimitChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ gasLimit: data.value })
  }
  handleSpenderAdressChange(e: any, data: any) {
    console.log(e.target.value)
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
  handleAdressFromChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ addressFrom: data.value })
  }
  handleAdressToChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ addressTo: data.value })
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
  handleAmountTransferFromChange(e: any, data: any) {
    console.log(e.target.value)
    this.setState({ amountTransferFrom: data.value })
  }
  checkAllowance() {
    allowance(this.state.tokenAdress, this.state.ownerAdressToCheck, this.state.spenderAdressToCheck)
  }
  transferFrom() {
    transferFrom(this.state.tokenAdress, this.state.addressFrom, this.state.addressTo,this.state.amountTransferFrom,this.state.gasPrice, this.state.gasLimit)
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
              <Input type = 'number' placeholder = 'Gas price' onChange = {this.handleGasPriceChange} value = {this.state.gasPrice}></Input>
              <Input type = 'number' placeholder = 'Gas limit' onChange = {this.handleGasLimitChange} value = {this.state.gasLimit}></Input>
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
          <div>
            <Header>Transfer from</Header>
            <Input type = 'text' style = {{ width: 370 }} placeholder = 'Adress from' value = {this.state.addressFrom} onChange = {this.handleAdressFromChange}/>
            <Input type = 'text' style = {{ width: 370 }} placeholder = 'Adress to' value = {this.state.addressTo} onChange = {this.handleAdressToChange}/>
            <Input type = 'number' style = {{ width: 370 }} placeholder = 'Amount' value = {this.state.amountTransferFrom} onChange = {this.handleAmountTransferFromChange}/>
            <Button onClick = {this.transferFrom}>Send</Button>
          </div>
        </div>
    )

  }
}
