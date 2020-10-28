'use strict';

require(`dotenv`).config();

const deleteDb = require(`./delete-db`);
const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);
const server = require(`./server`);
const fillDb = require(`./fill-db`);
const initDb = require(`./init-db`);
const initDbTables = require(`./init-db-tables`);


module.exports = {
  [deleteDb.name]: deleteDb,
  [deleteDb.alias]: deleteDb,
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
  [initDbTables.name]: initDbTables,
  [initDbTables.alias]: initDbTables,
};
