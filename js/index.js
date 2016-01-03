var Ajax = require('./ajax');
var parser = new DOMParser();
var moment = require('moment-timezone');
var Zone = moment.tz.guess();

var mainView = `<?xml version="1.0" encoding="UTF-8" ?>
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

class Item {
  constructor(data) {
    this.data = data;
  }

  get start() {
    return moment.tz(this.data.time, "America/New_York");
  }

  get end() {
    return moment.tz(this.data.end_time, "America/New_York");
  }

  get row() {
    return `<row>
        <subtitle class="nextName">${this.name}</subtitle>
        <text class="nextTime">${this.start.tz(Zone).format("HH:mm")}</text>
      </row>`;
  }

  get name() {
    return this.data.name;
  }
}

class Channel {
  constructor(data) {
    this.data = data;
    this.id = data.channel_id;
    this.node = null;
  }

  view() {
    return `<listItemLockup id="channel_${this.id}">
      <ordinal minLength="3" class="ordinalLayout"></ordinal>
      <subtitle></subtitle>
      <title></title>
      <relatedContent>
      </relatedContent>
    </listItemLockup>`;
  }

  create(context) {
    var channelDoc = parser.parseFromString(this.view(), "text/xml");
    this.node = context.ownerDocument.adoptNode(channelDoc.firstChild);
    this.node.addEventListener("select", this.play.bind(this));
    context.appendChild(this.node);
    this.update(this.data);
  }

  update(data) {
    this.data = data;
    this.setText("ordinal", this.id);
    this.setText("subtitle", this.name);
    this.setText("title", this.programmeName);
    this.setText("relatedContent", this.relatedContent);
    }
  }

  play() {
    console.log(this, this.url);
    var player = new Player();
    var video = new MediaItem('video', this.url);

    player.playlist = new Playlist();
    player.playlist.push(video);
    player.play();
  }

  get url() {
    return `http://d77.smoothstreams.tv:3665/viewss/ch${this.id.length == 1 ? "0" : ""}${this.id}.smil/playlist.m3u8?wmsAuthSign=${authToken}`;
  }

  get items() {
    if (this.data.items) {
      return this.data.items.map(item => new Item(item));
    } else {
      return [];
    }
  }

  get name() {
    var liveWhen = this.live ? "Now" : `at ${this.items[0].start.tz(Zone).format("H:mm")}`;
    return `${this.data.name.replace(/^[0-9]{2} - /,'')} - Live ${liveWhen}`;
  }

  get programmeName() {
    if (this.items.length == 0) {
      return "No programmes scheduled";
    } else {
      return this.items[0].name;
    }
  }

  get live() {
    return this.items[0].start <= moment() &&
           this.items[0].end > moment();
  }

  get relatedContent() {
    if (this.items.length > 0) {
      var rows = this.items.slice(0,8).map(item => item.row).join();
      return `<itemBanner>
          <title>Schedule:</title>
          ${rows}
        </itemBanner>`;
    } else {
      return "";
    }
  }

  setText(nodeType, text) {
    this.node.getElementsByTagName(nodeType).item(0).innerHTML = text;
  }
}

var activeDocument;
var authToken = null;



App.onLaunch = function(options) {
  activeDocument = parser.parseFromString(mainView, "text/xml");
  navigationDocument.pushDocument(activeDocument);
  fetch("http://cdn.smoothstreams.tv/schedule/feed.json", (err, response) => {
    var data = JSON.parse(response);
    for (let id in data) {
      var channel = new Channel(data[id]);
      channel.create(activeDocument.getElementsByTagName("section").item(0));
    }
  });
  getAuthToken();
};

function fetch(url, cb) {
  Ajax({
    url: url,
    dataType: 'json',
    cache: false,
    success: cb,
    error: function(xhr, status, err) {
      console.error(url, status, err.toString());
    }.bind(this)
  });
}

function getAuthToken() {
  Ajax({
    url: "http://starstreams.tv/",
    type: "POST",
    contentType: "application/x-www-form-urlencoded",
    data: "username=xxx&password=xxx&whmcslink_login=Log%20in",
    success: function(err, response, xhr) {
      Ajax({
        url: "http://starstreams.tv/players/web_auth/",
        success: function(err, response, xhr) {
          authToken = response.match(/wmsAuthSign=(.*)"/)[1];
          console.log(authToken);
        }
      });
    }
  });
}
