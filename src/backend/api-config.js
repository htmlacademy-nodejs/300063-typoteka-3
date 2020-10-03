'use strict';

const cookieParser = require(`cookie-parser`);
const express = require(`express`);
const HttpCodes = require(`http-status-codes`);

const {initDb, disconnectDb} = require(`./db`);
const {debug} = require(`./middleware`);
const {logger} = require(`./utils`);
const apiRoutes = require(`./api-routes`);


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
    before: [
      cookieParser(),
      logger.expressPinoLogger,
      express.json(),
      debug
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
