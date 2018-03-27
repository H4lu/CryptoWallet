import React from 'react'
import { Redirect } from 'react-router'

interface IMainWindowState {
  redirect: boolean
}
export class MainWindow extends React.Component<any, IMainWindowState> {
  constructor(props: any) {
    super(props)
    this.state = {
      redirect: false
    }
  }
  render() {
    if (this.props.connection && this.props.status) {
      let timeout = setTimeout(() => {
        clearTimeout(timeout)
        this.props.init('FROM TIMEOUT')
        this.setState({ redirect: true })
      }, 3000,[])
    }
    if (this.state.redirect) {
      return <Redirect from = '/' to = '/main'/>
    }
    return(
        <div className = 'window-main'>
        <p className = 'window-main-header'>Your Safest Wallet</p>
        <p className = 'window-main-text'>Braitberry</p>
        {(this.props.connection) ? (
          (this.props.status) ? (
            <p className = 'window-main-ready'>Your Braitberry is ready for use</p>
          ) : (
            <p className = 'window-main-not-ready'>Enter PIN</p>
          )
        ) : (
          <p className = 'window-main-not-ready'>USB-cable is not connected</p>
        )}
      </div>
    )
  }
}
