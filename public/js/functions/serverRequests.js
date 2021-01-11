// Deletes the image with the given url from the server, returns an error it is exists
function deleteImage (url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/delete');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify({ url }));

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success && response.error)
        return callback(response.error);

      return callback(null);
    }
  };
}

// Uploads the file as image, returns its url or an error if it exists
function uploadImage (file, callback) {
  const formdata = new FormData();
  formdata.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/image/upload');
  xhr.send(formdata);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.responseText) {
      const response = JSON.parse(xhr.responseText);

      if (!response.success)
        return callback(response.error);

      callback(null, response.url);
    }
  };
}
