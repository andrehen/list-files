const { BrowserWindow, dialog } = require('electron');

const handleSetTitle = (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(`${title}`)
}

const handleFileOpen = mainWindow => async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

const handleShowAlert = mainWindow => (_event, message) => {
  const options = {
    type: "none",
    buttons: ["Okay"],
    title: "Alert Message!",
    message
  }
  dialog.showMessageBox(mainWindow, options);
}

module.exports = { handleSetTitle, handleFileOpen, handleShowAlert }