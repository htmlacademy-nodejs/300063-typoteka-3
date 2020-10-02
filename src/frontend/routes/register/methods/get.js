'use strict';

const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const content = {
    title: `Типотека`,
    error: {
      email: false,
      password: false,
    },
  };
  res.render(`pages/register`, content);
  logger.endRequest(req, res);
};
