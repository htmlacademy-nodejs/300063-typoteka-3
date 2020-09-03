'use strict';

const {Sequelize} = require(`sequelize`);

const {DB_DRIVER, ExitCode} = require(`common/params`);
const {logger} = require(`backend/utils`);


const sequelize = new Sequelize({
  dialect: process.env.DB_DRIVER || DB_DRIVER,
});

const initDb = async () => {
  logger.info(`DB is connecting...`);
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
