chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "collectLinks") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ["src/content/content.js"],
          },
          () => {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "fetchLinks" },
              (response) => {
                sendResponse({ links: response.links });
              }
            );
          }
        );
      }
    });
    return true;
  }
});
