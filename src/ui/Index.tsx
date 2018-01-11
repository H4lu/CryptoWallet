import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { App } from './App'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { Routes } from './Routes'
import { SignIn } from './SignIn'
// import { Switch } from 'react-router'

ReactDOM.render(<Router>
                  <div>
                    <SignIn/>
                    <Routes/>
                  </div>
                </Router>, document.getElementById('container'))
