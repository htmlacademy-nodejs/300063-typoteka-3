-- Получить список всех категорий
SELECT id, title FROM categories;


-- Получить список категорий для которых создана минимум одна публикация
SELECT categories.title
FROM articles_categories
INNER JOIN categories
  ON categories.id = articles_categories.category_id
GROUP BY categories.id
ORDER BY categories.id;


-- Получить список категорий с количеством публикаций
SELECT
  categories.id,
  categories.title,
  COUNT(categories.id)
FROM categories
INNER JOIN articles_categories
  ON articles_categories.category_id = categories.id
GROUP BY categories.id
ORDER BY categories.id;


-- Получить список публикаций
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.date,
  articles.image,
  COUNT(articles.id) AS "comment_count",
  articles_categories.categories AS "categories"
FROM articles
INNER JOIN comments
  ON comments.article_id = articles.id
INNER JOIN (
  SELECT
    articles_categories.article_id,
    array_agg(categories.title) AS "categories"
  FROM articles_categories
  INNER JOIN categories
    ON articles_categories.category_id = categories.id
  GROUP BY articles_categories.article_id
) AS "articles_categories"
  ON articles_categories.article_id = articles.id
GROUP BY articles.id, articles_categories.categories;
ORDER BY articles.date DESC;


-- Получить полную информацию определённой публикации (делается запрос для получения статьи с id = 1)
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.date,
  articles.image,
  COUNT(articles.id) AS "comment_count",
  articles_categories.categories AS "categories"
FROM articles
INNER JOIN comments
  ON comments.article_id = articles.id
INNER JOIN (
  SELECT
    articles_categories.article_id,
    array_agg(categories.title) AS "categories"
  FROM articles_categories
  INNER JOIN categories
    ON articles_categories.category_id = categories.id
  GROUP BY articles_categories.article_id
) AS "articles_categories"
  ON articles_categories.article_id = articles.id
GROUP BY articles.id, articles_categories.categories
HAVING articles.id = 1;


-- Получить список из 5 свежих комментариев
SELECT
  comments.id AS "id",
  comments.text AS "text",
  comments.date AS "date",
  accounts.firstname AS "user_firstname",
  accounts.lastname AS "user_lastname",
  comments.article_id
FROM comments
INNER JOIN accounts
  ON accounts.id = comments.account_id
ORDER BY comments.date DESC
  LIMIT 5;


-- Получить список комментариев для определённой публикации (делается запрос для получения комментариев статьи с id = 1)
SELECT
  comments.id AS "id",
  comments.text AS "text",
  comments.date AS "date",
  accounts.firstname AS "user_firstname",
  accounts.lastname AS "user_lastname",
  comments.article_id
FROM comments
INNER JOIN accounts
  ON accounts.id = comments.account_id
WHERE comments.article_id = 1
ORDER BY comments.date DESC;


-- Обновить заголовок определённой публикации на «Как я встретил Новый год»
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 3;
