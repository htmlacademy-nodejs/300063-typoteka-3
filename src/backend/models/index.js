'use strict';

const {getAccountModel, EAccountFieldName} = require(`./account`);
const {getArticleModel, EArticleFieldName} = require(`./article`);
const {getCategoryModel, ECategoryFieldName} = require(`./category`);
const {getCommentModel, ECommentFieldName} = require(`./comment`);
const {getRefreshTokenModel, ERefreshTokenFieldName} = require(`./refresh-token`);
const {EModelName, EForeignKey} = require(`./name-space`);

module.exports = {
  getAccountModel,
  getArticleModel,
  getCategoryModel,
  getCommentModel,
  getRefreshTokenModel,
  EAccountFieldName,
  EArticleFieldName,
  ECategoryFieldName,
  ECommentFieldName,
  ERefreshTokenFieldName,
  EForeignKey,
  EModelName,
};
