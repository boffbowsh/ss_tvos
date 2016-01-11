class ErrorDialog {
  constructor(message, cb) {
    var parser = new DOMParser()
    this.document = parser.parseFromString(`<document>
      <alertTemplate>
        <title>Authentication error:</title>
        <description>${message}</description>
        <button>
          <text>OK</text>
        </button>
      </alertTemplate>
    </document>`, "text/xml");
    this.document.addEventListener("select", function() {
      navigationDocument.dismissModal();
      this.document = null
      cb();
    });
  }

  show() {
    navigationDocument.presentModal(this.document);
  }
}

module.exports = ErrorDialog;
