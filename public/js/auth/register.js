window.onload = () => {
  listenDropDownListInputs(document); // Listen for drop down items

  const formPageOne = document.querySelector('.form-page-one');
  const formPageOneTitle = document.querySelector('.form-page-one-title');
  const formPageOneSubtitle = document.querySelector('.form-page-one-subtitle');
  const formPageOneError = document.querySelector('.form-page-one-error');
  const formPageTwo = document.querySelector('.form-page-two');
  const formPageTwoError = document.querySelector('.form-page-two-error');
  
  const countries = JSON.parse(document.getElementById('countries').value);
  const companyRoles = JSON.parse(document.getElementById('company-roles').value);
  const countryInput = document.getElementById('country-input');

  document.addEventListener('focusout', event => {
    if (event.target.id == 'country-visible-input')
      setTimeout(() => {
        document.querySelector('.phone-code').innerHTML = '+' + (countries.find(country => country.alpha2_code == countryInput.value) ? countries.find(country => country.alpha2_code == countryInput.value).phone_code : '0');
      }, 200);
  });

  const badRequestError = document.getElementById('bad-request-error').innerHTML;
  const passwordLengthError = document.getElementById('password-length-error').innerHTML;
  const passwordConfirmError = document.getElementById('password-confirm-error').innerHTML;
  const countryError = document.getElementById('country-error').innerHTML;
  const companyRoleError = document.getElementById('company-role-error').innerHTML;
  const phoneDuplicatedError = document.getElementById('phone-duplicated-error').innerHTML;
  const networkError = document.getElementById('network-error').innerHTML;
  const unknownError = document.getElementById('unknown-error').innerHTML;

  formPageOne.onsubmit = event => {
    event.preventDefault();

    formPageOneError.innerHTML = '';

    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    const confirmPassword = document.getElementById('confirm-password-input').value.trim();

    if (!email || !email.length)
      return formPageOneError.innerHTML = badRequestError;

    if (!password || password.length < 6)
      return formPageOneError.innerHTML = passwordLengthError;

    if (password != confirmPassword)
      return formPageOneError.innerHTML = passwordConfirmError;

    formPageOne.style.display = formPageOneTitle.style.display = formPageOneSubtitle.style.display = 'none';
    formPageTwo.style.display = 'flex';
  }

  formPageTwo.onsubmit = event => {
    event.preventDefault();

    formPageTwoError.innerHTML = '';

    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value.trim();
    const name = document.getElementById('name-input').value.trim();
    const companyName = document.getElementById('company-name-input').value.trim();
    const country = document.getElementById('country-input').value.trim();
    const companyRole = document.getElementById('company-role-input').value.trim();
    const companyPhone = document.getElementById('company-phone-code').innerHTML.trim() + document.getElementById('company-phone-input').value.trim();

    if (!name || !name.length || !companyName || !companyName.length || !country || !country.length || !companyRole || !companyRole.length || !companyPhone || !companyPhone.length)
      return formPageTwoError.innerHTML = badRequestError;

    if (!countries.find(each => each.alpha2_code == country))
      return formPageTwoError.innerHTML = countryError;

    if (!companyRoles.find(each => each == companyRole))
      return formPageTwoError.innerHTML = companyRoleError;

    serverRequest('/auth/register', 'POST', {
      email,
      password,
      name: name,
      company_name: companyName,
      country,
      role: companyRole,
      phone_number: companyPhone
    }, res => {
      if (res.success)
        return window.location = '/';

      if (res.error == 'bad_request')
        return formPageTwoError.innerHTML = badRequestError;
      if (res.error == 'duplicated_unique_field')
        return formPageTwoError.innerHTML = phoneDuplicatedError;
      if (res.error == 'network_error')
        return formPageTwoError.innerHTML = networkError;

      return formPageTwoError.innerHTML = unknownError;
    });
  }
}
