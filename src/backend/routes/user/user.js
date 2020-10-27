'use strict';

const HttpCodes = require(`http-status-codes`);

const {db} = require(`../../db`);
const {EAccountFieldName} = require(`../../models`);


class UserRoute {
  async get(req, res) {
    const {userId} = req.params;
    const user = await db.Account.findByPk(userId, {
      attributes: [
        EAccountFieldName.ID,
        EAccountFieldName.FIRSTNAME,
        EAccountFieldName.LASTNAME,
        EAccountFieldName.EMAIL,
        EAccountFieldName.AVATAR,
        EAccountFieldName.IS_ADMIN,
      ],
    });
    res.status(HttpCodes.OK).send(user);
  }
}

module.exports = UserRoute;
