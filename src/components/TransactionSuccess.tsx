import React, {Component} from 'react'
import { Redirect } from 'react-router'
import { TRANSACTION_SUCCESS } from '../core/paths'

interface ITransactionsuccessState {
  redirect: boolean
}
export class TransactionSuccess extends Component<any, ITransactionsuccessState> {
  constructor(props: any) {
    super(props)
    this.state = {
      redirect: false
    }
  }
  componentDidMount() {
    this.props.refresh()
  }
  render() {
    setTimeout(() => {
      this.setState({ redirect: true })
    },1000,[])
    // @ts-ignore
    if (this.state.redirect) return <Redirect from = '/transaction_success' to = '/main'/>
    return(
      <div className = 'window-main'>
        <img src = {TRANSACTION_SUCCESS} className = 'transaction-success-img'/>
        <p className = 'transaction-success-text'>Your transaction is successfully completed.</p>
      </div>
    )
  }
}
