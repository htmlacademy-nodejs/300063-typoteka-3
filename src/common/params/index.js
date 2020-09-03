'use strict';

const commonParams = require(`./common`);
const backendParams = require(`./backend`);
const frontendParams = require(`./frontend`);
const ExitCode = require(`./exit-codes`);


module.exports = {
  ...commonParams,
  ...backendParams,
  ...frontendParams,
  ExitCode,
};
