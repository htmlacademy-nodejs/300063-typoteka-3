'use strict';

const {accountAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {getQueryString, logger} = require(`../../utils`);


class RegisterRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {errorMessages, user} = this._parseQueryParams(req);
    const content = {
      title: `Типотека`,
      user,
      scriptList: [
        `js/main.js`
      ],
      errorMessages,
    };
    res.render(`pages/register`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {firstname, lastname, email, password, repeatedPassword, avatar} = req.body;
    const userParams = {
      firstname,
      lastname,
      email,
      avatar,
    };
    const createdUserRes = await accountAdapter.addItem({
      ...userParams,
      password,
      repeatedPassword,
    });

    let path = `/${routeName.LOGIN}`;
    if (createdUserRes.content && createdUserRes.content.errorMessages) {
      const query = getQueryString({
        user: JSON.stringify(userParams),
        errorMessages: JSON.stringify(createdUserRes.content.errorMessages),
      });
      path = `/${routeName.REGISTER}?${query}`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }

  _parseQueryParams(req) {
    let {user, errorMessages} = req.query;
    return {
      user: user && JSON.parse(user) || {},
      errorMessages: errorMessages && JSON.parse(errorMessages),
    };
  }
}

module.exports = RegisterRoute;
