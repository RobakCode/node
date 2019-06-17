var controllers = require("./controllers.js");
var server = require("./server.js");

var routing = {
  "/": controllers.index,
  "/form": controllers.form,
  "/save-form": controllers.saveForm,
  "/404": controllers.error404
};

server.start(routing);
