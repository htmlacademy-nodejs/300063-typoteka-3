'use strict';

const {EModelName} = require(`./name-space`);


const ECategoryFieldName = {
  TITLE: `title`,
};

const getCategoryModel = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {}
  Category.init({
    [ECategoryFieldName.TITLE]: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.CATEGORIES,
    timestamp: true,
    paranoid: true,
  });
  return Category;
};

module.exports = {
  getCategoryModel,
  ECategoryFieldName,
};
