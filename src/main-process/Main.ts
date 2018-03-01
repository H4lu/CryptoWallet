import { app, BrowserWindow, Menu } from 'electron'
/*import * as url from 'url'
import * as path from 'path'*/
declare var __dirname: string
let mainWindow: Electron.BrowserWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1024, height: 720, resizable: false,
    fullscreen: false, frame: false })
  mainWindow.once('ready-to-show', () => mainWindow.show())
 // const fileName = 'file:///' + __dirname + '/index.html'
 // mainWindow.loadURL(fileName)
 /* mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))*/
  mainWindow.loadURL(`file:///${__dirname}/index.html`)
  mainWindow.webContents.on('context-menu', (e, props) => {
    console.log(e)
    const selectionMenu = Menu.buildFromTemplate([
      { role: 'copy' },
      { type: 'separator' },
      { role: 'selectall' }
    ])
    const InputMenu = Menu.buildFromTemplate([{
      label: 'Undo',
      role: 'undo'
    }, {
      label: 'Redo',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      role: 'cut'
    }, {
      label: 'Copy',
      role: 'copy'
    }, {
      label: 'Paste',
      role: 'paste'
    }, {
      type: 'separator'
    }, {
      label: 'Select all',
      role: 'selectall'
    }
    ])
    const { inputFieldType, selectionText } = props
    if (inputFieldType === 'plainText') {
      InputMenu.popup(mainWindow)
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(mainWindow)
    }
  })
})

app.on('window-all-closed', app.quit)
app.on('before-quit', () => {
  mainWindow.removeAllListeners('close')
  mainWindow.close()
})
