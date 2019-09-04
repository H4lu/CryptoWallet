import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { App } from './App'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
// import { Routes } from './Routes'
// import { SignIn } from './SignIn'
import App from './App'
import { Provider } from 'react-redux'
import configureStore from '../core/store/configureStore'
//const store = configureStore()
// import { Switch } from 'react-router'
let reactDOM = ReactDOM.render(
               <Router>
                  <App/>
                </Router>
               , document.getElementById('container'))

const Container = Object(reactDOM)
export default Container
