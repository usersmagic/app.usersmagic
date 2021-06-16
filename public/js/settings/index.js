const random_color_values = ['rgb(3, 17, 73)', 'rgb(254, 211, 85)', 'rgb(46, 197, 206)', 'rgb(241, 120, 182)', 'rgb(120, 121, 241)'];
const allowed_company_roles = ['ui_designer', 'ux_designer', 'user_researcher', 'full_stack_designer', 'product_manager', 'developer', 'manager', 'sales', 'marketing', 'other'];
let user, randomColor = null, saveButtonActive = false, saving = false;

function throwUnknownError() {
  createConfirm({
    title: document.getElementById('unknown-error').innerHTML,
    text: '',
    reject: document.getElementById('confirm').innerHTML
  }, res => { return; });
}

function settingsDrowDownInputListener () {
  // Listen for drop down input focus in event
  document.addEventListener('focusin', event => {
    if (event.target.classList.contains('settings-drop-down-list-input')) {
      event.target.parentNode.classList.add('settings-drop-down-list-open-bottom-animation-class');
      event.target.parentNode.classList.remove('settings-drop-down-list-close-up-animation-class');
      event.target.parentNode.style.outlineColor = 'rgba(46, 197, 206, 0.6)';
      event.target.parentNode.style.outlineWidth = '0.5px';
      event.target.parentNode.style.outlineStyle = 'auto';
    }
  });

  // Listen for drop down input focus out event
  document.addEventListener('focusout', event => {
    if (event.target.classList.contains('settings-drop-down-list-input') && event.target.parentNode.classList.contains('settings-drop-down-list-open-bottom-animation-class')) {
      event.target.parentNode.classList.remove('settings-drop-down-list-open-bottom-animation-class');
      event.target.parentNode.classList.add('settings-drop-down-list-close-up-animation-class');
      event.target.parentNode.style.outline = 'none';
    }
  });

  // Listen for drop down input event, search the values with the given input
  document.addEventListener('input', event => {
    if (event.target.classList.contains('settings-drop-down-list-input')) {
      event.target.parentNode.parentNode.querySelector('.settings-drop-down-list-input-not-visible').value = '';
      const values = JSON.parse(event.target.parentNode.querySelector('.settings-drop-down-list-items-json').value);
      const wrapper = event.target.parentNode.querySelector('.settings-drop-down-choices-wrapper');

      wrapper.innerHTML = ''; // Reset content of the wrapper
      const inputValue = event.target.value.toLowerCase().trim();

      values.forEach(value => {
        if (inputValue.length) { // If there is a search text
          if (value.name.toLowerCase().trim().includes(inputValue)) { // Take documents that include the given text
            const newValue = document.createElement('span');
            newValue.classList.add('settings-drop-down-list-each-item');
            newValue.id = value.id;
            newValue.innerHTML = value.name;
            wrapper.appendChild(newValue);
            // while (newValue.previousElementSibling && value.name.toLowerCase().trim().indexOf(inputValue) < newValue.previousElementSibling.innerHTML.toLowerCase().trim().indexOf(inputValue))
            //   wrapper.insertBefore(newValue, newValue.previousElementSibling);
          }
          if (value.name.toLowerCase().trim() == inputValue) { // If the name exactly matches the value, take this value
            event.target.parentNode.parentNode.querySelector('.settings-drop-down-list-input-not-visible').value = value.id;
          }
        } else { // Select all elements
          const newValue = document.createElement('span');
          newValue.classList.add('settings-drop-down-list-each-item');
          newValue.id = value.id;
          newValue.innerHTML = value.name;
          wrapper.appendChild(newValue);
        }
      });
    }
  });

  // Listen for click events
  document.addEventListener('click', event => {
    // Click on a list item, change value and id accordingly
    if (event.target.classList.contains('settings-drop-down-list-each-item')) {
      event.target.parentNode.parentNode.querySelector('.settings-drop-down-list-input').value = event.target.innerHTML;
      event.target.parentNode.parentNode.querySelector('.settings-drop-down-list-input-not-visible').value = event.target.id;
    }
  });
}

