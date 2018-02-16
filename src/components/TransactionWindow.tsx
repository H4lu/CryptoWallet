import * as React from 'react'

export class TransactionWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render(){
    return(
    <div className = 'sidebar'>
      <button type = 'submit' className = 'button-menu'>Close</button>
      <div className = 'sidebar-content'>
         <header className = 'text-header'>Send Bitcoin</header>
        <input type = 'text' className = 'payment_address' placeholder = 'Payment Address'/>
        <input type = 'text' className = 'payment_address' placeholder = 'Amount'/>
        <p>Transaction Fee:</p>
        
      </div>
    </div>)
  }
}
