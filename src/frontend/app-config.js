'use strict';

const path = require(`path`);

const cookieParser = require(`cookie-parser`);
const {json, static: staticMiddleware, urlencoded} = require(`express`);

const {DEFAULT_VIEW_DIR, DEFAULT_PUBLIC_DIR} = require(`../common/params`);
const appRoutes = require(`./app-routes`);
const {
  accountByIdMiddleware,
  debugMiddleware,
  internalServerErrorMiddleware,
  localsMiddleware,
  notFoundMiddleware,
  tokenDetailsMiddleware,
} = require(`./middleware`);
const {logger} = require(`./utils`);


module.exports = {
  settings: [
    [`views`, path.resolve(__dirname, process.env.VIEW_DIR || DEFAULT_VIEW_DIR)],
    [`view engine`, `pug`]
  ],
  middlewares: {
    before: [
      logger.expressPinoLogger,
      cookieParser(),
      json(),
      debugMiddleware,
      staticMiddleware(path.resolve(__dirname, process.env.PUBLIC_DIR || DEFAULT_PUBLIC_DIR)),
      urlencoded({extended: false}),
      localsMiddleware,
      tokenDetailsMiddleware,
      accountByIdMiddleware
    ],
    after: [
      notFoundMiddleware,
      internalServerErrorMiddleware,
    ],
  },
  routes: appRoutes,
};
