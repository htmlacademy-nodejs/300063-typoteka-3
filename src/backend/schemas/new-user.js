'use strict';

const Joi = require(`@hapi/joi`);

const {backendParams} = require(`../../common/params`);
const {EAccountFieldName} = require(`../models`);
const {schemaMessages} = require(`../messages`);


const {
  MAX_FIRSTNAME_SYMBOL_COUNT,
  MAX_LASTNAME_SYMBOL_COUNT,
  MAX_EMAIL_SYMBOL_COUNT,
  MAX_AVATAR_SYMBOL_COUNT,
  MIN_PASSWORD_SYMBOL_COUNT,
} = backendParams.db.account;

const {
  PATTERN_FIRSTNAME_FIELD,
  MAX_FIRSTNAME_LENGTH,
  REQUIRED_FIRSTNAME_FIELD,
  PATTERN_LASTNAME_FIELD,
  MAX_LASTNAME_LENGTH,
  REQUIRED_LASTNAME_FIELD,
  INVALID_EMAIL,
  MAX_EMAIL_LENGTH,
  REQUIRED_EMAIL_FIELD,
  PATTERN_AVATAR_FIELD,
  MAX_AVATAR_LENGTH,
  MIN_PASSWORD_LENGTH,
  REQUIRED_PASSWORD_FIELD,
  MIN_REPEAT_PASSWORD_LENGTH,
  REQUIRED_REPEAT_PASSWORD_FIELD,
} = schemaMessages.User;

module.exports = Joi.object({
  [EAccountFieldName.FIRSTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(MAX_FIRSTNAME_SYMBOL_COUNT)
    .required()
    .messages({
      'string.pattern.base': PATTERN_FIRSTNAME_FIELD,
      'string.max': MAX_FIRSTNAME_LENGTH,
      'any.required': REQUIRED_FIRSTNAME_FIELD,
      'string.empty': REQUIRED_FIRSTNAME_FIELD,
    }),
  [EAccountFieldName.LASTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(MAX_LASTNAME_SYMBOL_COUNT)
    .required()
    .messages({
      'string.pattern.base': PATTERN_LASTNAME_FIELD,
      'string.max': MAX_LASTNAME_LENGTH,
      'any.required': REQUIRED_LASTNAME_FIELD,
      'string.empty': REQUIRED_LASTNAME_FIELD,
    }),
  [EAccountFieldName.EMAIL]: Joi.string()
    .email()
    .max(MAX_EMAIL_SYMBOL_COUNT)
    .required()
    .messages({
      'string.email': INVALID_EMAIL,
      'string.max': MAX_EMAIL_LENGTH,
      'any.required': REQUIRED_EMAIL_FIELD,
      'string.empty': REQUIRED_EMAIL_FIELD,
    }),
  [EAccountFieldName.AVATAR]: Joi.string()
    .max(MAX_AVATAR_SYMBOL_COUNT)
    .allow(``)
    .pattern(/.(jpg|png)$/)
    .messages({
      'string.pattern.base': PATTERN_AVATAR_FIELD,
      'string.max': MAX_AVATAR_LENGTH,
    }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .min(MIN_PASSWORD_SYMBOL_COUNT)
    .required()
    .messages({
      'string.min': MIN_PASSWORD_LENGTH,
      'any.required': REQUIRED_PASSWORD_FIELD,
      'string.empty': REQUIRED_PASSWORD_FIELD,
    }),
  repeatedPassword: Joi.string()
    .min(MIN_PASSWORD_SYMBOL_COUNT)
    .required()
    .messages({
      'string.min': MIN_REPEAT_PASSWORD_LENGTH,
      'any.required': REQUIRED_REPEAT_PASSWORD_FIELD,
      'string.empty': REQUIRED_REPEAT_PASSWORD_FIELD,
    }),
});
