'use strict';

const express = require(`express`);
const HttpCodes = require(`http-status-codes`);

const {logger} = require(`backend/utils`);
const {debugMiddleware} = require(`backend/middleware`);

const apiArticles = require(`./api-articles`);
const apiCategories = require(`./api-categories`);
const apiSearch = require(`./api-search`);


const server = express();
server.use(logger.expressPinoLogger);
server.use(express.json());
server.use(debugMiddleware);

server.use(`/api/articles`, apiArticles);
server.use(`/api/categories`, apiCategories);
server.use(`/api/search`, apiSearch);

server.use((req, res) => {
  res.status(HttpCodes.NOT_FOUND).send(`Not found`);
  logger.endRequest(req, res);
});

module.exports = server;
