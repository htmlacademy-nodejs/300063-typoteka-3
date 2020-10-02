'use strict';

const {backendParams} = require(`../../common/params`);
const {EModelName} = require(`./name-space`);


const {
  MAX_TITLE_SYMBOL_COUNT,
  MAX_ANNOUNCE_SYMBOL_COUNT,
  MAX_IMAGE_NAME_SYMBOL_COUNT,
} = backendParams.db.article;

const EArticleFieldName = {
  ID: `id`,
  TITLE: `title`,
  ANNOUNCE: `announce`,
  TEXT: `text`,
  IMAGE: `image`,
  DATE: `date`,
};

const getArticleModel = (sequelize, DataTypes) => {
  class Article extends sequelize.Sequelize.Model {}
  Article.init({
    [EArticleFieldName.TITLE]: {
      type: new DataTypes.STRING(MAX_TITLE_SYMBOL_COUNT),
      allowNull: false,
    },
    [EArticleFieldName.ANNOUNCE]: {
      type: new DataTypes.STRING(MAX_ANNOUNCE_SYMBOL_COUNT),
      allowNull: false,
    },
    [EArticleFieldName.TEXT]: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    [EArticleFieldName.IMAGE]: {
      type: new DataTypes.STRING(MAX_IMAGE_NAME_SYMBOL_COUNT),
      allowNull: false,
    },
    [EArticleFieldName.DATE]: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.ARTICLES,
  });
  return Article;
};

module.exports = {
  getArticleModel,
  EArticleFieldName,
};
