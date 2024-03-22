if (typeof browser == "undefined") {
  globalThis.browser = chrome;
}

const styleIdentifier = "pfwa";
const settingsIdentifier = "settings";
const defaultSettings = {
  settings: {
    on: true,
    currentPopupMessage: "",
    styles: {
      chatHistory: true,
      textInput: true
    }
  }
};
const requiredPermissions = {
  origins: ["https://chat.openai.com/*"],
  permissions: ["storage"]
}

browser.runtime.onInstalled.addListener(() => {
  browser.permissions.contains(requiredPermissions).then((hasPermissions) => {
    if (hasPermissions) return;
    browser.permissions.request(requiredPermissions);
  });
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (result.hasOwnProperty(settingsIdentifier)) return;
    browser.storage.sync.set(defaultSettings);
  });
});
browser.commands.onCommand.addListener((command) => {
  if (command != "toggle") return;
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) return;

    result.settings.on = !result.settings.on;
    browser.storage.sync.set(result);
  });
});
browser.storage.onChanged.addListener((changes, area) => {
  if (area != "sync" || changes.settings == null) return;

  browser.action.setIcon({
    path: "images/status" + (changes.settings.newValue.on == true ? "On" : "Off") + ".png"
  });
});
