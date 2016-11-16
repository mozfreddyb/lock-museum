#!/usr/bin/env node
"use strict";
const nstatic = require("node-static");
const exec = require('child_process').exec;

const TWO_HOURS = 1000*60*60*2;
const WEEK_SEC = 60*60*24*7;
const WEEK_MS = 1000*WEEK_SEC

var file = new nstatic.Server('html/', {
  headers: {
    "Content-Security-Policy": "default-src 'self'; img-src *;",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": " 1; mode=block",
    "Strict-Transport-Security": `max-age=${WEEK_SEC}; includeSubDomains;`,
    "X-Frame-Options": "DENY"

  }
});

// schedule re-generating screenshots
function schedule() {
  // those exec calls are async
  //  but we simply don't care about the results because yolo
  console.log(new Date(), "Requesting new screenshots.");
  exec('node ./requestNewScreenshots.js', (error, stdout, stderr) => {
    console.log("requestNewScreenShots stdout:", stdout);
    console.log("requestNewScreenShots stderr:", stderr);
    if (error) {
      console.error(`requestNewScreenShots exec error: ${error}`);
    }
  });


  // we should ask for the URLs to the new screenshots... in two hours.
  setTimeout(function() {
    console.log(new Date(), "Getting latest screenshot URLs.");
    exec('node ./getLatest.js', (error, stdout, stderr) => {
      console.log("getLatest stdout:", stdout);
      console.log("getLatest stderr:", stderr);
      if (error) {
        console.error(`getLatest exec error: ${error}`);
      }
  });
  }, TWO_HOURS);

  // running again next week
  setTimeout(schedule, WEEK_MS)
}
schedule();

// host stuff in html/
const PORT = process.env.PORT || 4000;
require ('http').createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
}).listen(PORT);

console.log("> node-static is listening on http://127.0.0.1:"+PORT);
