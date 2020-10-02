'use strict';

const httpCodes = require(`http-status-codes`);
const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../common/params`);
const {db} = require(`../db`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || commonParams.JWT_ACCESS_SECRET_DEFAULT;

module.exports = async (req, res, next) => {
  const {accessToken} = req.cookies;
  if (!accessToken) {
    res.status(httpCodes.BAD_REQUEST).send({message: `Токен доступа отсутствует`});
    return;
  }

  await jwt.verify(accessToken, JWT_ACCESS_SECRET, async (error, accountData) => {
    if (error) {
      res.status(httpCodes.BAD_REQUEST).send({message: `Токен доступа невалиден`});
      return;
    }
    const {id} = accountData;
    const account = await db.Account.findByPk(id);
    if (!account) {
      res.status(httpCodes.BAD_REQUEST).send({message: `Пользователя с ${id} ID не существует`});
      return;
    }
    if (!account.isAdmin) {
      res.status(httpCodes.BAD_REQUEST).send({message: `Недостаточно прав`});
      return;
    }
    next();
  });
};
