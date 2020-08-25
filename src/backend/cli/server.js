'use strict';

const server = require(`../api`);
const {initDb} = require(`../db`);
const {logger} = require(`../utils`);
const {DEFAULT_BACKEND_PORT, ExitCode} = require(`../../common/params`);


module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(...args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || parseInt(process.env.BACKED_PORT, 10) || DEFAULT_BACKEND_PORT;
    try {
      await initDb();
      logger.info(`DB connected successfully`);
    } catch (error) {
      logger.error(`DB connection error ${error}`);
      process.exit(ExitCode.ERROR);
    }
    server
      .listen(port, () => logger.startServer(port))
      .on(`error`, (error) => logger.errorStart(error));
  }
};
