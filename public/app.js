const userSearchForm = document.querySelector("#user-search-form");
const usernameInput = document.querySelector("#username-input");
const titleSearchInput = document.querySelector("#title-search-input");
const sortSelect = document.querySelector("#sort-select");
const mediaFilterSelect = document.querySelector("#media-filter-select");
const favoritesOnlyCheckbox = document.querySelector(
  "#favorites-only-checkbox"
);
const statusMessage = document.querySelector("#status-message");
const mediaGallery = document.querySelector("#media-gallery");
const subredditList = document.querySelector("#subreddit-list");
const loginButton = document.querySelector("#login-button");
const fullscreenViewer = document.querySelector("#fullscreen-viewer");
const viewerContent = document.querySelector("#viewer-content");
const viewerCloseButton = document.querySelector("#viewer-close-button");

let loadedPosts = Array.isArray(window.samplePosts)
  ? window.samplePosts
  : [];
let selectedSubreddit = "all";
let favoritePostIds = new Set(
  JSON.parse(localStorage.getItem("favoritePostIds") || "[]")
);

function saveFavorites() {
  localStorage.setItem(
    "favoritePostIds",
    JSON.stringify([...favoritePostIds])
  );
}
function setStatus(message) {
  statusMessage.textContent = message;
}

function renderPosts() {
  mediaGallery.innerHTML = "";

  const titleQuery = titleSearchInput.value.trim().toLowerCase();
  const mediaFilter = mediaFilterSelect.value;
const sortMethod = sortSelect.value;
const favoritesOnly = favoritesOnlyCheckbox.checked;

  let visiblePosts = loadedPosts.filter((post) => {
    const matchesTitle = post.title.toLowerCase().includes(titleQuery);
    const matchesMedia =
  mediaFilter === "all" || post.mediaType === mediaFilter;

const matchesSubreddit =
  selectedSubreddit === "all" ||
  post.subreddit === selectedSubreddit;

const matchesFavorite =
  !favoritesOnly || favoritePostIds.has(post.id);

return (
  matchesTitle &&
  matchesMedia &&
  matchesSubreddit &&
  matchesFavorite
);
});
  visiblePosts = [...visiblePosts].sort((firstPost, secondPost) => {
    switch (sortMethod) {
      case "date-asc":
        return firstPost.createdUtc - secondPost.createdUtc;

      case "score-desc":
        return secondPost.score - firstPost.score;

      case "comments-desc":
        return secondPost.commentCount - firstPost.commentCount;

      case "date-desc":
      default:
        return secondPost.createdUtc - firstPost.createdUtc;
    }
  });

  if (visiblePosts.length === 0) {
    setStatus(
      loadedPosts.length === 0
        ? "Search for a Reddit user to begin."
        : "No posts match the current filters."
    );

    return;
  }

  setStatus(`${visiblePosts.length} media post(s) shown.`);

  for (const post of visiblePosts) {
    const card = document.createElement("article");
    card.className = "media-card";

const mediaButton = document.createElement("button");
mediaButton.className = "media-card-button";
mediaButton.type = "button";
mediaButton.setAttribute("aria-label", `Open ${post.title} fullscreen`);

const image = document.createElement("img");
image.src = post.mediaUrl;
image.alt = post.title;
image.loading = "lazy";

mediaButton.append(image);

mediaButton.addEventListener("click", () => {
  viewerContent.innerHTML = "";

  const fullscreenImage = document.createElement("img");
  fullscreenImage.src = post.mediaUrl;
  fullscreenImage.alt = post.title;

  viewerContent.append(fullscreenImage);
  fullscreenViewer.hidden = false;
});
    const content = document.createElement("div");
    content.className = "media-card-content";

    const title = document.createElement("h3");
    title.className = "media-card-title";
    title.textContent = post.title;

    const metadata = document.createElement("p");
    metadata.className = "media-card-meta";
    metadata.textContent =
      `r/${post.subreddit} · ${post.score} points · ` +
      `${post.commentCount} comments`;

    const favoriteButton = document.createElement("button");
const isFavorite = favoritePostIds.has(post.id);

favoriteButton.type = "button";
favoriteButton.className = "favorite-button";
favoriteButton.textContent = isFavorite
  ? "★ Remove favorite"
  : "☆ Add favorite";

favoriteButton.addEventListener("click", () => {
  if (favoritePostIds.has(post.id)) {
    favoritePostIds.delete(post.id);
  } else {
    favoritePostIds.add(post.id);
  }

  saveFavorites();
  renderPosts();
});

content.append(title, metadata, favoriteButton);
    card.append(mediaButton, content);
    mediaGallery.append(card);
  }
}

function renderSubreddits() {
  subredditList.innerHTML = "";

  const subredditCounts = new Map();

  for (const post of loadedPosts) {
    const currentCount = subredditCounts.get(post.subreddit) || 0;
    subredditCounts.set(post.subreddit, currentCount + 1);
  }

  if (subredditCounts.size === 0) {
    subredditList.innerHTML = "<p>No user loaded.</p>";
    return;
  }

  const list = document.createElement("ul");
const allItem = document.createElement("li");
const allButton = document.createElement("button");

allButton.type = "button";
allButton.textContent = `All (${loadedPosts.length})`;
allButton.className =
  selectedSubreddit === "all" ? "subreddit-button active" : "subreddit-button";

allButton.addEventListener("click", () => {
  selectedSubreddit = "all";
  renderSubreddits();
  renderPosts();
});

allItem.append(allButton);
list.append(allItem);
  for (const [subreddit, count] of subredditCounts) {
  const item = document.createElement("li");
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = `r/${subreddit} (${count})`;
  button.className =
    selectedSubreddit === subreddit
      ? "subreddit-button active"
      : "subreddit-button";

  button.addEventListener("click", () => {
    selectedSubreddit = subreddit;
    renderSubreddits();
    renderPosts();
  });

  item.append(button);
  list.append(item);
}

  subredditList.append(list);
}

function closeViewer() {
  fullscreenViewer.hidden = true;
  viewerContent.innerHTML = "";
}

userSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();

  if (!username) {
    setStatus("Enter a Reddit username.");
    return;
  }

  setStatus(
    `Ready to search u/${username}. Reddit API access will be connected next.`
  );
});

titleSearchInput.addEventListener("input", renderPosts);
sortSelect.addEventListener("change", renderPosts);
mediaFilterSelect.addEventListener("change", renderPosts);
favoritesOnlyCheckbox.addEventListener("change", renderPosts);

loginButton.addEventListener("click", () => {
  setStatus("Reddit OAuth login will be connected next.");
});

viewerCloseButton.addEventListener("click", closeViewer);

fullscreenViewer.addEventListener("click", (event) => {
  if (event.target === fullscreenViewer) {
    closeViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !fullscreenViewer.hidden) {
    closeViewer();
  }
});

renderSubreddits();
renderPosts();
