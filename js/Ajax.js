function ajax(options) {
  var url = options.url;
  var type = options.type || 'GET';
  var headers = options.headers || {} ;
  var body = options.data || null;
  var timeout = options.timeout || null;
  var success = options.success || function(err, data) {
    console.log("options.success was missing for this request");
  };
  var contentType = options.contentType || 'application/json';
  var error = options.error || function(err, data) {
    console.log("options.error was missing for this request");
  };

  if (!url) {
    throw 'loadURL requires a url argument';
  }

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = timeout;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(null, xhr.responseText, xhr);
      } else {
        success(new Error("Error [" + xhr.status + "] making http request: " + url));
      }
    }
  };

  xhr.open(type, url, true);

  xhr.setRequestHeader("Content-Type", contentType);
  xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*');

  Object.keys(headers).forEach(function(key) {
    xhr.setRequestHeader(key, headers[key]);
  });

  if(!body) {
    xhr.send();
    } else {
        xhr.send(body);
    }

  return xhr;
}

function fetch(url, cb) {
  ajax({
    url: url,
    dataType: 'json',
    cache: false,
    success: cb,
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(this)
  });
}

module.exports = {ajax: ajax, fetch: fetch};
