'use strict';

const chalk = require(`chalk`);


const descriptions = {
  '--version': {
    alias: `-v`,
    info: `выводит номер версии`,
  },
  '--help': {
    alias: `-h`,
    info: `печатает этот текст`,
  },
  '--generate': {
    alias: `-g`,
    info: `формирует файл mocks.json`,
    option: `<count>`,
  },
  '--server': {
    alias: `-s`,
    info: `запускает сервер на указанном порту (по-умолчанию :3000)`,
    option: `<port>`,
  },
  '--delete-db': {
    alias: `-ddb`,
    info: `удаляет БД и пользователя БД, (если передать параметр superuser можно указать имя суперпользователя в БД, который нужен для инициализации, по-умолчанию postgres)`,
    option: `<superuser>[postgres]`,
  },
  '--init-db': {
    alias: `-idb`,
    info: `инициализирует БД и пользователя БД, (если передать параметр superuser можно указать имя суперпользователя в БД, который нужен для инициализации, по-умолчанию postgres)`,
    option: `<superuser>`,
  },
  '--init-db-tables': {
    alias: `-idbt`,
    info: `инициализирует необходимые таблицы в базе данный, (если передать параметр force все данные в таблицах будут удалены)`,
    option: `<force> [force]`,
  },
  '--fill-db': {
    alias: `-fdb`,
    info: `наполняет таблицы в базе данных фейковыми данными (count задает одинаковое количество пользователей и статей)`,
    option: `<count>`,
  },
};

module.exports = {
  name: `--help`,
  alias: `-h`,
  run() {
    console.info(chalk.grey(`Программа запускает http-сервер и формирует файл с данными для API.`));
    console.info(chalk.grey(`  Гайд`));
    console.info(chalk.grey(`  server "command"`));
    console.info(chalk.grey(`  Команды:`));
    for (let command in descriptions) {
      if (descriptions.hasOwnProperty(command)) {
        const description = descriptions[command];
        const option = description.option || ``;
        console.info(chalk.grey(`  ${command} [${description.alias}] ${option} — ${description.info}.`));
      }
    }
  }
};
