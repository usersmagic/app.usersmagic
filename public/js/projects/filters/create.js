// Filter data taken from server side, each filter is identified by its id
const filters = {};

// Filter information showing if a filter is used and how
let filtersData;

// Target data from server sife
let target;

// Id or keyword of the currently selected filter
let currentlyClickedFilter = 'settings';

// Add required item sign on an item
function addRequiredItemSign (item) {
  const newSign = document.createElement('span');
  newSign.classList.add('general-input-required-sign');
  newSign.innerHTML = '*';
  item.appendChild(newSign);
}

// Create an input title on the settings-content-wrapper
function createSettingsInputTitle (text, isRequired) {
  const settingsInputTitle = document.createElement('span');
  settingsInputTitle.classList.add('general-input-title');
  settingsInputTitle.innerHTML = text;
  if (isRequired)
    addRequiredItemSign(settingsInputTitle);
  document.querySelector('.filter-settings-content-wrapper').appendChild(settingsInputTitle);
}

// Create a text on the settings-content-wrapper
function createSettingsInputInfoText (text) {
  const span = document.createElement('span');
  span.classList.add('general-input-info-text');
  span.innerHTML = text;
  document.querySelector('.filter-settings-content-wrapper').appendChild(span);
}

// Create add filter button on the settings-content-wrapper
function createAddFilterButton () {
  const newButton = document.createElement('div');
  newButton.classList.add('general-seablue-button');
  newButton.classList.add('add-filter-button');

  const text = document.createElement('span');
  text.innerHTML = 'Add Filter';
  newButton.appendChild(text);

  document.querySelector('.filter-settings-content-wrapper').appendChild(newButton);
}

// Create a short input on the settings-content-wrapper
function createSettingsShortInput (value, placeholder, name, type) {
  const settingsShortInput = document.createElement('input');
  settingsShortInput.classList.add('general-input-with-border');
  settingsShortInput.type = type ? type : 'text';
  settingsShortInput.value = value;
  settingsShortInput.placeholder = placeholder;
  settingsShortInput.name = name;
  document.querySelector('.filter-settings-content-wrapper').appendChild(settingsShortInput);
}

// Create filter choices wrapper and content on the settings-content-wrapper
function createFilterChoicesWrapperAndContent (choices) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('filter-choices-wrapper');

  choices.forEach(choice => {
    const newChoice = document.createElement('span');
    if (filtersData[currentlyClickedFilter] && filtersData[currentlyClickedFilter].includes(choice.toString()))
      newChoice.classList.add('each-filter-choice-selected');
    else
      newChoice.classList.add('each-filter-choice');
    newChoice.innerHTML = choice;
    wrapper.appendChild(newChoice);
  });

  document.querySelector('.filter-settings-content-wrapper').appendChild(wrapper);
}

