'use strict';

const {spawn} = require(`child_process`);

const chalk = require(`chalk`);

const {ExitCode} = require(`../../common/params`);
const {getDbParamsConfig} = require(`../utils`);


const {database, host, port, username, password} = getDbParamsConfig();

const userSql = `
  CREATE ROLE ${username} WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD '${password}';
`;

const dbSql = `
  CREATE DATABASE ${database}
    WITH
    OWNER = ${username}
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
`;

const dbRightsSql = `GRANT ALL ON DATABASE ${database} TO ${username}`;

const initDb = (superuser = `postgres`) => {
  const psql = spawn(`psql`, [
    `-U`, superuser,
    `-h`, host,
    `-p`, port,
    `-c`, userSql,
    `-c`, dbSql,
    `-c`, dbRightsSql
  ]);

  psql.stderr.on(`data`, (data) => {
    console.log(data.toString());
    console.log(`Operation failed: ${data.toString()}`);
    process.exit(ExitCode.ERROR);
  });
  psql.on(`close`, () => {
    console.info(chalk.green(`Operation success. DB and DB user initialized.`));
    process.exit(ExitCode.SUCCESS);
  });
};

module.exports = {
  name: `--init-db`,
  alias: `-idb`,
  async run(superuser) {
    initDb(superuser);
  },
};
