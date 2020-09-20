'use strict';

const bcrypt = require(`bcrypt`);
const httpCodes = require(`http-status-codes`);

const {db} = require(`../../../db`);
const {EAccountFieldName} = require(`../../../models`);

const salt = 10;

const getErrorsOfParamsCheck = async (req) => {
  const {email, password, repeatedPassword} = req.body;
  const userCount = await db.Account.count({
    where: {
      [EAccountFieldName.EMAIL]: email
    }
  });
  const errorMessages = [];
  if (password !== repeatedPassword) {
    errorMessages.push(`Пароли не совпадают`);
  }
  if (userCount) {
    errorMessages.push(`Пользователь с таким email уже существует`);
  }
  return errorMessages;
};

module.exports = async (req, res) => {
  const {firstname, lastname, email, avatar = ``, password} = req.body;
  const errorMessages = await getErrorsOfParamsCheck(req);
  if (errorMessages.length !== 0) {
    res.status(httpCodes.BAD_REQUEST).send({errorMessages});
    return;
  }
  const hash = await bcrypt.hash(password, salt);
  await db.Account.create({
    [EAccountFieldName.FIRSTNAME]: firstname,
    [EAccountFieldName.LASTNAME]: lastname,
    [EAccountFieldName.EMAIL]: email,
    [EAccountFieldName.AVATAR]: avatar,
    [EAccountFieldName.PASSWORD]: hash,
    isAdmin: false,
  });
  res.status(httpCodes.OK).send();
};