function saveGeneralData() {
  if (saving) return;

  const settingsGeneralSaveButton = document.querySelector('.settings-general-save-button');

  saving = true;
  const name = document.getElementById('name-input').value.trim();
  const company_role = document.getElementById('company-role-input').value.trim();

  const nameError = document.getElementById('name-input-error');
  const companyRoleError = document.getElementById('company-role-input-error');

  nameError.style.display = companyRoleError.style.display = 'none';

  if (!name || !name.length) {
    document.getElementById('name-title').scrollIntoView(true);
    nameError.style.display = 'block';
    nameError.classList.remove('blink-red-animation-class');
    nameError.classList.add('blink-red-animation-class');
    saving = false;
    return;
  }

  if (!company_role || !allowed_company_roles.includes(company_role)) {
    document.getElementById('company-role-title').scrollIntoView(true);
    companyRoleError.style.display = 'block';
    companyRoleError.classList.remove('blink-red-animation-class');
    companyRoleError.classList.add('blink-red-animation-class');
    saving = false;
    return;
  }

  if (document.getElementById('company-name-input')) { // User is admin
    const company_name = document.getElementById('company-name-input').value.trim();
    const companyNameError = document.getElementById('company-name-input-error');
    companyNameError.style.display = 'none';

    if (!company_name || !company_name.length) {
      document.getElementById('company-name-title').scrollIntoView(true);
      companyNameError.style.display = 'block';
      companyNameError.classList.remove('blink-red-animation-class');
      companyNameError.classList.add('blink-red-animation-class');
      saving = false;
      return;
    }

    document.querySelector('.settings-general-saving').style.display = 'flex';

    serverRequest('/settings', 'POST', {
      name: name,
      role: company_role,
      company_name
    }, res => {
      setTimeout(() => {
        document.querySelector('.settings-general-saving').style.display = 'none';
        saveButtonActive = saving = false;
        settingsGeneralSaveButton.style.backgroundColor = 'rgba(196, 196, 196, 0.5)';
        settingsGeneralSaveButton.style.cursor = 'not-allowed';
        settingsGeneralSaveButton.style.color = 'rgb(117, 112, 101)';
        settingsGeneralSaveButton.style.fontWeight = '600';
        if (!res.success) throwUnknownError();
      }, 1000);    
    });
  } else {
    serverRequest('/settings', 'POST', {
      name: name,
      role: company_role
    }, res => {
      setTimeout(() => {
        document.querySelector('.settings-general-saving').style.display = 'none';
        saveButtonActive = saving = false;
        settingsGeneralSaveButton.style.backgroundColor = 'rgba(196, 196, 196, 0.5)';
        settingsGeneralSaveButton.style.cursor = 'not-allowed';
        settingsGeneralSaveButton.style.color = 'rgb(117, 112, 101)';
        settingsGeneralSaveButton.style.fontWeight = '600';
        if (!res.success) throwUnknownError();
      }, 1000);        
    });
  }
} 

