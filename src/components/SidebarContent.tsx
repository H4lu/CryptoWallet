import * as React from 'react'
// import {Link} from 'react-router-dom'

export class SidebarContent extends React.Component<any, any> {
  render() {
    return (
      <div className = 'sidebar'>
        <div className = 'sidebar-content'>
        <div>
          <p className = 'total-label'>Total</p>
          <p className = 'total-percent text-inline'>+5%:</p>
        </div>
          <p className = 'total-currency-font'>{this.props.total}$</p>
          <hr/>
          <div className = 'nav-buttons-container'>
            <button className = 'nav-buttons'>Your addresses</button>
            <button className = 'nav-buttons'>ERC20</button>
            <button className = 'nav-buttons'>ShapeShift</button>
          </div>
          <hr/>
          <header className = 'info-header-font'>Your Braitberry:</header>
            <div className = 'info'>
             <p className = 'info-default-font'>-ID:</p><p className = 'info-amount-font text-inline'>13332</p>
             <p className = 'info-default-font'>Currency Available</p><span className ='info-amount-font'>3</span>
             <p className = 'info-default-font'>Currency Can Add</p><span className = 'info-amount-font'>2</span>
            </div>
        </div>
    </div>
    )}
  }
