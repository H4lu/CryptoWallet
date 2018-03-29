import * as React from 'react'
import { USB_OFF_PATH, USB_ON_PATH } from '../core/paths'

export class Footer extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.renderStatusOK = this.renderStatusOK.bind(this)
    this.renderStatusErr = this.renderStatusErr.bind(this)
  }
  renderStatusOK() {
    return <div><img src = {USB_ON_PATH} className = 'usb-connection-status'/><p className = 'status'>Status:<span className = 'footer-connected'>Connected</span></p></div>
  }
  renderStatusErr() {
    return <div><img src = {USB_OFF_PATH} className = 'usb-connection-status'/><p className = 'status'>Status:<span className = 'footer-not-connected'> Not Connected</span></p></div>
  }
  render() {
    return (
    <div className = 'footer'>
      <div className = 'footer-content'>
        <p className = 'version'>Version 1.1</p>
        {(this.props.connection) ? (
          this.renderStatusOK()
        ) : (
          this.renderStatusErr()
        )}
      </div>
    </div>
    )
  }
}
