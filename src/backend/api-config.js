'use strict';

const cookieParser = require(`cookie-parser`);
const express = require(`express`);
const HttpCodes = require(`http-status-codes`);

const apiRoutes = require(`./api-routes`);
const {initDb, disconnectDb} = require(`./db`);
const {
  getAccountById,
  debug,
  initLocals,
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
      getAccountById,
    ],
    after: [
      (req, res) => {
        res.status(HttpCodes.NOT_FOUND).send(`Not found`);
        logger.endRequest(req, res);
      }
    ],
  },
  routes: apiRoutes,
};
