class Item {
  constructor(data) {
    this.data = data;
  }

  get start() {
    console.log(this.data.time, Date.parse(this.data.time));
    return new Date(Date.parse(this.data.time));
  }

  get end() {
    return new Date(Date.parse(this.data.end_time));
  }

  get row() {
    return `<row>
        <subtitle class="nextName">${this.name}</subtitle>
        <text class="nextTime">${this.start.getHours()}:${this.start.getMinutes()}</text>
      </row>`;
  }

  get name() {
    return this.data.name;
  }
}

module.exports = Item;
