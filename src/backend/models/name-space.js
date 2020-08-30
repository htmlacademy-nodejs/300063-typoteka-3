'use strict';

const EModelName = {
  ACCOUNTS: `Accounts`,
  ACCOUNT_TYPES: `AccountTypes`,
  ARTICLES: `Articles`,
  CATEGORIES: `Categories`,
  COMMENTS: `Comments`,
  ARTICLE_CATEGORY: `articleCategory`,
};

const EForeignKey = {
  ACCOUNT_TYPE_ID: `accountTypeId`,
  ACCOUNT_ID: `accountId`,
  ARTICLE_ID: `articleId`,
  CATEGORY_ID: `categoryId`,
};

module.exports = {
  EModelName,
  EForeignKey,
};
