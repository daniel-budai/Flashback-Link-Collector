document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("collect").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      scrapePage(tabs[0].id, 1);
    });
  });
});

function scrapePage(tabId, pageNumber) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["src/content/content.js"],
    },
    () => {
      chrome.tabs.sendMessage(tabId, { action: "SCRAPE_LINKS" }, (response) => {
        const links = response.links;
        const div = document.getElementById("links");

        links.forEach((link) => {
          const a = document.createElement("a");
          let actualUrl;
          if (link.startsWith("https://www.flashback.org/leave.php?u=")) {
            actualUrl = new URL(link).searchParams.get("u");
          } else {
            actualUrl = link;
          }
          a.textContent = actualUrl;
          a.href = actualUrl;
          a.target = "_blank";
          div.appendChild(a);
          div.appendChild(document.createElement("br"));
        });

        const nextPageNumber = pageNumber + 1;
        const nextPageUrl = `https://www.flashback.org/t3610716p${nextPageNumber}`;
        chrome.tabs.update(tabId, { url: nextPageUrl }, () => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (info.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);

              setTimeout(() => {
                scrapePage(tabId, nextPageNumber);
              }, 5000);
            }
          });
        });
      });
    }
  );
}
