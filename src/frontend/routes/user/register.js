'use strict';

const {accountAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger} = require(`../../utils`);


class RegisterRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {errorMessages} = req.locals || {};
    const user = req.locals && req.locals.user || {
      firstname: ``,
      lastname: ``,
      email: ``,
      avatar: ``,
    };
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
      const queryParams = {
        user: userParams,
        errorMessages: createdUserRes.content.errorMessages,
      };
      const query = encodeURIComponent(JSON.stringify(queryParams));
      path = `/${routeName.REGISTER}?params=${query}`;
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }
}

module.exports = RegisterRoute;
