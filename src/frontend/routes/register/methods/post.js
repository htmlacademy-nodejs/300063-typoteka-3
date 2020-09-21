'use strict';

const {logger} = require(`../../../utils`);
const {accountAdapter, FileAdapter} = require(`../../../adapters`);


const setFileName = async (req) => {
  if (!req.file) {
    return;
  }
  req.body.avatar = await FileAdapter.download(req.file);
  console.log(req.body.avatar);
};

module.exports = async (req, res) => {
  await setFileName(req);
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

  let path = `/register`;
  if (createdUserRes.content && createdUserRes.content.errorMessages) {
    const queryParams = {
      user: userParams,
      errorMessages: createdUserRes.content.errorMessages,
    };
    const query = encodeURIComponent(JSON.stringify(queryParams));
    path = `/register?params=${query}`;
  }
  res.redirect(path);
  logger.endRequest(req, res);
};
