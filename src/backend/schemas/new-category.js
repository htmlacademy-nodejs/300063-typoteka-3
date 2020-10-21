'use strict';

const Joi = require(`@hapi/joi`);

const {backendParams} = require(`../../common/params`);
const {schemaMessages} = require(`../messages`);
const {ECategoryFieldName} = require(`../models`);


const {
  MIN_TITLE_SYMBOL_COUNT,
  MAX_TITLE_SYMBOL_COUNT,
} = backendParams.db.Category;
const {
  REQUIRED_TITLE_FIELD,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
} = schemaMessages.Category;

module.exports = Joi.object({
  [ECategoryFieldName.TITLE]: Joi.string()
    .min(MIN_TITLE_SYMBOL_COUNT)
    .max(MAX_TITLE_SYMBOL_COUNT)
    .required()
    .messages({
      'any.required': REQUIRED_TITLE_FIELD,
      'string.empty': REQUIRED_TITLE_FIELD,
      'string.min': MIN_TITLE_LENGTH,
      'string.max': MAX_TITLE_LENGTH,
    }),
});
