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
        <img src="${shot.imageURL}" />
      </li>`;
    }
    resultHTML += "</ul>";
    document.getElementById("main").innerHTML = resultHTML;

  /*  {
        testName: …,
        imageURL: …,
        osName: …,
        browserName: …
      }
      */

  });
})
