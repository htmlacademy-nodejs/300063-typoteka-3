'use strict';

const {accountAdapter} = require(`../../../adapters`);
const {logger} = require(`../../../utils`);


module.exports = async (req, res) => {
  const {email, password} = req.body;
  const loginCookies = await accountAdapter.login({
    email,
    password,
  });
  if (loginCookies.status === `failed`) {
    res.redirect(`/login`);
  }
  res.set(`set-cookie`, loginCookies);
  res.redirect(`/`);
  logger.endRequest(req, res);
};
