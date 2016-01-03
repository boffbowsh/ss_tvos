class Config {
  static get username() {
    return localStorage.getItem("username");
  }

  static get password() {
    return localStorage.getItem("password");
  }

  static get site() {
    return localStorage.getItem("site");
  }

  static get host() {
    return localStorage.getItem("host");
  }

  static get port() {
    var port = localStorage.getItem("port");
    if (port) {
      return parseInt(port);
    } else {
      return null;
    }
  }

  static get valid() {
    return !!(this.username && this.password && this.site && this.host && this.port);
  }
}

module.exports = Config;
