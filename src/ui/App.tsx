import React from 'react'
import ReactDOM from 'react-dom'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { SignIn } from './signin'
import { MainLayout } from './MainLayout'

ReactDOM.render(<MainLayout/>,
            document.getElementById('container')
  )
// <Route path = '/' component = {MainLayout}/>
