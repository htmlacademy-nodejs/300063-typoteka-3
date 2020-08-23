'use strict';


module.exports = (sequelize, DataTypes) => {
  class Article extends sequelize.Sequelize.Model {}
  Article.init({
    title: {
      type: new DataTypes.STRING(250),
      allowNull: false,
    },
    announce: {
      type: new DataTypes.STRING(250),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image: {
      type: new DataTypes.STRING(150),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `articles`,
    timestamp: true,
    paranoid: true,
  });
  return Article;
};
