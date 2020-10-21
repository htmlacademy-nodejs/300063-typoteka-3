'use strict';

const {backendParams} = require(`../../common/params`);


const {
  Account,
  Article,
  Category,
  Comment,
} = backendParams.db;

module.exports = {
  Article: {
    MIN_TITLE_LENGTH: `Заголовок должен содержать не меньше ${Article.MIN_TITLE_SYMBOL_COUNT} символов`,
    MAX_TITLE_LENGTH: `Заголовок должен содержать не больше ${Article.MAX_TITLE_SYMBOL_COUNT} символов`,
    TITLE_REQUIRED_FIELD: `Поле заголовка обязательно для заполнения`,
    IMAGE_EXTENSION: `Допускаются только изображения с расширениемя jpg и png`,
    MIN_CATEGORY_ITEMS: `Необходимо выбрать хотя бы 1 категорию`,
    MIN_ANNOUNCE_LENGTH: `Анонс должен содержать не меньше ${Article.MIN_ANNOUNCE_SYMBOL_COUNT} символов`,
    MAX_ANNOUNCE_LENGTH: `Анонс должен содержать не больше ${Article.MAX_ANNOUNCE_SYMBOL_COUNT} символов`,
    ANNOUNCE_REQUIRED_FIELD: `Поле анонса обязателно для заполнения`,
    MAX_TEXT_LENGTH: `Текст публикации должен содержать не больше ${Article.MAX_TEXT_SYMBOL_COUNT} символов`,
    MAX_IMAGE_NAME_LENGTH: `Название изображения не может содержать больше ${Article.MAX_IMAGE_NAME_SYMBOL_COUNT} символов`,
    DATE_FORMAT: `Укажите дату согласно стандарту ISO 8601`,
    DATE_REQUIRED: `Выберите дату публикации`,
  },
  Comment: {
    MIN_TEXT_LENGTH: `Комментарий должен содержать не меньше ${Comment.MIN_TEXT_SYMBOL_COUNT} символов`,
    MAX_TEXT_LENGTH: `Комментарий должен содержать не больше ${Comment.MAX_TEXT_SYMBOL_COUNT} символов`,
    REQUIRED_TEXT_FIELD: `Нельзя отправить пустой комментарий`,
    REQUIRED_ARTICLE_ID_FIELD: `Поле accountId обязательно для заполнения`,
    REQUIRED_ACCOUNT_ID_FIELD: `Поле articleId обязательно для заполнения`,
  },
  Category: {
    REQUIRED_TITLE_FIELD: `Название категории обязательное поле`,
    MIN_TITLE_LENGTH: `Количество символов в названии категории не может быть меньше ${Category.MIN_TITLE_SYMBOL_COUNT}`,
    MAX_TITLE_LENGTH: `Количество символов в названии категории не может быть больше ${Category.MAX_TITLE_SYMBOL_COUNT}`,
  },
  Login: {
    REQUIRED_EMAIL_FIELD: `Укажите email`,
    REQUIRED_PASSWORD_FIELD: `Укажите пароль`,
  },
  User: {
    PATTERN_FIRSTNAME_FIELD: `Имя может содержать только латинские и кириллические символы`,
    MAX_FIRSTNAME_LENGTH: `Имя может содержать не более ${Account.MAX_FIRSTNAME_SYMBOL_COUNT} символов`,
    REQUIRED_FIRSTNAME_FIELD: `Имя является обязательным полем для заполнения`,
    PATTERN_LASTNAME_FIELD: `Фамилия может содержать только латинские и кириллические символы`,
    MAX_LASTNAME_LENGTH: `Фамилия может содержать не более ${Account.MAX_LASTNAME_SYMBOL_COUNT} символов`,
    REQUIRED_LASTNAME_FIELD: `Фамилия является обязательным полем для заполнения`,
    INVALID_EMAIL: `Email невалиден`,
    MAX_EMAIL_LENGTH: `Email может содержать не более ${Account.MAX_EMAIL_SYMBOL_COUNT} символов`,
    REQUIRED_EMAIL_FIELD: `Email является обязательным полем для заполнения`,
    PATTERN_AVATAR_FIELD: `Допускаются только изображения с расширениемя jpg и png`,
    MAX_AVATAR_LENGTH: `Имя файла с аватаром может содержать не более ${Account.MAX_AVATAR_SYMBOL_COUNT} символов`,
    MIN_PASSWORD_LENGTH: `Пароль должен содержать не менее ${Account.MIN_PASSWORD_SYMBOL_COUNT} символов`,
    REQUIRED_PASSWORD_FIELD: `Пароль является обязательным полем для заполнения`,
    MIN_REPEAT_PASSWORD_LENGTH: `Поле повторение пароля должно содержать не менее ${Account.MIN_PASSWORD_SYMBOL_COUNT} символов и совпадать с паролем`,
    REQUIRED_REPEAT_PASSWORD_FIELD: `Поле повторение пароля является обязательным для заполнения`,
  },
  Token: {
    REQUIRED_TOKEN_FIELD: `Необходимо указать token`,
  }
};
