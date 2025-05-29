const homeTab = document.getElementById("homeTab");
const gamesTab = document.getElementById("gamesTab");
const moviesTab = document.getElementById("moviesTab");
const searchTab = document.getElementById("searchTab");
const pageIframe = document.getElementById("pageIframe");

function openTab(tab, pageUrl) {
  if (tab) {
    tab.classList.add("activeTab");
  }
  closeIframe();
  openIframe(
    `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/site/${pageUrl}`,
    document.body
  );
}

function closeTabs(...tab) {
  if (tab) {
    for (let i = 0; i < tab.length; i++) {
      tab[i].classList.remove("activeTab");
    }
  }
}

homeTab.addEventListener("click", function () {
  openTab(homeTab, "home.htm");
  closeTabs(gamesTab, moviesTab, searchTab);
});

gamesTab.addEventListener("click", function () {
  openTab(gamesTab, "games.htm");
  closeTabs(homeTab, moviesTab, searchTab);
});

moviesTab.addEventListener("click", function () {
  openTab(moviesTab, "movies.htm");
  closeTabs(homeTab, gamesTab, searchTab);
});

searchTab.addEventListener("click", function () {
  openTab(searchTab, "search.htm");
  closeTabs(homeTab, moviesTab, gamesTab);
});

openTab(homeTab, "home.htm");
closeTabs(gamesTab, moviesTab, searchTab);

async function openIframe(
  id,
  containerSelector = document.getElementById("gameHolder")
) {
  // Construct the URL to fetch the HTML content.
  let iframeUrl = id;
  while (iframeUrl.includes("%252F")) {
    iframeUrl = iframeUrl.replace("%252F", "/");
  }

  // Fetch the HTML content.
  const response = await fetch(iframeUrl);
  const fetchedHtml = await response.text();

  // Wrap the fetched HTML in a standard HTML document.
  const fullScreenHtml = fetchedHtml;

  // Create the iframe.
  const iframe = document.createElement("iframe");
  iframe.style.border = "none";
  // Optionally, style the iframe to take up 100% of its container.
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.id = "pageIframe";

  // Insert the iframe into the container.
  const container = containerSelector;

  container.appendChild(iframe);

  // Write the full HTML into the iframe.
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(fullScreenHtml);
  iframeDoc.close();
}

function closeIframe() {
  const iframe = document.getElementById("pageIframe");
  if (iframe) {
    iframe.remove();
  }
}
