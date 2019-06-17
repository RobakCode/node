var fs = require("fs");

var render = function(response, view, params, httpCode) {
  fs.readFile(view, "utf8", function(error, data) {
    if (error) return;

    params = params || {};
    httpCode = httpCode || 200;

    for (var key in params) {
      data = data.replace(new RegExp("@" + key + "@", "g"), params[key]);
    }

    response.writeHead(httpCode, { "Contant-type": "text/plain" });
    response.write(data);
    response.end();
  });
};

exports.render = render;
