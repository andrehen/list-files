var fs = require('fs');
var fsPromises = require('fs').promises;
// TODO: continue from here https://nodejs.org/dist/latest-v10.x/docs/api/fs.html

var path = require('path');

function formatedDate() {
  return new Date().toISOString().
    replace(/T/, '-').      // replace T with a space
    replace(/\..+/, '').     // delete the dot and everything after
    replace(/:/g, '');
}

function niceBytes(x) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0, n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

function scanDir(dirPath) {

  let count = -1;
  let totalFiles = 0;
  let totalDir = 0;
  let totalSize = 0;

  const osDirSeparator = process.platform === 'win32' ? '\\' : '/';

  const dirTree = (filename) => {
    count++;

    var info = {
      id: count,
      // path: filename,
      name: path.basename(filename)
    };

    var stats;
    try {
      stats = fs.lstatSync(filename);
    } catch (err) {
      return {
        id: info.id,
        name: `${info.name} - [NO_ACCESS]`,
        size: 0,
      }
    }
    
    

    if (stats.isDirectory()) {
      // info.type = "folder";
      info.dirPath = filename;
      totalDir++;
      info.children = fs.readdirSync(filename).map(function (child) {
        return dirTree(filename + osDirSeparator + child);
      });
    } else {
      // Assuming it's a file. In real life it could be a symlink or
      // something else!
      // info.type = "file";
      // info.size = niceBytes(stats.size);
      totalFiles++;
      totalSize += stats.size;
      info.size = stats.size;
    }

    return info;
  }

  return new Promise((resolve, reject) => {
    const startDate = new Date();
    console.log(`Init time:    ${startDate.toLocaleString()}`);

    const cleanedPath = dirPath.replace(/\\/g, '-').replace(/:/g, '');

    try {
      const dirInfo = dirTree(dirPath);

      const outputStr = JSON.stringify(dirInfo);
      const fileName = `${cleanedPath}-(${totalFiles} files, ${totalDir} dirs, Total Size ${niceBytes(totalSize)})-${formatedDate()}.json`;

      resolve({ outputStr, fileName });
    } catch (error) {
      reject(`Some error: ${error}`);
    }
  });


}

function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', err => {
      if (err) {
        reject({ msg: 'Error writing' });
        return;
      }
      console.log('Deu bom');
      resolve({ msg: 'Deu bom' });
    });
  });
}

module.exports = { scanDir, writeFile };