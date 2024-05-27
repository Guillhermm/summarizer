chrome.runtime.onInstalled.addListener(() => {
  // Sets initial state of the extension.
  chrome.storage.sync.set({ isEnabled: false });
});
