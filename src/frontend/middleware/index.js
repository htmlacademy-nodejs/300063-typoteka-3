'use strict';

const accountByTokenMiddleware = require(`./account-by-token`);
const authenticationJwtMiddleware = require(`./authenticate-jwt`);
const checkAdminMiddleware = require(`./check-admin`);
const debugMiddleware = require(`./debug.middleware`);
const localsMiddleware = require(`./locals`);
const queryParamsMiddleware = require(`./query-params`);
const unauthorizedMiddleware = require(`./unauthorized`);


module.exports = {
  accountByTokenMiddleware,
  authenticationJwtMiddleware,
  checkAdminMiddleware,
  debugMiddleware,
  localsMiddleware,
  queryParamsMiddleware,
  unauthorizedMiddleware,
};
