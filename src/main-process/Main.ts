import { app, BrowserWindow, Menu } from 'electron'
// import installExtension , { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
/*import * as url from 'url'
import * as path from 'path'*/

declare var __dirname: string
let mainWindow: BrowserWindow
app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 1024, height: 720, resizable: false,
    fullscreen: false, frame: false })
  mainWindow.loadURL(`file:///${__dirname}/index.html`)
  mainWindow.webContents.toggleDevTools()
  mainWindow.once('ready-to-show', () => mainWindow.show())
 // const fileName = 'file:///' + __dirname + '/index.html'
 // mainWindow.loadURL(fileName)
  /* mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))*/

  /*installExtension(REACT_DEVELOPER_TOOLS).then((name => console.log(`Added Extension:  ${name}`))).catch((err) => console.log('An error occurred: ', err))
  installExtension(REDUX_DEVTOOLS).then((name => console.log(`Added Extension:  ${name}`))).catch((err) => console.log('An error occurred: ', err))
  */
  mainWindow.webContents.on('context-menu', (e, props) => {
    console.log(e)
    const selectionMenu = Menu.buildFromTemplate([
      { role: 'copy' },
      { type: 'separator' }
    ])
    const InputMenu = Menu.buildFromTemplate([{
      label: 'Copy',
      role: 'copy'
    }, {
      label: 'Paste',
      role: 'paste'
    }
    ])
    const { inputFieldType, selectionText } = props
    if (inputFieldType === 'plainText') {
      InputMenu.popup(mainWindow)
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(mainWindow)
    }
  })
  mainWindow.once('close', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
/*app.on('before-quit', () => {
  mainWindow.removeAllListeners('close')
  mainWindow.close()
})
*/
