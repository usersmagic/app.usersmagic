const question_types = {
  'yes_no': 'Yes No',
	'multiple_choice': 'Multiple Choice',
	'opinion_scale': 'Opinion Scale',
	'open_answer': 'Open Answer',
};
let project, templates = [], country = null, id;

function recreateContentOfTemplatesWrapper () {
  serverRequest(`/templates/filter?country=${country}`, 'GET', {}, res => {
    if (!res.success)
      return createConfirm({
        title: 'An unknown error occured',
        text: `Please contact our support team to resolve the issue.${res.error && res.error.length ? ' The Error Message: ' + res.error : ''}`,
        reject: 'Close'
      }, res => {});

    templates = [];
    for (let i = 0; i < Object.values(res.templates).length; i++)
      templates = templates.concat(Object.values(res.templates)[i]);

    const wrapper = document.querySelector('.templates-wrapper');
    while (wrapper.childElementCount > 1)
      wrapper.childNodes[1].remove();

    Object.keys(res.templates).forEach(title => {
      const eachTitle = document.createElement('span');
      eachTitle.classList.add('each-title');
      eachTitle.innerHTML = title;
      wrapper.appendChild(eachTitle);

      const templatesInnerWrapper = document.createElement('div');
      templatesInnerWrapper.classList.add('templates-inner-wrapper');

      res.templates[title].forEach(template => {
        const eachTemplateWrapper = document.createElement('div');
        eachTemplateWrapper.classList.add('each-template-wrapper');
        eachTemplateWrapper.id = template._id;

        const eachTemplateImageWrapper = document.createElement('div');
        eachTemplateImageWrapper.classList.add('each-template-image-wrapper');
        const img = document.createElement('img');
        img.src = template.image;
        img.alt = `usersmagic ${template.name}`;
        eachTemplateImageWrapper.appendChild(img);
        eachTemplateWrapper.appendChild(eachTemplateImageWrapper);

        const eachTemplateName = document.createElement('span');
        eachTemplateName.classList.add('each-template-name');
        eachTemplateName.innerHTML = template.name;
        eachTemplateWrapper.appendChild(eachTemplateName);

        templatesInnerWrapper.appendChild(eachTemplateWrapper);
      });

      wrapper.appendChild(templatesInnerWrapper);
    });
  });
};

function checkForCountryChange () {
  const countryInput = document.getElementById('country-input');

  if (countryInput.value && countryInput.value != country) {
    country = countryInput.value;
    recreateContentOfTemplatesWrapper();
  }

  setTimeout(() => {
    checkForCountryChange();
  }, 100);
};

