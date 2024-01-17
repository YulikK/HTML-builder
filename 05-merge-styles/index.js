// const { mkdir, readdir, stat, copyFile, rmdir, unlink } = require('node:fs/promises');
const fs = require('fs').promises;
const path = require('path');

async function createBundle(folderPath) {
  const files = await fs.readdir(folderPath);
  const cssFiles = files.filter((file) => file.endsWith('.css'));
  let cssContent = '';

  for (const file of cssFiles) {
    const filePath = path.join(folderPath, file);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    cssContent += fileContent;
  }

  const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');
  await fs.writeFile(outputPath, cssContent);
}

createBundle(path.join(__dirname, 'styles'));
