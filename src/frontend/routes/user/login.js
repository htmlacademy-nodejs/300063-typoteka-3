'use strict';

const {accountAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);
const {getQueryString, logger} = require(`../../utils`);


class LoginRoute {
  constructor() {
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
  }

  async get(req, res) {
    const {authParams, errorMessages} = this._parseQueryParams(req);
    const content = {
      title: `Типотека`,
      authParams,
      errorMessages
    };
    res.render(`pages/login`, content);
    logger.endRequest(req, res);
  }

  async post(req, res) {
    const {email, password} = req.body;
    const loginRes = await accountAdapter.login({
      email,
      password,
    });
    let path = `/${routeName.MAIN}`;
    if (loginRes.content && loginRes.content.errorMessages) {
      const query = getQueryString({
        authParams: JSON.stringify({email}),
        errorMessages: JSON.stringify(loginRes.content.errorMessages),
      });
      path = `/${routeName.LOGIN}?${query}`;
    } else {
      res.set(`set-cookie`, loginRes);
    }
    res.redirect(path);
    logger.endRequest(req, res);
  }

  _parseQueryParams(req) {
    let {authParams, errorMessages} = req.query;
    if (authParams) {
      authParams = JSON.parse(authParams);
    }
    if (errorMessages) {
      errorMessages = JSON.parse(errorMessages);
    }
    return {authParams, errorMessages};
  }
}

module.exports = LoginRoute;
