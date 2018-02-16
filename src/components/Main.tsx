import * as React from 'react'
import {Route, Switch} from 'react-router-dom'
import {Currency} from './Currency'
import {MainContent} from './MainContent'
export class Main extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <Switch>
        <Route exact path = '/main' component = {MainContent}/>
        <Route path = '/currency' component = {Currency}/>
      </Switch>
    )
  }

}
