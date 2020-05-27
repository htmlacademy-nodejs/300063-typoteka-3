'use strict';

const server = require(`../../api`);
const {logger} = require(`../../utils`);
const {DEFAULT_PORT} = require(`../../constants`);


module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(...args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || parseInt(process.env.SERVER_API_PORT, 10) || DEFAULT_PORT;

    server
      .listen(port, () => logger.startServer(port))
      .on(`error`, (error) => logger.errorStart(error));
  }
};
