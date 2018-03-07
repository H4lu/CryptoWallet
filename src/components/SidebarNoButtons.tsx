import * as React from 'react'
import { Link } from 'react-router-dom'

export class SidebarNoButtons extends React.Component<any, any> {
  render() {
    return(
      <div className = 'sidebar'>
        <div className = 'sidebar-content'>
          <div>
            <Link to = '/main'>
              <button type = 'submit' className = 'button-home'>Home</button>
            </Link>
          </div>
          <hr/>
          <div>
            <p className = 'total-label text-inline'>Total</p>
            <p className = 'total-percent text-inline'>+5%</p>
          </div>
          <p className = 'total-currency-font'>{this.props.total}$</p>
          <hr/>
          <header className = 'info-header-font'>Your Braitberry:</header>
            <div className = 'about-block'>
            <div>
             <p className = 'info-default-font text-inline'>-ID:</p><p className = 'info-amount-font text-inline'>13332</p>
            </div>
            <div>
             <p className = 'info-default-font text-inline'>Currency Available</p><p className ='info-amount-font text-inline'>3</p>
            </div>
            <div>
             <p className = 'info-default-font text-inline'>Currency Can Add</p><p className = 'info-amount-font text-inline'>2</p>
            </div>
            </div>
        </div>
      </div>
    )
  }
}
