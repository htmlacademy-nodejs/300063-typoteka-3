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

module.exports = Joi.object({
  [EAccountFieldName.FIRSTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(MAX_FIRSTNAME_SYMBOL_COUNT)
    .required()
    .messages({
      'string.pattern.base': schemaMessages.User.PATTERN_FIRSTNAME_FIELD,
      'string.max': schemaMessages.User.MAX_FIRSTNAME_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_FIRSTNAME_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_FIRSTNAME_FIELD,
    }),
  [EAccountFieldName.LASTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(MAX_LASTNAME_SYMBOL_COUNT)
    .required()
    .messages({
      'string.pattern.base': schemaMessages.User.PATTERN_LASTNAME_FIELD,
      'string.max': schemaMessages.User.MAX_LASTNAME_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_LASTNAME_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_LASTNAME_FIELD,
    }),
  [EAccountFieldName.EMAIL]: Joi.string()
    .email()
    .max(MAX_EMAIL_SYMBOL_COUNT)
    .required()
    .messages({
      'string.email': schemaMessages.User.INVALID_EMAIL,
      'string.max': schemaMessages.User.MAX_EMAIL_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_EMAIL_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_EMAIL_FIELD,
    }),
  [EAccountFieldName.AVATAR]: Joi.string()
    .max(MAX_AVATAR_SYMBOL_COUNT)
    .allow(``)
    .pattern(/.(jpg|png)$/)
    .messages({
      'string.pattern.base': schemaMessages.User.PATTERN_AVATAR_FIELD,
      'string.max': schemaMessages.User.MAX_AVATAR_LENGTH,
    }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .min(MIN_PASSWORD_SYMBOL_COUNT)
    .required()
    .messages({
      'string.min': schemaMessages.User.MIN_PASSWORD_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_PASSWORD_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_PASSWORD_FIELD,
    }),
  repeatedPassword: Joi.string()
    .min(MIN_PASSWORD_SYMBOL_COUNT)
    .required()
    .messages({
      'string.min': schemaMessages.User.MIN_REPEAT_PASSWORD_LENGTH,
      'any.required': schemaMessages.User.REQUIRED_REPEAT_PASSWORD_FIELD,
      'string.empty': schemaMessages.User.REQUIRED_REPEAT_PASSWORD_FIELD,
    }),
});
