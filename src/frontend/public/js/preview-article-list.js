'use strict';

(() => {
  const socket = io(`http://localhost:8080`);

  const updateArticlesHandler = (articleData) => {
    const articleCommentCountSelector = `[data-article-id='${articleData.id}'] .preview__comment-count`;
    const articleCommentCountElement = document.querySelector(articleCommentCountSelector);
    if (articleCommentCountElement) {
      articleCommentCountElement.textContent = articleData.commentCount;
    }
  };

  socket.addEventListener(`articles`, updateArticlesHandler);
})();
