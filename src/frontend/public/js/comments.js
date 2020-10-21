'use strict';

(() => {
  const socket = io(`http://localhost:8080`);
  const commentListElement = document.querySelector(`.publication__list`);

  const createComment = (comment) => {
    const commentHtml = getCommentElement(comment);
    commentListElement.children[0].insertAdjacentHTML(`beforebegin`, commentHtml);
  };

  const getCommentElement = (comment) => {
    const avatar = comment.account.avatar && `img/${comment.account.avatar}` || `img/icons/smile.svg`;
    const userName = `${comment.account.firstname} ${comment.account.lastname}`;
    const date = `${comment.date.day}, ${comment.date.time}`;
    const anchorHref = `/articles/${comment.article.id}`;
    return `
      <li class="publication__list-item" data-comment-id="${comment.id}">
        <div class="publication__header">
          <img class="publication__list-image" src="${avatar}" width='20' height='20' alt='Аватар пользователя'/>
          <b class="publication__list-name">${userName}</b>
          <time class="publication__item-time" datetime="${comment.date.stamp}">${date}</time>
        </div>
        <a href="${anchorHref}" class="publication__item-text">${comment.text}</a>
        <p class="publication__text-strong">${comment.article.title}</p>
        <button
          class="publication__button button button--close-item"
          type="submit"
          name="action"
          value="delete"
        >
          <span class="visually-hidden">Закрыть строку списка</span>
        </button>
      </li>
    `;
  };

  socket.addEventListener(`create-comment`, createComment);
})();
