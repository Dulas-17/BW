// Data for series and movies. (Assumes these are defined in 2.js and 3.js with unique IDs)
// const seriesData = [...]
// const movieData = [...]

const content = {
  series: seriesData,
  movies: movieData,
};

const buttonSound = new Audio('click2.mp3'); 

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    try {
      buttonSound.currentTime = 0;
      buttonSound.play();
    } catch (err) {
      console.error('Failed to play button sound:', err);
    }
  }
});

let searchDebounceTimeout;
let suggestionDebounceTimeout;
let currentPlayingType = null;
let currentPlayingId = null; // CHANGED: from currentPlayingIndex to currentPlayingId
let scrollPosition = {};

// --- Video Playback & Tracking ---

function playEpisode(link, type, id) { // CHANGED: Takes id instead of index
  const player = document.getElementById('videoFullScreen');
  const iframe = player.querySelector('iframe');

  currentPlayingType = type;
  currentPlayingId = id; // CHANGED: Store the ID

  iframe.src = link;
  player.style.display = 'flex';
}

function closeFullScreen() {
  const player = document.getElementById('videoFullScreen');
  const iframe = player.querySelector('iframe');

  if (currentPlayingType !== null && currentPlayingId !== null) {
      saveAsWatched(currentPlayingType, currentPlayingId); // CHANGED: Pass ID
  }

  iframe.src = '';
  player.style.display = 'none';
  restoreScrollPosition(localStorage.getItem('lastActiveSection'));

  currentPlayingType = null;
  currentPlayingId = null;
}

// --- Local Storage Utilities ---
function saveScrollPosition(sectionId) {
  scrollPosition[sectionId] = window.scrollY;
  localStorage.setItem(`scrollPosition_${sectionId}`, window.scrollY);
}

function restoreScrollPosition(sectionId) {
  const storedScrollY = localStorage.getItem(`scrollPosition_${sectionId}`);
  if (storedScrollY) {
    window.scrollTo(0, parseInt(storedScrollY, 10));
  }
}

// NEW: Functions to track which items have been opened
function markAsOpened(type, id) {
    const key = `opened_${type}_${id}`;
    localStorage.setItem(key, 'true');
}

function isOpened(type, id) {
    const key = `opened_${type}_${id}`;
    return localStorage.getItem(key) === 'true';
}

function saveState(sectionId, detailType = null, detailId = null, originSection = null) { // CHANGED: detailIndex -> detailId
  localStorage.setItem('lastActiveSection', sectionId);

  if (detailType !== null && detailId !== null) {
    localStorage.setItem('lastDetailType', detailType);
    localStorage.setItem('lastDetailId', detailId); // CHANGED: detailIndex -> detailId
  } else {
    localStorage.removeItem('lastDetailType');
    localStorage.removeItem('lastDetailId');
  }

  localStorage.removeItem('activeGenre');

  if (originSection !== null) {
    localStorage.setItem('originSection', originSection);
  } else {
    localStorage.removeItem('originSection');
  }
}

function saveAsWatched(type, id) { // CHANGED: Takes id instead of index
  const key = `watched_${type}_${id}`;
  localStorage.setItem(key, 'true');
}

function isWatched(type, id) { // CHANGED: Takes id instead of index
  const key = `watched_${type}_${id}`;
  return localStorage.getItem(key) === 'true';
}

// --- Section Management ---
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  saveState(id);
  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';
  document.querySelector('nav').style.display = 'flex';
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

  if (id === 'series') {
    document.querySelector('#series .search-container').style.display = 'block';
    document.getElementById('seriesGenreButtons').style.display = 'flex';
    const savedQuery = localStorage.getItem('searchQuery_series') || '';
    document.getElementById('seriesSearch').value = savedQuery;
    renderGenreButtons('series');
    if (savedQuery) performSearch('series');
    else filterContentByGenre('series', localStorage.getItem('activeGenre_series') || 'All');
  } else if (id === 'movies') {
    document.querySelector('#movies .search-container').style.display = 'block';
    document.getElementById('movieGenreButtons').style.display = 'flex';
    const savedQuery = localStorage.getItem('searchQuery_movies') || '';
    document.getElementById('movieSearch').value = savedQuery;
    renderGenreButtons('movies');
    if (savedQuery) performSearch('movies');
    else filterContentByGenre('movies', localStorage.getItem('activeGenre_movies') || 'All');
  } else if (id === 'watchLater') {
    showWatchLater();
  }
}

