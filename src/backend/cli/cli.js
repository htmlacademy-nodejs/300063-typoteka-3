'use strict';

require(`dotenv`).config();

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);
const server = require(`./server`);
const fillDb = require(`./filldb`);
const initDb = require(`./initdb`);

module.exports = {
  [version.name]: version,
  [version.alias]: version,
  [help.name]: help,
  [help.alias]: help,
  [generate.name]: generate,
  [generate.alias]: generate,
  [server.name]: server,
  [server.alias]: server,
  [fillDb.name]: fillDb,
  [fillDb.alias]: fillDb,
  [initDb.name]: initDb,
  [initDb.alias]: initDb,
};
