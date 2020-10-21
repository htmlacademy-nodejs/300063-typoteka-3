'use strict';

const fs = require(`fs`);
const path = require(`path`);

const dirPath = path.resolve(__dirname, `./logs`);
try {
  fs.accessSync(dirPath, fs);
} catch (error) {
  fs.mkdirSync(dirPath);
}

