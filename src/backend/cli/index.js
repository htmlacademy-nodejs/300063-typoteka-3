'use strict';

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);
const server = require(`./server`);


const Cli = {
  [version.name]: version,
  [version.alias]: version,
  [help.name]: help,
  [help.alias]: help,
  [generate.name]: generate,
  [generate.alias]: generate,
  [server.name]: server,
  [server.alias]: server,
};

module.exports = {
  Cli,
};
