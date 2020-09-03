'use strict';

const pino = require(`pino`);
const expressPinoLogger = require(`express-pino-logger`);
const HttpCodes = require(`http-status-codes`);


class LoggerCenter {
  constructor(name) {
    this._logger = pino({
      name,
      level: process.env.LOG_LEVEL || `info`,
    });
    this.expressPinoLogger = expressPinoLogger({logger: this._logger});
  }

  info(infoText) {
    this._logger.info(infoText);
  }

  startServer(port) {
    this._logger.info(`Server start on ${port} port`);
  }

  error(errorText) {
    this._logger.error(errorText);
  }

  errorStart(error) {
    this._logger.error(`Server can't start. Error ${error}`);
  }

  getLogger(options = {}) {
    return this._logger.child(options);
  }

  endRequest(req, res) {
    const message = `End ${req.method} request to url ${req.originalUrl} with status code ${res.statusCode}`;
    if (res.statusCode > HttpCodes.BAD_REQUEST) {
      this._logger.error(message);
    } else {
      this._logger.info(message);
    }
  }
}

module.exports = LoggerCenter;
