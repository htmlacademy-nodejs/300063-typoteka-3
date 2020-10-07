'use strict';

const path = require(`path`);

const cookieParser = require(`cookie-parser`);
const {json, static: staticMiddleware, urlencoded} = require(`express`);

const {frontendParams} = require(`../common/params`);
const appRoutes = require(`./app-routes`);
const {
  getAccountById,
  debug,
  redirectToInternalServerError,
  initializeLocals,
  redirectToNotFound,
  decryptTokenDetails,
} = require(`./middleware`);
const {logger} = require(`./utils`);


module.exports = {
  settings: [
    [`views`, path.resolve(__dirname, process.env.VIEW_DIR || frontendParams.DEFAULT_VIEW_DIR)],
    [`view engine`, `pug`]
  ],
  middleware: {
    before: [
      staticMiddleware(path.resolve(__dirname, process.env.PUBLIC_DIR || frontendParams.DEFAULT_PUBLIC_DIR))
    ],
    routes: [
      logger.expressPinoLogger,
      cookieParser(),
      json(),
      debug,
      urlencoded({extended: false}),
      initializeLocals,
      decryptTokenDetails,
      getAccountById,
    ],
    after: [
      redirectToNotFound,
      redirectToInternalServerError,
    ],
  },
  routes: appRoutes,
};
