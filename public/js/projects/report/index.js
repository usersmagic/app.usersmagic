const FILTERS = ['age', 'gender']
const selected_filters = {
  age: [],
  gender: []
};

//let selected_filters = [];

// finds the true filter object from HTMLCollection
function getFilter(DOMElements, filter){
  for(elem of DOMElements){
    if(elem.classList.contains(filter))
      return elem;
  }
}

function updateSelectedFilters(){
  let filter_html = '';
  const selected_filters_html = document.getElementsByClassName('selected-filters-wrapper')[0];

  for( filter of selected_filters.age){
    // styling
    filter_html += `<div class=selected-filter><button class=cancel-filter value='${filter}'>x</button><span class=filter>${filter}</span></div>`;
  }

  for(filter of selected_filters.gender){
    filter_html += `<div class=selected-filter><button class=cancel-filter value='${filter}'>x</button><span class=filter>${filter}</span></div>`;
  }

  selected_filters_html.innerHTML = filter_html;
}

function initiateFilters(filters_from_server){
  for(filter of filters_from_server){
    if(filter.length == 1) {
      selected_filters.push(filters_from_server);
      break;
    }
    if(filter && filter.length > 0) {
      if(filter.includes(',')){
        const sepFilters = filter.split(',');
        for(f of sepFilters){
          if(!selected_filters.includes(f)) selected_filters.push(f);
        }
      }
      else selected_filters.push(filter);
    }
  }

  updateSelectedFilters();
}

function setQuery(){
  const id = window.location.href.split('id=')[1].split('&')[0];
  let data = {};

  if(selected_filters.age.length != 0 || selected_filters.gender.length != 0){
    data = {
      filters: selected_filters
    }
  }

  serverRequest(`/projects/report?id=${id}`,'POST', data, res =>{
    console.log(res);

    const questions = res.questions ? res.questions : [];

    let html_code = '';
    const questions_summary = document.getElementsByClassName('questions-summary-results-wrapper')[0];

    for (q of questions){
        html_code += '<div class="summary-results-each-question-wrapper"><div class="summary-results-each-question-inner-wrapper">';
        html_code += `<span class="summary-results-each-question-text">${q.text}</span>`;
        html_code += '<div class="summary-results-each-question-info-wrapper">';

        if (q.type == 'yes_no'){
          html_code += `<span class="summary-results-each-question-info-title">${Math.max(q.answers.yes, q.answers.no)}</span>`;
          html_code += `<span class="summary-results-each-question-info-data">${question.answers.yes >= question.answers.no ? 'YES' : 'NO'}</span>`;
        }

        else if (q.type == 'multiple_choice'){
          html_code += `<span class="summary-results-each-question-info-title">${q.data.max}</span>`;
          html_code += `<span class="summary-results-each-question-info-data">${q.answers[q.data.max]}</span>`;
        }

        else if (q.type == 'opinion_scale'){
          html_code += `<span class="summary-results-each-question-info-title">mean</span>`;
          html_code += `<span class="summary-results-each-question-info-data">${q.data.mean}/${Object.keys(q.answers)[Object.keys(q.answers).length-1]}</span>`;
        }

        else if (q.type == 'open_answer'){
          html_code += `<span class="summary-results-each-question-info-title">answers</span>`;
          html_code += `<span class="summary-results-each-question-info-data">${q.answers.length}</span>`;
        }

        html_code += '</div></div></div>';
    }
    questions_summary.innerHTML = html_code;

    const questions_all = document.getElementsByClassName('questions-all-wrapper')[0];

    html_code = '';

    for(let i = 0; i < questions.length; i++){
      const question = questions[i];

      html_code += '<div class="each-question-wrapper">';
      html_code += `<span class="each-question-number">${i+1}</span>`;
      html_code += `<span class="each-question-text">${question.text}</span>`;
      html_code += `<span class="each-question-details">${question.details}</span>`;

      if (question.type == 'yes_no'){
        html_code += '<div class="yes-no-wrapper"><div class="yes-content-wrapper><div class="yes-outer-wrapper>';
        html_code += `<div class="yes-inner-wrapper" style="height: ${question.answers.yes}%; margin-top: ${question.answers.no}%"></div>`;
        html_code += '<div class="yes-no-icon-outer-wrapper">';
        html_code += '<div class="yes-icon-wrapper">';
        html_code += '<i class="fas fa-check"></i></div>';
        html_code += '<div class="yes-text">YES</div>';
        html_code += '</div></div>';
        html_code += '<div class="yes-no-text-wrapper">';
        html_code += `<span class="yes-no-percentage-text">${question.answers.yes}%</span>`;
        html_code += `<span class="yes-no-number-text">${question.data.yes_number} answers</span>`;
        html_code += '</div></div>';
        html_code += '<div class="no-content-wrapper"><div class="no-outer-wrapper">';
        html_code += `<div class=no-inner-wrapper style="height: ${question.answers.no}%; margin-top: ${question.answers.yes}%"></div>`;
        html_code += '<div class="yes-no-icon-outer-wrapper">';
        html_code += '<div class="no-icon-wrapper">';
        html_code += '<i class="fas fa-times"></i></div>';
        html_code += '<div class="no-text">NO</div>';
        html_code += '</div></div>';
        html_code += '<div class="yes-no-text-wrapper">';
        html_code += `<span class="yes-no-percentage-text">${question.answers.no}%</span>`;
        html_code += `<span class="yes-no-number-text"> ${question.data.no_number} answers</span>`;
        html_code += '</div></div></div>';
      }

      else if (question.type == 'multiple_choice'){
        html_code += `<span class="multiple-choice-answer-title">${question.data.total} answers</span>`;
        html_code += '<div class="multiple-choice-answers-wrapper">';
        for(key in Object.keys(question.answers)){
          html_code += '<div class="each-multiple-choice">';
          html_code += `<span class="each-multiple-choice-text">${key}</span>`;
          html_code += `<span class="each-multiple-choice-number">${question.answers[key]}</span>`;
          html_code += '</div>';
        }
        html_code += '</div>';
      }

      else if (question.type == 'open_answer'){
        html_code += `<span class="open-answer-title">${question.answers.length} answers</span>`;
        html_code += '<div class="open-answer-wrapper">';
        for(answer of question.answers){
          html_code += `<span class="each-answer"> ${answer}</span>`;
        }
        html_code += '</div>';
      }

      else if (question.type == 'opinion_scale'){
        html_code += '<div class="histogram-wrapper">';
        html_code += '<div class="histogram-title-wrapper">';
        html_code += '<span class="histogram-title-text">Histogram</span>';
        html_code += `<span class="histogram-title-answers-text">${question.data.total_number} answers</span>`;
        html_code += '</div>';
        html_code += '<div class="histogram-title-wrapper">';
        html_code += '<span class="histogram-title-info"> Mean:';
        html_code += `<span class="seablue"> ${question.data.mean}</span></span>`;
        html_code += '<span class="histogram-title-info"> Median:';
        html_code += `<span class="seablue">${question.data.median}</span></span>`;
        html_code += '</div>';
        html_code += '<div class="histogram-inner-wrapper">';
        for(j in Object.keys(question.answers)){
          j = parseInt(j);
          const key = j+1;
          html_code += `<div class="histogram-each-column" style="height: ${question.answer_percentages[key]}%">`;
          html_code += `<span class="histogram-each-column-text"> ${question.answers[key]}</span>`;
          html_code += '</div>';
          if (j < Object.keys(question.answers).length-1)
            html_code += '<div class="histogram-column-seperator"></div>';
        }
        html_code += '</div>';
        html_code += '<div class="histogram-inner-line-wrapper">';
        for(j in Object.keys(question.answers)){
          j = parseInt(j);
          const key = j+1;
          html_code += `<div class="histogram-each-column-explanation">${key}</div>`;
          if(j < Object.keys(question.answers).length-1)
            html_code += '<div class="histogram-column-seperator"></div>';
        }
        html_code += '</div>';
        html_code += '<div class="histogram-explanation-line">';
        html_code += '<div class="histogram-explanation-line-item"></div>';
        html_code += '<div class="histogram-explanation-line-item"></div>';
        html_code += '<div class="histogram-explanation-line-item"></div>';
        html_code += '</div>';
        html_code += '<div class="histogram-explanation-text-wrapper">';
        html_code += `<span class="histogram-explanation-text-left">${question.labels.left}</span>`;
        html_code += `<span class="histogram-explanation-text-middle">${question.labels.middle}</span>`;
        html_code += `<span class="histogram-explanation-text-right">${question.labels.right}</span>`;
        html_code += '</div></div>';
      }
      html_code += '</div>';
    }

    questions_all.innerHTML = html_code;
  })
}

