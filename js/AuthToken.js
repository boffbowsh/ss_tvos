var Ajax = require('./Ajax');
var Config = require('./Config');

var authToken, expiry;

function get(cb) {
  if (authToken && expiry > Date.now()) {
    cb(null, authToken);
  } else {
    Ajax.fetch(`http://smoothstreams.tv/schedule/admin/dash_new/hash_api.php?username=${Config.username}&password=${Config.password}&site=${Config.site}`, function(err, response) {
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
