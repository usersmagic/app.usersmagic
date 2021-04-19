const FILTERS = ['age', 'gender']
let selected_filters = [], isDownloadButtonOpen = false;

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

  for( filter of selected_filters){
    // styling
    filter_value = filter.split(":")[1]
    filter_html += `<div class=selected-filter><button class=cancel-filter value='${filter}'>x</button><span class=filter>${filter_value}</span></div>`;
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
  const url = window.location.href.split('&filters=')[0];
  if(selected_filters.length == 0) window.location.href = url + `&filters=${selected_filters} `;
  else window.location.href = url + `&filters=${selected_filters}&filters= `;
}

window.onload = () => {
  listenForContentHeader(document); // Listen for content header buttons

  // const filters_from_server = JSON.parse(document.getElementById("filters").value);
  // initiateFilters(filters_from_server);

  const resultsDownloadButton = document.querySelector('.results-download-button');
  const downloadOptionsWrapper = document.querySelector('.download-options-wrapper');

  document.addEventListener('click', event =>{
    // let clicked_on_filters = false;

    // for(filter of FILTERS){
    //   if(event.target.classList.contains(filter)){
    //     const domElements = document.getElementsByClassName('filter-options');
    //     const htmlElem = getFilter(domElements, filter);
    //     if(htmlElem.style.display == "none" || !htmlElem.style.display) htmlElem.style.display = "flex";
    //     else htmlElem.style.display = "none";
    //     clicked_on_filters = true;
    //   }
    // }

    // // close other filters
    // if(clicked_on_filters){
    //   for (filter of FILTERS){
    //     if (!event.target.classList.contains(filter) && !event.target.parentNode.classList.contains(filter)){
    //       const domElements = document.getElementsByClassName('filter-options');
    //       getFilter(domElements,filter).style.display = "none";
    //     }
    //   }
    // }
    // if (event.target.classList.contains('filter-option-button') || event.target.parentNode.classList.contains('filter-option-button')){
    //   const gender = 'gender:'+event.target.innerText;
    //   if(!selected_filters.includes(gender)) selected_filters.push(gender);
    //   updateSelectedFilters();
    //   setQuery();
    // }

    // if(event.target.classList.contains('cancel-filter')){
    //   const filter = event.target.value;
    //   if(selected_filters.includes(filter)) selected_filters = selected_filters.filter(item => item != filter);
    //   updateSelectedFilters();
    //   setQuery();
    // }

    // if(event.target.classList.contains('apply-age') || event.target.parentNode.classList.contains('apply-age')){
    //   const startAge = document.getElementById("start").value;
    //   const endAge = document.getElementById("end").value;
    //   let error_found = false;

    //   if(startAge < 18 || endAge > 80){
    //     window.alert("Age must be between 18 and 80");
    //     window.location.reload();
    //     error_found = true;
    //   }
    //   //checks
    //   if(startAge > endAge) {
    //     window.alert("Max. age must be greater than min. age");
    //     window.location.reload();
    //     error_found = true;
    //   }
    //   if(!error_found){
    //     const filter = `age:${startAge} - ${endAge}`;
    //     selected_filters.push(filter);
    //     updateSelectedFilters();
    //     setQuery();
    //   }
    // }

    if (event.target.classList.contains('results-download-button-span')) {
      if (isDownloadButtonOpen) {
        isDownloadButtonOpen = false;

        downloadOptionsWrapper.classList.remove('open-bottom-animation-class');
        downloadOptionsWrapper.classList.add('close-top-animation-class');

        setTimeout(() => {
          resultsDownloadButton.style.borderBottomWidth = '2px';
          resultsDownloadButton.style.borderBottomLeftRadius = '10px';
          resultsDownloadButton.style.borderBottomRightRadius = '10px';

          downloadOptionsWrapper.style.border = '0px';
        }, 400);
      } else {
        isDownloadButtonOpen = true;
        resultsDownloadButton.style.borderBottomWidth = '0px';
        resultsDownloadButton.style.borderBottomLeftRadius = '0px';
        resultsDownloadButton.style.borderBottomRightRadius = '0px';

        downloadOptionsWrapper.style.border = '2px solid rgba(184, 235, 238, 1)';
        downloadOptionsWrapper.style.borderTop = '0px';

        downloadOptionsWrapper.classList.remove('close-top-animation-class');
        downloadOptionsWrapper.classList.add('open-bottom-animation-class');
      }
    } else if (!event.target.classList.contains('each-download-option') && isDownloadButtonOpen) {
      isDownloadButtonOpen = false;

      downloadOptionsWrapper.classList.remove('open-bottom-animation-class');
      downloadOptionsWrapper.classList.add('close-top-animation-class');

      setTimeout(() => {
        resultsDownloadButton.style.borderBottomWidth = '2px';
        resultsDownloadButton.style.borderBottomLeftRadius = '10px';
        resultsDownloadButton.style.borderBottomRightRadius = '10px';

        downloadOptionsWrapper.style.border = '0px';
      }, 400);
    } 
  });

}
