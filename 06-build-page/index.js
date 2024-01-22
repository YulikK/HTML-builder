const fs = require('node:fs/promises');
const path = require('path');

const distName = 'project-dist';
const assetName = 'assets';
const cssName = 'styles';
const htmlName = 'template.html';
const htmlBundleName = 'index.html';
const componentsName = 'components';
const cssBundleName = 'style.css';
const pathTask = path.dirname(__filename);
const pathDist = path.join(pathTask, distName);
const pathAssetDist = path.join(pathDist, assetName);
const pathAsset = path.join(pathTask, assetName);
const pathCss = path.join(pathTask, cssName);
const pathComponents = path.join(pathTask, componentsName);
const pathHtml = path.join(pathTask, htmlName);

function startBuild() {
  console.log(`1. Looking for the ${distName} folder`);
  return fs
    .access(pathDist)
    .then(() => {
      console.log(`- clear the ${distName} folder`);
      return clearDirectory(pathDist);
    })
    .catch(() => {
      console.log(`- create directory ${distName}`);
      return fs.mkdir(pathDist);
    })
    .then(() => {
      console.log(`2. Looking for the ${assetName} folder`);
      return fs.access(pathAssetDist);
    })
    .then(() => {
      console.log(`- clear the ${assetName} folder`);
      return clearDirectory(pathAssetDist);
    })
    .catch(() => {
      console.log(`- create directory ${assetName}`);
      return fs.mkdir(pathAssetDist);
    })
    .then(() => {
      console.log(`3. Copying the assembly files ${assetName}`);
      return copyDirectory(pathAsset, pathAssetDist);
    })
    .then(() => {
      console.log('4. Make css bundle');
      return makeCssBundle(pathCss, pathDist);
    })
    .then(() => {
      console.log('5. Make HTML-file');
      return makeHtml(pathHtml, pathComponents, pathDist);
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

function makeHtml(source, components, destination) {
  return fs
    .readdir(components)
    .then((componentFiles) => {
      const componentsPromises = componentFiles
        .filter((file) => file.endsWith('.html'))
        .map((file) => {
          const filePath = path.join(components, file);
          return fs.readFile(filePath);
        });
      return Promise.all(componentsPromises).then((componentContents) => ({
        componentFiles,
        componentContents,
      }));
    })
    .then(({ componentFiles, componentContents }) => {
      return fs.readFile(source, 'utf-8').then((templateContent) => {
        componentFiles.forEach((file, index) => {
          const componentName = file.replace('.html', '');
          const regex = new RegExp(`{{${componentName}}}`, 'g');
          templateContent = templateContent.replace(
            regex,
            componentContents[index],
          );
        });
        const HtmlBundlePath = path.join(destination, htmlBundleName);
        return fs.writeFile(HtmlBundlePath, templateContent);
      });
    });
}

startBuild();
