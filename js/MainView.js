var Channel = require('./Channel');
var Ajax = require('./Ajax');
var ConfigController = require('./ConfigController');
var ErrorDialog = require('./ErrorDialog');

var template = `<?xml version="1.0" encoding="UTF-8" ?>
<document>
  <head>
    <style>
      .nextName {
        tv-align: left;
      }

      .nextTime {
        tv-align: right;
      }
    </style>
  </head>
  <compilationTemplate theme="light">
    <list>
      <relatedContent>
      </relatedContent>
      <section>
      </section>
    </list>
  </compilationTemplate>
</document>`;

var view;
var channels = {};

function render() {
  view = new DOMParser().parseFromString(template, "text/xml");
  getFeed(function(data) {
    for (let id in data) {
      var channel = new Channel(data[id]);
      channels[id] = channel;
      channel.create(view.getElementsByTagName("section").item(0));
    }
    scheduleUpdate();
  });

  view.addEventListener("play", function(evt) {
    evt.preventDefault();
    var configController = new ConfigController();
    configController.show(() => {
      navigationDocument.popToRootDocument();
    });
  });

  return view;
}

function getFeed(cb) {
  Ajax.fetch("http://cdn.smoothstreams.tv/schedule/feed.json", (err, response) => {
    if (err || response == '') {
      new ErrorDialog("Error receiving schedule data from SmoothStreams", update).show();
    } else {
      cb(JSON.parse(response));
    }
  });
}

function update() {
  getFeed(function(data) {
    for (let id in data) {
      channels[id].update(data[id]);
    }
  });
  scheduleUpdate();
}

function scheduleUpdate() {
  // 10 minute boundary
  var updateAt = Math.floor(Date.now() / 600000) * 600000 + 600000;
  setTimeout(update, updateAt - Date.now());
}

module.exports = {render: render};
