'use strict';

const chalk = require(`chalk`);

const {ExitCode} = require(`../../common/params`);
const {initDb} = require(`../db`);


module.exports = {
  name: `--init-db-tables`,
  alias: `-idbt`,
  async run(force) {
    const isForce = force === `force`;
    try {
      await initDb(isForce);
      console.info(chalk.green(`Operation success. DB tables initialized.`));
      process.exit(ExitCode.SUCCESS);
    } catch (error) {
      console.error(chalk.red(`Operation failed. DB tables can't initialize. You should check the environment params of DB connected.`));
      process.exit(ExitCode.ERROR);
    }
  },
};
