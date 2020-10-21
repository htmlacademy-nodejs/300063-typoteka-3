'use strict';

module.exports = {
  Authenticate: {
    USER_NOT_EXISTS: `Пользователя с указанным email не существует`,
    WRONG_PASSWORD: `Пароль неверен`,
  },
  AuthenticateJwt: {
    UNAUTHORIZED: `Необходимо авторизоваться`,
    FORBIDDEN: `Недостаточно прав`,
  },
  CheckAdmin: {
    ACCESS_DENIED: `Недостаточно прав`,
    USER_DOES_NOT_EXIST: `Пользователя не существует`,
  },
};
