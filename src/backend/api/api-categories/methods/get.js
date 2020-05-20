'use strict';

const HttpCodes = require(`http-status-codes`);

const {categoryAdapter} = require(`backend/adapters`);


module.exports = async (req, res) => {
  console.log(categoryAdapter.getList());
  res.status(HttpCodes.OK).send(categoryAdapter.getList());
};
