// Create the image input wrapper with given url
function createImageInputWrapper (url) {
  const wrapper = document.querySelector('.create-project-wrapper');
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
  i.classList.add('delete-project-image-button');
  imageInputWrapper.appendChild(i);

  wrapper.appendChild(imageInputWrapper);
  wrapper.insertBefore(imageInputWrapper, imageInputWrapper.previousElementSibling);
  wrapper.insertBefore(imageInputWrapper, imageInputWrapper.previousElementSibling);
}

// Deletes the image with the given url from the server
function deleteImage (url) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/delete');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({ url }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error)
        return console.log(response.error);
    }
  };
}

// Uploads the file as image and sets the image input value accordingly, deletes the old image if there is any
function uploadImage (file) {
  document.querySelector('.general-choose-image-input-text').childNodes[0].innerHTML = 'Uploading...';
  document.querySelector('.general-choose-image-input-text').childNodes[1].type = 'text';
  document.querySelector('.general-choose-image-input-text').style.cursor = 'progress';

  const formdata = new FormData();
  formdata.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/upload');
  xhr.send(formdata);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      document.querySelector('.general-choose-image-input-text').style.display = 'none';

      if (!response.success)
        return alert(`An unknown error occured, please try again later. Error Message: ${response.error}`);

      document.getElementById('project-image-value-input').value = response.url;
      createImageInputWrapper(response.url);
    }
  };
}

window.onload = () => {
  const createProjectOuterWrapper = document.querySelector('.create-project-outer-wrapper');
  const noProjectWrapper = document.querySelector('.no-project-wrapper');
  let isStartProjectOpen = false; // See if this is the first project of the user

  const projectCreateForm = document.querySelector('.create-project-wrapper');
  const projectNameInput = document.getElementById('project-name-input');
  const projectDescriptionInput = document.getElementById('project-description-input');
  const projectImageInput = document.getElementById('project-image-input');
  const projectImageValueInput = document.getElementById('project-image-value-input');
  const projectError = document.getElementById('project-error');

  document.addEventListener('click', event => {
    // Open create project wrapper
    if (event.target.classList.contains('start-project-button') || event.target.parentNode.classList.contains('start-project-button')) {
      isStartProjectOpen = true;
      createProjectOuterWrapper.style.display = 'flex';
      noProjectWrapper.style.display = 'none';
    } else if (event.target.classList.contains('open-create-project-wrapper-button') || event.target.parentNode.classList.contains('open-create-project-wrapper-button')) {
      createProjectOuterWrapper.style.display = 'flex';
    }

    // Close create project wrapper
    if (event.target.classList.contains('create-project-outer-wrapper')) {
      createProjectOuterWrapper.style.display = 'none';
      projectError.childNodes[0].innerHTML = "";
      if (isStartProjectOpen)
        noProjectWrapper.style.display = 'flex';
    }

    // Delete uploaded image
    if (event.target.classList.contains('delete-project-image-button')) {
      const url = document.getElementById('project-image-value-input').value;
      document.getElementById('project-image-value-input').value = null;
      document.querySelector('.general-image-input-wrapper').remove();
      document.querySelector('.general-choose-image-input-text').style.cursor = 'pointer';
      document.querySelector('.general-choose-image-input-text').childNodes[0].innerHTML = 'Choose an image or a logo for your project';
      document.querySelector('.general-choose-image-input-text').childNodes[1].type = 'file';
      document.querySelector('.general-choose-image-input-text').style.display = 'flex';
      deleteImage(url);
    }
  });

  projectImageInput.onchange = () => {
    uploadImage(projectImageInput.files[0]);
  }

  projectCreateForm.onsubmit = event => {
    event.preventDefault();

    if (!projectNameInput.value || !projectNameInput.value.length || !projectDescriptionInput.value || !projectDescriptionInput.value.length || !projectImageValueInput.value || !projectImageValueInput.value.length)
      return projectError.childNodes[0].innerHTML = "Please enter all the fields";

    if (projectNameInput.value.length > 1000 || projectDescriptionInput.value.length > 1000)
      return projectError.childNodes[0].innerHTML = "Project name and description cannot be longer than 1000 characters";

    return projectCreateForm.submit();
  }
}
