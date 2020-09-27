'use strict';

const {api} = require(`../experiment`);
const {logger} = require(`../utils`);
const {DEFAULT_BACKEND_PORT} = require(`../../common/params`);


module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(...args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || parseInt(process.env.BACKED_PORT, 10) || DEFAULT_BACKEND_PORT;
    const server = await api.getInstance();
    server
      .listen(port, () => logger.startServer(port))
      .on(`error`, (error) => logger.errorStart(error));
  }
};
