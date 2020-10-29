'use strict';

const {commonParams} = require(`../../common/params`);


const environment = process.env.NODE_ENV || commonParams.MODE;
const dbParamsMap = {
  development: {
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT,
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
  },
  test: {
    database: process.env.TEST_DATABASE,
    host: process.env.TEST_HOST,
    port: process.env.TEST_PORT,
    username: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD,
  },
};

module.exports = () => dbParamsMap[environment];
