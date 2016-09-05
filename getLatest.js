#!/usr/bin/env node
//
// Run this periodically to get a recent list of screenshots
//  into shots.json
//
"use strict";



var fetch = require('node-fetch');
var fs = require("fs");

const OUTFILE = "html/shots.json"
var credentialedURL = process.env.CREDENTIALS;
if (credentialedURL.indexOf("https://") === -1) {
  console.error("Couldnt find credentials!");
  process.exit(1);
}
// format = 'https://USERNAME:TOKEN@crossbrowsertesting.com/api/v3/screenshots'

let screenshotTests = {"1276817": 'EV Certificate',
"1276819": 'DV Certificate',
  "1276821": 'Passive Mixed Content',
  "1276823": 'Active Mixed'
}

var finalList = []; // what we will emit, ultimately

for (let id in screenshotTests) {
  let name = screenshotTests[id];
  let versionsUrl = `${credentialedURL}/${id}/versions?format=json`;
  fetch(versionsUrl)
    .then((res) => res.json())
    .then(function(versionData) {
      let versionList = versionData.versions;
      for (let v of versionList) {
        if ((v.result_count.total - v.result_count.successful) < 4) {
          //console.log("skipping v:", v, v.result_count.total, v.result_count.successful);
          continue; // skip unfinished
        }
        let vid = v.version_id; // use this, it should be the latest
        //console.log("found version", vid, "for", id);
        let shotsData = `${credentialedURL}/${id}/${vid}?format=json`;
        fetch(shotsData).then((res) => res.json()).then(hereTheImages);
        break; // one is enough
      }
  });
}

function hereTheImages(results) {
  debugger;
  var res = results.versions[0];
  for (let shot of res.results) {
    finalList.push({
      testName: screenshotTests[results.screenshot_test_id],
      imageURL: shot.images.windowed,
      osName: shot.os.name,
      browserName: shot.browser.name
    });
  }
  fs.unlinkSync(OUTFILE)
  fs.writeFileSync(OUTFILE, JSON.stringify(finalList));
}

/*function showImage(o) {
  console.log(o.testName, o.browserName, "on", o.osName);
  console.log(o.imageURL, "\n");
}*/
