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
        `js/main.js`,
        `js/avatar.js`
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

    const path = this._getPath(createdUserRes, userParams);
    res.redirect(path);
    logger.endRequest(req, res);
  }

  _parseQueryParams(req) {
    const {user, errorMessages} = req.query;
    return {
      user: user && JSON.parse(user) || {},
      errorMessages: errorMessages && JSON.parse(errorMessages),
    };
  }

  _getPath(userRes, userParams) {
    let path = `/${routeName.LOGIN}`;
    if (userRes.content && userRes.content.errorMessages) {
      const query = getQueryString({
        user: JSON.stringify(userParams),
        errorMessages: JSON.stringify(userRes.content.errorMessages),
      });
      path = `/${routeName.REGISTER}?${query}`;
    }
    return path;
  }
}

module.exports = RegisterRoute;
