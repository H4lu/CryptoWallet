import React from 'react'
import { Redirect } from 'react-router'
import { TRANSACTION_SUCCESS } from '../core/paths'
interface ITransactionsuccessState {
  redirect: boolean
}
export class TransactionSuccess extends React.Component<any, ITransactionsuccessState> {
  constructor(props: any) {
    super(props)
    this.state = {
      redirect: false
    }
  }
  componentDidMount() {
    this.props.refresh()
    let timer = setTimeout(() => {
      this.setState({ redirect: true })
      clearTimeout(timer)
    },3000,[])

  }
  render() {
    if (this.state.redirect) return <Redirect from = '/transaction_success' to = '/main'/>
    return(
      <div className = 'window-main'>
        <img src = {TRANSACTION_SUCCESS} className = 'transaction-success-img'/>
      </div>
    )
  }
}
