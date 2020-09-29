'use strict';

const {backendParams} = require(`../../common/params`);
const {EModelName} = require(`./name-space`);


const {
  MAX_FIRSTNAME_SYMBOL_COUNT,
  MAX_LASTNAME_SYMBOL_COUNT,
  MAX_EMAIL_SYMBOL_COUNT,
  MAX_AVATAR_SYMBOL_COUNT,
  PASSWORD_SYMBOL_COUNT,
} = backendParams.db.account;

const EAccountFieldName = {
  ID: `id`,
  FIRSTNAME: `firstname`,
  LASTNAME: `lastname`,
  EMAIL: `email`,
  AVATAR: `avatar`,
  PASSWORD: `password`,
  IS_ADMIN: `isAdmin`
};

const getAccountModel = (sequelize, DataTypes) => {
  class Account extends sequelize.Sequelize.Model {}
  Account.init({
    [EAccountFieldName.FIRSTNAME]: {
      type: new DataTypes.STRING(MAX_FIRSTNAME_SYMBOL_COUNT),
      allowNull: false,
    },
    [EAccountFieldName.LASTNAME]: {
      type: new DataTypes.STRING(MAX_LASTNAME_SYMBOL_COUNT),
      allowNull: false,
    },
    [EAccountFieldName.EMAIL]: {
      type: new DataTypes.STRING(MAX_EMAIL_SYMBOL_COUNT),
      allowNull: false,
    },
    [EAccountFieldName.AVATAR]: {
      type: new DataTypes.STRING(MAX_AVATAR_SYMBOL_COUNT),
      allowNull: false,
    },
    [EAccountFieldName.PASSWORD]: {
      type: new DataTypes.CHAR(PASSWORD_SYMBOL_COUNT),
      allowNull: false,
    },
    [EAccountFieldName.IS_ADMIN]: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: EModelName.ACCOUNTS,
  });
  return Account;
};

module.exports = {
  getAccountModel,
  EAccountFieldName,
};
