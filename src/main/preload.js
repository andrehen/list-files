// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  setTitle: title => ipcRenderer.send('set-title', title),
  showAlert: msg => ipcRenderer.send('show-alert', msg),
  openDir: () => ipcRenderer.invoke('dialog:openDir'),
  onUpdateCounter: callback => ipcRenderer.on('update-counter', callback),
  onFileProcessingUpdate: callback => ipcRenderer.on('update-file-processing-status', callback),
});

/**
 * You can call ipcRenderer.on directly in the preload script rather than exposing it over the context bridge.
 * 
 * However, this approach has limited flexibility compared to exposing your preload APIs over the context bridge,
 * since your listener can't directly interact with your renderer code.
 */
// window.addEventListener('DOMContentLoaded', () => {
//   const counter = document.getElementById('counter');
//   ipcRenderer.on('update-counter', (_event, value) => {
//     const oldValue = Number(counter.innerText);
//     const newValue = oldValue + value;
//     counter.innerText = newValue;
//   })
// });