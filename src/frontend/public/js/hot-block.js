'use strict';

(() => {
  const socket = io('http://localhost:8080');

  const updateHotArticlesHandler = (hotArticles) => {
    const hotListElement = document.querySelector(`.hot__list`);
    const listElement = document.createElement(`ul`);
    listElement.classList.add(`hot__list`);
    hotArticles.forEach((article) => {
      const itemListElement = createArticleItem(article);
      listElement.append(itemListElement);
    });
    hotListElement.replaceWith(listElement);
  };

  const createArticleItem = (article) => {
    const itemListElement = document.createElement(`li`);
    itemListElement.classList.add(`hot__list-item`);
    const anchorElement = document.createElement(`a`);
    anchorElement.classList.add(`hot__list-link`);
    anchorElement.href = `/articles/${article.id}`;
    anchorElement.textContent = article.announce;
    const supElement = document.createElement(`sup`);
    supElement.classList.add(`hot__link-sup`);
    supElement.textContent = article.commentCount;
    anchorElement.append(supElement);
    itemListElement.append(anchorElement);
    return itemListElement;
  };

  const updateLastCommentsHandler = (lastComments) => {
    const lastListElement = document.querySelector(`.last__list`);
    const listElement = document.createElement(`ul`);
    listElement.classList.add(`last__list`);
    lastComments.forEach((comment) => {
      const itemListElement = createLastCommentItem(comment);
      listElement.append(itemListElement);
    });
    lastListElement.replaceWith(listElement);
  };

  const createLastCommentItem = (comment) => {
    const itemListElement = document.createElement(`li`);
    itemListElement.classList.add(`last__list-item`);
    const imageElement = document.createElement(`img`);
    imageElement.classList.add(`last__list-image`);
    imageElement.src = `/img/${comment.account.avatar}`;
    const userNameElement = document.createElement(`b`);
    userNameElement.classList.add(`last__list-name`);
    userNameElement.textContent = `${comment.account.firstname} ${comment.account.lastname}`;
    const anchorElement = document.createElement(`a`);
    anchorElement.classList.add(`last__list-link`);
    anchorElement.href = `/articles/${comment.article.id}`;
    anchorElement.textContent = comment.text;
    itemListElement.append(imageElement);
    itemListElement.append(userNameElement);
    itemListElement.append(anchorElement);
    return itemListElement;
  };

  socket.addEventListener(`hot-articles`, updateHotArticlesHandler);
  socket.addEventListener(`last-comments`, updateLastCommentsHandler);
})();
