'use strict';

const initAppSocket = require(`./init`);
const {appSocket} = require(`./socket`);
const EntityName = require(`./entity-name`);

module.exports = {
  initAppSocket,
  appSocket,
  EntityName,
};
