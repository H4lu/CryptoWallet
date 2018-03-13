import * as React from 'react'
import CreateQR from '../core/CreateQR'
import { getEthereumAddress } from '../API/cryptocurrencyAPI/Ethereum'
import { Table } from '../components/Table'
import { clipboard } from 'electron'
import { sendTransaction } from '../core/SendTransaction'

interface IETHWindowState {
  address: string,
  qrcodeAddress: string,
  paymentAddress: string,
  amount: number,
  fee: number
}

export class ETHWIndow extends React.Component<any, IETHWindowState> {
  constructor(props: any) {
    super(props)

    this.handleCopyClick = this.handleCopyClick.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleFeeChange = this.handleFeeChange.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = {
      address: getEthereumAddress(),
      qrcodeAddress: '',
      paymentAddress: '',
      amount: 0,
      fee: 0
    }
  }
  componentWillMount() {
    this.setState({ qrcodeAddress: CreateQR(this.state.address) })
  }
  handleCopyClick() {
    clipboard.writeText(this.state.address)
  }
  handleClick() {
    sendTransaction('ethereum', this.state.paymentAddress, this.state.amount, this.state.fee)
  }
  handleAmountChange(e: any) {
    this.setState({ amount: e.target.value })
  }
  handleAddressChange(e: any) {
    this.setState({ paymentAddress: e.target.value })
  }
  handleFeeChange(e: any) {
    this.setState({ fee: e.target.value })
  }
  render () {
    return (
      <div className = 'main'>
        <div className = 'main-content'>
        <div className = 'currency-content'>
          <div className = 'currency-block-container'>
            <div className = 'currency-block-card'>
              <p className = 'default-font-colored'>Your Ethereum</p>
              <div className = 'card-container-second-block'>
              <div className = 'card-upper-block'>
                <img src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUvSURBVHgBzZdrTBxVFMfPnVl2YWnTUmgba1+hD8Rnpa1pWl9tqk2q1ia2jS9CwIaImEZoMbQxAhKbUp6iKbBqF1K11qBtsK3FR6xRUQmE1k9gHy6V54ILC8vuzu7cez0DVMECOzOLsf8vc+fec+f85txzz9wRYRrEOScOR6Spvv4LCkFKhGnQzDlrV/e5hxLCjavrbLbvGAQhAYJURUWDGV/rbSrJr0WvjFgHQSpoIKe3MxEv6ziACZ+WnpxcEQJBKCig/PzP5oHAUpUcGunh2/zE/SQEId1ACgQzijnASeyYbhHJDsXHl80DndKd1OFR920ghBdgM4QQAg6HExjFfCYwRzTS2U0N506DDumKUF7e+zOB0yPAwTyxBYtPSi7ZADqkC0gIm/sCXu6e3IKEcsJf/ye3/kOg4uKTs3FHHQhkh6v4SNKLJU+DRmkCUt7YLwqF2Jyrxh6hDiamFC4CDdIElFdasw3dPKNhylLchbka7NUDFRWdm0OAZGEzDDSIcLIj6aXCjWrtVQNRg/QsLsGqGxxip+SVwD3kwU3Hb5xIIByYkL1zZ5YRVEhVHco7cioGH3oMm+ZRJ8PyuL3Q3t4NPXYH2Lt7YcDpAkEQwGAwDF/HaJEp3Ohsavjyp0C+AkZISWSBitnYjFSigffgGhiCq1f+gFZb+zCU0q9AMsbA8WcfdLR3gdM5gLZsZAz9EC7s3727dGEgfwEjNDNq1XZkyqWUkj6sxl0dvViV+0eq8qgUp4ODQ8NAowDg9Ugw5PKA3y+DaBAxaqKZC2zhrBmZp2y2KqYLqKCiJsrnYcd7e/uiOnFpXC43INjfTicCGtunRNPv9yOYG7yShFAhMVHz7RcuNNa2TObTMAUPtDbbo4e8g96JclWrJK8Pujw9nhCDuHgquykjVP9zTfvauI3HGRcHOZBl+NKzJ7KbKELjxLmERh8wDslfnc3/HPQCHS49uSwycn7s76vMH9IWZ7VRFEyYvMo3zKASyI/BrcN8i6feGeVLVkbwuLitdzU11rZN5nPKXRYKpjYqwkNru8Is9962lA84FuzBU9AmJKiDAEKQXuAsIyLcvNkUs7Qx+vaIBCIbPpIJvzbVvIBfY6vVGtozGPkthn05J+RNt6nT0tnY6PeLsQnAIAODs1KJUEdHN8i4o7A4DuK0conKxZvWzerusEc+IHP5IOEQxwg8Wlme/v1U/gLWocTERC+Vheew0slIXzzDe0vzijse2+rqvdVK/L41uE45aNaPO4oizBkObM3XZwteXR69OKzNHvEp5ewb/OSsZxTSAsGoAlK0P/3xqyCzN4iSngQWYaROrLnfVBV7z4olRy17s8HH1xtCyA7bb9JTyxbGdCelFKcSBr8g5HacIuLyVVOJHlPjS/UBqqjokzBZDLXgjOev96GjHkR8TzDSkktNF10+cdZ2wkgmLuGdOEpGbdo5o5srLfua1fjRdKLLL6udB7L0I9a75eMeIpDLl1tsV7AqbxnbjxHy4dcjofLd9I9VutB2HspI2WLHQp2InjzjBhRAQrb82x6BrLZLzmrQIM1H2MxXtv1AiPCOCtNfwSdknj+fI4MG6Trku8RrmOC8abJxzBsPJTSpsjKtHzRKF1BOaqpLAAF/oUn3BMMMiXKryvY1gg7p/nPdu+eJi4zRdKwx8ngaOB3C+98CnQrq3z56ge8E4+zomK5mInl2Wyw5btCpoIB27dpFBXPoIaw7rXgrccYPW60HeuD/Vkn5mQdfTisvuV4Mbwo9nJVlgGnQX/6RQJjjpN31AAAAAElFTkSuQmCC'/>
                <p className = 'currency-name'> Ethereum</p>
              </div>
              <hr/>
              <div className = 'card-bottom-block'>
              <div>
                   <p className = 'currency-amount-crypto text-inline'>{this.props.balance}</p><p className = 'currency-short-name text-inline'>ETH</p>
                  </div>
                  <div className = 'wrap'>
                    {(this.props.hourChange > 0) ? (
                      <p className = 'positive-percentage text-inline'>{this.props.hourChange}%</p>
                    ) : (
                      <p className = 'negative-percentage text-inline'>{this.props.hourChange}%</p>
                    )}
                   <p className = 'currency-amount-fiat text-inline'>{this.props.price}$</p>
                   </div>
              </div>
            </div>
            </div>
            <div className = 'currency-block-transaction'>
            <header className = 'default-font-colored'>Send Bitcoin</header>
              <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' value = {this.state.paymentAddress} onChange = {this.handleAddressChange}/>
              <input type = 'text' className = 'input-amount' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
              <input type = 'text' className = 'input-fee-amount' placeholder = 'Fee' onChange = {this.handleFeeChange} value = {this.state.fee}/>
              <button type = 'submit' className = 'button-send' onClick = {this.handleClick}>Send</button>
            </div>
          </div>
          </div>
          <div className = 'currency-address-container'>
            <div className = 'currency-address'>
              <p className = 'default-font-colored'>Your Ethereum Address:</p>
              <img src = {this.state.qrcodeAddress} className = 'address-qrcode'/>
              <div className = 'address-with-button'>
                <p className = 'address-with-button-address'>{this.state.address}</p>
                <button type = 'submit' className = 'button-copy' onClick = {this.handleCopyClick}>Copy</button>
              </div>
            </div>
          </div>
          <Table data = {this.props.lastTx}/>
      </div>
    </div>
    )
  }
}
