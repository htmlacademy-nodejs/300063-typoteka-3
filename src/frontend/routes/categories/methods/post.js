'use strict';

const {categoryAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {title} = req.body;
  console.log(title);
  const aaa = await categoryAdapter.addItem({title});
  console.log(aaa);
  res.redirect(`/categories`);
  logger.endRequest(req, res);
};
