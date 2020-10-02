'use strict';

const {EModelName} = require(`./name-space`);


const EArticleFieldName = {
  ID: `id`,
  TITLE: `title`,
  ANNOUNCE: `announce`,
  TEXT: `text`,
  IMAGE: `image`,
  DATE: `createdAt`,
};

const getArticleModel = (sequelize, DataTypes) => {
  class Article extends sequelize.Sequelize.Model {}
  Article.init({
    [EArticleFieldName.TITLE]: {
      type: new DataTypes.STRING(250),
      allowNull: false,
    },
    [EArticleFieldName.ANNOUNCE]: {
      type: new DataTypes.STRING(250),
      allowNull: false,
    },
    [EArticleFieldName.TEXT]: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    [EArticleFieldName.IMAGE]: {
      type: new DataTypes.STRING(150),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.ARTICLES,
    timestamp: true,
    paranoid: true,
  });
  return Article;
};

module.exports = {
  getArticleModel,
  EArticleFieldName,
};
