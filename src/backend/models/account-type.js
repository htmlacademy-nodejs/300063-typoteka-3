'use strict';

const {EModelName} = require(`./name-space`);


const EAccountTypeFieldName = {
  TITLE: `title`,
};

const getAccountTypeModel = (sequelize, DataTypes) => {
  class AccountType extends sequelize.Sequelize.Model {}
  AccountType.init({
    [EAccountTypeFieldName.TITLE]: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.ACCOUNT_TYPES,
  });
  return AccountType;
};

module.exports = {
  getAccountTypeModel,
  EAccountTypeFieldName,
};
