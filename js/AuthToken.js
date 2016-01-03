var Ajax = require('./Ajax');

function get(cb) {
  Ajax.ajax({
    url: "http://starstreams.tv/",
    type: "POST",
    contentType: "application/x-www-form-urlencoded",
    data: "username=xxx&password=xxx&whmcslink_login=Log%20in",
    success: function(err, response, xhr) {
      Ajax.ajax({
        url: "http://starstreams.tv/players/web_auth/",
        success: function(err, response, xhr) {
          cb(response.match(/wmsAuthSign=(.*)"/)[1]);
        }
      });
    }
  });
}

module.exports = {get: get};
