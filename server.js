var http = require("http");
var url = require("url");

function start(routing) {
  http
    .createServer(function(request, response) {
      var pathName = url.parse(request.url).pathname;

      if (!routing[pathName]) {
        pathName = "/404";
      }

      routing[pathName](request, response);
    })
    .listen(8080, "127.0.0.1");
}

exports.start = start;
