'use strict';

const httpCodes = require(`http-status-codes`);


module.exports = async (req, res, next) => {
  const {account} = req.locals;
  if (!account) {
    res.status(httpCodes.BAD_REQUEST).send({message: `Пользователя не существует`});
    return;
  }
  if (!account.isAdmin) {
    res.status(httpCodes.FORBIDDEN).send({message: `Недостаточно прав`});
    return;
  }
  next();
};
