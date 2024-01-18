// const { mkdir, readdir, stat, copyFile, rmdir, unlink } = require('node:fs/promises');
const fs = require('fs').promises;
const path = require('path');

const pathTask = path.dirname(__filename);
const distFolder = 'project-dist';
const pathDistFolder = path.join(pathTask, distFolder);
const cssBundleName = 'bundle.css';
const cssFolder = 'styles';
const pathCssFolder = path.join(pathTask, cssFolder);

function startBuild() {
  return fs
    .access(pathDistFolder)
    .then(() => {
      console.log(`1. Looking for the ${distFolder} folder`);
    })
    .catch(() => {
      console.log(` - create directory ${distFolder}`);
      return fs.mkdir(pathDistFolder);
    })
    .then(() => {
      console.log('2. Make css bundle');
      return makeCssBundle(pathCssFolder, pathDistFolder);
    });
}

function makeCssBundle(source, destination) {
  return fs
    .readdir(source)
    .then((files) => {
      const bundlePromises = files
        .filter((file) => file.endsWith('.css'))
        .map((file) => {
          const filePath = path.join(source, file);
          return fs.readFile(filePath);
        });
      return Promise.all(bundlePromises);
    })
    .then((cssContent) => {
      const bundleContent = cssContent.join('\n');
      const bundlePath = path.join(destination, cssBundleName);
      return fs.writeFile(bundlePath, bundleContent);
    });
}

startBuild();
