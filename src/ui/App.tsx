import React from 'react'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { SignIn } from './signin'
// import { MainLayout } from './MainLayout'
// import { SignIn } from './SignIn'
/* import { NavBar } from './NavBar'
import { Switch, Route } from 'react-router'
import { ActionLog } from '../components/ActionLog'
import { TransactionComponent } from '../components/TransactionComponent'
import { ERC20 } from '../components/ERC20'
import { Exchange } from '../components/Exchange'
*/
/* import { Routes } from './Routes'
import { Switch } from 'react-router'
*/
import '../components/style.css'
export class App extends React.Component {
  render() {
    return(
      <div >
      <div className = 'header'>
          <div className = 'header-content'>
            <header>Braitberry</header>
          </div>
      </div>
      <div className = 'content'>
      <div className = 'main'>
           <button type = 'submit' className = 'button-refresh'>Refresh</button>
           <div className = 'currency-block'>
             <header className = 'text-header'>Available Cryptocurrency: </header>
            </div>

        </div>
        <div className = 'sidebar'>
          <button type = 'submit' className = 'button-menu'>Menu</button>
            <div className = 'sidebar-content'>
              <header className = 'text-header'>Total:</header>
            </div>
        </div>
        </div>
        <div className = 'footer'>
          <div className = 'footer-content'>
            <p className = 'status'>Status: OK</p>
            <p className = 'version'>Braitberry v 0.1</p>
          </div>
        </div>
        </div>
    )
  }
}
/* <div className = 'main'>
          main content here
          </div>
          <div className = 'sidebar'>
          Sidebar here
          </div>
        <div className = 'footer'>
          <div className = 'footer-content'>
             Footer
          </div>
        </div>
*/
// <Route path = '/' component = {MainLayout}/>
