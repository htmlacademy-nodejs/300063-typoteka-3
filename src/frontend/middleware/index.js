'use strict';

const accountByIdMiddleware = require(`./account-by-id`);
const checkAdminMiddleware = require(`./check-admin`);
const debugMiddleware = require(`./debug.middleware`);
const internalServerErrorMiddleware = require(`./internale-server-error`);
const localsMiddleware = require(`./locals`);
const notFoundMiddleware = require(`./not-found`);
const queryParamsMiddleware = require(`./query-params`);
const tokenDetailsMiddleware = require(`./token-details`);
const unauthorizedMiddleware = require(`./unauthorized`);


module.exports = {
  accountByIdMiddleware,
  checkAdminMiddleware,
  debugMiddleware,
  internalServerErrorMiddleware,
  localsMiddleware,
  notFoundMiddleware,
  queryParamsMiddleware,
  tokenDetailsMiddleware,
  unauthorizedMiddleware,
};
