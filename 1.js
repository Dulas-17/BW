Const content = {
  series: seriesData, 
  movies: movieData,
};

// Global variables for debouncing
let searchDebounceTimeout;
let suggestionDebounceTimeout;

function playEpisode(link, episodeTitle = null) {
  const player = document.getElementById('videoFullScreen');
  const iframe = player.querySelector('iframe');


  iframe.src = link;
  player.style.display = 'flex';
}

function closeFullScreen() {
  const player = document.getElementById('videoFullScreen');
  const iframe = player.querySelector('iframe');

  iframe.src = '';
  player.style.display = 'none';
  restoreScrollPosition(localStorage.getItem('lastActiveSection'));
}

// --- Local Storage Utilities ---
function saveScrollPosition(sectionId) {
  localStorage.setItem(`scrollPosition_${sectionId}`, window.scrollY);
}

function restoreScrollPosition(sectionId) {
  const storedScrollY = localStorage.getItem(`scrollPosition_${sectionId}`);
  if (storedScrollY) {
    window.scrollTo(0, parseInt(storedScrollY, 10));
  }
}

function saveState(sectionId, detailType = null, detailIndex = null, originSection = null) {
  console.log(`saveState called: sectionId=${sectionId}, detailType=${detailType}, detailIndex=${detailIndex}, originSection=${originSection}`);
  localStorage.setItem('lastActiveSection', sectionId);

  if (detailType !== null && detailIndex !== null) {
    localStorage.setItem('lastDetailType', detailType);
    localStorage.setItem('lastDetailIndex', detailIndex);
  } else {
    localStorage.removeItem('lastDetailType');
    localStorage.removeItem('lastDetailIndex');
  }

  localStorage.removeItem('activeGenre'); // Clean up old generic key if it exists

  if (originSection !== null) {
    localStorage.setItem('originSection', originSection);
  } else {
    localStorage.removeItem('originSection');
  }
  saveScrollPosition(sectionId);
}

// --- Section Management ---
function showSection(id) {
  console.log(`showSection called for: ${id}`);
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  saveState(id);

  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';
  // Ensure the navigation bar is visible when showing a main section
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

// --- Search Functionality ---
function performSearch(type) {
  const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
  const query = inputElement.value.toLowerCase().trim();
  console.log(`Performing search for ${type} with query: "${query}"`);

  hideSuggestions(type);

  if (query) {
    localStorage.setItem(`searchQuery_${type}`, query);
  } else {
    localStorage.removeItem(`searchQuery_${type}`);
  }

  const filtered = content[type].filter(item => {
    if (item.title.toLowerCase().includes(query)) return true;
    if (item.description && item.description.toLowerCase().includes(query)) return true;
    if (item.genres && item.genres.some(genre => genre.toLowerCase().includes(query))) return true;
    return false;
  });

  localStorage.setItem(`activeGenre_${type}`, 'All');
  console.log(`Search performed, activeGenre_${type} set to 'All'.`);
  renderGenreButtons(type);

  const listContainer = document.getElementById(type === 'series' ? 'seriesList' : 'movieList');
  if (filtered.length === 0 && query !== '') {
    listContainer.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
  } else {
    if (type === 'series') {
      showSeriesList(filtered, query);
    } else {
      showMovieList(filtered, query);
    }
  }
  saveScrollPosition(type === 'series' ? 'series' : 'movies');
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
    suggestionDebounceTimeout = setTimeout(() => {
      showSuggestions(type, query);
    }, 100);
  } else {
    hideSuggestions(type);
  }
}

// --- Search Suggestions ---
function showSuggestions(type, query) {
  const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
  suggestionsContainer.innerHTML = '';

  if (query.length === 0) {
    hideSuggestions(type);
    return;
  }

  const relevantContent = content[type];
  const matchingSuggestions = relevantContent.filter(item =>
    item.title.toLowerCase().includes(query)
  ).slice(0, 5);

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
  const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
  suggestionsContainer.classList.remove('active');
}

// --- Genre Filtering ---
function getUniqueGenres(type) {
  const allGenres = content[type].flatMap(item => item.genres || []);
  return ['All', ...new Set(allGenres)].sort();
}

function renderGenreButtons(type) {
  const containerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const genres = getUniqueGenres(type);
  const activeGenre = localStorage.getItem(`activeGenre_${type}`) || 'All';
  console.log(`Rendering genre buttons for ${type}. Active genre from storage: ${activeGenre}`);

  genres.forEach(genre => {
    const button = document.createElement('button');
    button.textContent = genre;
    button.onclick = () => filterContentByGenre(type, genre);
    if (genre === activeGenre) {
      button.classList.add('active-genre');
    }
    container.appendChild(button);
  });
}

function filterContentByGenre(type, genre) {
  console.log(`filterContentByGenre called for ${type} with genre: ${genre}`);
  const genreButtonsContainerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
  const buttons = document.getElementById(genreButtonsContainerId).querySelectorAll('button');

  buttons.forEach(button => {
    button.classList.toggle('active-genre', button.textContent === genre);
  });

  let filteredList;
  if (genre === 'All') {
    filteredList = content[type];
  } else {
    filteredList = content[type].filter(item => item.genres && item.genres.includes(genre));
  }

  if (type === 'series') {
    document.getElementById('seriesSearch').value = '';
    hideSuggestions('series');
    localStorage.removeItem('searchQuery_series');
  } else if (type === 'movies') {
    document.getElementById('movieSearch').value = '';
    hideSuggestions('movies');
    localStorage.removeItem('searchQuery_movies');
  }

  if (type === 'series') {
    showSeriesList(filteredList);
  } else {
    showMovieList(filteredList);
  }

  localStorage.setItem(`activeGenre_${type}`, genre);
  console.log(`activeGenre_${type} saved as: ${genre}`);
}

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

  if (displayList.length === 0 && query !== '') {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
    return;
  } else if (displayList.length === 0 && (list === null || query === '')) {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items to display here.</p>`;
    return;
  }

  displayList.forEach((s) => {
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

  if (displayList.length === 0 && query !== '') {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem; justify-content:center; font-size:1.5rem;">No results found for "${query}".</p>`;
    return;
  } else if (displayList.length === 0 && (list === null || query === '')) {
    container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items to display here.</p>`;
    return;
  }

  displayList.forEach((m) => {
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

// --- Share Functionality ---
function generateShareLink(type, index) {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?type=${type}&id=${index}`;
}

