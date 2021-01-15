let companyId;
let isSaving = false;
let isDataChanged = false;

// Post a xmlhttp request on server to save company data, reset page content accordingly
function saveCompanyData (callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/settings?id=${companyId}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({
    company_name: document.getElementById('company-name-input').value,
    country: document.getElementById('company-country-input').value,
    phone_number: document.getElementById('company-phone-number-input').value || null,
    account_holder_name: document.getElementById('company-account-holder-name-input').value || null,
    timezone: document.getElementById('country-timezone-input').value || null
  }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error)
        return callback(response.error);

      return callback(null);
    }
  };
}

// Check the input values, show error messages; returns false if there was an error
function checkCompanyData (callback) {
  if (isSaving || !isDataChanged)
    return callback(false);

  if (!document.getElementById('company-name-input').value || !document.getElementById('company-name-input').value.length)
    return createConfirm({
      title: 'Please enter a company name',
      text: 'You should enter a name for your company',
      reject: 'Continue'
    }, res => {
      return callback(false);
    });

  if (!document.getElementById('company-country-visible-input').value || !document.getElementById('company-country-visible-input').value.length)
    return createConfirm({
      title: 'Please choose your country',
      text: 'If you can\'t see your country right now, you can reach our team from hello@usersmagic.com.',
      reject: 'Continue'
    }, res => {
      return callback(false);
    });

  if (!document.getElementById('company-country-input').value || !document.getElementById('company-country-input').value.length)
    return createConfirm({
      title: 'Please enter the country correctly',
      text: 'You should choose your country from the list.',
      reject: 'Continue'
    }, res => {
      return callback(false);
    });

  return callback(true);
}

// Change password of the company using companyId. Checks for errors, returns false if there was an error
function saveNewPassword (callback) {
  const oldPassword = document.getElementById('company-old-password-input').value;
  const newPassword = document.getElementById('company-new-password-input').value;
  const confirmPassword = document.getElementById('company-confirm-password-input').value;

  if (!oldPassword || !oldPassword.length) {
    document.getElementById('password-error').childNodes[0].innerHTML = 'Please enter your old password';
    return callback(false);
  }

  if (!newPassword || !newPassword.length) {
    document.getElementById('password-error').childNodes[0].innerHTML = 'Please choose a new password';
    return callback(false);
  }

  if (newPassword.length < 6) {
    document.getElementById('password-error').childNodes[0].innerHTML = 'Your password should be at least 6 digits long';
    return callback(false);
  }

  if (!confirmPassword || !confirmPassword.length || confirmPassword != newPassword) {
    document.getElementById('password-error').childNodes[0].innerHTML = 'Please confirm your password';
    return callback(false);
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/auth/change_password?id=${companyId}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({
    old_password: oldPassword,
    new_password: newPassword
  }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error) {
        if (response.error == 'password_verification') {
          document.getElementById('password-error').childNodes[0].innerHTML = 'Your old password does not match';
        } else {
          document.getElementById('password-error').childNodes[0].innerHTML = 'An unknown error occured, please try again later';
        }
        return callback(false);
      }

      return callback(true);
    }
  };
}

// Create the new profile image
function createProfileImageWrapper (url) {
  const wrapper = document.getElementById('image-input-outer-wrapper');

  const innerWrapper = document.createElement('div');
  innerWrapper.classList.add('settings-each-input-wrapper');

  const inputTitle = document.createElement('span');
  inputTitle.classList.add('general-input-title');
  inputTitle.innerHTML = 'Profile Photo';
  innerWrapper.appendChild(inputTitle);
  
  const imageInputWrapper = document.createElement('div');
  imageInputWrapper.classList.add('general-image-input-wrapper');

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('general-image-input-wrapper-image');
  const image = document.createElement('img');
  image.src = url;
  image.alt = 'usersmagic';
  imageWrapper.appendChild(image);
  imageInputWrapper.appendChild(imageWrapper);

  const i = document.createElement('i');
  i.classList.add('fas');
  i.classList.add('fa-times');
  i.classList.add('delete-company-image-button');
  imageInputWrapper.appendChild(i);

  innerWrapper.appendChild(imageInputWrapper);
  wrapper.appendChild(innerWrapper);
  wrapper.insertBefore(innerWrapper, innerWrapper.previousElementSibling);
  wrapper.insertBefore(innerWrapper, innerWrapper.previousElementSibling);
}

// Create the image input wrapper
function createImageInputWrapper () {
  const wrapper = document.getElementById('image-input-outer-wrapper');

  const innerWrapper = document.createElement('div');
  innerWrapper.classList.add('settings-each-input-wrapper');

  const inputTitle = document.createElement('span');
  inputTitle.classList.add('general-input-title');
  inputTitle.innerHTML = 'Profile Photo';
  innerWrapper.appendChild(inputTitle);
  
  const imageInputWrapper = document.createElement('label');
  imageInputWrapper.classList.add('general-choose-image-input-text');

  const imageSpan = document.createElement('span');
  imageSpan.innerHTML = 'Choose a profile photo';
  imageInputWrapper.appendChild(imageSpan);

  const imageInput = document.createElement('input');
  imageInput.classList.add('display-none');
  imageInput.id = 'image-input';
  imageInput.type = 'file';
  imageInput.accept = 'image/*';
  imageInputWrapper.appendChild(imageInput);

  innerWrapper.appendChild(imageInputWrapper);
  wrapper.appendChild(innerWrapper);
  wrapper.insertBefore(innerWrapper, innerWrapper.previousElementSibling);
  wrapper.insertBefore(innerWrapper, innerWrapper.previousElementSibling);
}

