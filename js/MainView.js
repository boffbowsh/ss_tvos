var Channel = require('./Channel');
var Ajax = require('./Ajax');

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

function render() {
  view = new DOMParser().parseFromString(template, "text/xml");
  Ajax.fetch("http://cdn.smoothstreams.tv/schedule/feed.json?timezone=UTC", (err, response) => {
    var data = JSON.parse(response);
    for (let id in data) {
      var channel = new Channel(data[id]);
      channel.create(view.getElementsByTagName("section").item(0));
    }
  });
  return view;
}

module.exports = {render: render};
