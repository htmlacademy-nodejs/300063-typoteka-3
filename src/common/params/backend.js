'use strict';

module.exports = {
  MOCK_FILE_NAME: `mock.json`,
  DEFAULT_COMMAND_FOR_BACKEND_CLI: `--help`,
  USER_ARGV_INDEX: 2,
  generate: {
    Count: {
      DEFAULT: 1,
      MIN: 1,
      MAX: 1000,
    },
    OLDEST_PUBLICATION_COUNT_DAY: 256,
  },
  FILE_TITLES_PATH: `./data/titles.txt`,
  FILE_TEXTS_PATH: `./data/texts.txt`,
  FILE_CATEGORIES_PATH: `./data/categories.txt`,
  FILE_COMMENTS_PATH: `./data/comments.txt`,
  FILE_FIRSTNAMES_PATH: `./data/firstnames.txt`,
  FILE_LASTNAMES_PATH: `./data/lastnames.txt`,
  FILE_AVATARS_PATH: `./data/avatars.txt`,
  FILE_IMAGES_PATH: `./data/images.txt`,
  JWT_ACCESS_SECRET_DEFAULT: `access`,
  JWT_REFRESH_SECRET_DEFAULT: `refresh`,
  db: {
    account: {
      MAX_FIRSTNAME_SYMBOL_COUNT: 50,
      MAX_LASTNAME_SYMBOL_COUNT: 50,
      MAX_EMAIL_SYMBOL_COUNT: 100,
      MAX_AVATAR_SYMBOL_COUNT: 100,
      PASSWORD_SYMBOL_COUNT: 72,
      MIN_PASSWORD_SYMBOL_COUNT: 6,
    },
    article: {
      MAX_TITLE_SYMBOL_COUNT: 250,
      MIN_TITLE_SYMBOL_COUNT: 30,
      MAX_ANNOUNCE_SYMBOL_COUNT: 250,
      MIN_ANNOUNCE_SYMBOL_COUNT: 30,
      MAX_IMAGE_NAME_SYMBOL_COUNT: 150,
      MAX_TEXT_SYMBOL_COUNT: 1000,
      MIN_CHOOSE_CATEGORY_ITEMS: 1,
    },
    category: {
      MAX_TITLE_SYMBOL_COUNT: 30,
      MIN_TITLE_SYMBOL_COUNT: 5,
    },
    comment: {
      MAX_TEXT_SYMBOL_COUNT: 1000,
    },
    token: {
      MAX_TOKEN_SYMBOL_COUNT: 1000,
    }
  },
};
