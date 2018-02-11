import { app, BrowserWindow } from 'electron'
/*import * as url from 'url'
import * as path from 'path'*/
declare var __dirname: string
let mainWindow: Electron.BrowserWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1024, height: 720, resizable: false,
    fullscreen: false })
  mainWindow.once('ready-to-show', () => mainWindow.show())
 // const fileName = 'file:///' + __dirname + '/index.html'
 // mainWindow.loadURL(fileName)
 /* mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))*/
  mainWindow.loadURL(`file:///${__dirname}/index.html`)
})

app.on('window-all-closed', app.quit)
app.on('before-quit', () => {
  mainWindow.removeAllListeners('close')
  mainWindow.close()
})
