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
  "1276823": 'Active Mixed',
  "1958994": 'Expired'
} // xbrowsertesting calls them screenshot_test_id -^

for (let id in screenshotTests) {
  let name = screenshotTests[id];
  let versionsUrl = `${credentialedURL}/${id}/versions?format=json`;
  fetch(versionsUrl)
    .then((res) => res.json())
    .then(function(versionData) {
      let versionList = versionData.versions;
      let latest = 0;
      let timestamp;
      for (let v of versionList) {
        if ((v.result_count.successful - v.result_count.total) < -4) {
            continue; // skip unfinished
          }
        }
        timestamp = (new Date(v.start_date)).getTime(); //
        if (timestamp < latest) {
          continue
        }
        latest = timestamp;
        var vid = v.version_id; // use this, it should be the latest
        console.log("found version", vid, "for", id);
      }
      console.log("Test", id, "using version", vid, "from", timestamp);
      // tell xbrowsertesting to repeat this screenshot test
      let shotsData = `${credentialedURL}/${id}/${vid}?format=json`;
      fetch(shotsData, { method: 'POST'});
  });
}
