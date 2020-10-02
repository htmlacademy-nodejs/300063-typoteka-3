'use strict';

const debugMiddleware = require(`./debug.middleware`);
const queryParamsMiddleware = require(`./query-params`);


module.exports = {
  debugMiddleware,
  queryParamsMiddleware,
};
