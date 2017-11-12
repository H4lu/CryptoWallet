import * as React from 'react'

interface IPayComponentProps {

}

export class TransactionComponent extends React.Component<IPayComponentProps, any> {

  constructor(props: IPayComponentProps) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
      // doing someting
  }

  render() {
    return(
      <div>
        <select name = 'pay'>
          <option>select currency for payment</option>
          <option value = 'bitcoin'>BitCoin</option>
          <option value = 'etherium'>Ethereum</option>
          <option value = 'litecoin'>Litecoin</option>
          <option value = 'ripple'>Ripple</option>
          <option value = 'dash'>Dash</option>
          <option value = 'monero'>Monero</option>
          <option value = 'iota'>IOTA</option>
          <option value = 'stratis'>Stratis</option>
          <option value = 'neo'>NEO</option>
          <option value = 'zcash'>Zcash</option>
       </select>
       <input id = 'sumpay' type = 'number'></input>
       <input type = 'text' name = 'payment address' placeholder = 'Enter payment purpose'></input>
       <button name = 'payButton' onClick = {this.handleClick}>OK</button>
       <div id = 'compay'> Transaction fee 0.02%	</div>
     </div>
    )
  }
}
