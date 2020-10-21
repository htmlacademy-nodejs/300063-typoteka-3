'use strict';

const account = require(`./account`);
const article = require(`./article`);
const category = require(`./category`);
const checker = require(`./checker`);
const comment = require(`./comment`);


module.exports = {
  ...account,
  ...article,
  ...category,
  ...checker,
  ...comment,
};
