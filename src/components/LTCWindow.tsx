import * as React from 'react'
import CreateQR from '../core/CreateQR'
import getAddress from '../API/hardwareAPI/GetAddress'
import { sendTransaction } from '../core/SendTransaction'
import { clipboard } from 'electron'
import { Table } from './Table'
interface ILTCWindowState {
  address: string,
  qrcodeAddress: string,
  paymentAddress: string,
  amount: number,
  fee: number
}

export class LTCWindow extends React.Component<any, ILTCWindowState> {
  constructor(props: any) {
    super (props)

    this.state = {
      address: getAddress(2),
      qrcodeAddress: '',
      paymentAddress: '',
      amount: 0,
      fee: 0
    }
  }

  componentWillMount() {
    this.setState({ qrcodeAddress: CreateQR(this.state.address) })
    this.props.transactions()
    console.log('PROPERTY: ' + this.props.lastTx)
  }
  handleClick() {
    sendTransaction('litecoin', this.state.paymentAddress, this.state.amount, this.state.fee)
  }
  handleCopyClick() {
    clipboard.writeText(this.state.address)
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
        <div className = 'currency-content'>
          <div className = 'currency-block-container'>
            <div className = 'currency-block-card'>
            <header className = 'text-header'>Your Bitcoin</header>
            <div className = 'currency-info-container'>
              <p className = 'default-font-colored'>Your Litecoin</p>
              <div className = 'card-container'>
                <div className = 'card-upper-block'>
                  <img src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAbVSURBVHgBzVddbBRVFL73znS3O/u/bZcqbmGFSpAS1IYSqAoPPGnQxCejJhqeeMDEEGKIMTxpfCTBmKgPxsQnEhOTxhcTiQrBEGwEoUCgGNOshS7ddru7s9PZnZ/rOXdmtrPslt3tk6eZ3t3ZO+d85+d+5wwh/zOhpEe5evXqqKqqL1Eq7eSE7LBsa0RiLMQ5sQgnK5LE/jYs41ZADv4ZjSrXdu/ene9Ff1eApqamlHQ6fahuWCcI5xMAJMokRojNHSWUwm3eWF3hNiUF+P9DRFG+GB8fv96NrY6Arly5tqtmap+ZpnVEooz0Ipxwz8oifPp2y+Tk6SylOtkIIPBUvnj58glu2R9DWqKMMbRAWA9ZtilfM4TRs+27SjDyzsTE83+QXgBhilIDQ18btvU26GmkATcz+OPuZ+9h7lfkpo1TX4QaT3NUpgeDwff2T0yc6wrQ7Oxs8H4+/w1UxFut2x3TDIxSqB8KUWvUj7eFUWJYJnynTXD8OhhlFViPvjw5+f1jAYFienl6+hNd1z+iberFixYay27dShLxOJEkiduW1UgOAOR3781StVolvA0ifJ4xkb5iNBZ7fXzPnov+32X/l2szMwdNwzyFXrf1jbupAoUDqSQPhUL+zAmp1eu0VqtjttoqaZxESpNqWT37D+f7/YXeCMP8/LyiqernhmkwztsHW4CCSwkpPNTfTz00/qtSqXDQARm1yfri7Abjz+UuXfoQM9MC6MHi4jHTNMfWi84aHCChSGTdTeVyGUMg0tpJbHSck5PT09efaQI0MzMzrFdXP0DUWDv0MXyDxz4cVkg74LZtk5WVkogvprWj4B7GolpdPdEEiFJ5H4Q405EnsT/YFkkmU7z5NheXputwrVLvXifhxKUGzl/L5XKpBqB6XT/YHd1REgmFSag/2LIdI6apVRGl7sVxhElSem5u7kUBCG6wWt04Qjo7JOoikYg7qngzC1uYrnKZ4x6ggq4i5BW3ZdnMZvIeAUjTtE3ACYluHsfwAneI1PlryGNqo14nw5vSZMf2US4xifQiUE6isOUVTXsC9Ee7eUiWZBKNRlp/4A5rj27fTuQ+mRQKS8Q59t33Pcs0RwUwTdWjnPKg32OkXe/CNsFglbB+wmESDATaqBPMi2AoroWlJcp4b6MWmEgS4TRQP4wV4I9Nm024YmPRMRGFRDxGRNf3zT9CGXzWIV2FxQLPP3xIofUIR+xuCnNNRI7lQIDVYbXII23EEwQwODDAE8kEHUiJ4+7A8EUU03P75m2i13Rq207PAAeb9nQS4K2KABQOBh+AlSr4GV9DgeMeFyS4KZ3mT2/LImOiobYmqtBItVVNRIySXlLFCRY/OgRjcE6YLhQKC5C3kr+G0Esv5FDEYo6AoiPrZaAC/COSzJ2TyLtOFRVghG1KbwpAo6OjNUmSp7m9pgTThJ7KgL5ULpPrN26QhYV8WysW1E9xeRnqyK2YnsrG4TZRj5L0l7CN/yKx8K9iwqMumYNyE1YDVgAiUhKLxdpmA7lH1TTCgUhwZLXhSIoVLjyd4sK6Eo3Ubso5806zTXQAdQPviUJOxtM/wVFV64bRQjKYOuSf/mCgbXUYdYOEFYUoJNTqvcuYbhQ4dvdypdI8FAJNwCn+fXLv3jsNQIOD0dmFfPTHQnHpTWeA8lcvJUokTPqAf3gbhg7Db2PP7ux4onDmKZcrZObWLadGMTcOpdSoxM6CXlMEQJiEsTMRj54Oh0KrrYpskkomibuvOQJuBLHmxPqYC58tFovuCEsaTRh0/HZg374pT2dj8MlkMrODqdSnzsPNZoGDOGt+CdyQFEsrOKgIMNiAod3UhkcyxzEg3p4mMsxms2eqmn54uVQ85HjAiAS9CSZJWlHV5tedHsUA2tCqq8B/DDJlEduyYfIMn9oGgfDva9EPYd2S+3f+QrFUGsF0Udbb22pbcT1BJzG98PIJNdn3HaTqqFc7nrRYSyaTc+nNT74ajUTvoZ7eBq5HcLiTpEiT5YARXTSZPLc1kzn2KJi2gFCGU6mZ7JbM4cHUwIUAHHkJSIoBLsmNVrelhDwjY9rhEnooM5RQ/xmlP/ju5s2btXbP0A4eKnO53Cno4sehgydxKvQqfj1MDm047YDxtSjBO9ydwfTQ+9mRkZ/9RdwTIBcUhboayy8unSxVSm/U9FrEqa31xtQ1rpKpZAYCffcj0diXRaP21YGxseVO9ro+NAgsn8/vKqrqAatef6VmmC/U9Voc3kIURr15la9CnWhyX98SdPHzIaX/l+GhofOJRKLYrZ2NnmICry2hWGzoKV0vDdo2C+BQlkhEVmRZfhCJRAoQpQ2dhv8Agp1Gqo5B+HwAAAAASUVORK5CYII'/>
                  <p className = 'currency-name'>Litecoin</p>
                </div>
                <hr/>
                <div className = 'card-bottom-block'>
                <div>   
                  <p className = 'currency-amount-crypto text-inline'>{this.props.balance} $</p>
                  <p className = 'currency-short-name text-inline'>{this.props.price}LTC</p>
                </div>
                <div className = 'wrap'>
                  {(this.props.hourChange > 0) ? (
                      <p className = 'positive-percentage text-inline'>{this.props.hourChange}%</p>
                    ): (
                      <p className = 'negative-percentage text-inline'>{this.props.hourChange}%</p>
                    )}
                  <p className = 'currency-amount-fiat text-inline'>{this.props.price}$</p>
                </div>
              </div>
            </div>
            <div className = 'currency-block-transaction'>
              <p className = 'default-font-colored'>Send Litecoin</p>
              <input type = 'text' className = 'payment_address' placeholder = 'Payment Address' value = {this.state.paymentAddress} onChange = {this.handleAddressChange}/>
              <input type = 'text' className = 'input-amount' placeholder = 'Amount' onChange = {this.handleAmountChange} value = {this.state.amount}/>
              <input type = 'text' className = 'input-fee-amount' placeholder = 'Fee'/>
              <button type = 'submit' className = 'button-send' onClick = {this.handleClick}>Send</button>
            </div>
          </div>
          <div className = 'currency-block-container'>
            <div className = 'currency-address'>
              <p className = 'default-font-colored'>Your Litecoin Address:</p>
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
    </div>
  </div>
    )
  }
}