// --- Search Functionality (No major changes here) ---
function performSearch(type) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  const query = inputElement.value.toLowerCase().trim();
  hideSuggestions(type);
  if (query) localStorage.setItem(`searchQuery_${type}`, query);
  else localStorage.removeItem(`searchQuery_${type}`);
  const filtered = content[type].filter(item => 
    item.title.toLowerCase().includes(query) ||
    (item.description && item.description.toLowerCase().includes(query)) ||
    (item.genres && item.genres.some(genre => genre.toLowerCase().includes(query)))
  );
  localStorage.setItem(`activeGenre_${type}`, 'All');
  renderGenreButtons(type);
  const listContainer = document.getElementById(type === 'series' ? 'seriesList' : 'movieList');
  if (filtered.length === 0 && query !== '') {
    listContainer.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
  } else {
    if (type === 'series') showSeriesList(filtered, query);
    else showMovieList(filtered, query);
  }
}

function searchContent(type) {
  clearTimeout(searchDebounceTimeout);
  clearTimeout(suggestionDebounceTimeout);
  performSearch(type);
}

function handleSearchInputForSuggestions(type) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  const query = inputElement.value.toLowerCase().trim();
  clearTimeout(suggestionDebounceTimeout);
  if (query.length > 0) {
    suggestionDebounceTimeout = setTimeout(() => showSuggestions(type, query), 100);
  } else {
    hideSuggestions(type);
  }
}

