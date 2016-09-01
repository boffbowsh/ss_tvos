var Entities = require('special-entities');
var Config = require('./Config');
var moment = require('moment-timezone');

var parser = new DOMParser();

class Item {
  constructor(data, channel) {
    this.data = data;
    this.node = null;
    this.children = [];
    this.channel = channel;

    Item.items[this.id] = this;
  }

  get start() {
    return moment.tz(this.data.time, "America/New_York").local();
  }

  get end() {
    return moment.tz(this.data.end_time, "America/New_York").local();
  }

  get name() {
    return this.data.name;
  }

  get id() {
    return parseInt(this.data.id, 10);
  }

  get subtitle() {
    return this.channel.name + " - " + this.data.runtime / 60 + "h";
  }

  get ordinal() {
    if (this.live) {
      return "Live";
    } else {
      return this.start.format("HH:mm");
    }
  }

  get live() {
    return this.start <= new Date(Date.now()) &&
           this.end > new Date(Date.now());
  }

  get past() {
    return this.end < new Date(Date.now());
  }

  get parentId() {
    return parseInt(this.data.parent_id, 10);
  }

  view() {
    var altVersionsTitle;
    if (this.children.length > 0)
      altVersionsTitle = '<title>Alternative versions:</title>';
    return `<listItemLockup id="item_${this.id}">
      <ordinal minLength="5" class="ordinalLayout"></ordinal>
      <subtitle></subtitle>
      <title></title>
      <decorationLabel></decorationLabel>
      <relatedContent>
        <itemBanner>
          ${altVersionsTitle}
          <row>
          </row>
        </itemBanner>
      </relatedContent>
    </listItemLockup>`;
  }

  create(context) {
    var channelDoc = parser.parseFromString(this.view(), "text/xml");
    this.node = context.ownerDocument.adoptNode(channelDoc.firstChild);
    this.node.addEventListener("select", this.channel.play.bind(this.channel));
    context.appendChild(this.node);
    this.update(this.data);
    this.addAlternativeVersions();
  }

  update(data) {
    this.data = data;
    if (this.node && this.past) {
      this.node.parentNode.removeChild(this.node);
      this.node = null;
      return;
    }
    this.setText("ordinal", this.ordinal);
    this.setText("subtitle", this.subtitle);
    this.setText("title", this.name);
    this.setText("decorationLabel", this.quality);
  }

  addAlternativeVersions() {
    for (let i in this.children) {
      var child = this.children[i];
      this.addAlternativeVersion(child);
    }
  }

  addAlternativeVersion(item) {
    var badge;
    if (item.quality == "720p")
      badge = '<badge src="resource://hd"/>';
    var language = item.data.language.toUpperCase();

    var markup = `<buttonLockup>${badge}<title>${language}</title></buttonLockup>`;

    var row = this.node.getElementsByTagName("row").item(0);
    var altDoc = parser.parseFromString(markup, "text/xml");
    var node = row.ownerDocument.adoptNode(altDoc.firstChild);
    node.addEventListener("select", item.channel.play.bind(item.channel));
    row.appendChild(node);
  }

  setText(nodeType, text) {
    if (text === undefined || text.length === 0) {
      return;
    }
    text = Entities.normalizeXML(text, "numeric");
    text = text.replace(/ & /, ' &amp; ');
    this.node.getElementsByTagName(nodeType).item(0).innerHTML = text;
  }

  cmp(other) {
    if (this.start.isAfter(other.start))
      return 1;
    if (this.start.isBefore(other.start))
      return -1;
    if (this.id > other.id)
      return 1;
    return 0;
  }
}

Item.items = {};

module.exports = Item;
