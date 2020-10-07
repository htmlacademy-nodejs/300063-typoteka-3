'use strict';

const {backendParams} = require(`../../common/params`);
const {EModelName} = require(`./name-space`);


const ECategoryFieldName = {
  ID: `id`,
  TITLE: `title`,
};

const getCategoryModel = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {}
  Category.init({
    [ECategoryFieldName.TITLE]: {
      type: new DataTypes.STRING(backendParams.db.Category.MAX_TITLE_SYMBOL_COUNT),
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
