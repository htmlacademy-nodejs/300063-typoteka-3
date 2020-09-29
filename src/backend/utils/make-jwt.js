'use strict';

const jwt = require(`jsonwebtoken`);

const {backendParams} = require(`../../common/params`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || backendParams.JWT_ACCESS_SECRET_DEFAULT;
let JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || backendParams.JWT_REFRESH_SECRET_DEFAULT;

module.exports = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: `15m`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  return {accessToken, refreshToken};
};
