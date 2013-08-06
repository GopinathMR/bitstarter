var express = require('express');
var fs = require('fs');


var app = express.createServer(express.logger());

app.use(express.static(__dirname));

/*
app.get('/', function(request, response) {
//  response.send('Hello World 2!');
  var buf = fs.readFileSync('index.html');
  response.send(buf.toString());
});
*/

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
