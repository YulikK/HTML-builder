const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'write-text.txt'));

stdout.write('What are we gonna put in the file?\n');
stdout.write('new text line: ');

stdin.on('data', (data) => {
  if (data.toString().toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(data);
    stdout.write('new text line: ');
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\nStopped the program'));
