const FILTERS = ['age', 'gender']

// finds the true filter object from HTMLCollection
function getFilter(DOMElements, filter){
  for(elem of DOMElements){
    if(elem.classList.contains(filter))
      return elem;
  }
}

window.onload = () => {
  listenForContentHeader(document); // Listen for content header buttons

  document.addEventListener('click', event =>{
    let clicked_on_filters = false;

    for(filter of FILTERS){
      if(event.target.classList.contains(filter)){
        const domElements = document.getElementsByClassName('filter-options');
        const htmlElem = getFilter(domElements, filter);
        if(htmlElem.style.display == "none") htmlElem.style.display = "flex";
        else htmlElem.style.display = "none";
        clicked_on_filters = true;
      }
    }
    // close other filters
    if(clicked_on_filters){
      for(filter of FILTERS){
        if(!event.target.classList.contains(filter) && !event.target.parentNode.classList.contains(filter)){
          const domElements = document.getElementsByClassName('filter-options');
          getFilter(domElements,filter).style.display = "none";
        }
      }
    }

  })

}
