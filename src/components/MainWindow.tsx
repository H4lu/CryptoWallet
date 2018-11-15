import React from 'react'
import { Redirect } from 'react-router'
/*import { LOGO_PATH } from '../core/paths'*/
interface IMainWindowState {
  redirect: boolean
}
export class MainWindow extends React.Component<any, IMainWindowState> {
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
      return <p className = 'window-main-not-ready'>Waiting for PIN</p>
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
      return <Redirect from = '/' to = '/main'/>
    }

    // <img src = '../static/logo.svg'/>
    return(
        <div className = 'background-start'>
   
      </div>
    )
  }
}
