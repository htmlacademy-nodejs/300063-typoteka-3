'use strict';

const HttpCodes = require(`http-status-codes`);


module.exports = async (req, res) => {
  res.status(HttpCodes.OK).send();
};
