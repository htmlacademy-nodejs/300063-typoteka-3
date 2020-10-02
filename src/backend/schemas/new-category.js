'use strict';

const Joi = require(`@hapi/joi`);

const {schemaMessages} = require(`../messages`);


module.exports = Joi.object({
  title: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      'any.required': schemaMessages.Category.REQUIRED_FIELD,
      'string.empty': schemaMessages.Category.REQUIRED_FIELD,
      'string.min': schemaMessages.Category.MIN_TITLE_LENGTH,
      'string.max': schemaMessages.Category.MAX_TITLE_LENGTH,
    }),
});
