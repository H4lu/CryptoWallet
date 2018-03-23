import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { App } from './App'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
// import { Routes } from './Routes'
// import { SignIn } from './SignIn'
import { App } from './App'
import { Provider } from 'react-redux'
import store from '../core/store/configureStore'
// import { Switch } from 'react-router'
ReactDOM.render(<Provider store = {store}>
               <Router>
                    <App/>
                </Router></Provider>, document.getElementById('container'))
