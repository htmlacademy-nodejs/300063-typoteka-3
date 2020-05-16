'use strict';

const express = require(`express`);
const HttpCodes = require(`http-status-codes`);

const {logger} = require(`../utils`);
const {debugMiddleware} = require(`../middleware`);


const server = express();
server.use(logger.expressPinoLogger);
server.use(express.json());
server.use(debugMiddleware);

server.use((req, res) => {
  res.status(HttpCodes.NOT_FOUND).send(`Not found`);
  logger.endRequest(req, res);
});

module.exports = server;
