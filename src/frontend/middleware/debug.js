'use strict';

const debug = require(`debug`);


const log = debug(`frontend`);

module.exports = (req, res, next) => {
  log(`Start ${req.method} request to url ${req.url}`);
  next();
};