function showSuggestions(type, query) {
  const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
  suggestionsContainer.innerHTML = '';
  if (query.length === 0) {
    hideSuggestions(type);
    return;
  }
  const matchingSuggestions = content[type].filter(item => item.title.toLowerCase().includes(query)).slice(0, 5);
  if (matchingSuggestions.length > 0) {
    matchingSuggestions.forEach(item => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      const highlightedText = item.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`);
      suggestionItem.innerHTML = highlightedText;
      suggestionItem.onclick = () => selectSuggestion(type, item.title);
      suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.classList.add('active');
  } else {
    hideSuggestions(type);
  }
}

function selectSuggestion(type, title) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  inputElement.value = title;
  hideSuggestions(type);
  performSearch(type);
}

function hideSuggestions(type) {
  document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions').classList.remove('active');
}

// --- Genre Filtering (No major changes here) ---
function getUniqueGenres(type) {
  const allGenres = content[type].flatMap(item => item.genres || []);
  return ['All', ...new Set(allGenres)].sort();
}

function renderGenreButtons(type) {
  const container = document.getElementById(type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons');
  if (!container) return;
  container.innerHTML = '';
  const genres = getUniqueGenres(type);
  const activeGenre = localStorage.getItem(`activeGenre_${type}`) || 'All';
  genres.forEach(genre => {
    const button = document.createElement('button');
    button.textContent = genre;
    button.onclick = () => filterContentByGenre(type, genre);
    if (genre === activeGenre) button.classList.add('active-genre');
    container.appendChild(button);
  });
}

function filterContentByGenre(type, genre) {
  const buttons = document.getElementById(type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons').querySelectorAll('button');
  buttons.forEach(button => button.classList.toggle('active-genre', button.textContent === genre));
  let filteredList = (genre === 'All') ? content[type] : content[type].filter(item => item.genres && item.genres.includes(genre));
  const searchInput = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  searchInput.value = '';
  hideSuggestions(type);
  localStorage.removeItem(`searchQuery_${type}`);
  if (type === 'series') showSeriesList(filteredList);
  else showMovieList(filteredList);
  localStorage.setItem(`activeGenre_${type}`, genre);
}

// --- Display List Functions ---
function showSeriesList(list = content.series, query = '') {
  const container = document.getElementById('seriesList');
  container.innerHTML = '';
  if (list.length === 0) {
    const message = query ? `No results found for "${query}".` : "No items to display here.";
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">${message}</p>`;
    return;
  }
  list.forEach((s) => {
    const div = document.createElement('div');
    // CHANGED: Check if opened and add class
    const openedClass = isOpened('series', s.id) ? 'item-opened' : '';
    div.className = `series-item ${openedClass}`;
    const highlightedTitle = query ? s.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : s.title;
    div.innerHTML = `
      <img src="${s.image}" alt="${s.title}" />
      <h4>${highlightedTitle}</h4>
      // CHANGED: Pass item's unique id instead of index
      <button onclick="saveScrollAndShowDetails('series', '${s.id}')" class="btn">Open</button>
      <button onclick="addToWatchLater('series', '${s.id}')" class="watch-later-btn">Watch Later</button>
    `;
    container.appendChild(div);
  });
}

function showMovieList(list = content.movies, query = '') {
  const container = document.getElementById('movieList');
  container.innerHTML = '';
  if (list.length === 0) {
    const message = query ? `No results found for "${query}".` : "No items to display here.";
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem; justify-content:center; font-size:1.5rem;">${message}</p>`;
    return;
  }
  list.forEach((m) => {
    const div = document.createElement('div');
    // CHANGED: Check if opened and add class
    const openedClass = isOpened('movie', m.id) ? 'item-opened' : '';
    div.className = `series-item ${openedClass}`;
    const highlightedTitle = query ? m.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : m.title;
    div.innerHTML = `
      <img src="${m.image}" alt="${m.title}" />
      <h4>${highlightedTitle}</h4>
      // CHANGED: Pass item's unique id instead of index
      <button onclick="saveScrollAndShowDetails('movie', '${m.id}')" class="btn">Open</button>
      <button onclick="addToWatchLater('movie', '${m.id}')" class="watch-later-btn">Watch Later</button>
    `;
    container.appendChild(div);
  });
}

// --- Share Functionality ---
function generateShareLink(type, id) { // CHANGED: Takes id instead of index
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?type=${type}&id=${id}`;
}

async function shareContent(type, id) { // CHANGED: Takes id instead of index
  const item = content[type].find(i => i.id === id);
  if (!item) return alert('Could not find item to share.');

  const shareUrl = generateShareLink(type, id);
  const shareData = {
    title: `Stream ${item.title} on BayWatch!`,
    text: item.description || '',
    url: shareUrl,
  };

  try {
    if (navigator.share) await navigator.share(shareData);
    else window.open(`https://wa.me/?text=${encodeURIComponent(shareData.title + '\n' + shareData.text + '\n' + shareData.url)}`, '_blank');
  } catch (error) {
    if (error.name !== 'AbortError') alert('Failed to share.');
  }
}

function copyLinkToClipboard(type, id) { // CHANGED: Takes id instead of index
  const shareUrl = generateShareLink(type, id);
  navigator.clipboard.writeText(shareUrl)
    .then(() => alert('Link copied to clipboard!'))
    .catch(() => alert('Failed to copy link.'));
}

// --- Detail View Functions ---
function saveScrollAndShowDetails(type, id) { // CHANGED: Takes id instead of index
  const sectionId = type === 'series' ? 'series' : 'movies';
  saveScrollPosition(sectionId);
  markAsOpened(type, id); // NEW: Mark this item as opened

  if (type === 'series') showSeriesDetails(id);
  else showMovieDetails(id);
}

