'use strict';

const date = require(`./date`);
const account = require(`./account`);
const article = require(`./article`);
const comment = require(`./comment`);
const file = require(`./file`);


module.exports = {
  ...date,
  ...account,
  ...article,
  ...comment,
  ...file,
};
