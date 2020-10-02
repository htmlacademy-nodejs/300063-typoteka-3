'use strict';

const bcrypt = require(`bcrypt`);
const httpCodes = require(`http-status-codes`);

const {db} = require(`../db`);


module.exports = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await db.Account.findOne({
    where: {email},
    raw: true,
  });
  if (!user) {
    res.status(httpCodes.FORBIDDEN)
      .json({
        errorMessages: [`LoginMessage.USER_NOT_EXISTS`],
      });
    return;
  }
  const isPasswordCompare = await bcrypt.compare(password, user.password.trim());
  if (!isPasswordCompare) {
    res.status(httpCodes.FORBIDDEN)
      .json({
        errorMessages: [`LoginMessage.WRONG_PASSWORD`],
      });
    return;
  }

  res.locals.user = {id: user.id};
  next();
};
