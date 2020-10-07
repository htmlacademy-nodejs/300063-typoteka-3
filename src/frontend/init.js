'use strict';

const fs = require(`fs`);
const path = require(`path`);


const dirNames = [`logs`, `temp`];

dirNames.forEach((dirName) => {
  const dirPath = path.resolve(__dirname, `./${dirName}`);
  try {
    fs.accessSync(dirPath, fs);
  } catch (error) {
    fs.mkdirSync(dirPath);
  }
});
