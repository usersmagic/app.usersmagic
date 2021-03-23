// Post data for submition limit
function postSubmitionLimit (id, limit, callback) {
  const data = { limit };
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/projects/filters/submit?id=${id}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error) {
        alert("An error occured while changing data. Error message: " + (response.error.message ? response.error.message : response.error));
        return callback(true);
      }
      callback(false);
    }
  };
}

window.onload = () => {
  listenForContentHeader(document); // Listen for content header buttons
  listenDropDownListInputs(document); // Listen for drop down items
  
  const createTargetOuterWrapper = document.querySelector('.create-target-outer-wrapper');

  const targetCreateForm = document.querySelector('.create-target-wrapper');
  const targetNameInput = document.getElementById('target-name-input');
  const targetDescriptionInput = document.getElementById('target-description-input');
  const targetCountryInput = document.getElementById('target-country-input');
  const targetError = document.getElementById('target-error');

  const company = JSON.parse(document.getElementById('company-json').value);

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

    // Click start target button
    if (event.target.classList.contains('target-start-button')) {
      event.target.style.display = 'none';
      event.target.previousElementSibling.style.display = 'flex';
    }

    // Click approve tester number button
    if (event.target.classList.contains('approve-tester-number-button')) {
      const testerNumberInput = event.target.previousElementSibling;
      const target = JSON.parse(event.target.parentNode.parentNode.parentNode.childNodes[0].value);

      if (!testerNumberInput.value || isNaN(parseInt(testerNumberInput.value)) || !Number.isInteger(parseInt(testerNumberInput.value)) || parseInt(testerNumberInput.value) <= 0 || parseInt(testerNumberInput.value) > 10) {
        testerNumberInput.classList.add('blink-red-animation-class');
        setTimeout(() => {
          testerNumberInput.classList.remove('blink-red-animation-class');
        }, 600);
      } else if (company.credit < parseInt(testerNumberInput.value) * target.credit_per_user) {
        createConfirm({
          title: 'Credit Error',
          text: 'You don\'t have enough credit to buy this much testers. Please contact our team to increase your credits.',
          reject: 'Close'
        }, res => { return });
      } else {
        postSubmitionLimit(event.target.id, parseInt(testerNumberInput.value), err => {
          if (!err) location.reload();
        });
      }
    }

    // Click stop test button
    if (event.target.classList.contains('target-stop-button')) {
      createConfirm({
        title: 'Are you sure you want to pause your test?',
        text: 'Please confirm that you want to pause your test. You won\'t be refunded for your credits.',
        reject: 'Cancel',
        accept: 'Continue'
      }, res => {
        if (res)
          postSubmitionLimit(event.target.id, 0, err => {
            if (!err) location.reload();
          });
      });
    }
  });

  targetCreateForm.onsubmit = event => {
    event.preventDefault();

    if (!targetNameInput.value || !targetNameInput.value.length || !targetDescriptionInput.value || !targetDescriptionInput.value.length || !targetCountryInput.value || !targetCountryInput.value.length)
      return targetError.childNodes[0].innerHTML = "Please enter all the fields";

    if (targetNameInput.value.length > 1000 || targetDescriptionInput.value.length > 1000)
      return targetError.childNodes[0].innerHTML = "Target name and description cannot be longer than 1000 characters";

    return targetCreateForm.submit();
  };
}
