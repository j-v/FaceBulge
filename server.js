var express = require('express')
  , app = express.createServer();

app.configure(function() {
  var hourMs = 1000*60*60;
  app.use(express.static(__dirname + '/experiments', { maxAge: hourMs }));
  app.use(express.directory(__dirname + '/experiments'));
  app.use(express.errorHandler());
});

var port = process.env.PORT || 8000;
app.listen(port);