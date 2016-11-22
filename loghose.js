var loghose = require('docker-loghose')
var through = require('through2')
var opts = {
  json: false, // parse the lines that are coming as JSON
  docker: null, // here goes options for Dockerode
  events: null, // an instance of docker-allcontainers
  newline: false, // Break stream in newlines
  // Logs from the container, running docker-loghose are excluded by default.
  // It could create endless loops, when the same logs are written to stdout...
  // To get all logs set includeCurrentContainer to 'true'
  includeCurrentContainer: false, // default value: false
  // the following options limit the containers being matched
  // so we can avoid catching logs for unwanted containers
  matchByName: /hello/, // optional
  matchByImage: /matteocollina/, // optional
  skipByName: /.*pasteur.*/, // optional
  skipByImage: /.*dockerfile.*/ // optional
}
loghose(opts).pipe(through.obj(function (chunk, enc, cb) {
  this.push(JSON.stringify(chunk))
  this.push('\n')
  cb()
})).pipe(process.stdout)
