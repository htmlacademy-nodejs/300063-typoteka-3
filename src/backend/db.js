'use strict';

const {Sequelize} = require(`sequelize`);

const {ExitCode} = require(`common/params`);
const {logger} = require(`backend/utils`);


const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
});

const initDb = async () => {
  await sequelize.sync()
    .catch((error) => {
      logger.error(`DB connection error ${error}`);
      process.exit(ExitCode.ERROR);
    });
  logger.info(`DB connected successfully`);
};

module.exports = {
  sequelize,
  initDb,
};
