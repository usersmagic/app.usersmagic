window.onload = () => {
  const formWrapper = document.querySelector('.form-wrapper');
  const formError = document.querySelector('.form-error');

  const badRequestError = document.getElementById('bad-request-error').innerHTML;
  const notFoundError = document.getElementById('not-found-error').innerHTML;
  const wrongPasswordError = document.getElementById('wrong-password-error').innerHTML;
  const networkError = document.getElementById('network-error').innerHTML;
  const unknownError = document.getElementById('unknown-error').innerHTML;

  formWrapper.onsubmit = event => {
    event.preventDefault();

    formError.innerHTML = '';

    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();

    if (!email || !email.length || !password || !password.length)
      return formError.innerHTML = badRequestError;

    serverRequest('/auth/login', 'POST', {
      email,
      password
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return formError.innerHTML = badRequestError;
        else if (res.error == 'document_not_found')
          return formError.innerHTML = notFoundError;
        else if (res.error == 'password_verification')
          return formError.innerHTML = wrongPasswordError;
        else if (res.error == 'network_error')
          return formError.innerHTML = networkError;
        else
          return formError.innerHTML = unknownError;
      } else {
        if (res.redirect)
          return window.location = res.redirect;
        return window.location = '/';
      }
    });
  }
}
