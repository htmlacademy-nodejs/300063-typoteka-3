'use strict';

const Joi = require(`@hapi/joi`);

const {EAccountFieldName} = require(`../models`);
const {schemaMessages} = require(`../messages`);

const {
  REQUIRED_EMAIL_FIELD,
  REQUIRED_PASSWORD_FIELD,
} = schemaMessages.Login;


module.exports = Joi.object({
  [EAccountFieldName.EMAIL]: Joi.string()
  .required()
  .messages({
    'any.required': REQUIRED_EMAIL_FIELD,
    'string.empty': REQUIRED_EMAIL_FIELD,
  }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .required()
    .messages({
      'any.required': REQUIRED_PASSWORD_FIELD,
      'string.empty': REQUIRED_PASSWORD_FIELD,
    }),
});
