'use strict';

const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../common/params`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || commonParams.JWT_ACCESS_SECRET_DEFAULT;
let JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || commonParams.JWT_REFRESH_SECRET_DEFAULT;
const MAX_AGE_ACCESS_TOKEN_COOKIE = process.env.MAX_AGE_ACCESS_TOKEN_COOKIE || commonParams.MAX_AGE_ACCESS_TOKEN_COOKIE;

module.exports = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: `${MAX_AGE_ACCESS_TOKEN_COOKIE}ms`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  return {accessToken, refreshToken};
};
