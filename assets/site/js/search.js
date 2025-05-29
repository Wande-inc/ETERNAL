const MOVIES_URL =
  "https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/json/movies.json";
const GAMES_URL =
  "https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/json/games.json";

let movies = [];
let games = [];
let allItems = [];
let gameHolder;

// Array of colors for categories
const categoryColors = [
  "#5865f2", // blue
  "#f25c54", // red
  "#43b581", // green
  "#f2c94c", // yellow
  "#9b59b6", // purple
  "#e17055", // orange
  "#00b894", // teal
  "#fd79a8", // pink
  "#636e72", // gray
  "#00cec9", // cyan
  "#fdcb6e", // gold
  "#6c5ce7", // indigo
];

async function fetchData() {
  try {
    const [moviesRes, gamesRes] = await Promise.all([
      fetch(MOVIES_URL),
      fetch(GAMES_URL),
    ]);
    movies = await moviesRes.json();
    games = await gamesRes.json();
    allItems = [
      ...movies.map((m) => ({ ...m, type: "movie" })),
      ...games.map((g) => ({ ...g, type: "game" })),
    ];
    // Wait for DOM to be ready before rendering
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        renderResults(allItems)
      );
    } else {
      renderResults(allItems);
    }
  } catch (e) {
    document.getElementById("results").innerHTML = "<p>Error loading data.</p>";
  }
}

function openItem(item) {
  // Hide all other elements except gameHolder
  Array.from(document.body.children).forEach((child) => {
    if (child.id !== "gameHolder") {
      child.style.display = "none";
    }
  });
  // Create or show the gameHolder overlay
  if (!gameHolder) {
    gameHolder = document.createElement("div");
    gameHolder.id = "gameHolder";
    document.body.appendChild(gameHolder);
  }
  document.body.classList.add("flexIframe");
  gameHolder.style.display = "flex";
  gameHolder.innerHTML = `<div id="iframeDetails"><div><img id="iframeImg" src="${
    item.type === "movie"
      ? `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/movies/${item.id}/img.${item.img}`
      : `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/games/${item.id}/img.${item.img}`
  }">
  </img>
  <span id="iframeName">${item.name}</span></div>
  <button class="play" id="fullscreen"><span class="material-symbols-outlined">
fullscreen
</span></button>
  </div>`;
  openIframe(item);
  document.getElementById("fullscreen").addEventListener("click", function () {
    const win = window.open();
    openIframe(item, win.document.body);
  });
}

async function openIframe(item, containerSelector = null) {
  let iframeUrl =
    item.type === "movie"
      ? `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/movies/${item.id}/index.html`
      : `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/games/${item.id}/index.html`;
  while (iframeUrl.includes("%252F")) {
    iframeUrl = iframeUrl.replace("%252F", "/");
  }
  const response = await fetch(iframeUrl);
  const fetchedHtml = await response.text();
  const fullScreenHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fullscreen Content</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: black;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    ${fetchedHtml}
  </body>
</html>
  `;
  const iframe = document.createElement("iframe");
  iframe.style.border = "none";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.id = "iframe";
  const container = containerSelector || document.getElementById("gameHolder");
  container.appendChild(iframe);
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(fullScreenHtml);
  iframeDoc.close();
}

function getCategoryColor(category) {
  // Hash category to a color index
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return categoryColors[Math.abs(hash) % categoryColors.length];
}

function renderResults(items) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  if (!items.length) {
    results.innerHTML = "<p>No results found.</p>";
    return;
  }
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "game";
    let imgUrl =
      item.type === "movie"
        ? `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/movies/${item.id}/img.${item.img}`
        : `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/games/${item.id}/img.${item.img}`;
    div.style.backgroundImage = `url('${imgUrl}')`;
    const catColor = item.category
      ? getCategoryColor(item.category)
      : categoryColors[0];
    div.innerHTML = `
      <span class="category" style="background:${catColor}">${
      item.category || ""
    }</span>
      <h3 class="name">${item.name}</h3>
      <p class="details">${item.details || ""}</p>
      <span class="type">${item.type}</span>
    `;
    div.addEventListener("click", () => openItem(item));
    results.appendChild(div);
  });
}

// Ensure DOM is ready before adding event listeners
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", function (e) {
    const val = e.target.value.trim().toLowerCase();
    if (!val) {
      renderResults(allItems);
      return;
    }
    const filtered = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(val) ||
        (item.details && item.details.toLowerCase().includes(val)) ||
        (item.category && item.category.toLowerCase().includes(val))
    );
    renderResults(filtered);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupSearch);
} else {
  setupSearch();
}

fetchData();
