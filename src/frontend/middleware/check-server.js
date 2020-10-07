'use strict';

const {checkerAdapter} = require(`../adapters`);

module.exports = async (req, res, next) => {
  const isAvailableServer = await checkerAdapter.server();
  console.log(isAvailableServer);
  if (isAvailableServer) {
    next();
  } else {
    next(`Сервер недоступен`);
  }
};
