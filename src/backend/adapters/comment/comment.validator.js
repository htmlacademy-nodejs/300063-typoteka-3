'use strict';

const commentParams = require(`./params`);


class CommentValidator {
  checkRequestField(req) {
    const propertyList = Object.keys(req.body);
    return {
      extra: propertyList.filter((property) => !commentParams.requestPropertyList.includes(property)),
      required: commentParams.requestPropertyList.filter((property) => !req.body[property]),
    };
  }
}

module.exports = new CommentValidator();
