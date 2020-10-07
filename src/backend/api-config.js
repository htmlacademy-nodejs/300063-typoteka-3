'use strict';

const cookieParser = require(`cookie-parser`);
const express = require(`express`);

const apiRoutes = require(`./api-routes`);
const {initDb, disconnectDb} = require(`./db`);
const {
  getAccountById,
  debug,
  decryptTokenDetails,
  initLocals,
  notFound,
} = require(`./middleware`);
const {logger} = require(`./utils`);


module.exports = {
  prefix: `api`,
  init: {
    sync: [],
    async: [initDb],
  },
  destroy: {
    sync: [],
    async: [disconnectDb],
  },
  middleware: {
    routes: [
      cookieParser(),
      logger.expressPinoLogger,
      express.json(),
      debug,
      initLocals,
      decryptTokenDetails,
      getAccountById,
    ],
    after: [notFound],
  },
  routes: apiRoutes,
};
