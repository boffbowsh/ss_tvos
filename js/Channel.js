var Item = require('./Item');
var AuthToken = require('./AuthToken');

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
    AuthToken.get(function(authToken) {
      var player = new Player();
      var video = new MediaItem('video', this.url + authToken);

      player.playlist = new Playlist();
      player.playlist.push(video);
      player.play();
    }.bind(this));
  }

  get url() {
    return `http://d77.smoothstreams.tv:3665/viewss/ch${this.id.length == 1 ? "0" : ""}${this.id}.smil/playlist.m3u8?wmsAuthSign=`;
  }

  get items() {
    if (this.data.items) {
      return this.data.items.map(item => new Item(item));
    } else {
      return [];
    }
  }

  get name() {
    var liveWhen = this.live ? "Now" : `at ${this.items[0].start.getHours()}:${this.items[0].start.getMinutes()}`;
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
    console.log(this.items)
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
      return "";
    }
  }

  setText(nodeType, text) {
    this.node.getElementsByTagName(nodeType).item(0).innerHTML = text;
  }
}

module.exports = Channel;
