var fs = require('fs'),
    file = "doubleCheckDatabaseTest.db";
//var fd = fs.openSync(file, "w");
//console.log("fd: " + fd);
fs.unlink(file);
console.log("Deleted file: " + file);
