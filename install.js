var mysql = require("mysql");

function installDB() {
  var connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
  });

  connect.connect();

  var queryDB = "CREATE DATABASE IF NOT EXISTS node;";
  var queryTables =
    "CREATE TABLE IF NOT EXISTS node.users (`id` INT AUTO_INCREMENT, `name` VARCHAR(255), `full_name` VARCHAR(255) NOT NULL, PRIMARY KEY(`id`) );";

  connect.query(queryDB, null, function(err) {
    if (err) return;
    connect.query(queryTables, null, function(err) {
      if (err) return;
      console.log("Tabela została dodana do bazy!");
      connect.end();
    });
    console.log("Baza danych została utworzona!");
  });
}

installDB();
