'use strict';

const {checkerAdapter} = require(`../adapters`);


module.exports = async (req, res, next) => {
  const isAvailableServer = await checkerAdapter.monitorServer();
  if (isAvailableServer) {
    next();
  } else {
    next(`Сервер недоступен`);
  }
};
