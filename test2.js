var exec = require('child_process').exec;
var child;
var timestamp;


child = exec("docker logs ubuntu",
   function (error, stdout, stderr) {
      console.log('stdout: ' + stdout );
      timestamp = stdout;
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }
   });

   console.log(child.stdout);