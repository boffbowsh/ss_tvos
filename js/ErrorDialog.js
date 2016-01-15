var escape = require('escape-html');

class ErrorDialog {
  constructor(message, cb) {
    console.log("Error:", message);
    var parser = new DOMParser();
    this.document = parser.parseFromString(`<document>
      <alertTemplate>
        <title>Authentication error:</title>
        <description>${escape(message)}</description>
        <button>
          <text>OK</text>
        </button>
      </alertTemplate>
    </document>`, "text/xml");
    this.document.addEventListener("select", function() {
      navigationDocument.dismissModal();
      this.document = null;
      cb();
    });
  }

  show() {
    navigationDocument.presentModal(this.document);
  }
}

module.exports = ErrorDialog;
