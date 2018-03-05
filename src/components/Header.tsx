import * as React from 'react'
import {remote} from 'electron'

let currentWindow = remote.BrowserWindow.getFocusedWindow()
export class Header extends React.Component<any, any> {
  
  constructor(props: any) {
    super(props)

    this.closeWindow = this.closeWindow.bind(this)
    this.hideWindow = this.hideWindow.bind(this)
  }

  closeWindow() {
    currentWindow.close()
  }
  hideWindow() {
    currentWindow.minimize()
  }
  
  render() {
    return (
    <div className = 'header'>
      <div className = 'header-content'>
        <p className = 'logo-font'>Braitberry</p>
        <div className = 'title-bar-buttons'>
          <button className = 'button-hide' onClick = {this.hideWindow}/>
          <button className = 'button-close' onClick = {this.closeWindow}/>
        </div>
      </div>
    </div>)
  }
}
