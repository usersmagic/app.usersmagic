window.onload = () => {
  listenDropDownListInputs(document); // Listen for drop down items
  
  const formWrapper = document.querySelector('.complete-form-wrapper');
  const formError = document.querySelector('.form-error');

  const companyRoles = JSON.parse(document.getElementById('company-roles').value);

  const badRequestError = document.getElementById('bad-request-error').innerHTML;
  const passwordLengthError = document.getElementById('password-length-error').innerHTML;
  const passwordConfirmError = document.getElementById('password-confirm-error').innerHTML;
  const companyRoleError = document.getElementById('company-role-error').innerHTML;
  const networkError = document.getElementById('network-error').innerHTML;
  const unknownError = document.getElementById('unknown-error').innerHTML;

  formWrapper.onsubmit = event => {
    event.preventDefault();

    formError.innerHTML = '';

    const password = document.getElementById('password-input').value.trim();
    const confirmPassword = document.getElementById('confirm-password-input').value.trim();
    const companyRole = document.getElementById('company-role-input').value.trim();

    if (!password || !password.length || !companyRole || !companyRole.length)
      return formError.innerHTML = badRequestError;

    if (!password || password.length < 6)
      return formError.innerHTML = passwordLengthError;

    if (password != confirmPassword)
      return formError.innerHTML = passwordConfirmError;

    if (!companyRoles.find(each => each == companyRole))
      return formError.innerHTML = companyRoleError;

    serverRequest('/auth/complete', 'POST', {
      password,
      role: companyRole
    }, res => {
      if (!res.success) {
        if (res.error == 'bad_request')
          return formError.innerHTML = badRequestError;
        else if (res.error == 'network_error')
          return formError.innerHTML = networkError;
        else
          return formError.innerHTML = unknownError;
      } else {
        return window.location = '/';
      }
    });
  }
}
