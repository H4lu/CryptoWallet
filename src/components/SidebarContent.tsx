import * as React from 'react'
import {Link} from 'react-router-dom'

export class SidebarContent extends React.Component<any, any> {
  render() {
    return (
      <div className = 'sidebar'>
      <button type = 'submit' className = 'button-menu'>Menu</button>
        <div className = 'sidebar-content'>
          <header className = 'text-header'>Total:</header>
          <header className = 'text-header'>123148293648234$:</header>
          <header className = 'text-header'>Additional:</header>
          <div className = 'nav-buttons-container'>
            <Link to = '/send'>
              <button className = 'nav-buttons'>Your addresses</button>
            </Link>
            <Link to = '/erc20'>
              <button className = 'nav-buttons'>ERC20</button>
            </Link>
          </div>
          <header className = 'text-header'>Your Braitberry:</header>
            <div className = 'info'>
             <p>-ID:1337</p>
             <p>-8 currency available</p>
             <p>-2 currency can add</p>
            </div>
        </div>
    </div>
    )}
  }