function updateUserPhoto(photo) {
  const settingsGeneralInnerWrapper = document.querySelector('.settings-general-inner-wrapper');

  if (photo) {
    const settingsProfilePhoto = document.createElement('div');
    settingsProfilePhoto.classList.add('settings-profile-photo');
    const image = document.createElement('img');
    image.src = photo;
    image.alt = 'usersmagic company user';
    settingsProfilePhoto.appendChild(image);

    const deletePhotoButton = document.createElement('span');
    deletePhotoButton.classList.add('change-photo-button');
    deletePhotoButton.classList.add('delete-user-profile-photo-button');
    deletePhotoButton.innerHTML = document.getElementById('delete-photo').innerHTML;
    

    settingsGeneralInnerWrapper.appendChild(settingsProfilePhoto);
    settingsGeneralInnerWrapper.appendChild(deletePhotoButton);
    while (deletePhotoButton.previousElementSibling && deletePhotoButton.previousElementSibling.id != 'photo-title')
      settingsGeneralInnerWrapper.insertBefore(deletePhotoButton, deletePhotoButton.previousElementSibling);
    while (settingsProfilePhoto.previousElementSibling && settingsProfilePhoto.previousElementSibling.id != 'photo-title')
      settingsGeneralInnerWrapper.insertBefore(settingsProfilePhoto, settingsProfilePhoto.previousElementSibling);
  } else {
    const settingsDefaultProfilePhoto = document.createElement('div');
    settingsDefaultProfilePhoto.classList.add('settings-default-profile-photo');
    settingsDefaultProfilePhoto.style.backgroundColor = user.color;
    const span = document.createElement('span');
    span.innerHTML = user.name.split(' ')[0][0] + user.name.split(' ')[user.name.split(' ').length-1][0];
    settingsDefaultProfilePhoto.appendChild(span);

    const changePhotoButton = document.createElement('label');
    changePhotoButton.classList.add('change-photo-button');
    changePhotoButton.innerHTML = document.getElementById('upload-photo').innerHTML;
    const input = document.createElement('input');
    input.classList.add('display-none');
    input.type = 'file';
    input.id = 'user-photo-input';
    input.multiple = false;
    input.accept = 'image/*';
    changePhotoButton.appendChild(input);

    settingsGeneralInnerWrapper.appendChild(settingsDefaultProfilePhoto);
    settingsGeneralInnerWrapper.appendChild(changePhotoButton);
    while (changePhotoButton.previousElementSibling && changePhotoButton.previousElementSibling.id != 'photo-title')
      settingsGeneralInnerWrapper.insertBefore(changePhotoButton, changePhotoButton.previousElementSibling);
    while (settingsDefaultProfilePhoto.previousElementSibling && settingsDefaultProfilePhoto.previousElementSibling.id != 'photo-title')
      settingsGeneralInnerWrapper.insertBefore(settingsDefaultProfilePhoto, settingsDefaultProfilePhoto.previousElementSibling);
  }
}

function createNewMember(user) {
  const eachTeamUser = document.createElement('div');
  eachTeamUser.classList.add('each-team-user');

  const eachTeamUserDefaultProfile = document.createElement('div');
  eachTeamUserDefaultProfile.classList.add('each-team-user-default-profile');
  eachTeamUserDefaultProfile.style.backgroundColor = user.color;

  const span = document.createElement('span');
  span.innerHTML = user.name.split(' ')[0][0] + user.name.split(' ')[user.name.split(' ').length-1][0];
  eachTeamUserDefaultProfile.appendChild(span);
  eachTeamUser.appendChild(eachTeamUserDefaultProfile);

  const eachTeamUserName = document.createElement('span');
  eachTeamUserName.classList.add('each-team-user-name');
  eachTeamUserName.innerHTML = user.name;
  eachTeamUser.appendChild(eachTeamUserName);

  if (user.type == 'admin') {
    const eachTeamUserAdmin = document.createElement('span');
    eachTeamUserAdmin.classList.add('each-team-user-admin');
    eachTeamUserAdmin.innerHTML = document.getElementById('admin').innerHTML;
    eachTeamUser.appendChild(eachTeamUserAdmin);
  }

  const eachTeamUserRole = document.createElement('span');
  eachTeamUserRole.classList.add('each-team-user-role');
  eachTeamUserRole.innerHTML = document.getElementById(user.role).innerHTML;
  eachTeamUser.appendChild(eachTeamUserRole);

  const settingsTeamInnerWrapper = document.querySelector('.settings-team-inner-wrapper');
  settingsTeamInnerWrapper.appendChild(eachTeamUser);

  while (eachTeamUser.previousElementSibling && !eachTeamUser.previousElementSibling.classList.contains('each-team-user'))
    settingsTeamInnerWrapper.insertBefore(eachTeamUser, eachTeamUser.previousElementSibling);
}

