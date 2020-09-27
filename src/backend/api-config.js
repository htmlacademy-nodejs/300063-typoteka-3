'use strict';

const cookieParser = require(`cookie-parser`);
const express = require(`express`);
const HttpCodes = require(`http-status-codes`);

const {initDb, disconnectDb} = require(`./db`);
const {debugMiddleware} = require(`./middleware`);
const {logger} = require(`./utils`);
const apiRoutes = require(`./api-routes`);


module.exports = {
  prefix: `api`,
  init: {
    sync: [],
    async: [initDb],
  },
  close: {
    sync: [],
    async: [disconnectDb],
  },
  middlewares: {
    before: [
      cookieParser(),
      logger.expressPinoLogger,
      express.json(),
      debugMiddleware
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
