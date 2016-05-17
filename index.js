#!/usr/bin/env node
"use strict";
const nstatic = require("node-static");
const exec = require('child_process').exec;

const TWOHOURS = 60*60*2;
const WEEK = 60*60*24*7;


var file = new nstatic.Server('html/', {
  headers: {
    "Content-Security-Policy": "default-src 'self'; img-src *;",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": " 1; mode=block",
    //Strict-Transport-Security: max-age=31536000; includeSubDomains;

  }
});

// schedule re-generating screenshots
function schedule() {
  // those exec calls are async
  //  but we simply don't care about the results because yolo
  console.log(new Date(), "Requesting new screenshots.")
  exec('nodejs ./requestNewScreenshots.js');

  // we should ask for the URLs to the new screenshots... in two hours.
  setTimeout(function() {
    console.log(new Date(), "Getting latest screenshot URLs.")
    exec('nodejs ./getLatest.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
  });
  }, TWO_HOURS);

  // running again next week
  setTimeout(schedule, WEEK)
}

// host stuff in html/
const PORT = process.env.PORT || 4000;
require ('http').createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
}).listen(PORT);

console.log("> node-static is listening on http://127.0.0.1:"+PORT);