function addNewMember(member) {
  const eachAddedMember = document.createElement('div');
  eachAddedMember.classList.add('each-added-member');
  eachAddedMember.id = member._id;

  if (member.profile_photo) {
    const profile = document.createElement('div');
    profile.classList.add('each-team-member-input-list-profile');
    const img = document.createElement('img');
    img.src = member.profile_photo;
    img.alt = member.name;
    profile.appendChild(img);
    eachAddedMember.appendChild(profile);
  } else {
    const profileDefault = document.createElement('div');
    profileDefault.classList.add('each-team-member-input-list-default-profile');
    profileDefault.style.backgroundColor = member.color;
    const span = document.createElement('span');
    span.innerHTML = member.name.split(' ')[0][0] + member.name.split(' ')[member.name.split(' ').length-1][0];
    profileDefault.appendChild(span);
    eachAddedMember.appendChild(profileDefault);
  }
  
  const eachMemberName = document.createElement('span');
  eachMemberName.innerHTML = member.name;
  eachAddedMember.appendChild(eachMemberName);

  const deleteEachMember = document.createElement('i');
  deleteEachMember.classList.add('fas');
  deleteEachMember.classList.add('fa-times');
  deleteEachMember.classList.add('delete-each-member');
  eachAddedMember.appendChild(deleteEachMember);

  document.querySelector('.team-members-wrapper').appendChild(eachAddedMember);
  document.querySelector('.team-members-wrapper').insertBefore(eachAddedMember, eachAddedMember.previousElementSibling);
}

function addMemberToInputUserList(member) {
  const eachTeamMemberInputList = document.createElement('div');
  eachTeamMemberInputList.classList.add('each-team-member-input-list');
  eachTeamMemberInputList.id = member._id;

  if (member.profile_photo) {
    const profile = document.createElement('div');
    profile.classList.add('each-team-member-input-list-profile');
    const img = document.createElement('img');
    img.src = member.profile_photo;
    img.alt = member.name;
    profile.appendChild(img);
    eachTeamMemberInputList.appendChild(profile);
  } else {
    const profileDefault = document.createElement('div');
    profileDefault.classList.add('each-team-member-input-list-default-profile');
    profileDefault.style.backgroundColor = member.color;
    const span = document.createElement('span');
    span.innerHTML = member.name.split(' ')[0][0] + member.name.split(' ')[member.name.split(' ').length-1][0];
    profileDefault.appendChild(span);
    eachTeamMemberInputList.appendChild(profileDefault);
  }

  const span = document.createElement('span');
  span.innerHTML = member.name;
  eachTeamMemberInputList.appendChild(span);

  document.querySelector('.team-members-input-list-wrapper').appendChild(eachTeamMemberInputList);
}

function checkInviteMemberButtonStatus() {
  const type = document.querySelector('.selected-invite-member-wrapper');
  const email = document.getElementById('invite-member-email-input').value;
  const name = document.getElementById('invite-member-name-input').value;
  const password = document.getElementById('invite-member-password-input').value;
  const confirmPassword = document.getElementById('invite-member-confirm-password-input').value;

  const approveButton = document.querySelector('.approve-invite-member-button');

  if (type && email && email.length && name && name.length && password && password.length && confirmPassword && confirmPassword.length) {
    approveButton.style.backgroundColor = 'rgb(46, 197, 206)';
    approveButton.style.cursor = 'pointer';
  } else {
    approveButton.style.backgroundColor = 'rgba(186, 183, 178, 0.5)';
    approveButton.style.cursor = 'not-allowed';
  }

  setTimeout(() => {
    checkInviteMemberButtonStatus();
  }, 1000);
}

function checkCreateTeamButtonStatus() {
  const name = document.querySelector('.create-team-name-input').value.trim();
  const members = [];
  const memberNodes = document.querySelector('.team-members-wrapper').childNodes;

  for (let i = 0; i < memberNodes.length-1; i ++)
    members.push(memberNodes[i].id);

  const approveButton = document.querySelector('.approve-create-team-button');

  if (name && name.length && members.length) {
    approveButton.style.backgroundColor = 'rgb(46, 197, 206)';
    approveButton.style.cursor = 'pointer';
  } else {
    approveButton.style.backgroundColor = 'rgba(186, 183, 178, 0.5)';
    approveButton.style.cursor = 'not-allowed';
  }

  setTimeout(() => {
    checkCreateTeamButtonStatus();
  }, 1000);
}

