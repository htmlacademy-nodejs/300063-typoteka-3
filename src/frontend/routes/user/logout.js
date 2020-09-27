'use strict';

const {accountAdapter} = require(`../../adapters`);


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
    res.redirect(`/login`);
  }
}

module.exports = LogoutRoute;
