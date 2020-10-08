'use strict';

(() => {
  const socket = io('http://localhost:8080');

  const updateArticlesHandler = (articleData) => {
    console.log(111);
    console.log(111);
    const articleCommentCountElement = document.querySelector(`.preview__item[data-id='${articleData.id}'] .preview__comment-count`);
    articleCommentCountElement.textContent = articleData.commentCount;
    console.log(articleCommentCountElement);

    console.log(articleData);
  };

  socket.addEventListener(`articles`, updateArticlesHandler);
})();
