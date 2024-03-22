if (typeof browser == "undefined") {
  globalThis.browser = chrome;
}

const styleIdentifier = "pfwa";
const settingsIdentifier = "settings";

function removeStyleById(id) {
  if (el = document.getElementById(id)) {
    el.parentNode.removeChild(el);
  }
}

function removeAllStyles() {
  var el = document.getElementsByClassName(styleIdentifier);
  while (el.length > 0) {
    el[0].parentNode.removeChild(el[0]);
  }
}

function addStyleById(id) {
  if (document.getElementById(id)) return;

  var link = document.createElement('link');
  link.id = id;
  link.className = styleIdentifier;
  link.href = browser.runtime.getURL('css/' + id + '.css');
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

function updateStyles() {
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (result == null || !result.settings.on) {
      removeAllStyles();
      return;
    }

    var styles = Object.keys(result.settings.styles);
    styles.forEach((style) => {
      if (result.settings.styles[style]) {
        addStyleById(style);
      } else {
        removeStyleById(style);
      }
    });
  });
}
browser.storage.onChanged.addListener((changes, area) => {
  if (area == "sync" && changes.settings != null) {
    updateStyles();
  }
});
updateStyles();