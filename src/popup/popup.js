document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("collect").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["content.js"],
        },
        () => {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "SCRAPE_LINKS" },
            (response) => {
              const links = response.links;
              const div = document.getElementById("links");
              links.forEach((link) => {
                const p = document.createElement("p");
                p.textContent = link;
                div.appendChild(p);
              });
            }
          );
        }
      );
    });
  });
});