async function shareContent(type, index) {
  const item = type === 'series' ? content.series[index] : content.movies[index];
  if (!item) {
    console.error('Item not found for sharing:', type, index);
    alert('Could not find item to share.');
    return;
  }

  const shareUrl = generateShareLink(type, index);
  const shareData = {
    title: `Stream ${item.title} on BayWatch!`,
    text: item.description ? `"${item.description}"` : '',
    url: shareUrl,
  };

  console.log("Attempting to share:", shareData);

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      console.log('Content shared successfully via Web Share API!');
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.title + '\n' + shareData.text + '\n' + shareData.url)}`;
      window.open(whatsappUrl, '_blank');
      console.log('Opened WhatsApp for sharing.');
    }
  } catch (error) {
    console.error('Error sharing content:', error);
    if (error.name !== 'AbortError') {
      alert('Failed to share. Please try again or copy the link directly.');
    }
  }
}

function copyLinkToClipboard(type, index) {
  const shareUrl = generateShareLink(type, index);
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      alert('Link copied to clipboard!');
      console.log('Link copied:', shareUrl);
    })
    .catch(err => {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please try again.');
    });
}


// --- Detail View Functions ---
function showSeriesDetails(i, originSection = null) {
  console.log(`showSeriesDetails called for index: ${i}, origin: ${originSection}`);
  const s = content.series[i];
  if (!s) {
    console.error("Error: Series item not found at index:", i);
    alert("Could not load series details. Data might be missing or corrupted.");
    showSection(originSection === 'watchLater' ? 'watchLater' : 'series');
    return;
  }
  const container = document.getElementById('seriesDetails');

  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('series').classList.add('active');

  document.getElementById('seriesList').innerHTML = '';
  document.getElementById('seriesDetails').style.display = 'block';

  // Hide navigation bar, search, and genre buttons
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

  container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map(ep => {
    return `<button onclick="playEpisode('${ep.link}', '${ep.title.replace(/'/g, "\\'")}')">${ep.title}</button>`;
  }).join('')}
        </div>
        <div class="detail-bottom-actions">
<button onclick="shareContent('series', ${i})" class="btn share-btn">Share</button>
 <button onclick="goBackToList('series')" class="back">Back</button>
             <button onclick="copyLinkToClipboard('series', ${i})" class="btn copy-link-btn">Copy Link</button> </div>
      `;

  saveState('series', 'series', i, originSection);
  window.scrollTo(0, 0);
}

function showMovieDetails(i, originSection = null) {
  console.log(`showMovieDetails called for index: ${i}, origin: ${originSection}`);
  const m = content.movies[i];
  if (!m) {
    console.error("Error: Movie item not found at index:", i);
    alert("Could not load movie details. Data might be missing or corrupted.");
    showSection(originSection === 'watchLater' ? 'watchLater' : 'movies');
    return;
  }
  const container = document.getElementById('movieDetails');

  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById('movies').classList.add('active');

  document.getElementById('movieList').innerHTML = '';
  document.getElementById('movieDetails').style.display = 'block';

  // Hide navigation bar, search, and genre buttons
  document.querySelector('nav').style.display = 'none';
  document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
  document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

  container.innerHTML = `
        <img src="${m.image}" alt="${m.title}" />
        <h2>${m.title}</h2>
        <p>${m.description}</p>
        <div class="episode-buttons">
          <button onclick="playEpisode('${m.link}', '${m.title.replace(/'/g, "\\'")}')">Watch Now</button>
        </div>
        <div class="detail-bottom-actions"> 
<button onclick="shareContent('movie', ${i})" class="btn share-btn">Share</button>
 <button onclick="goBackToList('movies')" class="back">Back</button>
             <button onclick="copyLinkToClipboard('movie', ${i})" class="btn copy-link-btn">Copy Link</button> </div>
      `;
  saveState('movies', 'movie', i, originSection);
  window.scrollTo(0, 0);
}

function formatTime(seconds) {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function goBackToList(type) {
  console.log(`goBackToList called for: ${type}`);

  if (type === 'series') {
    document.getElementById('seriesDetails').style.display = 'none';
  } else {
    document.getElementById('movieDetails').style.display = 'none';
  }

  const originSection = localStorage.getItem('originSection');

  let targetSectionId = originSection === 'watchLater' ? 'watchLater' : type;
  showSection(targetSectionId);
}

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
  // Ensure the navigation bar is visible when in watch later section
  document.querySelector('nav').style.display = 'flex';
  document.getElementById('seriesDetails').style.display = 'none';
  document.getElementById('movieDetails').style.display = 'none';

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('watchLater').classList.add('active');

  const container = document.getElementById('watchLaterList');
  container.innerHTML = '';

  const watchLaterItems = getWatchLaterList();

  if (watchLaterItems.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #aaa;">Your Watch Later list is empty. Add some series or movies!</p>';
  } else {
    watchLaterItems.forEach((wlItem) => {
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
      // Clear any previous state to ensure clean load
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
        // Ensure nav, search, and genre buttons are hidden if restoring to detail view
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
