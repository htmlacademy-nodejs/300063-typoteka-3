'use strict';

const date = require(`./date`);
const account = require(`./account`);
const article = require(`./article`);
const comment = require(`./comment`);


module.exports = {
  ...date,
  ...account,
  ...article,
  ...comment,
};
