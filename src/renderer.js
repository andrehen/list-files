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

const btn = document.getElementById('btnFile');
const filePathElement = document.getElementById('filePath');

btn.addEventListener('click', async () => {
  const filePath = await window.api.openFile();
  filePathElement.innerText = filePath;
})

const counter = document.getElementById('counter');
window.api.onUpdateCounter((event, value) => {
    const oldValue = Number(counter.innerText);
    const newValue = oldValue + value;
    counter.innerText = newValue;

    // You can send a reply back to the main process from within the ipcRenderer.on callback.
    event.sender.send('counter-value', newValue);
})