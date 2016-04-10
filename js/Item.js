var moment = require('moment-timezone');

class Item {
  constructor(data) {
    this.data = data;
  }

  get start() {
    return moment.tz(this.data.time, "America/New_York").local();
  }

  get end() {
    return moment.tz(this.data.end_time, "America/New_York").local();
  }

  get row() {
    return `<row>
        <subtitle class="nextName">${this.name}</subtitle>
        <text class="nextTime">${this.start.format("H:mm")}</text>
      </row>`;
  }

  get name() {
    return this.data.name;
  }

  get quality() {
    return this.data.quality;
  }
}

module.exports = Item;
