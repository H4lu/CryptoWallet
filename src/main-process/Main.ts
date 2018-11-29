import { app, BrowserWindow, Menu, ipcMain } from 'electron'
// import installExtension , { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
/*import * as url from 'url'
import * as path from 'path'*/
import * as log from 'electron-log'
declare var __dirname: string
let mainWindow: BrowserWindow
ipcMain.once('close', () => {
  mainWindow.close()
})
ipcMain.on('hide', () => {
  mainWindow.minimize()
})
app.disableHardwareAcceleration()

app.on('ready', () => {
  
  mainWindow = new BrowserWindow({ width: 1366, height: 768, resizable: false,
    fullscreen: false, frame: false })
  mainWindow.loadURL(`file:///${__dirname}/index.html`)
  setupLogger()
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
    log.info(e)
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
      
      InputMenu.popup({window: mainWindow})
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup({window: mainWindow})
    }
  })
  mainWindow.once('close', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
function setupLogger() {
  // Same as for console transport
  log.transports.file.level = 'info'
  log.transports.file.format = '{h}:{i}:{s}:{ms} {text}'

  // Set approximate maximum log size in bytes. When it exceeds,
  // the archived log will be saved as the log.old.log file
  log.transports.file.maxSize = 5 * 1024 * 1024

  // Write to this file, must be set before first logging
  log.transports.file.file = __dirname + '/../log.log'
  log.transports.file.streamConfig = { flags: 'a' }
  // fs.createWriteStream options, must be set before first logging
  /*
  fs.exists(__dirname + '../log.log', (value) => {
    console.log('EXISTS', value)
    if (value) {
      log.transports.file.streamConfig = { flags: 'a' }
    } else {
      log.transports.file.streamConfig = { flags: 'w' }
    }
  })
*/
  // set existed file stream
  // log.transports.file.file = 'log.log'
  // log.transports.file.stream = fs.createWriteStream('log.log')
}

/*app.on('before-quit', () => {
  mainWindow.removeAllListeners('close')
  mainWindow.close()
})
*/
