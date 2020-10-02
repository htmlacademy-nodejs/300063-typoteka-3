'use strict';

const {EModelName} = require(`./name-space`);


const ERefreshTokenFieldName = {
  TOKEN: `token`,
};

const getRefreshTokenModel = (sequelize, DataTypes) => {
  class RefreshToken extends sequelize.Sequelize.Model {}
  RefreshToken.init({
    [ERefreshTokenFieldName.TOKEN]: {
      type: new DataTypes.STRING(1000)
    }
  }, {
    sequelize,
    modelName: EModelName.REFRESH_TOKENS,
  });
  return RefreshToken;
};

module.exports = {
  getRefreshTokenModel,
  ERefreshTokenFieldName,
};
