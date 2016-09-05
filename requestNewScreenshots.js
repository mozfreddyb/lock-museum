#!/usr/bin/env node
//
// Run this periodically to kick off creating new screenshot
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

let screenshotTests = {
  "1276817": 'EV Certificate',
  "1276819": 'DV Certificate',
  "1276821": 'Passive Mixed Content',
  "1276823": 'Active Mixed'
} // xbrowsertesting calls them screenshot_test_id -^

for (let id in screenshotTests) {
  let name = screenshotTests[id];
  let versionsUrl = `${credentialedURL}/${id}/versions?format=json`;
  fetch(versionsUrl)
    .then((res) => res.json())
    .then(function(versionData) {
      let versionList = versionData.versions;
      for (let v of versionList) {
        if (v.result_count.total != v.result_count.successful) {
          //console.log("skipping v:", v, v.result_count.total, v.result_count.successful);
          continue; // skip unfinished
        }
        let vid = v.version_id; // use this, it should be the latest
        //console.log("found version", vid, "for", id);
        let shotsData = `${credentialedURL}/${id}/${vid}?format=json`;
        // tell xbrowsertesting to repeat this screenshot test
        fetch(shotsData, { method: 'POST'});
        break; // once is enough
      }
  });
}