function pushNewTeam() {

}

window.onload = () => {
  settingsDrowDownInputListener();

  user = JSON.parse(document.getElementById('user-json').value);

  if (user.type == 'admin') {
    checkInviteMemberButtonStatus();
    checkCreateTeamButtonStatus();
  }

  const logoutConfirmTitle = document.getElementById('logout-confirm-title').innerHTML;
  const logout = document.getElementById('logout').innerHTML;
  const confirmInviteRequestTitle = document.getElementById('confirm-invite-request-title').innerHTML;
  const confirmInviteRequest = document.getElementById('confirm-invite-request').innerHTML;
  const teamCreateTitle = document.getElementById('team-create-title').innerHTML;
  const teamCreateText = document.getElementById('team-create-text').innerHTML;
  const deletePhotoTitle = document.getElementById('delete-photo-title').innerHTML;
  const deletePhotoText = document.getElementById('delete-photo-text').innerHTML;
  const confirm = document.getElementById('confirm').innerHTML;
  const cancel = document.getElementById('cancel').innerHTML;
  const passwordLengthError = document.getElementById('password-length-error').innerHTML;
  const confirmPasswordError = document.getElementById('confirm-password-error').innerHTML;
  const emailValidationError = document.getElementById('email-validation-error').innerHTML;
  const emailDuplicatedError = document.getElementById('email-duplicated-error').innerHTML;
  const networkError = document.getElementById('network-error').innerHTML;
  const unknownError = document.getElementById('unknown-error').innerHTML;

  const settingsChangePageLine = document.querySelector('.settings-change-page-line');

  const settingsGeneralSaveButtonWrapper = document.querySelector('.settings-general-save-button-wrapper');
  const settingsGeneralSaveButton = document.querySelector('.settings-general-save-button');
  const settingsGeneralWrapper = document.querySelector('.settings-general-wrapper');
  const settingsPlanTitle = document.querySelector('.settings-plan-title');
  const settingsPlanWrapper = document.querySelector('.settings-plan-wrapper');
  const settingsTeamWrapper = document.querySelector('.settings-team-wrapper');

  document.addEventListener('click', event => {
    if (event.target.parentNode.classList.contains('settings-change-page-buttons-wrapper') && !event.target.classList.contains('selected-change-button')) {
      const current = document.querySelector('.selected-change-button').innerHTML;
      const selected = event.target.innerHTML;

      document.querySelector('.selected-change-button').classList.remove('selected-change-button');
      event.target.classList.add('selected-change-button');

      settingsChangePageLine.style.animation = `from${current}To${selected} 0.2s ease-in-out 0s 1 forwards`;

      if (current == 'General')
        settingsGeneralSaveButtonWrapper.style.display = settingsGeneralWrapper.style.display = 'none';
      else if (current == 'Plan')
        settingsPlanTitle.style.display = settingsPlanWrapper.style.display = 'none';
      else if (current == 'Team')
        settingsTeamWrapper.style.display = 'none';
      

      if (selected == 'General')
        settingsGeneralSaveButtonWrapper.style.display = settingsGeneralWrapper.style.display = 'flex';
      else if (selected == 'Plan')
        settingsPlanTitle.style.display = settingsPlanWrapper.style.display = 'flex';
      else if (selected == 'Team')
        settingsTeamWrapper.style.display = 'flex';
    }

    if (event.target.classList.contains('logout-button')) {
      createConfirm({
        title: logoutConfirmTitle,
        text: '',
        reject: cancel,
        accept: logout
      }, res => {
        if (res) window.location = '/auth/logout';
      });
    }

    if (event.target.classList.contains('settings-general-save-button') && saveButtonActive) {
      saveGeneralData();
    }

    if (event.target.classList.contains('delete-user-profile-photo-button')) {
      createConfirm({
        title: deletePhotoTitle,
        text: deletePhotoText,
        reject: cancel,
        accept: confirm
      }, res => {
        if (!res) return;

        deleteImage(event.target.previousElementSibling.childNodes[0].src, err => {
          if (err) return throwUnknownError();

          event.target.previousElementSibling.remove();
          event.target.remove();
  
          serverRequest('/settings', 'POST', {
            profile_photo: ''
          }, res => {
            if (!res.success) return throwUnknownError();
  
            updateUserPhoto();
          });
        });
      });
    }

    if (event.target.classList.contains('change-password-button') || event.target.parentNode.classList.contains('change-password-button')) {
      const oldPassword = document.getElementById('old-password-input').value;
      const newPassword = document.getElementById('new-password-input').value;
      const confirmPassword = document.getElementById('confirm-password-input').value;
      const passwordError = document.querySelector('.change-password-error');

      passwordError.innerHTML = '';
      passwordError.classList.remove('blink-red-animation-class');

      if (!oldPassword || !oldPassword.length) {
        passwordError.innerHTML = document.getElementById('enter-old-password-error').innerHTML;
        passwordError.classList.add('blink-red-animation-class');
        return;
      }

      if (!newPassword || !newPassword.length) {
        passwordError.innerHTML = document.getElementById('enter-new-password-error').innerHTML;
        passwordError.classList.add('blink-red-animation-class');
        return;
      }

      if (newPassword.length < 6) {
        passwordError.innerHTML = document.getElementById('short-password-error').innerHTML;
        passwordError.classList.add('blink-red-animation-class');
        return;
      }

      if (!confirmPassword || !confirmPassword.length || newPassword != confirmPassword) {
        passwordError.innerHTML = document.getElementById('confirm-new-password-error').innerHTML;
        passwordError.classList.add('blink-red-animation-class');
        return;
      }

      serverRequest('/auth/change_password', 'POST', {
        old_password: oldPassword,
        new_password: newPassword
      }, res => {
        if (res.success) {
          document.getElementById('old-password-input').value = '';
          document.getElementById('new-password-input').value = '';
          document.getElementById('confirm-password-input').value = '';

          createConfirm({
            title: document.getElementById('password-changed').innerHTML,
            text: '',
            accept: confirm
          }, res => { return });
        } else {
          if (res.error == 'password_verification') {
            passwordError.innerHTML = document.getElementById('wrong-old-password-error').innerHTML;
            passwordError.classList.add('blink-red-animation-class');
          } else {
            passwordError.innerHTML = document.getElementById('unknown-error').innerHTML;
            passwordError.classList.add('blink-red-animation-class');
          }
        }
      });
    }

    if (event.target.classList.contains('invite-member-button') || event.target.parentNode.classList.contains('invite-member-button')) {
      document.querySelector('.invite-member-button').style.display = 'none';
      document.querySelector('.invite-member-wrapper').style.display = 'flex';
    }

    if (event.target.classList.contains('invite-member-close-button')) {
      document.querySelector('.invite-member-button').style.display = 'flex';
      document.querySelector('.invite-member-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('invite-member-each-type')) {
      if (document.querySelector('.selected-invite-member-wrapper'))
        document.querySelector('.selected-invite-member-wrapper').classList.remove('selected-invite-member-wrapper');

      event.target.classList.add('selected-invite-member-wrapper');
    } else if (event.target.parentNode && event.target.parentNode.classList.contains('invite-member-each-type')) {
      if (document.querySelector('.selected-invite-member-wrapper'))
        document.querySelector('.selected-invite-member-wrapper').classList.remove('selected-invite-member-wrapper');

      event.target.parentNode.classList.add('selected-invite-member-wrapper');
    }

    if (event.target.classList.contains('approve-invite-member-button')) {
      const type = document.querySelector('.selected-invite-member-wrapper') ? document.querySelector('.selected-invite-member-wrapper').id : null;
      const email = document.getElementById('invite-member-email-input').value;
      const name = document.getElementById('invite-member-name-input').value;
      const password = document.getElementById('invite-member-password-input').value;
      const confirmPassword = document.getElementById('invite-member-confirm-password-input').value;

      const inviteMemberError = document.querySelector('.invite-member-error');
      inviteMemberError.innerHTML = '';

      if (type && email && email.length && name && name.length && password && password.length && confirmPassword && confirmPassword.length) {
        if (password.length < 6)
          return inviteMemberError.innerHTML = passwordLengthError;

        if (password != confirmPassword)
          return inviteMemberError.innerHTML = confirmPasswordError;

        createConfirm({
          title: confirmInviteRequestTitle,
          text: confirmInviteRequest,
          reject: cancel,
          accept: confirm
        }, res => {
          if (!res) return;

          serverRequest('/settings/member/invite', 'POST', {
            type,
            email,
            name,
            password
          }, res => {
            if (res.success) {
              createNewMember(res.user);
              document.querySelector('.invite-member-button').style.display = 'flex';
              document.querySelector('.invite-member-wrapper').style.display = 'none';
            } else {
              if (res.error == 'bad_request' || res.error == 'email_submition')
                return createConfirm({
                  title: '',
                  text: emailValidationError,
                  reject: confirm
                }, res => { return });

              if (res.error == 'duplicated_unique_field')
                return createConfirm({
                  title: '',
                  text: emailDuplicatedError,
                  reject: confirm
                }, res => { return });

              if (res.error == 'network_error')
                return createConfirm({
                  title: '',
                  text: networkError,
                  reject: confirm
                }, res => { return });
                
              return createConfirm({
                title: '',
                text: unknownError,
                reject: confirm
              }, res => { return });
            }
          });
        });
      }
    }

    if (event.target.classList.contains('create-team-button') || event.target.parentNode.classList.contains('create-team-button')) {
      document.querySelector('.create-team-button').style.display = 'none';
      document.querySelector('.create-team-wrapper').style.display = 'flex';
    }

    if (event.target.classList.contains('create-team-close-button')) {
      document.querySelector('.create-team-button').style.display = 'flex';
      document.querySelector('.create-team-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('create-team-name-reset-button')) {
      document.querySelector('.create-team-name').style.display = 'none';
      document.querySelector('.create-team-name-reset-button').style.display = 'none';
      document.querySelector('.create-team-name-input').style.display = 'block';
    }

    if (event.target.classList.contains('each-team-member-input-list')) {
      const member = user.company.users.find(each => each._id == event.target.id);
      event.target.remove();
      addNewMember(member);
    } else if (event.target.parentNode && event.target.parentNode.classList.contains('each-team-member-input-list')) {
      const member = user.company.users.find(each => each._id == event.target.parentNode.id);
      event.target.parentNode.remove();
      addNewMember(member);
    } else if (event.target.parentNode && event.target.parentNode.parentNode && event.target.parentNode.parentNode.classList.contains('each-team-member-input-list')) {
      const member = user.company.users.find(each => each._id == event.target.parentNode.parentNode.id);
      event.target.parentNode.parentNode.remove(); 
      addNewMember(member);
    }

    if (event.target.classList.contains('delete-each-member')) {
      checkCreateTeamButtonStatus();
      const target = event.target.parentNode;
      const member = user.company.users.find(each => each._id == target.id);
      if (!member)
        return;
      addMemberToInputUserList(member);
      target.remove();
    }

    if (event.target.classList.contains('approve-create-team-button')) {
      const name = document.querySelector('.create-team-name-input').value.trim();
      const members = [];
      const memberNodes = document.querySelector('.team-members-wrapper').childNodes;

      for (let i = 0; i < memberNodes.length-1; i ++)
        members.push(memberNodes[i].id);

      if (!name || !name.length || !members.length)
        return;

      if (!randomColor)
        randomColor = random_color_values[parseInt(Math.random() * (random_color_values.length-1))];

      createConfirm({
        title: teamCreateTitle,
        text: teamCreateText,
        reject: cancel,
        accept: confirm
      }, res => {
        if (!res) return;

        serverRequest('/settings/team/create', 'POST', {
          name,
          color: randomColor,
          members
        }, res => {
          if (res.success);
        });
      })
    }
  });

  document.addEventListener('focusin', event => {
    if (event.target.classList.contains('team-members-input')) {
      document.querySelector('.team-members-input-wrapper').style.overflow = 'visible';
      document.querySelector('.team-members-input').style.borderBottom = 'none';
    }
  });

  document.addEventListener('focusout', event => {
    if (event.target.classList.contains('create-team-name-input')) {
      event.target.value = event.target.value.trim();
      const input = event.target;

      if (input.value && input.value.trim().length) {
        document.querySelector('.create-team-name').innerHTML = input.value.trim();
        document.querySelector('.create-team-name').style.display = 'initial';

        if (!randomColor) {
          randomColor = random_color_values[parseInt(Math.random() * (random_color_values.length-1))];
          document.querySelector('.create-team-name').style.backgroundColor = randomColor;
        }
          
        document.querySelector('.create-team-name-reset-button').style.display = 'initial';
        input.style.display = 'none';
      }
    }

    if (event.target.classList.contains('team-members-input')) {
      setTimeout(() => {
        document.querySelector('.team-members-input-wrapper').style.overflow = 'hidden';
        document.querySelector('.team-members-input').style.borderBottom = '1px solid rgba(117, 112, 101, 0.5)';
      }, 100);
    }
  });

  document.addEventListener('keyup', event => {
    if (event.key == 'Enter' && event.target.classList.contains('create-team-name-input')) {
      event.target.value = event.target.value.trim();
      const input = event.target;

      if (input.value && input.value.trim().length) {
        document.querySelector('.create-team-name').innerHTML = input.value.trim();
        document.querySelector('.create-team-name').style.display = 'initial';
        
        if (!randomColor) {
          randomColor = random_color_values[parseInt(Math.random() * (random_color_values.length-1))]
          document.querySelector('.create-team-name').style.backgroundColor = randomColor;
        }

        document.querySelector('.create-team-name-reset-button').style.display = 'initial';
        input.style.display = 'none';
      }
    }
  });

  const teamMembersInputListWrapper = document.querySelector('.team-members-input-list-wrapper');

  document.addEventListener('input', event => {
    if (event.target.classList.contains('team-members-input')) {
      const text = event.target.value.trim().toLocaleLowerCase();
      if (!text.length) {
        teamMembersInputListWrapper.childNodes.forEach(node => {
          node.style.display = 'flex';
        });
      } else {
        teamMembersInputListWrapper.childNodes.forEach(node => {
          if (!node.childNodes[1].innerHTML.toLocaleLowerCase().includes(event.target.value.trim().toLocaleLowerCase())) {
            node.style.display = 'none';
          } else {
            node.style.display = 'flex';
          }
        });
      }
    }

    if (!saveButtonActive && (event.target.id == 'name-input' || event.target.id == 'company-role-visible-input' || event.target.id == 'company-name-input')) {
      settingsGeneralSaveButton.style.backgroundColor = 'rgb(46, 197, 206)';
      settingsGeneralSaveButton.style.cursor = 'pointer';
      settingsGeneralSaveButton.style.color = 'rgb(254, 254, 254)';
      settingsGeneralSaveButton.style.fontWeight = '700';
      saveButtonActive = true;
    }
  });

  document.addEventListener('change', event => {
    if (event.target.id == 'user-photo-input' && event.target.files.length) {
      event.target.parentNode.previousElementSibling.remove();
      event.target.parentNode.remove();
      document.getElementById('user-photo-uploading').style.display = 'block';

      uploadImage(event.target.files[0], (err, file_name) => {
        if (err) return throwUnknownError();

        serverRequest('/settings', 'POST', {
          profile_photo: file_name
        }, res => {
          document.getElementById('user-photo-uploading').style.display = 'none';

          if (!res.success) {
            updateUserPhoto();
            return throwUnknownError();
          }

          updateUserPhoto(file_name);
        });
      });
    }
  });
}
