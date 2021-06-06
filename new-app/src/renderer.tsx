import ReactDOM from 'react-dom'
import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import App from './app'

ReactDOM.render(
    /*@ts-ignore */ 
    <Router>
        <App/>
    </Router>,
    document.getElementById('container')
)
