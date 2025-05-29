const categories = [
  "action",
  "adventure",
  "RPG",
  "simulation",
  "strategy",
  "sports",
  "racing",
  "fighting",
  "shooter",
  "platformer",
];

function select() {
  categories.forEach((cat) => {
    const output = document.getElementById("navBar");
    const option = document.createElement("option");
    option.value = cat;
    option.innerHTML = cat;
    output.appendChild(option);
  });
}

document.getElementById("navBar").addEventListener("change", function (event) {
  document
    .getElementById(event.target.value)
    .scrollIntoView({ block: "center", inline: "center" });
});

document.addEventListener("DOMContentLoaded", select);

function makeContainer(name) {
  const container = document.createElement("div");
  container.id = name;
  container.classList.add("gameCon");
  container.innerHTML = `<div id="${name}">
        <span class="title">${name}</span>
        <hr class="divider">
        <div class="gameSpace"></div>
      </div>`;
  document.getElementById("games").appendChild(container);
}

function makeCategoryCons() {
  for (let i = 0; i < categories.length; i++) {
    makeContainer(categories[i]);
  }
}

makeCategoryCons();

class Json {
  constructor(id, name, details, img, category) {
    this.id = id;
    this.name = name;
    this.details = details;
    this.img = img;
    this.category = category;
  }
}

let json = []; // Declare json globally

async function processJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    json = await response.json(); // Assign fetched data to global json variable
  } catch (error) {
    console.error(`Error loading JSON:`, error);
  }
}

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

function getCategoryColor(category) {
  // Hash category to a color index
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return categoryColors[Math.abs(hash) % categoryColors.length];
}

async function makeGames(category) {
  if (!json || !Array.isArray(json)) {
    console.error("json is undefined or not an array.");
    return [];
  }

  // Filter for matching category
  const matchingCategories = json.filter((item) => item.category === category);

  matchingCategories.forEach((item) => {
    const game = document.createElement("div");
    game.classList.add("game");
    game.id = item.id;
    game.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/games/${item.id}/img.${item.img}')`;
    const catColor = item.category
      ? getCategoryColor(item.category)
      : categoryColors[0];
    game.innerHTML = `
        <span class="category" style="background:${catColor}">${item.category}</span>
        <h3 class="name">${item.name}</h3>
        <p class="details">${item.details}</p>`;
    game.addEventListener("click", function () {
      openGame(item.id, item.img, item.name);
    });
    document.querySelector(`#${category} .gameSpace`).appendChild(game);
  });
}

// Call processing first, then execute makeGames()
processJSON(
  "https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/json/games.json"
).then(() =>
  categories.forEach((cat) => {
    makeGames(cat);
  })
);

let iframeHTML;

const gameHolder = document.getElementById("gameHolder");
gameHolder.style.display = "none";
gameHolder.innerHTML = "";

function openGame(gameId, img, name = "loading...") {
  document.getElementById("navBar").style.display = "none";
  document.getElementById("games").style.display = "none";
  gameHolder.style.display = "flex";
  gameHolder.innerHTML = `<div id="iframeDetails"><div><img id="iframeImg" src="https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/games/${gameId}/img.${img}">
  </img>
  <span id="iframeName">${name}</span></div>
  <button class="play" id="fullscreen"><span class="material-symbols-outlined">
fullscreen
</span></button>
  </div>`;
  document.body.classList.add("flexIframe");
  openIframe(gameId);
  document.getElementById("fullscreen").addEventListener("click", function () {
    const win = window.open();
    openIframe(gameId, win.document.body);
    const iframe = win.document.getElementById("iframe");
  });
}

async function openIframe(
  id,
  containerSelector = document.getElementById("gameHolder")
) {
  // Construct the URL to fetch the HTML content.
  let iframeUrl = `https://cdn.jsdelivr.net/gh/Wande-inc/ETERNAL@main/assets/games/${id}/index.html`;
  while (iframeUrl.includes("%252F")) {
    iframeUrl = iframeUrl.replace("%252F", "/");
  }

  // Fetch the HTML content.
  const response = await fetch(iframeUrl);
  const fetchedHtml = await response.text();

  // Wrap the fetched HTML in a standard HTML document.
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

  // Create the iframe.
  const iframe = document.createElement("iframe");
  iframe.style.border = "none";
  // Optionally, style the iframe to take up 100% of its container.
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.id = "iframe";

  // Insert the iframe into the container.
  const container = containerSelector;

  container.appendChild(iframe);

  // Write the full HTML into the iframe.
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(fullScreenHtml);
  iframeDoc.close();
}
