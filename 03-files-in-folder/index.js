const fs = require('fs').promises;
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

function startTask() {
  return fs.readdir(folderPath, { withFileTypes: true }).then((files) => {
    files.map((file) => {
      if(file.isFile()) {
        const filePath = path.join(file.path, file.name);
        return fs.stat(filePath).then((stats) => {
          const fileInfo = {
            name: file.name.split('.').slice(0, 1),
            type: file.name.split('.').slice(1),
            size: stats.size,
          };
          console.log(`${fileInfo.name} - ${fileInfo.type} - ${fileInfo.size} B`);
        });
      }
    });
  });
}

startTask();
