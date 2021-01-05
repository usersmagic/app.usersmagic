
// Create a confirm wrapper with the data given and returns the callback
// If the wrapper is confirmed returns callback true else false
function createConfirm (data, callback) {
  const confirmOuterWrapper = document.createElement('div');
  confirmOuterWrapper.classList.add('general-confirm-outer-wrapper');

  const confirmWrapper = document.createElement('div');
  confirmWrapper.classList.add('general-confirm-wrapper');

  const confirmTitle = document.createElement('span');
  confirmTitle.classList.add('general-confirm-title');
  confirmTitle.innerHTML = data.title;
  confirmWrapper.appendChild(confirmTitle);

  const confirmText = document.createElement('span');
  confirmText.classList.add('general-confirm-text');
  confirmText.innerHTML = data.text;
  confirmWrapper.appendChild(confirmText);

  const confirmButtonWrapper = document.createElement('div');
  confirmButtonWrapper.classList.add('general-confirm-button-wrapper');

  const noButton = document.createElement('span');
  noButton.classList.add('general-confirm-no-button');
  noButton.innerHTML = data.reject;
  confirmButtonWrapper.appendChild(noButton);

  const yesButton = document.createElement('span');
  yesButton.classList.add('general-confirm-yes-button');
  yesButton.innerHTML = data.accept;
  confirmButtonWrapper.appendChild(yesButton);

  confirmWrapper.appendChild(confirmButtonWrapper);

  confirmOuterWrapper.appendChild(confirmWrapper);
  document.querySelector('body').appendChild(confirmOuterWrapper);

  document.addEventListener('click', event => {
    if (event.target.classList.contains('general-confirm-no-button') || event.target.classList.contains('general-confirm-outer-wrapper')) {
      confirmOuterWrapper.remove();
      callback(false);
    } else if (event.target.classList.contains('general-confirm-yes-button')) {
      confirmOuterWrapper.remove();
      callback(true);
    }
  });
}
