'use strict';

const getAccountById = require(`./account-by-id`);
const checkAdmin = require(`./check-admin`);
const debug = require(`./debug.middleware`);
const redirectToInternalServerError = require(`./internale-server-error`);
const initializeLocals = require(`./locals`);
const redirectToNotFound = require(`./not-found`);
const parseQueryParams = require(`./query-params`);
const setUniqueFileName = require(`./set-unique-file-name`);
const decryptTokenDetails = require(`./token-details`);
const checkUnauthorized = require(`./unauthorized`);
const uploadFile = require(`./upload`);


module.exports = {
  getAccountById,
  checkAdmin,
  debug,
  redirectToInternalServerError,
  initializeLocals,
  redirectToNotFound,
  parseQueryParams,
  setUniqueFileName,
  decryptTokenDetails,
  checkUnauthorized,
  uploadFile,
};
