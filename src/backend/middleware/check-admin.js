'use strict';

const HttpCodes = require(`http-status-codes`);

const {middlewareMessages} = require(`../messages`);


const {ACCESS_DENIED, USER_DOES_NOT_EXIST} = middlewareMessages.CheckAdmin;

module.exports = async (req, res, next) => {
  const {account} = req.locals;
  if (!account) {
    res.status(HttpCodes.BAD_REQUEST).send({message: USER_DOES_NOT_EXIST});
    return;
  }
  if (!account.isAdmin) {
    res.status(HttpCodes.FORBIDDEN).send({message: ACCESS_DENIED});
    return;
  }
  next();
};
