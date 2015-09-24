var connect = require('connect');
var serveStatic = require('serve-static');
var port = 8080;
connect().use(serveStatic("./public")).listen(port);
console.log("started at http://localhost:%s", port);