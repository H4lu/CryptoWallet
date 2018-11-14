import * as React from 'react'
import { ipcRenderer } from 'electron'
// let currentWindow = remote.BrowserWindow.getFocusedWindow()

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.closeWindow = this.closeWindow.bind(this)
    this.hideWindow = this.hideWindow.bind(this)
  }

  closeWindow() {
    ipcRenderer.send('close',[])
  }

  hideWindow() {
    ipcRenderer.send('hide',[])
  }

  render() {
    return (
    <div className = 'header'>
      <div className = 'header-content'>
        <div className = 'title-bar-buttons'>
          <button className = 'button-hide' onClick = {this.hideWindow}/>
          <button className = 'button-close' onClick = {this.closeWindow}/>
        </div>
      </div>
    </div>
    )
  }
}
