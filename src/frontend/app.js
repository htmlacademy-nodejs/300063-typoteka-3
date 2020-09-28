'use strict';

const {AppBuilder} = require(`../common`);
const {DEFAULT_FRONTEND_PORT} = require(`../common/params`);
const appConfig = require(`./app-config`);
const {logger} = require(`./utils`);


const appContainer = new AppBuilder(appConfig);
(async () => {
  const app = await appContainer.getInstance();

  const port = parseInt(process.env.FRONTEND_PORT, 10) || DEFAULT_FRONTEND_PORT;
  app.listen(port, () => logger.startServer(port))
    .on(`error`, (error) => logger.errorStart(error));
})();

