var Entities = require('special-entities');

var Item = require('./Item');
var AuthToken = require('./AuthToken');
var Config = require('./Config');
var ConfigController = require('./ConfigController');
var ErrorDialog = require('./ErrorDialog');

var parser = new DOMParser();

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

  play() {
    AuthToken.get(function(error, authToken) {
      if (error) {
        new ErrorDialog(error, function() {
          var configController = new ConfigController();
          configController.show(() => {
            navigationDocument.popToRootDocument();
          });
        }).show();
      } else {
        var player = new Player();
        var video = new MediaItem('video', this.url + authToken);

        player.playlist = new Playlist();
        player.playlist.push(video);
        player.play();
      }
    }.bind(this));
  }

  get url() {
    return `http://${Config.host}:${Config.port}/${Config.site}/ch${this.id.length == 1 ? "0" : ""}${this.id}q1.stream/playlist.m3u8?wmsAuthSign=`;
  }

  get items() {
    if (this.data.items) {
      return this.data.items.map(item => new Item(item));
    } else {
      return [];
    }
  }

  get name() {
    var liveWhen = "";
    if (this.items.length > 0) {
      liveWhen = this.live ? " - Live Now" : ` - Live at ${this.items[0].start.format("H:mm")}`;
    }
    return `${this.data.name.replace(/^[0-9]{2} - /,'')}${liveWhen}`;
  }

  get programmeName() {
    if (this.items.length === 0) {
      return "No programmes scheduled";
    } else {
      return this.items[0].name;
    }
  }

  get live() {
    return this.items[0].start <= new Date(Date.now()) &&
           this.items[0].end > new Date(Date.now());
  }

  get relatedContent() {
    if (this.items.length > 0) {
      var rows = this.items.slice(0,8).map(item => item.row).join();
      return `<itemBanner>
          <title>Schedule:</title>
          ${rows}
        </itemBanner>`;
    } else {
      return "<itemBanner></itemBanner>";
    }
  }

  setText(nodeType, text) {
    text = Entities.normalizeXML(text, "numeric");
    this.node.getElementsByTagName(nodeType).item(0).innerHTML = text;
  }
}

module.exports = Channel;
