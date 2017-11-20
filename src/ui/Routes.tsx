import * as React from 'react'
import { Route } from 'react-router-dom'
import { App } from './App'
// import { TransactionComponent } from '../components/TransactionComponent'
import { SignIn } from './SignIn'
// import { Switch } from 'react-router';
// import { Switch } from 'react-router';
interface IRoutesProps {}
interface IRoutesState {}
export class Routes extends React.Component<IRoutesProps, IRoutesState> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return(<div>
    <Route path = '/home' component = {App} />
    <Route path = '/login' component = { SignIn } />
    </div>
    )
  }
}
