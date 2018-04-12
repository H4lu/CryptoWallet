import * as React from 'react'
import { remote } from 'electron'
import { LOGO_SMALL } from '../core/paths'
// let currentWindow = remote.BrowserWindow.getFocusedWindow()
interface IHeaderState {
  currentWindow: Electron.BrowserWindow
}
export class Header extends React.Component<any, IHeaderState> {
  constructor(props: any) {
    super(props)
    this.state = {
      currentWindow : remote.BrowserWindow.getFocusedWindow()
    }
    this.closeWindow = this.closeWindow.bind(this)
    this.hideWindow = this.hideWindow.bind(this)
  }

  closeWindow() {
    this.state.currentWindow.close()
  }
  hideWindow() {
    this.state.currentWindow.minimize()
  }

  render() {
    return (
    <div className = 'header'>
      <div className = 'header-content'>
        <div className = 'header-flex-container'>
        <img src = {LOGO_SMALL} /><p className = 'logo-font'>Braitberry</p>
        </div>
        <div className = 'title-bar-buttons'>
          <button className = 'button-hide' onClick = {this.hideWindow}/>
          <button className = 'button-close' onClick = {this.closeWindow}/>
        </div>
      </div>
    </div>
    )
  }
}
