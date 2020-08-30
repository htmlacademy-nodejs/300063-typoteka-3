'use strict';

const {getAccountModel, EAccountFieldName} = require(`./account`);
const {getAccountTypeModel, EAccountTypeFieldName} = require(`./account-type`);
const {getArticleModel, EArticleFieldName} = require(`./article`);
const {getCategoryModel, ECategoryFieldName} = require(`./category`);
const {getCommentModel, ECommentFieldName} = require(`./comment`);
const {EModelName, EForeignKey} = require(`./name-space`);

module.exports = {
  getAccountModel,
  getAccountTypeModel,
  getArticleModel,
  getCategoryModel,
  getCommentModel,
  EAccountFieldName,
  EAccountTypeFieldName,
  EArticleFieldName,
  ECategoryFieldName,
  ECommentFieldName,
  EForeignKey,
  EModelName,
};
