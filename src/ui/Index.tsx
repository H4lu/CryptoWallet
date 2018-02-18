import * as React from 'react'
import * as ReactDOM from 'react-dom'
// import { App } from './App'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router} from 'react-router-dom'
// import { Routes } from './Routes'
// import { SignIn } from './SignIn'
import { App } from './App'

// import { Switch } from 'react-router'

ReactDOM.render(<Router>
                    <App/>
                </Router>, document.getElementById('container'))
