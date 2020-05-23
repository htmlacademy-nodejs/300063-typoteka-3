'use strict';

const {logger} = require(`frontend/utils`);
const {accountAdapter} = require(`frontend/adapters`);


module.exports = async (req, res) => {
  const content = {
    type: `add`,
    article: {
      id: ``,
      title: ``,
      announce: ``,
      fullText: ``,
      createdDate: ``,
      category: [],
    },
    account: accountAdapter.getAuth(),
    scriptList: [
      `js/vendor.js`,
      `js/main.js`
    ],
  };
  res.render(`pages/articles/edit`, content);
  logger.endRequest(req, res);
};
