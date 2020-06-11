-- Получить список всех категорий
SELECT id, name FROM categories;


-- Получить список категорий для которых создана минимум одна публикация
SELECT name FROM categories
WHERE
  categories.id IN (
    SELECT DISTINCT category_id FROM articles_categories
  );


-- Получить список категорий с количеством публикаций
SELECT id, name, COUNT(*) FROM articles_categories, categories
WHERE category_id = id
GROUP BY id
ORDER BY id;


-- Получить список публикаций
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.date,
  articles.image,
  comments.count AS comment_count,
  articles_categories.categories
FROM
  articles,
  (SELECT article_id, COUNT(*)
    FROM comments
    GROUP BY article_id) AS comments,
  (SELECT article_id, array_agg(name) AS categories
     FROM articles_categories, categories
     WHERE category_id = id
     GROUP BY article_id) as articles_categories
WHERE
  articles_categories.article_id = articles.id AND
  comments.article_id = articles.id
ORDER BY articles.date DESC;


-- Получить полную информацию определённой публикации (делается запрос для получения статьи с id = 1)
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.date,
  articles.image,
  comments.count AS comment_count,
  articles_categories.categories
FROM
  articles,
  (SELECT article_id, COUNT(*)
    FROM comments
    GROUP BY article_id) AS comments,
  (SELECT article_id, array_agg(name) AS categories
     FROM articles_categories, categories
     WHERE category_id = id
     GROUP BY article_id) as articles_categories
WHERE
  articles.id = 1 AND
  articles_categories.article_id = articles.id AND
  comments.article_id = articles.id
ORDER BY articles.date DESC;


-- Получить список из 5 свежих комментариев (делается запрос для получения комментариев статьи с id = 1)
SELECT
  comments.article_id,
  comments.id AS comment_id,
  comments.text AS comment_text,
  comments.date AS comment_date,
  accounts.firstname,
  accounts.lastname
FROM
  comments,
  accounts
WHERE
  accounts.id = comments.account_id
ORDER BY comments.date DESC
  LIMIT 5;


-- Получить список комментариев для определённой публикации
SELECT
  comments.article_id,
  comments.id AS comment_id,
  comments.text AS comment_text,
  comments.date AS comment_date,
  accounts.firstname,
  accounts.lastname
FROM
  comments,
  accounts
WHERE
  comments.article_id = 1 AND
  accounts.id = comments.account_id
ORDER BY comments.date DESC;


-- Обновить заголовок определённой публикации на «Как я встретил Новый год»
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 3;