window.onload = () => {
  var foff = document.getElementsByClassName('questions-all-wrapper')[0];
  //foff.innerHTML = '<div>FUCK OFF!!!</div>';

  var foff2 = document.getElementsByClassName('questions-summary-results-wrapper')[0];
  //foff2.innerHTML = '<div>NA FUCK YOU</div>';

  listenForContentHeader(document); // Listen for content header buttons

  const filters_from_server = JSON.parse(document.getElementById("filters").value);
  console.log(filters_from_server);
  //initiateFilters(filters_from_server);

  document.addEventListener('click', event =>{
    let clicked_on_filters = false;

    for(filter of FILTERS){
      if(event.target.classList.contains(filter)){
        const domElements = document.getElementsByClassName('filter-options');
        const htmlElem = getFilter(domElements, filter);
        if(htmlElem.style.display == "none" || !htmlElem.style.display) htmlElem.style.display = "flex";
        else htmlElem.style.display = "none";
        clicked_on_filters = true;
      }
    }

    // close other filters
    if(clicked_on_filters){
      for (filter of FILTERS){
        if (!event.target.classList.contains(filter) && !event.target.parentNode.classList.contains(filter)){
          const domElements = document.getElementsByClassName('filter-options');
          getFilter(domElements,filter).style.display = "none";
        }
      }
    }
    if (event.target.classList.contains('filter-option-button') || event.target.parentNode.classList.contains('filter-option-button')){
      const gender = event.target.innerText;
      if(!selected_filters.gender.includes(gender)) selected_filters.gender.push(gender);
      updateSelectedFilters();
      setQuery();
    }

    if(event.target.classList.contains('cancel-filter')){
      const filter = event.target.value;
      if(selected_filters.age.includes(filter)) selected_filters.age = selected_filters.age.filter(item => item != filter);
      if(selected_filters.gender.includes(filter)) selected_filters.gender = selected_filters.gender.filter(item => item != filter);

      updateSelectedFilters();
      setQuery();
    }

    if(event.target.classList.contains('apply-age') || event.target.parentNode.classList.contains('apply-age')){
      const startAge = document.getElementById("start").value;
      const endAge = document.getElementById("end").value;
      let error_found = false;

      if(startAge < 18 || endAge > 80){
        window.alert("Age must be between 18 and 80");
        window.location.reload();
        error_found = true;
      }
      //checks
      if(startAge > endAge) {
        window.alert("Max. age must be greater than min. age");
        window.location.reload();
        error_found = true;
      }
      if(!error_found){
        const filter = `${startAge} - ${endAge}`;
        selected_filters.age.push(filter);
        updateSelectedFilters();
        setQuery();
      }
    }
  })

}
