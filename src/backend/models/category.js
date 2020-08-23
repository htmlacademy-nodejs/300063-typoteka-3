'use strict';


module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {}
  Category.init({
    title: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `categories`,
    timestamp: true,
    paranoid: true,
  });
  return Category;
};
