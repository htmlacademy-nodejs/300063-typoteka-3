'use strict';

const {ArticleRoute} = require(`./article`);
const {ArticlesRoute} = require(`./articles`);
const {CategoriesRoute} = require(`./categories`);
const {CategoryRoute} = require(`./category`);
const {CheckServerRoute} = require(`./check-server`);
const {CommentsRoute} = require(`./comments`);
const {CommentRoute} = require(`./comment`);
const {UserRoute} = require(`./user`);
const {UsersRoute} = require(`./users`);
const {LoginRoute} = require(`./login`);
const {LogoutRoute} = require(`./logout`);
const {RefreshRoute} = require(`./refresh`);


module.exports = {
  ArticleRoute,
  ArticlesRoute,
  CategoriesRoute,
  CategoryRoute,
  CheckServerRoute,
  CommentsRoute,
  CommentRoute,
  UserRoute,
  UsersRoute,
  LoginRoute,
  LogoutRoute,
  RefreshRoute,
};
