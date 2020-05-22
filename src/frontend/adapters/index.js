'use strict';

const date = require(`./date`);
const account = require(`./account`);
const article = require(`./article`);


module.exports = {
  ...date,
  ...account,
  ...article,
};
