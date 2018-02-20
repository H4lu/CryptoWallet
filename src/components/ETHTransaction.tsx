import * as React from 'react'
import { Link } from 'react-router-dom';

export class ETHTransaction extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render(){
    return(
    <div className = 'sidebar'>
    <Link to = '/eth-window'>
      <button type = 'submit' className = 'button-menu'>Close</button>
    </Link>
      <div className = 'sidebar-content'>
        <header className = 'text-header'>Send Ethereum</header>
        <input type = 'text' className = 'payment_address' placeholder = 'Payment Address'/>
        <input type = 'text' className = 'payment_address' placeholder = 'Amount'/>
      <div>
          <p>Transaction fee: </p>
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Limit'/><span>Gas Limit</span>
          <input type = 'number' className = 'fee-amount' placeholder = 'Gas Price'/><span>Gas Price</span>
      </div>
        <button type = 'submit'>Send ETH</button>
      </div>
    </div>)
  }
}
