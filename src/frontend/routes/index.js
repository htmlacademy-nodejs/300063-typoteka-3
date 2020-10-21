'use strict';

const {
  AddArticleRoute,
  ArticleRoute,
  CategoriesRoute,
  CategoryRoute,
  CommentRoute,
  CommentsRoute,
  EditArticleRoute,
  PublicationsRoute,
} = require(`./admin`);
const {
  ArticlesByCategoryRoute,
  MainRoute,
  SearchRoute,
} = require(`./common`);
const {
  NotFoundRoute,
  InternalServerErrorRoute,
} = require(`./errors`);
const {
  LoginRoute,
  LogoutRoute,
  RegisterRoute,
} = require(`./user`);


module.exports = {
  AddArticleRoute,
  ArticleRoute,
  ArticlesByCategoryRoute,
  CategoriesRoute,
  CategoryRoute,
  CommentRoute,
  CommentsRoute,
  EditArticleRoute,
  InternalServerErrorRoute,
  LoginRoute,
  LogoutRoute,
  MainRoute,
  NotFoundRoute,
  PublicationsRoute,
  RegisterRoute,
  SearchRoute,
};
