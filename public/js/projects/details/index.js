window.onload = () => {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('copy-url-button') || (event.target.parentNode && event.target.parentNode.classList.contains('copy-url-button')) || (event.target.parentNode && event.target.parentNode.classList.contains('copy-url-button')) || (event.target.parentNode.parentNode && event.target.parentNode.parentNode.classList.contains('copy-url-button'))) {
      let target = event.target;
      if (event.target.parentNode && event.target.parentNode.classList.contains('copy-url-button'))
        target = event.target.parentNode;
      if (event.target.parentNode.parentNode && event.target.parentNode.parentNode.classList.contains('copy-url-button'))
        target = event.target.parentNode.parentNode;

      const range = document.createRange();
      range.selectNodeContents(document.getElementById('project-custom-url'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      target.childNodes[1].childNodes[0].innerHTML = 'Copied!';
      setTimeout(() => {
        target.childNodes[1].childNodes[0].innerHTML = 'Copy your link';
        selection.removeAllRanges();
      }, 1000);
    }
  });
}
