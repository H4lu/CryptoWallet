import React from 'react'
// import { TransactionComponent } from '../components/TransactionComponent'
import { Link } from 'react-router-dom'
// import { Route } from 'react-router'
import { Menu, Icon } from 'semantic-ui-react'
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

  /* render() {
    return (
      <div>
      <Menu icon size = 'large' vertical >
      <Menu.Item as = {Link} to = '/home'><Icon name = 'home'/>Home</Menu.Item>
      <Menu.Item as = {Link} to ='/home/transaction'><Icon name = 'send'/>Send</Menu.Item>
      <Menu.Item as = {Link} to = '/home/erc20'>ERC20</Menu.Item>
      <Menu.Item as = {Link} to = '/home/exchange'>Exchange</Menu.Item>
      </Menu>
      </div>
    )
  }*/
  render() {
    return(
      <div>
        <Menu vertical icon className='right fixed inverted navbar'>
         <Menu.Item as = {Link} to = '/home'><Icon name = 'home' className = 'currency'/>Home</Menu.Item>
         <Menu.Item as = {Link} to ='/home/transaction' className = 'currency'><Icon name = 'send' size = 'large'/>Send</Menu.Item>
         <Menu.Item as = {Link} to = '/home/erc20'size = 'large' className = 'currency2'>ERC20</Menu.Item>
         <Menu.Item as = {Link} to = '/home/exchange' size = 'large'>Exchange</Menu.Item>
        </Menu>
      </div>
    )
  }
}
 // <button onClick = {this.onButtonClick}>Transaction</button>
        // {this.state.showComponent ? <TransactionComponent/> : null }
