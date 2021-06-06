import React, {Component} from 'react'
import { Redirect } from 'react-router'
interface IMainWindowState {
  redirect: boolean
}
export class MainWindow extends Component<any, IMainWindowState> {
  constructor(props: any) {
    super(props)
    this.state = {
      redirect: false
    }
    this.startRedirect = this.startRedirect.bind(this)
    this.renderWalletState = this.renderWalletState.bind(this)
  }
  renderWalletState() {
    switch (this.props.walletStatus) {
    case 0: {
      return <p className = 'window-main-ready'>Your Crypto Wallet is ready for use</p>
    }
    case 1: {
      return <p className = 'window-main-not-ready'>Don`t contain SIM</p>
    }
    case 2: {
        return <p className = 'window-main-not-ready'><p className='two_line_1'>Please enter</p><p className='two_line_2'>Pin code</p></p>
    }
    case 3: {
      return <p className = 'window-main-not-ready'>Not initialized</p>
    }
    case 4: {
      return <p className = 'window-main-not-ready'>SIM blocked</p>
    }
    }
  }
  startRedirect() {
    console.log('STARTING REDIR3')
    /* let timeout = setTimeout(() => {
      this.setState({ redirect: true })
      clearTimeout(timeout)
    },5000)
    */
  }
  render() {
    if (this.props.redirectToMain) {
      // eslint-disable-next-line
      // @ts-ignore
      return <Redirect from = '/' to = '/main'/>
    }

    return(
        <div className = 'background-start'>
            {(this.props.connection) ? (
                this.renderWalletState()
            ) : (
                <p className = 'window-main-not-ready'>Please connect Runer</p>
            )}
      </div>
    )
  }
}
