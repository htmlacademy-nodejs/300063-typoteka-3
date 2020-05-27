'use strict';

const server = require(`backend/api`);
const {logger} = require(`backend/utils`);
const {DEFAULT_PORT} = require(`backend/constants`);


module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(...args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || parseInt(process.env.BACKED_PORT, 10) || DEFAULT_PORT;

    server
      .listen(port, () => logger.startServer(port))
      .on(`error`, (error) => logger.errorStart(error));
  }
};
