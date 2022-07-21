const { BrowserWindow, dialog } = require('electron');
const { scanDir, writeFile } = require('./fileUtils');

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
  const sendWeb = (eventName, text) => { mainWindow.webContents.send('update-file-processing-status', { eventName, text }); }

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
  
  if (canceled) {
    console.log('User canceled...');
    sendWeb(EVENTS.error, 'User canceled...');
    return;
  }

  const selectedDirPath = filePaths[0];

  sendWeb(EVENTS.begin);
  sendWeb(EVENTS.update, 'Gerando arquivos...');
  console.log(`Must scan the dir: ${selectedDirPath}`);
  console.log('Scanning...');

  const { outputStr, fileName } = scanDir(selectedDirPath);

  scanDir(selectedDirPath)
    .then(({ outputStr, fileName }) => {
      console.log('Gerou um output!');

      sendWeb(EVENTS.update, 'Arquivos gerados ...');
      dialog.showSaveDialog(mainWindow, {
        buttonLabel: 'Salvar algo',
        defaultPath: fileName,
      }).then(({ canceled, filePath }) => {
        sendWeb(EVENTS.finished);
        if (canceled) console.log('User canceled...');
        else {
          writeFile(filePath, outputStr)
            .then(() => {
              sendWeb(EVENTS.update, `File saved in the path: ${filePath}`);
            })
            .catch(() => {
              sendWeb(EVENTS.update, `Some error writing the file: ${filePath}`);
            });
        }
      });
    })
    .catch(error => {
      sendWeb(EVENTS.update, error);
      sendWeb(EVENTS.finished);
    });

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