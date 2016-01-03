var MainView = require('./MainView');
var Config = require('./Config');
var ConfigController = require('./ConfigController');

App.onLaunch = function(options) {
  var mainDocument = MainView.render();

  if (!Config.valid) {
    var configController = new ConfigController();
    configController.show(() => {
      navigationDocument.replaceDocument(mainDocument, navigationDocument.documents[0]);
      navigationDocument.popToRootDocument();
    });
  } else {
    navigationDocument.pushDocument(mainDocument);
  }
};
