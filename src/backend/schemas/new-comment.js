'use strict';

const Joi = require(`@hapi/joi`);

const {schemaMessages} = require(`../messages`);


module.exports = Joi.object({
  text: Joi.string()
    .max(1000)
    .required()
    .messages({
      'string.max': schemaMessages.Article.MAX_TEXT_LENGTH,
      'any.required': schemaMessages.Common.EMPTY_VALUE,
    }),
});
