'use strict';

const {accountAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {logger} = require(`../../utils`);


class LoginRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const content = {
      title: `Типотека`,
      error: {
        email: false,
        password: false,
      },
    };
    res.render(`pages/login`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {email, password} = req.body;
    const loginCookies = await accountAdapter.login({
      email,
      password,
    });
    if (loginCookies.status === `failed`) {
      res.redirect(`/${routeName.LOGIN}`);
    }
    res.set(`set-cookie`, loginCookies);
    res.redirect(routeName.MAIN);
    logger.endRequest(req, res);
  }
}

module.exports = LoginRoute;
