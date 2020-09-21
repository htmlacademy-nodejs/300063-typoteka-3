'use strict';

const Joi = require(`@hapi/joi`);
const {EAccountFieldName} = require(`../models`);


module.exports = Joi.object({
  [EAccountFieldName.EMAIL]: Joi.string()
  .required()
  .messages({
    'any.required': `Укажите email`,
    'string.empty': `Укажите email`,
  }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .required()
    .messages({
      'any.required': `Укажите пароль`,
      'string.empty': `Укажите пароль`,
    }),
});
