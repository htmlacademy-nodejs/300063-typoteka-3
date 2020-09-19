'use strict';

const {EModelName} = require(`./name-space`);


const EAccountFieldName = {
  ID: `id`,
  FIRSTNAME: `firstname`,
  LASTNAME: `lastname`,
  EMAIL: `email`,
  AVATAR: `avatar`,
  PASSWORD: `password`,
};

const getAccountModel = (sequelize, DataTypes) => {
  class Account extends sequelize.Sequelize.Model {}
  Account.init({
    [EAccountFieldName.FIRSTNAME]: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    [EAccountFieldName.LASTNAME]: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    [EAccountFieldName.EMAIL]: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    [EAccountFieldName.AVATAR]: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    [EAccountFieldName.PASSWORD]: {
      type: new DataTypes.CHAR(255),
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
