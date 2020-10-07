'use strict';

const bcrypt = require(`bcrypt`);
const HttpCodes = require(`http-status-codes`);

const {commonParams} = require(`../../../common/params`);
const {db} = require(`../../db`);
const {EAccountFieldName} = require(`../../models`);


const SALT_ROUND = +process.env.SALT_ROUND || commonParams.SALT_ROUND;

class ApiUsers {
  constructor() {
    this.post = this.post.bind(this);
  }

  async post(req, res) {
    const {firstname, lastname, email, avatar = ``, password} = req.body;
    const errorMessages = await this._getErrorsOfParamsCheck(req);
    if (errorMessages.length !== 0) {
      res.status(HttpCodes.BAD_REQUEST).send({errorMessages});
      return;
    }
    const userCount = await db.Account.count();
    const hash = await bcrypt.hash(password, SALT_ROUND);
    const user = await db.Account.create({
      [EAccountFieldName.FIRSTNAME]: firstname,
      [EAccountFieldName.LASTNAME]: lastname,
      [EAccountFieldName.EMAIL]: email,
      [EAccountFieldName.AVATAR]: avatar,
      [EAccountFieldName.PASSWORD]: hash,
      isAdmin: userCount === 0,
    });
    res.status(HttpCodes.OK).send({
      [EAccountFieldName.ID]: user[EAccountFieldName.ID],
      [EAccountFieldName.FIRSTNAME]: user[EAccountFieldName.FIRSTNAME],
      [EAccountFieldName.LASTNAME]: user[EAccountFieldName.LASTNAME],
      [EAccountFieldName.EMAIL]: user[EAccountFieldName.EMAIL],
      [EAccountFieldName.AVATAR]: user[EAccountFieldName.AVATAR],
      [EAccountFieldName.isAdmin]: user[EAccountFieldName.IS_ADMIN],
    });
  }

  async _getErrorsOfParamsCheck(req) {
    const {email, password, repeatedPassword} = req.body;
    const userCountWithEmail = await db.Account.count({
      where: {
        [EAccountFieldName.EMAIL]: email
      }
    });
    const errorMessages = [];
    if (password !== repeatedPassword) {
      errorMessages.push(`Пароли не совпадают`);
    }
    if (userCountWithEmail) {
      errorMessages.push(`Пользователь с таким email уже существует`);
    }
    return errorMessages;
  }
}

module.exports = ApiUsers;
