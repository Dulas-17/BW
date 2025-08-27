// Ensure seriesData and movieData are loaded before this script runs.
const content = {
  series: seriesData.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })), // Sort seriesData at initialization
  movies: movieData.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })),  // Sort movieData at initialization
};

// Global variables for debouncing
let searchDebounceTimeout;
let suggestionDebounceTimeout;

// ... (playEpisode, closeFullScreen, saveScrollPosition, restoreScrollPosition, saveState functions unchanged) ...

// --- Section Management ---
function showSection(id) {
  console.log(`showSection called for: ${id}`);
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
    if (savedQuery) {
      performSearch('series');
    } else {
      const activeGenreSeries = localStorage.getItem('activeGenre_series') || 'All';
      console.log(`Series section active. Stored genre: ${activeGenreSeries}`);
      filterContentByGenre('series', activeGenreSeries);
    }
  } else if (id === 'movies') {
    document.querySelector('#movies .search-container').style.display = 'block';
    document.getElementById('movieGenreButtons').style.display = 'flex';
    const savedQuery = localStorage.getItem('searchQuery_movies') || '';
    document.getElementById('movieSearch').value = savedQuery;
    renderGenreButtons('movies');
    if (savedQuery) {
      performSearch('movies');
    } else {
      const activeGenreMovies = localStorage.getItem('activeGenre_movies') || 'All';
      console.log(`Movies section active. Stored genre: ${activeGenreMovies}`);
      filterContentByGenre('movies', activeGenreMovies);
    }
  } else if (id === 'watchLater') {
    showWatchLater();
  }
  restoreScrollPosition(id);
}

// ... (performSearch, searchContent, handleSearchInputForSuggestions, showSuggestions, selectSuggestion, hideSuggestions, getUniqueGenres, renderGenreButtons, filterContentByGenre functions unchanged) ...

// --- Display List Functions ---
function showSeriesList(list = null, query = '') {
  const currentList = list || content.series;
  const container = document.getElementById('seriesList');
  container.innerHTML = '';

  const activeGenre = localStorage.getItem('activeGenre_series');
  console.log(`showSeriesList called. Active series genre: ${activeGenre}. Query: "${query}"`);

  const displayList = (list === null && activeGenre && activeGenre !== 'All')
    ? currentList.filter(s => s.genres && s.genres.includes(activeGenre))
    : currentList;

  // Sort the display list alphabetically by title (case-insensitive)
  const sortedList = [...displayList].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

  if (sortedList.length === 0 && query !== '') {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
    return;
  } else if (sortedList.length === 0 && (list === null || query === '')) {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items to display here.</p>`;
    return;
  }

  sortedList.forEach((s) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    const originalIndex = content.series.indexOf(s);
    if (originalIndex === -1) return;

    const highlightedTitle = query ? s.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : s.title;

    div.innerHTML = `
      <img src="${s.image}" alt="${s.title}" />
      <h4>${highlightedTitle}</h4>
      <button onclick="showSeriesDetails(${originalIndex})" class="btn">Open</button>
      <button onclick="addToWatchLater('series', ${originalIndex})" class="watch-later-btn">Watch Later</button>
    `;
    container.appendChild(div);
  });
}

function showMovieList(list = null, query = '') {
  const currentList = list || content.movies;
  const container = document.getElementById('movieList');
  container.innerHTML = '';

  const activeGenre = localStorage.getItem('activeGenre_movies');
  console.log(`showMovieList called. Active movie genre: ${activeGenre}. Query: "${query}"`);

  const displayList = (list === null && activeGenre && activeGenre !== 'All')
    ? currentList.filter(m => m.genres && m.genres.includes(activeGenre))
    : currentList;

  // Sort the display list alphabetically by title (case-insensitive)
  const sortedList = [...displayList].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

  if (sortedList.length === 0 && query !== '') {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem; justify-content:center; font-size:1.5rem;">No results found for "${query}".</p>`;
    return;
  } else if (sortedList.length === 0 && (list === null || query === '')) {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items to display here.</p>`;
    return;
  }

  sortedList.forEach((m) => {
    const div = document.createElement('div');
    div.className = 'series-item';
    const originalIndex = content.movies.indexOf(m);
    if (originalIndex === -1) return;

    const highlightedTitle = query ? m.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : m.title;

    div.innerHTML = `
      <img src="${m.image}" alt="${m.title}" />
      <h4>${highlightedTitle}</h4>
      <button onclick="showMovieDetails(${originalIndex})" class="btn">Open</button>
      <button onclick="addToWatchLater('movie', ${originalIndex})" class="watch-later-btn">Watch Later</button>
    `;
    container.appendChild(div);
  });
}

// ... (generateShareLink, shareContent, copyLinkToClipboard, showSeriesDetails, showMovieDetails, formatTime, goBackToList functions unchanged) ...

// --- Watch Later Functionality ---
function getWatchLaterList() {
  const watchLaterJson = localStorage.getItem('watchLater');
  return watchLaterJson ? JSON.parse(watchLaterJson) : [];
}

function saveWatchLaterList(list) {
  localStorage.setItem('watchLater', JSON.stringify(list));
}

function addToWatchLater(type, index) {
  const item = type === 'series' ? content.series[index] : content.movies[index];
  const watchLaterList = getWatchLaterList();
  const itemId = `${type}-${index}`;

  const isAlreadyAdded = watchLaterList.some(
    (wlItem) => wlItem.uniqueId === itemId
  );

  if (!isAlreadyAdded) {
    watchLaterList.push({ uniqueId: itemId, type: type, originalIndex: index, itemData: item });
    saveWatchLaterList(watchLaterList);
    alert(`${item.title} added to Watch Later!`);
  } else {
    alert(`${item.title} is already in your Watch Later list.`);
  }
}

function removeFromWatchLater(type, originalIndex) {
  let watchLaterList = getWatchLaterList();
  const initialLength = watchLaterList.length;
  const itemIdToRemove = `${type}-${originalIndex}`;
  watchLaterList = watchLaterList.filter(
    (wlItem) => wlItem.uniqueId !== itemIdToRemove
  );

  if (watchLaterList.length < initialLength) {
    saveWatchLaterList(watchLaterList);
    alert('Item removed from Watch Later!');
    showWatchLater();
  }
}

function showWatchLater() {
  console.log('showWatchLater called');
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
  document.querySelector('nav').style.display = 'flex';
  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('watchLater').classList.add('active');

  const container = document.getElementById('watchLaterList');
  container.innerHTML = '';

  const watchLaterItems = getWatchLaterList();

  // Sort watch later items alphabetically by title (case-insensitive)
  const sortedWatchLaterItems = [...watchLaterItems].sort((a, b) =>
    a.itemData.title.localeCompare(b.itemData.title, undefined, { sensitivity: 'base' })
  );

  if (sortedWatchLaterItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #aaa;">Your Watch Later list is empty. Add some series or movies!</p>';
  } else {
    sortedWatchLaterItems.forEach((wlItem) => {
      const item = wlItem.itemData;
      const div = document.createElement('div');
      div.className = 'series-item';

      const detailFunctionCall = wlItem.type === 'series'
        ? `showSeriesDetails(${wlItem.originalIndex}, 'watchLater')`
        : `showMovieDetails(${wlItem.originalIndex}, 'watchLater')`;

      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        <h4>${item.title}</h4>
        <button onclick="${detailFunctionCall}" class="btn">View Details</button>
        <button onclick="removeFromWatchLater('${wlItem.type}', ${wlItem.originalIndex})" class="remove-watch-later-btn">Remove</button>
      `;
      container.appendChild(div);
    });
  }
  saveState('watchLater');
  restoreScrollPosition('watchLater');
}