function showSeriesDetails(id, originSection = null) { // CHANGED: Takes id instead of index
  const s = content.series.find(item => item.id === id);
  if (!s) {
    alert("Could not load series details.");
    showSection(originSection === 'watchLater' ? 'watchLater' : 'series');
    return;
  }
  const container = document.getElementById('seriesDetails');
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('series').classList.add('active');
  document.getElementById('seriesList').innerHTML = '';
  document.getElementById('seriesDetails').style.display = 'block';
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-container, .genre-buttons').forEach(el => el.style.display = 'none');

  container.innerHTML = `
    <img src="${s.image}" alt="${s.title}" />
    <h2>${s.title}</h2>
    <p>${s.description}</p>
    <div class="episode-buttons">
      ${s.episodes.map((ep, epIndex) => {
        // CHANGED: Use composite ID for watched status
        const episodeId = `${s.id}_${epIndex}`;
        const isEpisodeWatched = isWatched('series', episodeId);
        const buttonClass = isEpisodeWatched ? 'watched-episode-btn' : '';
        // CHANGED: Pass composite ID to playEpisode
        return `<button onclick="playEpisode('${ep.link}', 'series', '${episodeId}')" class="${buttonClass}">${ep.title}</button>`;
      }).join('')}
    </div>
    <div class="detail-bottom-actions">
      // CHANGED: Pass ID to share functions
      <button onclick="shareContent('series', '${s.id}')" class="back">Share</button>
      <button onclick="goBackToList('series')" class="back">Back</button>
      <button onclick="copyLinkToClipboard('series', '${s.id}')" class="back">Link</button>
    </div>
  `;
  saveState('series', 'series', id, originSection); // CHANGED: Save ID instead of index
  window.scrollTo(0, 0);
}

function showMovieDetails(id, originSection = null) { // CHANGED: Takes id instead of index
  const m = content.movies.find(item => item.id === id);
  if (!m) {
    alert("Could not load movie details.");
    showSection(originSection === 'watchLater' ? 'watchLater' : 'movies');
    return;
  }
  const container = document.getElementById('movieDetails');
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('movies').classList.add('active');
  document.getElementById('movieList').innerHTML = '';
  document.getElementById('movieDetails').style.display = 'block';
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-container, .genre-buttons').forEach(el => el.style.display = 'none');
  
  // CHANGED: Use ID for watched status
  const isMovieWatched = isWatched('movie', m.id);
  const buttonClass = isMovieWatched ? 'watched-episode-btn' : '';

  container.innerHTML = `
    <img src="${m.image}" alt="${m.title}" />
    <h2>${m.title}</h2>
    <p>${m.description}</p>
    <div class="episode-buttons">
      // CHANGED: Pass ID to playEpisode
      <button onclick="playEpisode('${m.link}', 'movie', '${m.id}')" class="${buttonClass}">Watch Now</button>
    </div>
    <div class="detail-bottom-actions">
      // CHANGED: Pass ID to share functions
      <button onclick="shareContent('movie', '${m.id}')" class="back">Share</button>
      <button onclick="goBackToList('movies')" class="back">Back</button>
      <button onclick="copyLinkToClipboard('movie', '${m.id}')" class="back">Link</button>
    </div>
  `;
  saveState('movies', 'movie', id, originSection); // CHANGED: Save ID instead of index
  window.scrollTo(0, 0);
}

function goBackToList(type) {
  if (type === 'series') document.getElementById('seriesDetails').style.display = 'none';
  else document.getElementById('movieDetails').style.display = 'none';
  const originSection = localStorage.getItem('originSection');
  let targetSectionId = originSection === 'watchLater' ? 'watchLater' : type;
  showSection(targetSectionId);
  requestAnimationFrame(() => restoreScrollPosition(targetSectionId));
}

// --- Watch Later Functionality ---
function getWatchLaterList() {
  return JSON.parse(localStorage.getItem('watchLater')) || [];
}

function saveWatchLaterList(list) {
  localStorage.setItem('watchLater', JSON.stringify(list));
}

