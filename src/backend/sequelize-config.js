'use strict';

const {commonParams} = require(`../common/params`);


const environment = process.env.NODE_ENV || `development`;

const config = {
  development: {
    database: process.env.DEV_DATABASE,
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT,
    username: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
    dialect: process.env.DB_DRIVER || commonParams.DEFAULT_DB_DRIVER,
    logging: true,
  },
  test: {
    database: process.env.TEST_DATABASE,
    host: process.env.TEST_HOST,
    port: process.env.TEST_PORT,
    username: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD,
    dialect: process.env.DB_DRIVER || commonParams.DEFAULT_DB_DRIVER,
    logging: false,
  },
};

module.exports = config[environment];
