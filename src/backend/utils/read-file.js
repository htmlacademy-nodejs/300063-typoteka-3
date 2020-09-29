'use strict';

const fs = require(`fs`).promises;

const chalk = require(`chalk`);


module.exports = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(`Не может прочитать файл ${filePath}`));
    return [];
  }
};
