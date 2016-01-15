var Ajax = require('./Ajax');
var Config = require('./Config');

var authToken, expiry;

function get(cb) {
  if (authToken && expiry > Date.now()) {
    cb(null, authToken);
  } else {
    var username = encodeURIComponent(Config.username),
        password = encodeURIComponent(Config.password);

    var url = `http://smoothstreams.tv/schedule/admin/dash_new/hash_api.php?username=${username}&password=${password}&site=${Config.site}`;
    Ajax.fetch(url, function(err, response) {
      var data = JSON.parse(response);
      if (data.error) {
        authToken = null;
        expiry = null;
        cb(data.error);
      } else {
        authToken = data.hash;
        expiry = Date.now() + parseInt(data.valid) * 60 * 1000;
        cb(null, authToken);
      }
    });
  }
}

module.exports = {get: get};
