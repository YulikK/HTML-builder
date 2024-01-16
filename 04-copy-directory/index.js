const { mkdir, readdir, stat, copyFile, rmdir, unlink } = require('node:fs/promises');
const path = require('path');

const startFolder = 'files';
const newFolder = 'files-copy';
const taskFolder = path.dirname(__filename);

async function dirExists(folderPath) {
  try {
    await stat(folderPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
  }
}

async function copyFiles() {
  try {
    const isExist = dirExists(path.join(taskFolder, newFolder))
    if (isExist) {
      const filesOld = await readdir(path.join(taskFolder, newFolder));
      for (const file of filesOld) {
        const stats = await stat(path.join(taskFolder, newFolder, file));
        if (stats.isFile()) {
          await unlink(path.join(taskFolder, newFolder, file));
        }
      }
      await rmdir(path.join(taskFolder, newFolder));
    }

    await mkdir(path.join(taskFolder, newFolder), { recursive: true });

    const files = await readdir(path.join(taskFolder, startFolder));

    for (const file of files) {
      const stats = await stat(path.join(taskFolder, startFolder, file));
      if (stats.isFile()) {
        await copyFile(path.join(taskFolder, startFolder, file), path.join(taskFolder, newFolder, file));
      }

    }

  } catch (error) {
    console.error('Error copying files:', error);
  }
}

copyFiles();