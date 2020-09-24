'use strict';

const {accountAdapter} = require(`../../../adapters`);

module.exports = async (req, res) => {
  const {headers} = req;
  await accountAdapter.logout({
    headers,
  });
  res.clearCookie(`accessToken`);
  res.clearCookie(`refreshToken`);
  res.redirect(`/login`);
};
