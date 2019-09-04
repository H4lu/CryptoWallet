import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { App } from './App'
import { BrowserRouter as Router } from 'react-router-dom'
// import { Routes } from './Routes'
// import { SignIn } from './SignIn'
import App from './App'
import { Provider } from 'react-redux'
import configureStore from '../core/store/configureStore'
const store = configureStore()
// import { Switch } from 'react-router'
let reactDOM = ReactDOM.render(<Provider store = {store}>
               <Router>
                  <App/>
                </Router>
                </Provider>, document.getElementById('container'))

const Container = Object(reactDOM).props.children.props.children.type.prototype.constructor.prototype
export default Container
