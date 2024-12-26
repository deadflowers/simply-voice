// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-voice") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleVoice" });
    });
  }
});

// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    spellCheck: true,
    grammarCheck: true,
    silenceTimeout: 6,
    recordAudio: false
  });

  // Create context menu
  chrome.contextMenus.create({
    id: "start-voice",
    title: "Start voice input",
    contexts: ["editable"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "start-voice") {
    chrome.tabs.sendMessage(tab.id, { action: "toggleVoice" });
  }
});