import React from 'react'
import { TransactionComponent } from '../components/TransactionComponent'

interface IMainLayoutProps {
}
interface IMainLayoutState {
  showComponent: boolean
}

export class MainLayout extends React.Component<IMainLayoutProps, IMainLayoutState> {
  constructor(props: IMainLayoutProps) {
    super(props)
    this.state = { showComponent: false }
    /*this.setState({
      showComponent : false
    })*/
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  onButtonClick() {
    this.setState({
      showComponent : true
    })
  }

  render() {
    return (
      <div>
        <button onClick = {this.onButtonClick}>Transaction</button>
        {this.state.showComponent ? <TransactionComponent/> : null }
      </div>
    )
  }
}
