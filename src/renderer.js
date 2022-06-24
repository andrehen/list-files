const setButton = document.getElementById('btn');
const titleInput = document.getElementById('title');

setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.api.setTitle(title)
});

const btn = document.getElementById('btnFile');
const filePathElement = document.getElementById('filePath');

btn.addEventListener('click', async () => {
  const filePath = await window.api.openFile();
  filePathElement.innerText = filePath
})