// Create the content of settings header using currentlySelectedFilter
function createSettingsHeaderWrapper () {
  const filterSettingsHeaderWrapper = document.querySelector('.filter-settings-header-wrapper');
  const clickedFilter = document.querySelector('.clicked-filter');

  if (clickedFilter)
    clickedFilter.classList.remove('clicked-filter');

  if (currentlyClickedFilter == 'settings') {
    filterSettingsHeaderWrapper.childNodes[0].src = '/res/images/block_icons/filter.png';
    filterSettingsHeaderWrapper.childNodes[1].innerHTML = 'Target Settings';
    filterSettingsHeaderWrapper.childNodes[2].style.display = 'none';
    filterSettingsHeaderWrapper.childNodes[3].style.display = 'none';
  } else if (currentlyClickedFilter == 'age') {
    filterSettingsHeaderWrapper.childNodes[0].src = '/res/images/block_icons/opinion_scale.png';
    filterSettingsHeaderWrapper.childNodes[1].innerHTML = 'Age';
    filterSettingsHeaderWrapper.childNodes[2].style.display = 'flex';
    filterSettingsHeaderWrapper.childNodes[3].style.display = 'flex';

    if (filtersData.age && ((filtersData.age.min && filtersData.age.min.length) || (filtersData.age.max && filtersData.age.max.length))) {
      filterSettingsHeaderWrapper.childNodes[3].classList.add('clicked');
      filterSettingsHeaderWrapper.childNodes[3].style.backgroundColor = 'rgb(46, 197, 206)';
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.add('general-slider-button-slide-right-animation-class');
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.remove('general-slider-button-slide-left-animation-class');
    } else {
      filterSettingsHeaderWrapper.childNodes[3].classList.remove('clicked');
      filterSettingsHeaderWrapper.childNodes[3].style.backgroundColor = 'rgb(196, 196, 196)';
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.remove('general-slider-button-slide-right-animation-class');
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.add('general-slider-button-slide-left-animation-class');
    }

    document.getElementById('age').classList.add('clicked-filter');
  } else {
    if (filters[currentlyClickedFilter].type == 'range')
      filterSettingsHeaderWrapper.childNodes[0].src = '/res/images/block_icons/opinion_scale.png';
    else
      filterSettingsHeaderWrapper.childNodes[0].src = '/res/images/block_icons/multiple_choice.png';
    filterSettingsHeaderWrapper.childNodes[1].innerHTML = filters[currentlyClickedFilter].name;
    filterSettingsHeaderWrapper.childNodes[2].style.display = 'flex';
    filterSettingsHeaderWrapper.childNodes[3].style.display = 'flex';

    if (filtersData[currentlyClickedFilter] && filtersData[currentlyClickedFilter].length) {
      filterSettingsHeaderWrapper.childNodes[3].classList.add('clicked');
      filterSettingsHeaderWrapper.childNodes[3].style.backgroundColor = 'rgb(46, 197, 206)';
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.add('general-slider-button-slide-right-animation-class');
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.remove('general-slider-button-slide-left-animation-class');
    } else {
      filterSettingsHeaderWrapper.childNodes[3].classList.remove('clicked');
      filterSettingsHeaderWrapper.childNodes[3].style.backgroundColor = 'rgb(196, 196, 196)';
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.remove('general-slider-button-slide-right-animation-class');
      filterSettingsHeaderWrapper.childNodes[3].childNodes[0].classList.add('general-slider-button-slide-left-animation-class');
    }

    document.getElementById(currentlyClickedFilter).classList.add('clicked-filter');
  }
}

// Create the content of settings-content-wrapper using currentlySelectedFilter
function createSettingsContentWrapper () {
  document.querySelector('.filter-settings-content-wrapper').innerHTML = "";

  if (currentlyClickedFilter == 'settings') {
    createSettingsInputTitle('Name', true);
    createSettingsShortInput(target.name, 'Enter a clear name for you target group', 'name');
    createSettingsInputTitle('Description', true);
    createSettingsShortInput(target.description, 'Explain your target group. This will make you job lot easier later', 'description');
  } else if (currentlyClickedFilter == 'age') {
    createSettingsInputTitle('Minimum Age');
    createSettingsShortInput(filtersData.age ? filtersData.age.min : '', 'Must be at leat 18', 'min_age', 'number');
    createSettingsInputTitle('Maximum Age');
    createSettingsShortInput(filtersData.age ? filtersData.age.max : '', 'Must be less than 80', 'max_age', 'number');
    // createAddFilterButton();
  } else {
    const filter = filters[currentlyClickedFilter];

    if (filter.type == 'radio') {
      createSettingsInputTitle('Accepted Answers', true);
      createSettingsInputInfoText('The users who have selected one of the selected answers will pass the filter');
      createFilterChoicesWrapperAndContent(filter.choices);
    } else if (filter.type == 'checked') {
      createSettingsInputTitle('Accepted Answers', true);
      createSettingsInputInfoText('The users who have selected any number of the selected answers will pass the filter');
      createFilterChoicesWrapperAndContent(filter.choices);
    } else if (filter.type == 'range') {
      createSettingsInputTitle('Accepted Answers', true);
      createSettingsInputInfoText('The users who have selected one of the selected answers will pass the filter');
      createFilterChoicesWrapperAndContent(Array.from( { length: (parseInt(filter.max_value) - parseInt(filter.min_value) + 1).toString() }, (_, i) =>  parseInt(filter.min_value) + i ));
    }
  }
}

