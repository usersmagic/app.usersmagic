function listenForContentHeader(document) {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('header-get-credit-button')) {
      createConfirm({
        title: 'Get Credits',
        text: 'As this is our beta version, direct credit transactions are not allowed through the site. Please contact our team at info@usersmagic.com about your personal payment plan for your credits. Thank you.',
        accept: 'Close'
      }, res => { return });
    }
  });
}
