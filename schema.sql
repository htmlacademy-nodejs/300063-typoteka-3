DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS accounts_account_types;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS account_types;


CREATE TABLE articles (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR (250),
    announce VARCHAR (250),
    text TEXT,
    date DATE,
    image VARCHAR (150)
);

CREATE TABLE accounts (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR (50),
    lastname VARCHAR (50),
    email VARCHAR (100),
    avatar VARCHAR (100),
    password CHAR (255)
);

CREATE TABLE categories (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR (50)
);

CREATE TABLE account_types (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR (50)
);

CREATE TABLE comments (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    text TEXT,
    date DATE,
    account_id BIGINT,
    article_id BIGINT,
    FOREIGN KEY (account_id) REFERENCES accounts (id)
        ON UPDATE SET NULL
        ON DELETE SET NULL,
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE articles_categories (
    article_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    CONSTRAINT article_categories_pk PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE accounts_account_types (
    account_id BIGINT NOT NULL,
    account_type_id INTEGER NOT NULL,
    CONSTRAINT accounts_account_types_pk PRIMARY KEY (account_id, account_type_id),
    FOREIGN KEY (account_id) REFERENCES accounts (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (account_type_id) REFERENCES account_types (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
