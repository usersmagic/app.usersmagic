window.onload = () => {
  const createTargetOuterWrapper = document.querySelector('.create-target-outer-wrapper');

  const targetCreateForm = document.querySelector('.create-target-wrapper');
  const targetNameInput = document.getElementById('target-name-input');
  const targetDescriptionInput = document.getElementById('target-description-input');
  const targetError = document.getElementById('target-error');

  document.addEventListener('click', event => {
    // Open create target wrapper
    if (event.target.classList.contains('open-create-target-wrapper-button') || event.target.parentNode.classList.contains('open-create-target-wrapper-button')) {
      createTargetOuterWrapper.style.display = 'flex';
    }

    // Close create target wrapper
    if (event.target.classList.contains('create-target-outer-wrapper')) {
      createTargetOuterWrapper.style.display = 'none';
      targetError.childNodes[0].innerHTML = "";
    }
  });

  targetCreateForm.onsubmit = event => {
    event.preventDefault();

    if (!targetNameInput.value || !targetNameInput.value.length || !targetDescriptionInput.value || !targetDescriptionInput.value.length)
      return targetError.childNodes[0].innerHTML = "Please enter all the fields";

    if (targetNameInput.value.length > 1000 || targetDescriptionInput.value.length > 1000)
      return targetError.childNodes[0].innerHTML = "Target name and description cannot be longer than 1000 characters";

    return targetCreateForm.submit();
  }
}
