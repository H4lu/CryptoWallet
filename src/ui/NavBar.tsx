import React from 'react'
// import { TransactionComponent } from '../components/TransactionComponent'
import { Link } from 'react-router-dom'
// import { Route } from 'react-router'

interface IMainLayoutProps {
}
interface IMainLayoutState {
}

export class NavBar extends React.Component<IMainLayoutProps, IMainLayoutState> {
  constructor(props: IMainLayoutProps) {
    super(props)
    /*this.setState({
      showComponent : false
    })*/
  }

  render() {
    return (
      <div>
        <Link to ='/home/transaction'>Send</Link>
        <Link to = '/home'>Home</Link>
      </div>
    )
  }
}
 // <button onClick = {this.onButtonClick}>Transaction</button>
        // {this.state.showComponent ? <TransactionComponent/> : null }
