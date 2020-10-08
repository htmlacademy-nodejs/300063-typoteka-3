'use strict';

const http = require(`http`);

const {AppBuilder} = require(`../common`);
const {frontendParams} = require(`../common/params`);
const appConfig = require(`./app-config`);
const {initAppSocket} = require(`./socket`);
const {logger} = require(`./utils`);


const appContainer = new AppBuilder(appConfig);
(async () => {
  const app = await appContainer.getInstance();
  const server = http.createServer(app);
  initAppSocket(server);
  const port = parseInt(process.env.FRONTEND_PORT, 10) || frontendParams.DEFAULT_FRONTEND_PORT;
  server.listen(port, () => logger.startServer(port))
    .on(`error`, (error) => logger.errorStart(error));
})();