// --- Initialize on DOM Content Loaded ---
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded. Initializing...');

  const urlParams = new URLSearchParams(window.location.search);
  const paramType = urlParams.get('type');
  const paramId = urlParams.get('id');

  if (paramType && paramId !== null) {
    const id = parseInt(paramId, 10);
    if (!isNaN(id)) {
      console.log(`Direct link detected: type=${paramType}, id=${id}`);
      localStorage.removeItem('lastActiveSection');
      localStorage.removeItem('lastDetailType');
      localStorage.removeItem('lastDetailIndex');
      localStorage.removeItem('originSection');

      if (paramType === 'series' && content.series[id]) {
        showSeriesDetails(id);
      } else if (paramType === 'movie' && content.movies[id]) {
        showMovieDetails(id);
      } else {
        console.warn('Direct link item not found or invalid type. Loading home.');
        showSection('home');
      }
    } else {
      console.warn('Invalid ID in direct link. Loading home.');
      showSection('home');
    }
  } else {
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    const originSection = localStorage.getItem('originSection');

    if (lastActiveSection) {
      console.log(`Restoring last active section: ${lastActiveSection}`);
      if (lastDetailType && lastDetailIndex !== null) {
        console.log(`Restoring detail view: ${lastDetailType} at index ${lastDetailIndex}`);
        document.querySelector('nav').style.display = 'none';
        document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
        document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

        if (lastDetailType === 'series') {
          showSeriesDetails(parseInt(lastDetailIndex, 10), originSection);
        } else if (lastDetailType === 'movie') {
          showMovieDetails(parseInt(lastDetailIndex, 10), originSection);
        }
      } else {
        showSection(lastActiveSection);
      }
    } else {
      console.log('No last active section found. Defaulting to "home".');
      showSection('home');
    }
  }

  renderGenreButtons('series');
  renderGenreButtons('movies');

  const seriesSearchInput = document.getElementById('seriesSearch');
  if (seriesSearchInput) {
    seriesSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('series'));
    seriesSearchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchContent('series');
      }
    });
    seriesSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('series'), 100));
    seriesSearchInput.addEventListener('focus', (event) => {
      const query = event.target.value.toLowerCase().trim();
      if (query.length > 0) {
        showSuggestions('series', query);
      }
    });
  }

  const movieSearchInput = document.getElementById('movieSearch');
  if (movieSearchInput) {
    movieSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('movies'));
    movieSearchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        searchContent('movies');
      }
    });
    movieSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('movies'), 100));
    movieSearchInput.addEventListener('focus', (event) => {
      const query = event.target.value.toLowerCase().trim();
      if (query.length > 0) {
        showSuggestions('movies', query);
      }
    });
  }

  let scrollTimer;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const currentSection = localStorage.getItem('lastActiveSection');
      if (currentSection) {
        saveScrollPosition(currentSection);
      }
    }, 200);
  });

  window.addEventListener('beforeunload', () => {
    const currentSection = localStorage.getItem('lastActiveSection');
    if (currentSection) {
      saveScrollPosition(currentSection);
    }
  });
});