var MainView = require('./MainView');

App.onLaunch = function(options) {
  var mainDocument = MainView.render();
  navigationDocument.pushDocument(mainDocument);
};