function createQuestion (question) {
  const questionWrapper = document.createElement('div');
  questionWrapper.classList.add('each-question-wrapper');

  const questionInfoWrapper = document.createElement('div');
  questionInfoWrapper.classList.add('question-info-wrapper');

  const questionType = document.createElement('span');
  questionType.classList.add('question-type');
  questionType.innerHTML = question_types[question.type];
  questionInfoWrapper.appendChild(questionType);

  const questionRequired = document.createElement('span');
  questionRequired.classList.add('question-required');
  if (question.required)
    questionRequired.innerHTML = 'Required';
  else
    questionRequired.innerHTML = 'Not required'; 
  questionInfoWrapper.appendChild(questionRequired);

  questionWrapper.appendChild(questionInfoWrapper);

  const questionText = document.createElement('span');
  questionText.classList.add('question-text');
  questionText.innerHTML = question.text;
  questionWrapper.appendChild(questionText);

  if (question.type == 'yes_no') {
    const yesnoButtonsWrapper = document.createElement('div');
    yesnoButtonsWrapper.classList.add('each-question-yesno-buttons-wrapper');

    const noButton = document.createElement('div');
    noButton.classList.add('each-question-no-button');
    const noI = document.createElement('i');
    noI.classList.add('fas');
    noI.classList.add('fa-times');
    noButton.appendChild(noI);
    const noSpan = document.createElement('span');
    noSpan.innerHTML = 'NO';
    noButton.appendChild(noSpan);
    yesnoButtonsWrapper.appendChild(noButton);

    const yesButton = document.createElement('div');
    yesButton.classList.add('each-question-yes-button');
    const yesI = document.createElement('i');
    yesI.classList.add('fas');
    yesI.classList.add('fa-check');
    yesButton.appendChild(yesI);
    const yesSpan = document.createElement('span');
    yesSpan.innerHTML = 'YES';
    yesButton.appendChild(yesSpan);
    yesnoButtonsWrapper.appendChild(yesButton);

    questionWrapper.appendChild(yesnoButtonsWrapper);
  } else if (question.type == 'open_answer') {
    const inputLong = document.createElement('textarea');
    inputLong.classList.add('general-input-with-border-long');
    inputLong.classList.add('answer-input'); // For DOM selection, not styling
    inputLong.placeholder = 'Your answer';
    questionWrapper.appendChild(inputLong);
  } else if (question.type == 'opinion_scale') {
    const opinionOuterWrapper = document.createElement('div');
    opinionOuterWrapper.classList.add('each-question-opinion-outer-wrapper');

    const opinionScaleWrapper = document.createElement('div');
    opinionScaleWrapper.classList.add('each-question-opinion-scale-wrapper');
    for (let i = question.range.min; i <= question.range.max; i++) {
      if (i != question.range.min) {
        const eachEmptyScale = document.createElement('div');
        eachEmptyScale.classList.add('each-question-empty-scale');
        opinionScaleWrapper.appendChild(eachEmptyScale);
      }
      const eachScale = document.createElement('span');
      eachScale.classList.add('each-question-each-scale');
      eachScale.innerHTML = i;
      opinionScaleWrapper.appendChild(eachScale);
    }
    opinionOuterWrapper.appendChild(opinionScaleWrapper);

    const opinionLine = document.createElement('div');
    opinionLine.classList.add('each-question-opinion-line');
    for (let i = 0; i < 3; i++) {
      const eachOpinionLine = document.createElement('div');
      eachOpinionLine.classList.add('each-question-opinion-line-item');
      opinionLine.appendChild(eachOpinionLine);
    }
    opinionOuterWrapper.appendChild(opinionLine);

    const opinionTextWrapper = document.createElement('div');
    opinionTextWrapper.classList.add('each-question-opinion-text-wrapper');
    const leftOpinionText = document.createElement('span');
    leftOpinionText.classList.add('each-question-opinion-text-left');
    leftOpinionText.innerHTML = question.labels.left;
    opinionTextWrapper.appendChild(leftOpinionText);
    const middleOpinionText = document.createElement('span');
    middleOpinionText.classList.add('each-question-opinion-text-middle');
    middleOpinionText.innerHTML = question.labels.middle;
    opinionTextWrapper.appendChild(middleOpinionText);
    const rightOpinionText = document.createElement('span');
    rightOpinionText.classList.add('each-question-opinion-text-right');
    rightOpinionText.innerHTML = question.labels.right;
    opinionTextWrapper.appendChild(rightOpinionText);
    opinionOuterWrapper.appendChild(opinionTextWrapper);

    questionWrapper.appendChild(opinionOuterWrapper);
  } else if (question.type == 'multiple_choice') {
    question.choices.forEach(choice => {
      const eachQuestionChoice = document.createElement('div');
      eachQuestionChoice.classList.add('each-question-choice');
      if (question.subtype == 'single') {
        eachQuestionChoice.classList.add('each-question-choice-radio');
        const radioChoiceWrapper = document.createElement('div');
        radioChoiceWrapper.classList.add('radio-choice-wrapper');
        const radioChoiceIcon = document.createElement('div');
        radioChoiceIcon.classList.add('radio-choice-icon');
        radioChoiceWrapper.appendChild(radioChoiceIcon);
        eachQuestionChoice.appendChild(radioChoiceWrapper);
      } else {
        eachQuestionChoice.classList.add('each-question-choice-checked');
        const checkedChoiceWrapper = document.createElement('div');
        checkedChoiceWrapper.classList.add('checked-choice-wrapper');
        const checkedChoiceIcon = document.createElement('div');
        checkedChoiceIcon.classList.add('checked-choice-icon');
        checkedChoiceIcon.classList.add('fas');
        checkedChoiceIcon.classList.add('fa-check');
        checkedChoiceWrapper.appendChild(checkedChoiceIcon);
        eachQuestionChoice.appendChild(checkedChoiceWrapper);
      }
      const span = document.createElement('span');
      span.innerHTML = choice;
      eachQuestionChoice.appendChild(span);
      questionWrapper.appendChild(eachQuestionChoice);
    });
  }

  document.querySelector('.template-questions-wrapper').appendChild(questionWrapper);
};

