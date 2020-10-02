'use strict';

const Joi = require(`@hapi/joi`);

const {EAccountFieldName} = require(`../models`);


module.exports = Joi.object({
  [EAccountFieldName.FIRSTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': `Имя может содержать только кириллические символы`,
      'string.max': `Имя может содержать не более 50 символов`,
      'any.required': `Имя является обязательным полем для заполнения`,
      'string.empty': `Имя является обязательным полем для заполнения`,
    }),
  [EAccountFieldName.LASTNAME]: Joi.string()
    .pattern(/^[A-zА-яЁё]+$/)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': `Фамилия может содержать только кириллические символы`,
      'string.max': `Фамилия может содержать не более 50 символов`,
      'any.required': `Фамилия является обязательным полем для заполнения`,
      'string.empty': `Фамилия является обязательным полем для заполнения`,
    }),
  [EAccountFieldName.EMAIL]: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      // 'string.email': `Email невалиден`,
      'string.max': `Email может содержать не более 100 символов`,
      'any.required': `Email является обязательным полем для заполнения`,
      'string.empty': `Email является обязательным полем для заполнения`,
    }),
  [EAccountFieldName.AVATAR]: Joi.string()
    .pattern(/.(jpg|png)$/)
    .max(100)
    .allow(``)
    .messages({
      'string.pattern.base': `Допускаются только изображения с расширениемя jpg и png`,
      'string.max': `Имя файла с аватаром может содержать не более 100 символов`,
    }),
  [EAccountFieldName.PASSWORD]: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': `Пароль должен содержать не менее 6 символов`,
      'any.required': `Пароль является обязательным полем для заполнения`,
      'string.empty': `Пароль является обязательным полем для заполнения`,
    }),
  repeatedPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': `Поле повторение пароля должено содержать не менее 6 символов и совпадать с паролем`,
      'any.required': `Поле повторение пароля является обязательным для заполнения`,
      'string.empty': `Поле повторение пароля является обязательным для заполнения`,
    }),
});
