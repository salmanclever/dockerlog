'use strict'

const spawn = require('child_process').spawn;

var timestamp;
var container = 'salubuntu';
var option;


function getLog () {
    if(timestamp){
        option =  ['logs', '-t' , '--since' , timestamp , container];
    } else {
        option = ['logs', '-t' , container];
    }
    var command = spawn('docker', option );
    var comout = {};

    command.stdout.on('data', (data) => {
        comout.stdout = data.toString();
        timestamp = comout.stdout.substring(comout.stdout.lastIndexOf("2016-"), comout.stdout.lastIndexOf("Z ") + 1);
        console.log(`stdout: ${comout.stdout} \n`);
    });

    command.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      comout.stderr = data.toString();
    });

    command.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        setTimeout(getLog, 2000);
    });
}

getLog();

