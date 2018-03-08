import React from 'react'
import { Redirect } from 'react-router';

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
    if(this.props.connection && this.props.status) {
        return <Redirect from = '/' to = '/main'/>
    }
    console.log('Status props: ' + this.props.status)
    console.log('Connection props: ' + this.props.connection)
    return(
      <div className = 'window-main'>
        <p className = 'window-main-header'>Your Safest Wallet</p>
        {(this.props.connection) ? (
          (this.props.status) ? (
            <p className = 'window-main-ready'>Your Braitberry is ready for use</p>
          ) : (
            <p className = 'window-main-not-ready'>Your Braitberry is not ready for use</p>
          )
        ): (
          <p/>
        )}
        <p className = 'window-main-text'>Braitberry</p>
      </div>
    )
  }
}
