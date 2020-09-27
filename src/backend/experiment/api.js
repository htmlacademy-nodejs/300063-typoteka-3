'use strict';

const {ApiBuilder} = require(`../../common`);
const apiConfig = require(`./api-config`);

module.exports = new ApiBuilder(apiConfig);
