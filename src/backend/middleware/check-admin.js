'use strict';

const httpCodes = require(`http-status-codes`);

const {middlewareMessages} = require(`../messages`);


const {ACCESS_DENIED, USER_DOES_NOT_EXIST} = middlewareMessages.CheckAdmin;

module.exports = async (req, res, next) => {
  const {account} = req.locals;
  if (!account) {
    res.status(httpCodes.BAD_REQUEST).send({message: USER_DOES_NOT_EXIST});
    return;
  }
  if (!account.isAdmin) {
    res.status(httpCodes.FORBIDDEN).send({message: ACCESS_DENIED});
    return;
  }
  next();
};
