'use strict';

const Joi = require(`@hapi/joi`);

const {ERefreshTokenFieldName} = require(`../models`);
const {schemaMessages} = require(`../messages`);


module.exports = Joi.object({
  [ERefreshTokenFieldName.TOKEN]: Joi.string()
    .required()
    .messages({
      'string.required': schemaMessages.Token.REQUIRED_TOKEN_FIELD,
      'string.empty': schemaMessages.Token.REQUIRED_TOKEN_FIELD,
    }),
});
