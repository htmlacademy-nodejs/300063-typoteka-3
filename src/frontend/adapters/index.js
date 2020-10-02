'use strict';

const account = require(`./account`);
const article = require(`./article`);
const category = require(`./category`);
const comment = require(`./comment`);


module.exports = {
  ...account,
  ...article,
  ...category,
  ...comment,
};
