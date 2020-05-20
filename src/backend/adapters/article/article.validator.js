'use strict';

const articleParams = require(`./params`);


class ArticleValidator {
  checkRequestField(req) {
    const propertyList = Object.keys(req.body);
    return {
      extra: propertyList.filter((property) => !articleParams.requestPropertyList.includes(property)),
      required: articleParams.requestPropertyList.filter((property) => !req.body[property]),
    };
  }
}

module.exports = new ArticleValidator();
