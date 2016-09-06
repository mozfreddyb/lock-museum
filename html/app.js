function normalizeBrowserName(longname) {
  "use strict";
  var match = longname.match(/(Safari|Internet Explorer|Chrome|Firefox|Opera|Edge)/i);
  switch (match[0]) {
    case "Internet Explorer":
      return "edge"; // so we have a one-word thing
    default:
      return match[0].toLowerCase();
  }
}
function normalizeTestName(longname) {
  "use strict";
  let testname = longname.toLowerCase();
  if (testname.indexOf("passive") !== -1) {
    return "mp"; // "mixed passive"
  } else if (testname.indexOf("active") !== -1) {
    return "ma"; // mixed active
  } else if (testname.indexOf("dv certificate") !== -1) {
    return "dv";
  } else if (testname.indexOf("ev certificate") !== -1) {
    return "ev";
  }
}
function uppercase(string) {
  "use strict";
  return string[0].toUpperCase() + string.slice(1);
}
addEventListener("DOMContentLoaded", function () {
  fetch("shots.json").then((r) => r.json()).then((shots) => {
    var byBrowser = {};
    var byTest = [];
    var resultHTML = "<ul>";
    for (let shot of shots) {
      if (!(shot.browserName in byBrowser)) { byBrowser[shot.browserName] = []; }
      if (!(shot.testName in byTest)) { byTest[shot.testName] = []; }
      byTest[shot.testName].push(shot);
      byBrowser[shot.browserName].push(shot);
      resultHTML += `
      <li>
        <span>${shot.testName} in ${shot.browserName} on ${shot.osName}</span><br>
        <a href="${shot.imageURL}" title="Click to expand">
            <img class="screenshot ${normalizeBrowserName(shot.browserName)} ${normalizeTestName(shot.testName)}"
                  src="${shot.imageURL}" />
        </a>
      </li>`;
    }
    resultHTML += "</ul>";
    document.getElementById("main").innerHTML = resultHTML;
  });




  // Add events to browser filter buttons
  var blabels = document.querySelectorAll("label.bf-label");
  for (let blabel of blabels) {
    blabel.addEventListener("click", function(e) {
      "use strict";
      var l = e.target;
      var selectedBrowser = l.dataset.browserName;
      for (let img of document.getElementsByClassName("screenshot")) {
        var el = img.parentNode.parentNode;
        if (selectedBrowser !== "none") {
          if (!img.classList.contains(selectedBrowser)) {
            el.classList.add("bfiltered");
          } else {
            el.classList.remove("bfiltered")
          }
        } else {
          el.classList.remove("bfiltered");
        }
      }
    });
  }


  // filtering by test case
  var tlabels = document.querySelectorAll("label.tf-label");
  for (let tlabel of tlabels) {
    tlabel.addEventListener("click", function(e) {
      "use strict";
      var l = e.target;
      var selectedTest = l.dataset.testName;
      for (let img of document.getElementsByClassName("screenshot")) {
        var el = img.parentNode.parentNode;
        if (selectedTest !== "none") {
          if (!img.classList.contains(selectedTest)) {
            el.classList.add("tfiltered");
          } else {
            el.classList.remove("tfiltered")
          }
        } else {
          el.classList.remove("tfiltered");
        }
      }
    });
  }

  /*  {
        testName: …,
        imageURL: …,
        osName: …,
        browserName: …
      }
      */


});
