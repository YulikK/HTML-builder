const fs = require('fs').promises;
const path = require('path');

const folder = 'files';
const copyFolder = 'files-copy';
const pathTask = path.dirname(__filename);
const pathFolder = path.join(pathTask, folder);
const pathCopyFolder = path.join(pathTask, copyFolder);

function startTask() {
  return fs
    .access(pathCopyFolder)
    .then(() => {
      console.log(`1. Looking for the ${copyFolder} folder`);
      return clearDirectory(pathCopyFolder);
    })
    .catch(() => {
      console.log(`1. Create directory ${copyFolder}`);
      return fs.mkdir(pathCopyFolder);
    })
    .then(() => {
      console.log(`2. Copying from ${folder} folder`);
      return copyDirectory(pathFolder, pathCopyFolder);
    });
}

function clearDirectory(directory) {
  return fs.readdir(directory).then((files) => {
    const unlinkPromises = files.map((file) => {
      const filePath = path.join(directory, file);
      return fs
        .stat(filePath)
        .then((stat) => {
          if (stat.isDirectory()) {
            return clearDirectory(filePath).then(() => fs.rmdir(filePath));
          } else {
            return fs.unlink(filePath);
          }
        })
        .catch((err) => {
          console.error(`Error deleting a file ${filePath}:`, err);
        });
    });

    return Promise.all(unlinkPromises);
  });
}

function copyDirectory(source, destination) {
  return fs.readdir(source).then((files) => {
    const copyPromises = files.map((file) => {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      return fs.stat(sourcePath).then((stat) => {
        if (stat.isDirectory()) {
          return fs
            .mkdir(destPath)
            .then(() => copyDirectory(sourcePath, destPath));
        } else {
          return fs.copyFile(sourcePath, destPath);
        }
      });
    });

    return copyPromises;
  });
}

startTask();
