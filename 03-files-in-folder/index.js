const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  for (const file of files) {
    const filePath = path.join(file.path, file.name);

    fs.stat(filePath, (error, stats) => {
      if (error) throw console.error(error);

      const fileSize = stats.size / 1000;
      const fileExtension = file.name.split('.').slice(1);
      console.log(`${file.name} - ${fileExtension} - ${fileSize}kb`);
    });
  }
});
