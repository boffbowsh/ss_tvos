var Ajax = require('./Ajax');

var authToken, expiry;

function get(cb) {
  if (authToken && expiry > Date.now()) {
    cb(authToken);
  } else {
    Ajax.fetch("http://smoothstreams.tv/schedule/admin/dash_new/hash_api.php?username=xxx&password=xxx&site=viewss", function(err, response) {
      var data = JSON.parse(response);
      authToken = data.hash;
      expiry = Date.now() + parseInt(data.valid) * 60 * 1000;
      cb(authToken);
    });
  }
}

module.exports = {get: get};
