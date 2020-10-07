'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);

const {db} = require(`../db`);
const {middlewareMessages} = require(`../messages`);


const {USER_NOT_EXISTS, WRONG_PASSWORD} = middlewareMessages.Authenticate;

module.exports = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await db.Account.findOne({
    where: {email},
    raw: true,
  });
  if (!user) {
    res.status(HttpCodes.FORBIDDEN)
      .json({
        errorMessages: [USER_NOT_EXISTS],
      });
    return;
  }
  const isPasswordCompare = await bcrypt.compare(password, user.password.trim());
  if (!isPasswordCompare) {
    res.status(HttpCodes.FORBIDDEN)
      .json({
        errorMessages: [WRONG_PASSWORD],
      });
    return;
  }

  res.locals.user = {id: user.id};
  next();
};
