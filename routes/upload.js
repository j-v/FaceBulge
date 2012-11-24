
/*
 * POST upload file.
 */

// __dirname will be /Users/jojo/code/FaceBulge/routes
var facedetect_path = __dirname + '/../experiments/facedetect/'
var exec = require('child_process').exec,
    child;
var fs = require("fs");

// maybe we could use async.js to avoid so much callback spaghetti
exports.action = function(req, res) {
  child = exec('cd '+ facedetect_path + ' && ./a.out ' + req.files.file.path,
    function (error, stdout, stderr) {
      var photo_path = req.files.file.path.split('/')
      res.render('uploaded', { title: 'FaceBulge', face_info: stdout, photo_path: '/uploads/' + photo_path[photo_path.length - 1] });
      if (error !== null) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
      }
  });
};