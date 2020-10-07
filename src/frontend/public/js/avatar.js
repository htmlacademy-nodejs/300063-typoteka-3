'use strict';

const avatarInput = document.querySelector(`input[name=picture`);
const avatarContainer = document.querySelector(`.avatar img`);

var fileTypes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png'
];
avatarInput.addEventListener(`change`, (event) => {
  const file = event.target.files[0];
  if (fileTypes.includes(file.type)) {
    avatarContainer.src = window.URL.createObjectURL(file);
  }
});

