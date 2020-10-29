'use strict';

(() => {
  const socket = io(`http://localhost:8080`);

  const deleteCommentHandler = (data) => {
    const {commentId} = data;
    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (commentElement) {
      commentElement.remove();
    }
  };

  socket.addEventListener(`delete-comment`, deleteCommentHandler);
})();
