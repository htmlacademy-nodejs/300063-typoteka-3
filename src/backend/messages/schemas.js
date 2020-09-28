'use strict';

module.exports = {
  Article: {
    MIN_TITLE_LENGTH: `Заголовок должен содержать не меньше 30 символов`,
    MAX_TITLE_LENGTH: `Заголовок должен содержать не больше 250 символов`,
    TITLE_REQUIRED_FIELD: `Поле заголовка обязательно для заполнения`,
    IMAGE_EXTENSION: `Допускаются только изображения с расширениемя jpg и png`,
    MIN_CATEGORY_ITEMS: `Необходимо выбрать хотя бы 1 категорию`,
    MIN_ANNOUNCE_LENGTH: `Анонс должен содержать не меньше 30 символов`,
    MAX_ANNOUNCE_LENGTH: `Анонс должен содержать не больше 250 символов`,
    ANNOUNCE_REQUIRED_FIELD: `Поле анонса обязателно для заполнения`,
    MAX_TEXT_LENGTH: `Текст публикации должен содержать не больше 1000 символов`,
    DATE_FORMAT: `Укажите дату согласно стандарту ISO 8601`,
    DATE_REQUIRED: `Выберите дату публикации`,
  },
  Comment: {
    MAX_TEXT_LENGTH: `Комментарий должен содержать не больше 1000 символов`,
    REQUIRED_TEXT_FIELD: `Нельзя отправить пустой комментарий`,
    REQUIRED_ARTICLE_ID_FIELD: `Поле accountId обязательно для заполнения`,
    REQUIRED_ACCOUNT_ID_FIELD: `Поле articleId обязательно для заполнения`,
  },
  Category: {
    REQUIRED_TITLE_FIELD: `Название категории обязательное поле`,
    MIN_TITLE_LENGTH: `Количество символов в названии категории не может быть меньше 5`,
    MAX_TITLE_LENGTH: `Количество символов в названии категории не может быть больше 30`,
  },
  Login: {
    REQUIRED_EMAIL_FIELD: `Укажите email`,
    REQUIRED_PASSWORD_FIELD: `Укажите пароль`,
  },
  User: {
    PATTERN_FIRSTNAME_FIELD: `Имя может содержать только кириллические символы`,
    MAX_FIRSTNAME_LENGTH: `Имя может содержать не более 50 символов`,
    REQUIRED_FIRSTNAME_FIELD: `Имя является обязательным полем для заполнения`,
    PATTERN_LASTNAME_FIELD: `Фамилия может содержать только кириллические символы`,
    MAX_LASTNAME_LENGTH: `Фамилия может содержать не более 50 символов`,
    REQUIRED_LASTNAME_FIELD: `Фамилия является обязательным полем для заполнения`,
    INVALID_EMAIL: `Email невалиден`,
    MAX_EMAIL_LENGTH: `Email может содержать не более 100 символов`,
    REQUIRED_EMAIL_FIELD: `Email является обязательным полем для заполнения`,
    PATTERN_AVATAR_FIELD: `Допускаются только изображения с расширениемя jpg и png`,
    MAX_AVATAR_LENGTH: `Имя файла с аватаром может содержать не более 100 символов`,
    MIN_PASSWORD_LENGTH: `Пароль должен содержать не менее 6 символов`,
    REQUIRED_PASSWORD_FIELD: `Пароль является обязательным полем для заполнения`,
    MIN_REPEAT_PASSWORD_LENGTH: `Поле повторение пароля должено содержать не менее 6 символов и совпадать с паролем`,
    REQUIRED_REPEAT_PASSWORD_FIELD: `Поле повторение пароля является обязательным для заполнения`,
  },
  Token: {
    REQUIRED_TOKEN_FIELD: `Необходимо указать token`,
  }
};
