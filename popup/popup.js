 
if (typeof browser == "undefined") {
  globalThis.browser = chrome;
}

const styleIdentifier = "pfwa";
const settingsIdentifier = "settings";

let version = browser.runtime.getManifest().version;
document.getElementById('version').innerText = version;

document.querySelectorAll('[data-locale]').forEach(e => {
  e.innerText = browser.i18n.getMessage(e.dataset.locale);
});
document.querySelectorAll('[data-localetitle]').forEach(e => {
  e.title = browser.i18n.getMessage(e.dataset.localetitle);
});

let switches = document.querySelectorAll("input[type='checkbox']");

switches.forEach((checkbox) => {
  checkbox.addEventListener('change', saveSettings);
});
function saveSettings() {
  let id = this.dataset.style;
  let checked = this.checked;

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) return;
    if (id == "on") {
      result.settings.on = checked;
    } else {
      result.settings.styles[id] = checked;
    }
    browser.storage.sync.set(result);
  });
}

browser.storage.sync.get([settingsIdentifier]).then((result) => {
  if (!result.hasOwnProperty(settingsIdentifier)) return;

  switches.forEach((checkbox) => {
    let id = checkbox.dataset.style;
    if (id == "on") {
      checkbox.checked = result.settings.on;
    } else {
      checkbox.checked = result.settings.styles[id];
    }
  });
});