// Save new profile image
function saveCompanyProfileImage (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/settings?id=${companyId}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({
    profile_photo: url
  }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error)
        return callback(response.error);

      return callback(null);
    }
  };
}

window.onload = () => {
  listenDropDownListInputs(document); // Listen for drop down items
  companyId = JSON.parse(document.getElementById('company-data-json').value)._id.toString();

  document.addEventListener('input', event => {
    if (event.target.id == 'image-input') {
      const imageInput = event.target;
      const file = imageInput.files[0];
      imageInput.parentNode.childNodes[0].innerHTML = 'Uploading...';
      imageInput.type = 'text';
      imageInput.parentNode.style.cursor = 'progress';
  
      uploadImage(file, (err, url) => {
        if (err) {
          return createConfirm({
            title: 'Upload Error',
            text: 'An error occured while we are uploading your image, please try again.',
            reject: 'Continue'
          }, res => {});
        }
  
        saveCompanyProfileImage(url, err => {
          if (err) {
            return createConfirm({
              title: 'Upload Error',
              text: 'An error occured while we are uploading your image, please try again.',
              reject: 'Continue'
            }, res => {});
          }
  
          imageInput.parentNode.parentNode.remove();
          createProfileImageWrapper(url);
          document.querySelector('.header-user-logo').childNodes[0].src = url;
        });
      });
    } else {
      isDataChanged = true;
      document.querySelector('.unsaved-changes-text').style.display = 'block';
    }
  });

  document.addEventListener('click', event => {
    if (event.target.classList.contains('general-drop-down-list-each-item')) {
      isDataChanged = true;
      document.querySelector('.unsaved-changes-text').style.display = 'block';
    }

    if (event.target.classList.contains('settings-save-changes-button') || (event.target.parentNode && event.target.parentNode.classList.contains('settings-save-changes-button'))) {
      checkCompanyData(res => {
        if (res) {
          isSaving = true;
          document.querySelector('.settings-save-changes-button').style.cursor = 'progress';
          document.querySelector('.unsaved-changes-text').innerHTML = 'Saving...';

          saveCompanyData(err => {
            if (err && err == 'phone_validation') {
              return createConfirm({
                title: 'Phone number is not valid',
                text: 'Please enter a valid phone number',
                reject: 'Continue'
              }, res => {
                isSaving = false;
                document.querySelector('.settings-save-changes-button').style.cursor = 'pointer';
                document.querySelector('.unsaved-changes-text').innerHTML = 'You have unsaved changes';
                return;
              });
            }

            if (err) {
              return createConfirm({
                title: 'An error occured',
                text: 'An error occured while we are saving your data. Please check what you wrote and try again.',
                reject: 'Continue'
              }, res => {
                isSaving = false;
                document.querySelector('.settings-save-changes-button').style.cursor = 'pointer';
                document.querySelector('.unsaved-changes-text').innerHTML = 'You have unsaved changes';
                return;
              });
            }

            setTimeout(() => {
              isSaving = false;
              isDataChanged = false;
              document.querySelector('.settings-save-changes-button').style.cursor = 'pointer';
              document.querySelector('.unsaved-changes-text').innerHTML = 'You have unsaved changes';
              document.querySelector('.unsaved-changes-text').style.display = 'none';
            }, 1000); // Wait for one second before finish saving, for better UX
          });
        }
      });
    }

    if (event.target.classList.contains('logout-button') || (event.target.parentNode && event.target.parentNode.classList.contains('logout-button'))) {
      createConfirm({
        title: 'Are you sure you want to logout',
        text: 'Please confirm you want to logout',
        reject: 'Cancel',
        accept: 'Continue'
      }, res => {
        if (res) return window.location = '/auth/logout';
      });
    }

    if (event.target.classList.contains('change-password-button') || (event.target.parentNode && event.target.parentNode.classList.contains('change-password-button'))) {
      document.querySelector('.change-password-outer-wrapper').style.display = 'flex';
    }

    if (event.target.classList.contains('change-password-outer-wrapper')) {
      document.querySelector('.change-password-outer-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('save-new-password-button')) {
      saveNewPassword(res => {
        if (res) {
          document.getElementById('password-error').childNodes[0].innerHTML = '';

          createConfirm({
            title: 'Your password is updated',
            text: 'You changed your password, please use your new password to login',
            accept: 'Continue'
          }, res => {
            document.querySelector('.change-password-outer-wrapper').style.display = 'none';
            document.getElementById('company-old-password-input').value = '';
            document.getElementById('company-new-password-input').value = '';
            document.getElementById('company-confirm-password-input').value = '';
          });
        }
      })
    }

    if (event.target.classList.contains('delete-company-image-button')) {
      createConfirm({
        title: 'Are you sure you want to delete your profile photo?',
        text: 'Please confirm you want to delete your profile photo',
        reject: 'Cancel',
        accept: 'Continue'
      }, res => {
        if (!res) return;

        saveCompanyProfileImage(null, err => {
          if (err) {
            return createConfirm({
              title: 'Upload Error',
              text: 'An error occured while we are uploading your image, please try again.',
              reject: 'Continue'
            }, res => {});
          }
          event.target.parentNode.parentNode.remove();
          createImageInputWrapper();
          document.querySelector('.header-user-logo').childNodes[0].src = '/res/images/default/company.png';
        });
      });
    }
  });
}
