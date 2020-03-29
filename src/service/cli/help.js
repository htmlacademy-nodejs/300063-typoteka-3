'use strict';

const chalk = require(`chalk`);

const descriptions = {
  '--version': {
    info: `выводит номер версии`,
  },
  '--help': {
    info: `печатает этот текст`,
  },
  '--generate': {
    info: `формирует файл mocks.json`,
    option: `<count>`
  },
};

module.exports = {
  name: `--help`,
  alias: `-h`,
  run() {
    console.info(`Программа запускает http-сервер и формирует файл с данными для API.`);
    console.info(`  Гайд`);
    console.info(`  server "command"`);
    console.info(`  Команды:`);
    for (let key in descriptions) {
      if (descriptions.hasOwnProperty(key)) {
        const description = descriptions[key];
        const command = chalk.cyan(key);
        const option = chalk.yellow(description.option || ``);
        const info = description.info;
        console.info(`  ${command} ${option} — ${info}`);
      }
    }
  }
};
