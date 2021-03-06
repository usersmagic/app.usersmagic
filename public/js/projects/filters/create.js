// Filter data taken from server side, each filter is identified by its id
const filters = {};

// Filter information showing if a filter is used and how
let filtersData;

// Target data from server sife
let target;

// Id or keyword of the currently selected filter
let currentlyClickedFilter = 'settings';

// Save project
function saveFilters (callback) {
  const data = {
    filters: filtersData
  };
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/projects/filters/create/save?id=${target._id}`);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error) {
        alert("An error occured while saving. Error message: " + (response.error.message ? response.error.message : response.error));
        return callback(true);
      }
      callback(false);
    }
  };
}

// Automatically call save project every second
function autoSave () {
  saveFilters(err => {
    if (err) return;

    setTimeout(() => {
      autoSave();
    }, 1000);
  });
}

// Sort function for filters by their order in filters
function sortFilters(filter1, filter2) {
  const filterKeys = ['age'] + Object.keys(filters);
  return (filterKeys.indexOf(filter1) < filterKeys.indexOf(filter2) ? -1 : 1);
}

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

// Create the content of the custom filters wrapper
function createCustomFiltersWrapper () {
  const customFiltersWrapper = document.querySelector('.custom-filters-wrapper');
  const filterKeys = Object.keys(filters);

  customFiltersWrapper.innerHTML = '';

  const ageFilterWrapper = document.createElement('div');
  ageFilterWrapper.classList.add('each-filter-wrapper');
  ageFilterWrapper.id = 'age';
  if (filtersData.age && ((filtersData.age.min && filtersData.age.min.length) || (filtersData.age.max && filtersData.age.max.length)))
    ageFilterWrapper.classList.add('selected-filter');
  const text = document.createElement('span');
  text.innerHTML = 'Age';
  ageFilterWrapper.appendChild(text);
  customFiltersWrapper.appendChild(ageFilterWrapper);

  filterKeys.forEach(key => {
    const eachFilterWrapper = document.createElement('div');
    eachFilterWrapper.classList.add('each-filter-wrapper');
    eachFilterWrapper.id = key;
    if (filtersData[key] && filtersData[key].length)
      eachFilterWrapper.classList.add('selected-filter');
    const text = document.createElement('span');
    text.innerHTML = filters[key].name;
    eachFilterWrapper.appendChild(text);
    customFiltersWrapper.appendChild(eachFilterWrapper);
  });
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
    createSettingsShortInput(target.description, 'Explain your target group. e.g Female college students that are freshmen and interested in sports', 'description');
  } else if (currentlyClickedFilter == 'age') {
    createSettingsInputTitle('Minimum Age');
    createSettingsShortInput(filtersData.age ? filtersData.age.min : '', 'Must be at least 18', 'min_age', 'number');
    createSettingsInputTitle('Maximum Age');
    createSettingsShortInput(filtersData.age ? filtersData.age.max : '', 'Must be less than 80', 'max_age', 'number');
  } else {
    const filter = filters[currentlyClickedFilter];
    createSettingsInputInfoText(filter.text);
    createSettingsInputTitle('Accepted Answers', true);

    if (filter.type == 'radio') {
      
      createSettingsInputInfoText('The users who have selected one of the selected answers will pass the filter');
      createFilterChoicesWrapperAndContent(filter.choices);
    } else if (filter.type == 'checked') {
      createSettingsInputInfoText('The users who have selected any number of the selected answers will pass the filter');
      createFilterChoicesWrapperAndContent(filter.choices);
    } else if (filter.type == 'range') {
      createSettingsInputInfoText('The users who have selected one of the selected answers will pass the filter');
      createFilterChoicesWrapperAndContent(filter.choices);
    }
  }
}

// Create the content of show-filters-wrapper
function createShowFiltersWrapper () {
  const showFiltersContentWrapper = document.querySelector('.show-filters-content-wrapper');
  showFiltersContentWrapper.innerHTML = '';
  const filterKeys = Object.keys(filtersData);
  filterKeys.sort(sortFilters);

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
      selectedText.innerHTML = (filtersData.age.min ? filtersData.age.min : 18) + ' - ' + (filtersData.age.max ? filtersData.age.max : 80);
      selectedFiltersWrapper.appendChild(selectedText);
    } else {
      text.innerHTML = filters[key].name;
      filters[key].choices.forEach(choice => {
        if (filtersData[key].includes(choice)) {
          const selectedText = document.createElement('span');
          selectedText.classList.add('each-selected-filter');
          selectedText.innerHTML = choice;
          selectedFiltersWrapper.appendChild(selectedText);
        }
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
    filters[filter._id.toString()] = filter;
  });
}

// Get the target json data from the server side
function getTargetData () {
  target = JSON.parse(document.getElementById('json-target-data').value);
  filtersData = target.filters;
  createShowFiltersWrapper();
}

// Create an error message after the given element with the given error message
function createErrorMessage (element, message) {
  const errorText = document.createElement('span');
  errorText.classList.add('finish-error-text');
  errorText.innerHTML = message;
  element.after(errorText);
  errorText.classList.add('blink-red-animation-class');
}

// Check the current data before finishing the target
function checkDataBeforeFinish (callback) {
  if (filtersData.age && (filtersData.age.min > filtersData.age.max)) {
    currentlyClickedFilter = 'age';
    createSettingsHeaderWrapper();
    createSettingsContentWrapper();
    createErrorMessage(document.getElementsByName('max_age')[0], 'Your maximum age should be bigger than your minimum age.');
    callback(false);
  } else if (filtersData.age && filtersData.age.min < 18) {
    currentlyClickedFilter = 'age';
    createSettingsHeaderWrapper();
    createSettingsContentWrapper();
    createErrorMessage(document.getElementsByName('min_age')[0], 'The minimum age must be at least 18.');
    callback(false);
  } else if (filtersData.age && filtersData.age.max > 80) {
    currentlyClickedFilter = 'age';
    createSettingsHeaderWrapper();
    createSettingsContentWrapper();
    createErrorMessage(document.getElementsByName('max_age')[0], 'The maximum age must be at most 80.');
    callback(false);
  } else {
    callback(true);
  }
}

// Finish project
function finishTarget () {
  saveFilters(err => {
    if (err) return;

    checkDataBeforeFinish(res => {
      if (res) {
        createConfirm({
          title: 'Are you sure you want to finish editing your filters?',
          text: 'You cannot change your filters once you start testing.',
          reject: 'Cancel',
          accept: 'Continue'
        }, res => {
          if (res) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `/projects/filters/create/finish?id=${target._id}`);
            xhr.send();
      
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.responseText) {
                const response = JSON.parse(xhr.responseText);
      
                if (!response.success && response.error)
                  return alert("An error occured while finishing the target. Error message: " + (response.error.message ? response.error.message : response.error));
                return window.location = `/projects/filters?id=${target.project_id.toString()}`;
              }
            };
          }
        });
      }
    });
  });
}

window.onload = () => {
  getFiltersData(); // Load filters data on reload
  getTargetData(); // Load target data on reload
  listenForContentHeader(document); // Listen for content header buttons
  listenSliderButtons(document); // Listen slider buttons
  setTimeout(() => {
    autoSave(); // Automatically save project
  }, 1000); // Wait for everything on the page to be uploaded

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
      createCustomFiltersWrapper();
    } else if (event.target.classList.contains('each-filter-choice-selected')) { // deactivate a filter choice
      event.target.classList.add('each-filter-choice');
      event.target.classList.remove('each-filter-choice-selected');
      filtersData[currentlyClickedFilter] = filtersData[currentlyClickedFilter].filter(each => each != event.target.innerHTML);
      if (!filtersData[currentlyClickedFilter].length)
        delete filtersData[currentlyClickedFilter];
      createSettingsHeaderWrapper();
      createShowFiltersWrapper();
      createCustomFiltersWrapper();
    }

    // Click activate button
    if (event.target.classList.contains('active-slide-button') || event.target.parentNode.classList.contains('active-slide-button')) {
      if (filtersData[currentlyClickedFilter] && filtersData[currentlyClickedFilter].length) {
        delete filtersData[currentlyClickedFilter];
        createSettingsContentWrapper();
        createShowFiltersWrapper();
        createCustomFiltersWrapper();
      } else {
        filtersData[currentlyClickedFilter] = filters[currentlyClickedFilter].choices;
        createSettingsContentWrapper();
        createShowFiltersWrapper();
        createCustomFiltersWrapper();
      }
    }

    // Click finish target button
    if (event.target.classList.contains('finish-target-button') || event.target.parentNode.classList.contains('finish-target-button')) {
      finishTarget();
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
