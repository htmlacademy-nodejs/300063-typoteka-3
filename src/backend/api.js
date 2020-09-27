'use strict';

const {ApiBuilder} = require(`../common`);
const apiConfig = require(`./api-config`);

const apiContainer = new ApiBuilder(apiConfig);

module.exports = {
  apiContainer,
};
