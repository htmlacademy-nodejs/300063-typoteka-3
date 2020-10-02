'use strict';

const {AppBuilder} = require(`../common`);
const apiConfig = require(`./api-config`);

const apiContainer = new AppBuilder(apiConfig);

module.exports = {
  apiContainer,
};
