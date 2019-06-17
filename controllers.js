var fs = require("fs");
var formidable = require("formidable");
var mysql = require("mysql");
var render = require("./render.js");

function index(request, response) {
  render.render(response, "views/index.html", {
    pageTitle: "Strona główna"
  });
}

function form(request, response) {
  render.render(response, "views/form.html", {
    pageTitle: "Formularz"
  });
}

function saveForm(request, response) {
  var uploadPath = "file/";

  var generateNewFileName = function(fileName) {
    var prefix = Math.floor(Math.random() * 1000 + 1);
    return prefix + "_" + fileName;
  };

  var onSaveError = function(response) {
    render.render(response, "views/saveFrom.html", {
      pageTitle: "Zapisanie formularza - błąd",
      content: "Zapisanie formularza nie powiodło się!"
    });
  };

  var onSaveSuccess = function(response, orderId) {
    render.render(response, "views/saveForm.html", {
      pageTitle: "Zapisanie formularza - zapisano",
      content:
        "Zapisanie formularza powiodło się! Twój numer zgłoszenia to: " +
        orderId
    });
  };

  var saveIntoDb = function(data, onSuccess, onError) {
    var connect = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "node"
    });

    connect.connect();

    connect.query("INSERT INTO users SET ?", data, function(err, result) {
      if (err) {
        onError();
        return;
      }
      onSuccess(result);
    });
  };

  var handleForm = function() {
    var form = new formidable.IncomingForm();

    form.parse(request, function(error, fields, files) {
      if (error) {
        onSaveError(response);
        return;
      }

      var newName = generateNewFileName(files.file.name);

      fs.rename(files.file.path, uploadPath + newName, function(error) {
        if (error) {
          onSaveError(response);
          return;
        }

        var saveData = {};
        saveData["name"] = fields.name;
        saveData["file_name"] = newName;

        var saveDbSuccess = function(result) {
          return onSaveSuccess(response, result.insertId);
        };

        var saveDbError = function() {
          return onSaveError(response);
        };

        saveIntoDb(saveData, saveDbSuccess, saveDbError);
      });
    });
  };

  if (request.method === "POST") {
    handleForm();
  } else {
    response.writeHead(301, { "Contant-type": "text/plain" });
    response.end("Wystąpił błąd!");
    return;
  }
}

function error404(request, response) {
  render.render(response, "views/404.html", {
    pageTitle: "404"
  });
}

exports.index = index;
exports.form = form;
exports.saveForm = saveForm;
exports.error404 = error404;
