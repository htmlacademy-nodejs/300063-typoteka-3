'use strict';

const version = require(`./version`);
const help = require(`./help`);
const generate = require(`./generate`);


const Cli = {
  [version.name]: version,
  [version.alias]: version,
  [help.name]: help,
  [help.alias]: help,
  [generate.name]: generate,
  [generate.alias]: generate,
};

module.exports = {
  Cli,
};
