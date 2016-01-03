var parser = new DOMParser();

class Form {
  constructor(template, configName) {
    this.document = parser.parseFromString(template, "text/xml");
    this.document.getElementsByTagName('button').item(0).addEventListener("select", function() {
      localStorage.setItem(configName, this.document.getElementsByTagName('textField').item(0).getFeature('Keyboard').text);
      this.cb();
    }.bind(this));
  }

  show(cb) {
    this.cb = cb;
    navigationDocument.pushDocument(this.document);
  }
}

class UsernameForm extends Form {
  constructor() {
    var template = `<document>
      <formTemplate>
        <banner>
          <description>Enter username / email</description>
        </banner>
        <textField></textField>
        <footer>
          <button>
            <text>Next</text>
          </button>
        </footer>
      </formTemplate>
      </document>`;

    super(template, "username");
  }
}

class PasswordForm extends Form {
  constructor() {
    var template = `<document>
      <formTemplate>
        <banner>
          <description>Enter password</description>
        </banner>
        <textField secure="true"></textField>
        <footer>
          <button>
            <text>Next</text>
          </button>
        </footer>
      </formTemplate>
      </document>`;

    super(template, "password");
  }
}

class SiteForm {
  constructor() {
    var template = `<document>
      <alertTemplate>
         <title>Select your site</title>
         <button data-service-name="viewms" data-port="3655">
            <text>MyStreams &amp; uSport</text>
         </button>
         <button data-service-name="view247" data-port="3625">
            <text>Live 247</text>
         </button>
         <button data-service-name="viewss" data-port="3665">
            <text>StarStreams</text>
         </button>
         <button data-service-name="viewmma" data-port="3645">
            <text>MMA-TV / MyShout</text>
         </button>
         <button data-service-name="viewstvn" data-port="3615">
            <text>StreamTVnow</text>
         </button>
      </alertTemplate>
    </document>`;

    this.document = parser.parseFromString(template, "text/xml");
    this.document.addEventListener("select", function(evt) {
      localStorage.setItem("site", evt.target.getAttribute("data-service-name"));
      localStorage.setItem("port", evt.target.getAttribute("data-port"));
      this.cb();
    }.bind(this));
  }

  show(cb) {
    this.cb = cb;
    navigationDocument.pushDocument(this.document);
  }
}

class ServerForm {
  constructor() {
    var template = `<document>
      <alertTemplate>
         <title>Select your site</title>
         <button data-host="deu.nl2.smoothstreams.tv">
            <text>EU NL Evo</text>
         </button>
         <button data-host="deu.uk1.smoothstreams.tv">
            <text>EU UK Lon</text>
         </button>
         <button data-host="deu.nl1.smoothstreams.tv">
            <text>EU NL i3d</text>
         </button>
         <button data-host="dnae2.smoothstreams.tv">
            <text>US East 2 VA</text>
         </button>
         <button data-host="dnae1.smoothstreams.tv">
            <text>US East 1 NJ</text>
         </button>
         <button data-host="dnaw1.smoothstreams.tv">
            <text>US West LA</text>
         </button>
         <button data-host="dnae3.smoothstreams.tv">
            <text>CA East</text>
         </button>
         <button data-host="dsg.smoothstreams.tv">
            <text>Asia SG</text>
         </button>
      </alertTemplate>
    </document>`;

    this.document = parser.parseFromString(template, "text/xml");
    this.document.addEventListener("select", function(evt) {
      localStorage.setItem("host", evt.target.getAttribute("data-host"));
      this.cb();
    }.bind(this));
  }

  show(cb) {
    this.cb = cb;
    navigationDocument.pushDocument(this.document);
  }
}

class ConfigController {
  constructor() {
    this.usernameForm = new UsernameForm();
    this.passwordForm = new PasswordForm();
    this.siteForm = new SiteForm();
    this.serverForm = new ServerForm();
  }

  show(cb) {
    this.usernameForm.show(() => {
      this.passwordForm.show(() => {
        this.siteForm.show(() => {
          this.serverForm.show(cb);
        });
      });
    });
  }
}

module.exports = ConfigController;
