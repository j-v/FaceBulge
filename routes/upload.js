
/*
 * POST upload file.
 */

// __dirname will be /Users/jojo/code/FaceBulge/routes
var facedetect_path = __dirname + '/../experiments/facedetect/'
var exec = require('child_process').exec,
    child;
    
exports.action = function(req, res) {
  console.log('running: ' + 'cd '+ facedetect_path + ' && ./a.out ' + req.files.file.path)
  child = exec('cd '+ facedetect_path + ' && ./a.out ' + req.files.file.path,
    function (error, stdout, stderr) {
      res.render('uploaded', { title: 'FaceBulge', face_info: stdout });
      if (error !== null) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
      }
  });
};