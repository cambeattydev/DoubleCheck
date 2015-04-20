var fs = require('fs'),
    file = "doubleCheckDatabaseTest.db";
var fd = fs.openSync(file, "w");
var sqlite3 = require('sqlite3'),
    db = new sqlite3.Database(file);
console.log("fd: " + fd);
  db.run("create table users(id integer primary key not null, username varchar(20) not null,   array varchar(400) not null)", function (err){
    console.log("Run Error: " + err);
  });
console.log("Created file: " + file);
fs.closeSync(fd);
console.log("Closed file: " + file);