function addToWatchLater(type, id) { // CHANGED: Takes id instead of index
  const item = content[type].find(i => i.id === id);
  if (!item) return;

  const watchLaterList = getWatchLaterList();
  // CHANGED: Check if ID is already in the list
  if (!watchLaterList.some(wlItem => wlItem.id === id)) {
    watchLaterList.push({ id: id, type: type });
    saveWatchLaterList(watchLaterList);
    alert(`${item.title} added to Watch Later!`);
  } else {
    alert(`${item.title} is already in your Watch Later list.`);
  }
}

function removeFromWatchLater(id) { // CHANGED: Takes id instead of index
  let watchLaterList = getWatchLaterList();
  const initialLength = watchLaterList.length;
  watchLaterList = watchLaterList.filter(wlItem => wlItem.id !== id);
  if (watchLaterList.length < initialLength) {
    saveWatchLaterList(watchLaterList);
    alert('Item removed from Watch Later!');
    showWatchLater();
  }
}

function showWatchLater() {
  document.querySelectorAll('.search-container, .genre-buttons').forEach(el => el.style.display = 'none');
  document.querySelector('nav').style.display = 'flex';
  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('watchLater').classList.add('active');

  const container = document.getElementById('watchLaterList');
  const watchLaterItems = getWatchLaterList();
  container.innerHTML = '';

  if (watchLaterItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #aaa;">Your Watch Later list is empty.</p>';
  } else {
    watchLaterItems.forEach((wlItem) => {
      const item = content[wlItem.type].find(i => i.id === wlItem.id);
      if (!item) return;

      const div = document.createElement('div');
      div.className = 'series-item';
      const detailFunctionCall = wlItem.type === 'series' ?
        `showSeriesDetails('${wlItem.id}', 'watchLater')` :
        `showMovieDetails('${wlItem.id}', 'watchLater')`;

      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <h4>${item.title}</h4>
        <button onclick="${detailFunctionCall}" class="btn">View Details</button>
        <button onclick="removeFromWatchLater('${wlItem.id}')" class="remove-watch-later-btn">Remove</button>
      `;
      container.appendChild(div);
    });
  }
  saveState('watchLater');
  restoreScrollPosition('watchLater');
}

// --- Initialize on DOM Content Loaded ---
document.addEventListener('DOMContentLoaded', function() {
  content.series.sort((a, b) => a.title.localeCompare(b.title));
  content.movies.sort((a, b) => a.title.localeCompare(b.title));

  const urlParams = new URLSearchParams(window.location.search);
  const paramType = urlParams.get('type');
  const paramId = urlParams.get('id'); // CHANGED: paramId is now a string ID

  if (paramType && paramId) {
    localStorage.clear(); // Clear state to prevent conflicts with direct link
    if (paramType === 'series' && content.series.some(i => i.id === paramId)) {
      showSeriesDetails(paramId);
    } else if (paramType === 'movie' && content.movies.some(i => i.id === paramId)) {
      showMovieDetails(paramId);
    } else {
      showSection('home');
    }
  } else {
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailId = localStorage.getItem('lastDetailId'); // CHANGED
    const originSection = localStorage.getItem('originSection');

    if (lastActiveSection) {
      if (lastDetailType && lastDetailId) {
        document.querySelector('nav').style.display = 'none';
        document.querySelectorAll('.search-container, .genre-buttons').forEach(el => el.style.display = 'none');
        if (lastDetailType === 'series') showSeriesDetails(lastDetailId, originSection);
        else if (lastDetailType === 'movie') showMovieDetails(lastDetailId, originSection);
      } else {
        showSection(lastActiveSection);
      }
    } else {
      showSection('home');
    }
  }

  // --- Search input event listeners ---
  const setupSearch = (type) => {
    const input = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
    if (!input) return;
    input.addEventListener('input', () => handleSearchInputForSuggestions(type));
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); searchContent(type); } });
    input.addEventListener('blur', () => setTimeout(() => hideSuggestions(type), 150));
    input.addEventListener('focus', (e) => { if (e.target.value) showSuggestions(type, e.target.value); });
  };

  renderGenreButtons('series');
  renderGenreButtons('movies');
  setupSearch('series');
  setupSearch('movies');
});
