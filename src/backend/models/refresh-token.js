'use strict';

const {backendParams} = require(`../../common/params`);
const {EModelName} = require(`./name-space`);


const ERefreshTokenFieldName = {
  TOKEN: `token`,
};

const getRefreshTokenModel = (sequelize, DataTypes) => {
  class RefreshToken extends sequelize.Sequelize.Model {}
  RefreshToken.init({
    [ERefreshTokenFieldName.TOKEN]: {
      type: new DataTypes.STRING(backendParams.db.token.MAX_TOKEN_SYMBOL_COUNT)
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
