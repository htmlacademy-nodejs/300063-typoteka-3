'use strict';

const {apiContainer} = require(`../api`);
const {logger} = require(`../utils`);
const {frontendParams} = require(`../../common/params`);


module.exports = {
  name: `--server`,
  alias: `-s`,
  async run(...args) {
    const [customPort] = args;
    const port = parseInt(customPort, 10) || parseInt(process.env.BACKED_PORT, 10) || frontendParams.DEFAULT_BACKEND_PORT;
    const server = await apiContainer.getInstance();
    server
      .listen(port, () => logger.startServer(port))
      .on(`error`, (error) => logger.errorStart(error));
  }
};
