const { BrowserWindow, dialog } = require('electron');

const handleSetTitle = (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(`${title}`)
}

const EVENTS = {
  error: 'error',
  begin: 'begin',
  finished: 'finished',
  update: 'update'
}

const handleDirectoryOpen = mainWindow => async () => {
  const sendWeb = (eventName, text) => { mainWindow.webContents.send('update-file-processing-status', {eventName, text}); }

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
  if (canceled) {
    console.log('User canceled...');
    sendWeb(EVENTS.error,'User canceled...');
    return;
  } else {
    const selectedDirPath = filePaths[0];

    sendWeb(EVENTS.begin);
    sendWeb(EVENTS.update, 'Gerando arquivos...');
    console.log(`Must scan the dir: ${selectedDirPath}`);
    console.log('Scanning...');

    setTimeout(() => {
      sendWeb(EVENTS.update, 'Arquivos gerados ...')
      dialog.showSaveDialog(mainWindow, {
        buttonLabel: 'Salvar algo',
        defaultPath: 'file-lerolero.txt'
      }).then(({ canceled, filePath }) => {
        sendWeb(EVENTS.finished);
        if (canceled) console.log('User canceled...');
        else {
          sendWeb(EVENTS.update, `File saved in the path: ${filePath}`);
        }
        // return filePaths[0];
      });
    }, 3000);
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

module.exports = { handleSetTitle, handleDirectoryOpen, handleShowAlert, EVENTS }