// Create the content of show-filters-wrapper
function createShowFiltersWrapper () {
  const showFiltersContentWrapper = document.querySelector('.show-filters-content-wrapper');
  showFiltersContentWrapper.innerHTML = '';
  const filterKeys = Object.keys(filtersData);

  filterKeys.forEach((key, i) => {
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('show-filter-each-title');
    const text = document.createElement('span');
    text.classList.add('general-input-title');

    const selectedFiltersWrapper = document.createElement('div');
    selectedFiltersWrapper.classList.add('selected-filters-wrapper');

    if (key == 'age') {
      text.innerHTML = 'Age';
      const selectedText = document.createElement('span');
      selectedText.classList.add('each-selected-filter');
      selectedText.innerHTML = (filtersData.age.min.length ? filtersData.age.min : 18) + ' - ' + (filtersData.age.max.length ? filtersData.age.max : 80);
      selectedFiltersWrapper.appendChild(selectedText);
    } else {
      text.innerHTML = filters[key].name;
      filtersData[key].forEach(choice => {
        const selectedText = document.createElement('span');
        selectedText.classList.add('each-selected-filter');
        selectedText.innerHTML = choice;
        selectedFiltersWrapper.appendChild(selectedText);
      });
    }

    titleWrapper.appendChild(text);
    showFiltersContentWrapper.appendChild(titleWrapper);
    showFiltersContentWrapper.appendChild(selectedFiltersWrapper);
  });
}

// Get the filter json data from the server side and create the filters global object
function getFiltersData () {
  const filtersJSON = JSON.parse(document.getElementById('json-filters-data').value);

  filtersJSON.forEach(filter => {
    if (filter && filter._id)
      filters[filter._id.toString()] = filter;
  });
}

// Get the target json data from the server side
function getTargetData () {
  target = JSON.parse(document.getElementById('json-target-data').value);
  filtersData = {};
}

window.onload = () => {
  getFiltersData(); // Load filters data on reload
  getTargetData(); // Load target data on reload
  listenSliderButtons(document); // Listen slider buttons

  document.addEventListener('click', event => {
    // Click a filter from filters menu
    if (event.target.classList.contains('each-filter-wrapper') || event.target.parentNode.classList.contains('each-filter-wrapper')) {
      currentlyClickedFilter = event.target.classList.contains('each-filter-wrapper') ? event.target.id : event.target.parentNode.id;
      createSettingsHeaderWrapper();
      createSettingsContentWrapper();
    }

    // Click settings button
    if (event.target.classList.contains('target-settings-wrapper') || event.target.parentNode.classList.contains('target-settings-wrapper')) {
      currentlyClickedFilter = 'settings';
      createSettingsHeaderWrapper();
      createSettingsContentWrapper();
    }

    if (event.target.classList.contains('each-filter-choice')) { // activate a filter choice
      event.target.classList.remove('each-filter-choice');
      event.target.classList.add('each-filter-choice-selected');
      if (filtersData[currentlyClickedFilter])
        filtersData[currentlyClickedFilter].push(event.target.innerHTML);
      else
        filtersData[currentlyClickedFilter] = [event.target.innerHTML];
      createSettingsHeaderWrapper();
      createShowFiltersWrapper();
    } else if (event.target.classList.contains('each-filter-choice-selected')) { // deactivate a filter choice
      event.target.classList.add('each-filter-choice');
      event.target.classList.remove('each-filter-choice-selected');
      filtersData[currentlyClickedFilter] = filtersData[currentlyClickedFilter].filter(each => each != event.target.innerHTML);
      if (!filtersData[currentlyClickedFilter].length)
        delete filtersData[currentlyClickedFilter];
      createSettingsHeaderWrapper();
      createShowFiltersWrapper();
    }

    // Click activate button
    if (event.target.classList.contains('active-slide-button') || event.target.parentNode.classList.contains('active-slide-button')) {
      if (filtersData[currentlyClickedFilter] && filtersData[currentlyClickedFilter].length) {
        delete filtersData[currentlyClickedFilter];
        createSettingsContentWrapper();
        createShowFiltersWrapper();
      } else {
        if (filters[currentlyClickedFilter].type == 'range')
          filtersData[currentlyClickedFilter] = Array.from( { length: (parseInt(filters[currentlyClickedFilter].max_value) - parseInt(filters[currentlyClickedFilter].min_value) + 1) }, (_, i) => (parseInt(filters[currentlyClickedFilter].min_value) + i).toString() );
        else
          filtersData[currentlyClickedFilter] = filters[currentlyClickedFilter].choices;
        createSettingsContentWrapper();
        createShowFiltersWrapper();
      }
    }
  });

  document.addEventListener('input', event => {
    if (event.target.name == 'min_age') {
      filtersData.age = {
        min: event.target.value,
        max: filtersData.age ? filtersData.age.max : ''
      }
      createShowFiltersWrapper();
      createSettingsHeaderWrapper();
    }
    if (event.target.name == 'max_age') {
      filtersData.age = {
        min: filtersData.age ? filtersData.age.min : '',
        max: event.target.value
      }
      createShowFiltersWrapper();
      createSettingsHeaderWrapper();
    }
  });
}
