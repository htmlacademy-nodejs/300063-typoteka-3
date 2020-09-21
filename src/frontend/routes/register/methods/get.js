'use strict';

const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {errorMessages} = req.locals || {};
  const user = req.locals && req.locals.user || {
    firstname: ``,
    lastname: ``,
    email: ``,
    avatar: `icons/smile.svg`,
  };
  const content = {
    title: `Типотека`,
    user,
    scriptList: [
      `js/main.js`
    ],
    errorMessages,
  };
  res.render(`pages/register`, content);
  logger.endRequest(req, res);
};
