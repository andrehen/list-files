const setButton = document.getElementById('btn');
const titleInput = document.getElementById('title');

setButton.addEventListener('click', () => {
  const title = titleInput.value;
  if (title.length === 0) {
    window.api.showAlert('Campo de texto vazio...');
  } else {
    window.api.setTitle(title);
  }
});

const btnFile = document.getElementById('btnFile');
const filePathElement = document.getElementById('filePath');

btnFile.addEventListener('click', async () => {
  const filePath = await window.api.openDir();
  filePathElement.innerText = filePath;
});

const counter = document.getElementById('counter');
window.api.onUpdateCounter((event, value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue;

  // You can send a reply back to the main process from within the ipcRenderer.on callback.
  event.sender.send('counter-value', newValue);
});

const errorOutput = document.getElementById('errorOutput');
const updatesOutput = document.getElementById('updatesOutput');
window.api.onFileProcessingUpdate((event, { eventName, text }) => {
  if (eventName === 'error') {
    errorOutput.hidden = false;
    updatesOutput.hidden = true;
    errorOutput.innerText = text;
    updatesOutput.innerText = '';
  }
  if (eventName === 'begin') {
    btnFile.disabled = true;
    errorOutput.hidden = true;
    updatesOutput.hidden = false;

    errorOutput.innerText = '';
    updatesOutput.innerText = '';
  }
  if (eventName === 'finished') {
    btnFile.disabled = false;
  }
  if (eventName === 'update') {
    updatesOutput.innerText += `${text}\n`;
  }

});