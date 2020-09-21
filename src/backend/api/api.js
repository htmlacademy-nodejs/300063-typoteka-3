'use strict';

const express = require(`express`);
const HttpCodes = require(`http-status-codes`);

const {initDb, disconnectDb} = require(`../db`);
const {ExitCode} = require(`../../common/params`);
const {logger} = require(`../utils`);
const {debugMiddleware} = require(`../middleware`);

const apiArticles = require(`./api-articles`);
const apiCategories = require(`./api-categories`);
const apiComments = require(`./api-comments`);
const apiUser = require(`./api-user`);


class Server {
  constructor() {
    this._server = null;
  }

  async getInstance() {
    if (this._server === null) {
      await this._connectDb();
      this._initInstance();
    }
    return this._server;
  }

  async close() {
    await disconnectDb();
    this._server = null;
  }

  async _connectDb() {
    try {
      await initDb();
      logger.info(`DB connected successfully`);
    } catch (error) {
      logger.error(`DB connection error ${error}`);
      process.exit(ExitCode.ERROR);
    }
  }

  _initInstance() {
    this._server = express();
    this._initBeforeRouteMiddlewares();
    this._initRoutes();
    this._initAfterRouteMiddlewares();
  }

  _initBeforeRouteMiddlewares() {
    this._server.use(logger.expressPinoLogger);
    this._server.use(express.json());
    this._server.use(debugMiddleware);
  }

  _initRoutes() {
    this._server.use(`/api/articles`, apiArticles);
    this._server.use(`/api/categories`, apiCategories);
    this._server.use(`/api/comments`, apiComments);
    this._server.use(`/api/user`, apiUser);
  }

  _initAfterRouteMiddlewares() {
    this._server.use((req, res) => {
      res.status(HttpCodes.NOT_FOUND).send(`Not found`);
      logger.endRequest(req, res);
    });
  }
}

module.exports = new Server();


