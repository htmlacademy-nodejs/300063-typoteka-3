'use strict';

const {accountAdapter} = require(`../../adapters`);
const routeName = require(`../../route-name`);


class LogoutRoute {
  constructor() {
    this.get = this.get.bind(this);
  }

  async get(req, res) {
    const {headers} = req;
    await accountAdapter.logout({
      headers,
    });
    res.clearCookie(`accessToken`);
    res.clearCookie(`refreshToken`);
    res.redirect(`/${routeName.LOGIN}`);
  }
}

module.exports = LogoutRoute;