function recreatePageForGivenTemplate () {
  let template = null;
  for (let i = 0; i < templates.length; i++)
    if (templates[i]._id == id)
      template = templates[i];

  document.querySelector('.templates-go-back-button').style.display = 'flex';
  document.querySelector('.menu-title').innerHTML = template.name;
  document.querySelector('.menu-subtitle').innerHTML = template.description;

  document.querySelector('.templates-wrapper').style.display = 'none';
  document.querySelector('.template-details-wrapper').style.display = 'flex';

  document.querySelector('.template-details-title').innerHTML = template.welcome_screen.opening;
  document.querySelector('.template-details-subtitle').innerHTML = template.welcome_screen.details;

  if (template.welcome_screen.image && template.welcome_screen.image.length) {
    document.querySelector('.template-details-image-wrapper').style.display = 'initial';
    document.querySelector('.template-details-image-wrapper').childNodes[0].src = template.welcome_screen.image;
  } else
    document.querySelector('.template-details-image-wrapper').style.display = 'none';

  document.querySelector('.template-questions-wrapper').innerHTML = '';

  template.questions.forEach(question => createQuestion(question));
};

window.onload = () => {
  project = JSON.parse(document.getElementById('project-data-json').value);
  const templatesArrayList = Object.values(JSON.parse(document.getElementById('templates-data-json').value));
  for (let i = 0; i < templatesArrayList.length; i++)
    templates = templates.concat(templatesArrayList[i]);
  country = document.getElementById('country-input').value;
  listenDropDownListInputs(document); // Listen for drop down items
  checkForCountryChange();

  document.addEventListener('click', event => {
    if (event.target.classList.contains('each-template-wrapper') || event.target.parentNode.classList.contains('each-template-wrapper') || (event.target.parentNode && event.target.parentNode.parentNode.classList.contains('each-template-wrapper'))) {
      id = event.target.id;
      if (!id || !id.length) id = event.target.parentNode.id;
      if (!id || !id.length) id = event.target.parentNode.parentNode.id;

      recreatePageForGivenTemplate(id);
    }

    if (event.target.classList.contains('templates-go-back-button') || event.target.parentNode.classList.contains('templates-go-back-button')) {
      document.querySelector('.templates-go-back-button').style.display = 'none';
      document.querySelector('.menu-title').innerHTML = 'Template Gallery';
      document.querySelector('.menu-subtitle').innerHTML = 'Don’t know what to ask? Use our templates to save time.';
      document.querySelector('.templates-wrapper').style.display = 'flex';
      document.querySelector('.template-details-wrapper').style.display = 'none';
    }

    if (event.target.classList.contains('select-template-button') || event.target.parentNode.classList.contains('select-template-button')) {
      createConfirm({
        title: 'Confirm selection',
        text: 'Please confirm you want to continue with this template',
        accept: 'Continue',
        reject: 'Cancel'
      }, res => {
        if (res) {
          serverRequest(`/templates/update?id=${project._id}&template_id=${id}`, 'GET', {}, res => {
            if (!res.success)
              return createConfirm({
                title: 'An unknown error occured',
                text: `Please contact our support team to resolve the issue.${res.error && res.error.length ? ' The Error Message: ' + res.error : ''}`,
                reject: 'Close'
              }, res => {});
    
            return window.location = `/projects/create?id=${project._id}`;
          });
        }
      });
    }
  });
}
