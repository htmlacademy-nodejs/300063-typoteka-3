'use strict';

const Joi = require(`@hapi/joi`);

const {backendParams} = require(`../../common/params`);
const {schemaMessages} = require(`../messages`);
const {ECategoryFieldName} = require(`../models`);


const {MIN_TITLE_SYMBOL_COUNT, MAX_TITLE_SYMBOL_COUNT} = backendParams.db.category;

module.exports = Joi.object({
  [ECategoryFieldName.TITLE]: Joi.string()
    .min(MIN_TITLE_SYMBOL_COUNT)
    .max(MAX_TITLE_SYMBOL_COUNT)
    .required()
    .messages({
      'any.required': schemaMessages.Category.REQUIRED_TITLE_FIELD,
      'string.empty': schemaMessages.Category.REQUIRED_TITLE_FIELD,
      'string.min': schemaMessages.Category.MIN_TITLE_LENGTH,
      'string.max': schemaMessages.Category.MAX_TITLE_LENGTH,
    }),
});
