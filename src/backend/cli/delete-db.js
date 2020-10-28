'use strict';

const {spawn} = require(`child_process`);

const chalk = require(`chalk`);

const {ExitCode} = require(`../../common/params`);
const {getDbParamsConfig} = require(`../utils`);


const {database, host, port, username} = getDbParamsConfig();

const dbSql = `DROP DATABASE IF EXISTS ${database}`;

const userSql = `DROP ROLE IF EXISTS ${username};`;

const initDb = (superuser = `postgres`) => {
  const psql = spawn(`psql`, [
    `-U`, superuser,
    `-h`, host,
    `-p`, port,
    `-c`, dbSql,
    `-c`, userSql
  ]);

  psql.stderr.on(`data`, (data) => {
    console.log(data.toString());
    console.log(`Operation failed: ${data.toString()}`);
    process.exit(ExitCode.ERROR);
  });
  psql.on(`close`, () => {
    console.info(chalk.green(`Operation success. DB and DB user deleted.`));
    process.exit(ExitCode.SUCCESS);
  });
};

module.exports = {
  name: `--delete-db`,
  alias: `-ddb`,
  async run(superuser) {
    initDb(superuser);
  },
};
