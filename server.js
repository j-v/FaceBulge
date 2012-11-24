var express = require('express')
  , app = express.createServer();

var exec = require('child_process').exec,
    child;

//var facedetect_path = '/Users/jojo/code/FaceBulge/experiments/facedetect/'
var facedetect_path = '/home/jojo/FaceBulge/experiments/facedetect/'

app.configure(function() {
  var hourMs = 1000*60*60;
  app.use(express.logger());
  app.use(express.static(__dirname + '/experiments', { maxAge: hourMs }));
  // app.use(express.directory(__dirname + '/experiments'));
  app.use(express.errorHandler());
  app.post('/upload', express.bodyParser(), function(req, res) {
    child = exec('cd '+ facedetect_path + ' && ./a.out ' + req.files.file.path,
      function (error, stdout, stderr) {
        res.send(stdout);
        if (error !== null) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          console.log('exec error: ' + error);
        }
    });
  });
});

var port = process.env.PORT || 8080;
app.listen(port);