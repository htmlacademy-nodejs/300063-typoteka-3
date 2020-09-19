'use strict';

const {EModelName} = require(`./name-space`);


const ECategoryFieldName = {
  ID: `id`,
  TITLE: `title`,
};

const getCategoryModel = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {}
  Category.init({
    [ECategoryFieldName.TITLE]: {
      type: new DataTypes.STRING(30),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.CATEGORIES,
  });
  return Category;
};

module.exports = {
  getCategoryModel,
  ECategoryFieldName,
};
