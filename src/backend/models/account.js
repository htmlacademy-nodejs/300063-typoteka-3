'use strict';

module.exports = (sequelize, DataTypes) => {
  class Account extends sequelize.Sequelize.Model {}
  Account.init({
    firstname: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    lastname: {
      type: new DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    avatar: {
      type: new DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: new DataTypes.CHAR(255),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: `accounts`,
    timestamp: true,
    paranoid: true,
  });
  return Account;
};
