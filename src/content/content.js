chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SCRAPE_LINKS") {
    const postMessages = document.querySelectorAll(".post_message");
    const links = Array.from(postMessages)
      .map((div) => Array.from(div.querySelectorAll("a[href^='/leave.php']")))
      .flat()
      .map((a) => a.href);
    sendResponse({ links });
  }
});
