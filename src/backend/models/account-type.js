'use strict';

module.exports = (sequelize, DataTypes) => {
  class AccountType extends sequelize.Sequelize.Model {}
  AccountType.init({
    title: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `accountTypes`,
    timestamp: true,
    paranoid: true,
  });
  return AccountType;
};
