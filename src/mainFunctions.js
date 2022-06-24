const { BrowserWindow, dialog } = require('electron');

const handleSetTitle = (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(`Arrow ${title}`)
}

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({properties: ['openDirectory']})
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

module.exports = { handleSetTitle, handleFileOpen }