'use strict';

const httpCodes = require(`http-status-codes`);
const jwt = require(`jsonwebtoken`);

const {commonParams} = require(`../../common/params`);
const {db} = require(`../db`);


let JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || commonParams.JWT_ACCESS_SECRET_DEFAULT;

module.exports = async (req, res, next) => {
  const {accessToken} = req.cookies;
  await jwt.verify(accessToken, JWT_ACCESS_SECRET, async (error, accountData) => {
    const {id} = accountData;
    const account = await db.Account.findByPk(id);
    if (!account) {
      res.status(httpCodes.BAD_REQUEST).send({message: `Пользователя с ${id} ID не существует`});
      return;
    }
    if (!account.isAdmin) {
      res.status(httpCodes.FORBIDDEN).send({message: `Недостаточно прав`});
      return;
    }
    next();
  });
};
