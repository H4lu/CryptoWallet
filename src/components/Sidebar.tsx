import * as React from 'react'
import { Route, Switch} from 'react-router-dom'
import {SidebarContent} from '../components/SidebarContent'
import {TransactionWindow} from '../components/TransactionWindow'

export class Sidebar extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <Switch>
        <Route path = '/' component = {SidebarContent}/>
        <Route exact path = '/transaction-window' component = {TransactionWindow}/>
        </Switch>
    )
  }
   
  }
