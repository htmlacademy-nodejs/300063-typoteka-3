'use strict';

const {ApiArticle} = require(`./article`);
const {ApiArticles} = require(`./articles`);
const {ApiCategories} = require(`./categories`);
const {ApiCategory} = require(`./category`);
const {ApiCheckServer} = require(`./check-server`);
const {ApiComments} = require(`./comments`);
const {ApiComment} = require(`./comment`);
const {ApiUser} = require(`./user`);
const {ApiUsers} = require(`./users`);
const {ApiLogin} = require(`./login`);
const {ApiLogout} = require(`./logout`);
const {ApiRefresh} = require(`./refresh`);


module.exports = {
  ApiArticle,
  ApiArticles,
  ApiCategories,
  ApiCategory,
  ApiCheckServer,
  ApiComments,
  ApiComment,
  ApiUser,
  ApiUsers,
  ApiLogin,
  ApiLogout,
  ApiRefresh,
};
