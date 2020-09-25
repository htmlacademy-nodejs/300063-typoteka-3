'use strict';

const accountByIdMiddleware = require(`./account-by-id`);
const checkAdminMiddleware = require(`./check-admin`);
const debugMiddleware = require(`./debug.middleware`);
const localsMiddleware = require(`./locals`);
const queryParamsMiddleware = require(`./query-params`);
const tokenDetailsMiddleware = require(`./token-details`);
const unauthorizedMiddleware = require(`./unauthorized`);


module.exports = {
  accountByIdMiddleware,
  checkAdminMiddleware,
  debugMiddleware,
  localsMiddleware,
  queryParamsMiddleware,
  tokenDetailsMiddleware,
  unauthorizedMiddleware,
};
