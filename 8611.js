const content = {
    series: seriesData, // Assumes seriesData is loaded from 11.js
    movies: movieData,  // Assumes movieData is loaded from 12.js
};

// Global variables for debouncing
let searchDebounceTimeout;   // For the actual search triggered by enter/button
let suggestionDebounceTimeout; // For displaying suggestions as user types

// --- Video Position Tracking (No changes needed here) ---
function saveVideoPosition(videoId, currentTime, duration) {
    const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    videoProgress[videoId] = {
        currentTime: currentTime,
        duration: duration,
        timestamp: Date.now()
    };
    localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
}

function getVideoPosition(videoId) {
    const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    return videoProgress[videoId] || null;
}

function clearVideoPosition(videoId) {
    const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    delete videoProgress[videoId];
    localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
}

function playEpisode(link, episodeTitle = null) {
    const player = document.getElementById('videoFullScreen');
    const iframe = player.querySelector('iframe');

    // Generate a unique ID for this video
    const videoId = episodeTitle ? `${link}-${episodeTitle}` : link;

    // Check for saved position
    const savedPosition = getVideoPosition(videoId);
    const startTime = savedPosition ? savedPosition.currentTime : 0;

    // Add the start time to the video URL
    let videoUrl = link;
    if (startTime > 0) {
        const separator = link.includes('?') ? '&' : '?';
        videoUrl = `${link}${separator}t=${Math.floor(startTime)}`;
    }

    iframe.src = videoUrl;
    player.style.display = 'flex';

    // Set up message listener for tracking progress
    window.addEventListener('message', function videoProgressListener(event) {
        if (event.source !== iframe.contentWindow) return;

        try {
            const data = JSON.parse(event.data);
            if (data.currentTime && data.duration) {
                saveVideoPosition(videoId, data.currentTime, data.duration);
            }
        } catch (e) {
            console.log('Received non-progress message from iframe');
        }
    });

    // Store the listener so we can remove it later
    iframe._progressListener = videoProgressListener;
}

function closeFullScreen() {
    const player = document.getElementById('videoFullScreen');
    const iframe = player.querySelector('iframe');

    // Remove the progress listener
    if (iframe._progressListener) {
        window.removeEventListener('message', iframe._progressListener);
        delete iframe._progressListener;
    }

    iframe.src = '';
    player.style.display = 'none';
    restoreScrollPosition();
}

// --- Local Storage Utilities (No changes needed here for scroll position) ---
function saveScrollPosition() {
    localStorage.setItem('scrollPosition', window.scrollY);
}

function restoreScrollPosition() {
    const storedScrollY = localStorage.getItem('scrollPosition');
    if (storedScrollY) {
        window.scrollTo(0, parseInt(storedScrollY, 10));
    }
}

// *** MODIFIED saveState FUNCTION ***
function saveState(sectionId, detailType = null, detailIndex = null, activeGenreForSection = null, originSection = null) {
    localStorage.setItem('lastActiveSection', sectionId);
    if (detailType !== null && detailIndex !== null) {
        localStorage.setItem('lastDetailType', detailType);
        localStorage.setItem('lastDetailIndex', detailIndex);
    } else {
        localStorage.removeItem('lastDetailType');
        localStorage.removeItem('lastDetailIndex');
    }

    // Store active genre independently for each section
    if (sectionId === 'series' && activeGenreForSection !== null) {
        localStorage.setItem('activeGenre_series', activeGenreForSection);
    } else if (sectionId === 'series' && activeGenreForSection === null) {
        localStorage.removeItem('activeGenre_series');
    }
    if (sectionId === 'movies' && activeGenreForSection !== null) {
        localStorage.setItem('activeGenre_movies', activeGenreForSection);
    } else if (sectionId === 'movies' && activeGenreForSection === null) {
        localStorage.removeItem('activeGenre_movies');
    }
    // Remove the old 'activeGenre' key as it's no longer used
    localStorage.removeItem('activeGenre');


    if (originSection !== null) {
        localStorage.setItem('originSection', originSection);
    } else {
        localStorage.removeItem('originSection');
    }
    saveScrollPosition();
}

// --- Section Management ---
// *** MODIFIED showSection FUNCTION ***
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    // saveState will now handle section-specific active genre based on the 'id'
    // For general section display, we don't pass an active genre to saveState
    saveState(id, null, null, null, null); // Pass null for activeGenreForSection

    document.getElementById('seriesDetails').style.display = 'none';
    document.getElementById('movieDetails').style.display = 'none';
    document.querySelector('nav').style.display = 'flex';

    // Use .search-container instead of .search-box for display control
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

    // Clear search input and hide suggestions when changing sections to prevent stale searches
    if (document.getElementById('seriesSearch')) {
        document.getElementById('seriesSearch').value = '';
        hideSuggestions('series');
    }
    if (document.getElementById('movieSearch')) {
        document.getElementById('movieSearch').value = '';
        hideSuggestions('movies');
    }

    if (id === 'series') {
        document.querySelector('#series .search-container').style.display = 'block'; // Or 'flex' if you want it aligned
        document.getElementById('seriesGenreButtons').style.display = 'flex';
        renderGenreButtons('series');
        // Retrieve the series-specific active genre
        filterContentByGenre('series', localStorage.getItem('activeGenre_series') || 'All');
    } else if (id === 'movies') {
        document.querySelector('#movies .search-container').style.display = 'block'; // Or 'flex'
        document.getElementById('movieGenreButtons').style.display = 'flex';
        renderGenreButtons('movies');
        // Retrieve the movies-specific active genre
        filterContentByGenre('movies', localStorage.getItem('activeGenre_movies') || 'All');
    } else if (id === 'watchLater') {
        showWatchLater();
    }
    window.scrollTo(0, 0);
}

// --- Search Functionality ---
// *** MODIFIED performSearch FUNCTION ***
function performSearch(type) {
    const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
    const query = inputElement.value.toLowerCase().trim();

    // Hide suggestions after performing a search
    hideSuggestions(type);

    const filtered = content[type].filter(item => {
        // Search in title
        if (item.title.toLowerCase().includes(query)) {
            return true;
        }
        // Search in description
        if (item.description && item.description.toLowerCase().includes(query)) {
            return true;
        }
        // Search in genres
        if (item.genres && item.genres.some(genre => genre.toLowerCase().includes(query))) {
            return true;
        }
        return false;
    });

    // Reset the genre filter for the specific section being searched
    localStorage.setItem(`activeGenre_${type}`, 'All');
    renderGenreButtons(type); // Re-render genre buttons to reflect "All" being active

    // Display "No results" message if needed
    const listContainer = document.getElementById(type === 'series' ? 'seriesList' : 'movieList');
    if (filtered.length === 0 && query !== '') {
        listContainer.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
    } else {
        if (type === 'series') {
            showSeriesList(filtered, query); // Pass query for highlighting
        } else {
            showMovieList(filtered, query); // Pass query for highlighting
        }
    }
    saveScrollPosition();
}

// Explicit search trigger (from button or Enter key)
function searchContent(type) {
    clearTimeout(searchDebounceTimeout); // Clear any pending debounced search
    clearTimeout(suggestionDebounceTimeout); // Clear any pending suggestion update
    performSearch(type);
}

// Debounced handler for *suggestions only* (called on input)
function handleSearchInputForSuggestions(type) {
    const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
    const query = inputElement.value.toLowerCase().trim();

    clearTimeout(suggestionDebounceTimeout);
    if (query.length > 0) { // Show suggestions even for 1 char, but only if query isn't empty
        suggestionDebounceTimeout = setTimeout(() => {
            showSuggestions(type, query);
        }, 100); // Show suggestions relatively quickly
    } else {
        hideSuggestions(type); // Hide if input is empty
    }
}

// --- Search Suggestions (No changes needed here) ---
function showSuggestions(type, query) {
    const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
    suggestionsContainer.innerHTML = '';

    if (query.length === 0) { // Only show suggestions if query is not empty
        hideSuggestions(type);
        return;
    }

    const relevantContent = content[type];
    const matchingSuggestions = relevantContent.filter(item =>
        item.title.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to top 5 suggestions

    if (matchingSuggestions.length > 0) {
        matchingSuggestions.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            // Highlight the matching part
            const highlightedText = item.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`);
            suggestionItem.innerHTML = highlightedText;
            // Use an anonymous function for click to avoid immediate execution
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
    performSearch(type); // Immediately perform search on selection
}

function hideSuggestions(type) {
    const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
    suggestionsContainer.classList.remove('active');
    // We don't clear innerHTML immediately on blur, in case user clicks a suggestion
    // It will be cleared before new suggestions are shown or when section changes.
}

// --- Genre Filtering ---
function getUniqueGenres(type) {
    const allGenres = content[type].flatMap(item => item.genres || []);
    return ['All', ...new Set(allGenres)].sort();
}

// *** MODIFIED renderGenreButtons FUNCTION ***
function renderGenreButtons(type) {
    const containerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const genres = getUniqueGenres(type);
    // Get the active genre for the specific section
    const activeGenre = localStorage.getItem(`activeGenre_${type}`) || 'All';

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

// *** MODIFIED filterContentByGenre FUNCTION ***
function filterContentByGenre(type, genre) {
    const genreButtonsContainerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
    const buttons = document.getElementById(genreButtonsContainerId).querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent === genre) {
            button.classList.add('active-genre');
        } else {
            button.classList.remove('active-genre');
        }
    });

    let filteredList;
    if (genre === 'All') {
        filteredList = content[type];
    } else {
        filteredList = content[type].filter(item => item.genres && item.genres.includes(genre));
    }

    // Clear search input and hide suggestions when filtering by genre
    if (type === 'series' && document.getElementById('seriesSearch')) {
        document.getElementById('seriesSearch').value = '';
        hideSuggestions('series');
    } else if (type === 'movies' && document.getElementById('movieSearch')) {
        document.getElementById('movieSearch').value = '';
        hideSuggestions('movies');
    }

    if (type === 'series') {
        showSeriesList(filteredList);
    } else {
        showMovieList(filteredList);
    }
    // Save the active genre for the *specific* section
    saveState(type, null, null, genre, null);
    window.scrollTo(0, 0);
}

// --- Display List Functions ---
// Modified to accept an optional 'query' for highlighting
// *** MODIFIED showSeriesList FUNCTION (retrieves section-specific genre) ***
function showSeriesList(list = null, query = '') {
    const currentList = list || content.series;
    const container = document.getElementById('seriesList');
    container.innerHTML = '';

    const activeGenre = localStorage.getItem('activeGenre_series'); // Get series-specific genre
    // If a specific list is provided (e.g., from search), use it. Otherwise, filter by active genre.
    const displayList = (list === null && activeGenre && activeGenre !== 'All')
        ? currentList.filter(s => s.genres && s.genres.includes(activeGenre))
        : currentList;

    if (displayList.length === 0 && query !== '') {
        container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
        return;
    } else if (displayList.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items to display here.</p>`;
        return;
    }

    displayList.forEach((s) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        // Ensure we get the original index from the *full* content.series array
        // to correctly pass to showSeriesDetails for state saving/data retrieval.
        const originalIndex = content.series.indexOf(s);
        if (originalIndex === -1) return;

        // Check if any episode has progress
        const hasProgress = s.episodes && s.episodes.some(ep => {
            const videoId = `${ep.link}-${ep.title}`;
            return getVideoPosition(videoId);
        });

        // Simple highlighting: replace query with highlighted query
        const highlightedTitle = query ? s.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : s.title;

        div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${highlightedTitle}</h4>
          ${hasProgress ? '<div class="resume-badge">Continue Watching</div>' : ''}
          <button onclick="showSeriesDetails(${originalIndex})" class="btn">Open</button>
          <button onclick="addToWatchLater('series', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
        container.appendChild(div);
    });
    // This condition might need adjustment if `list === null` is always true when reloading section
    // but the restoreScrollPosition is primarily for initial page load or back from details.
    if (list === null && localStorage.getItem('lastActiveSection') === 'series' && !localStorage.getItem('lastDetailType')) {
        restoreScrollPosition();
    }
}

// Modified to accept an optional 'query' for highlighting
// *** MODIFIED showMovieList FUNCTION (retrieves section-specific genre) ***
function showMovieList(list = null, query = '') {
    const currentList = list || content.movies;
    const container = document.getElementById('movieList');
    container.innerHTML = '';

    const activeGenre = localStorage.getItem('activeGenre_movies'); // Get movies-specific genre
    const displayList = (list === null && activeGenre && activeGenre !== 'All')
        ? currentList.filter(m => m.genres && m.genres.includes(activeGenre))
        : currentList;

    if (displayList.length === 0 && query !== '') {
        container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No results found for "${query}".</p>`;
        return;
    } else if (displayList.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">No items to display here.</p>`;
        return;
    }

    displayList.forEach((m) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        // Ensure we get the original index from the *full* content.movies array
        // to correctly pass to showMovieDetails for state saving/data retrieval.
        const originalIndex = content.movies.indexOf(m);
        if (originalIndex === -1) return;

        const videoId = m.link;
        const hasProgress = getVideoPosition(videoId);

        // Simple highlighting: replace query with highlighted query
        const highlightedTitle = query ? m.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : m.title;

        div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${highlightedTitle}</h4>
          ${hasProgress ? '<div class="resume-badge">Continue Watching</div>' : ''}
          <button onclick="showMovieDetails(${originalIndex})" class="btn">Watch</button>
          <button onclick="addToWatchLater('movie', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
        container.appendChild(div);
    });
    if (list === null && localStorage.getItem('lastActiveSection') === 'movies' && !localStorage.getItem('lastDetailType')) {
        restoreScrollPosition();
    }
}


// --- Detail View Functions ---
// *** MODIFIED showSeriesDetails FUNCTION (for saving state) ***
function showSeriesDetails(i, originSection = null) {
    const s = content.series[i];
    if (!s) {
        console.error("Error: Series item not found at index:", i);
        alert("Could not load series details. Data might be missing or corrupted.");
        if (originSection === 'watchLater') {
            showSection('watchLater');
        } else {
            showSection('series');
        }
        return;
    }
    const container = document.getElementById('seriesDetails');

    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('series').classList.add('active');

    document.getElementById('seriesList').innerHTML = ''; // Clear list when showing details
    document.getElementById('seriesDetails').style.display = 'block';

    container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map(ep => {
              const videoId = `${ep.link}-${ep.title}`;
              const progress = getVideoPosition(videoId);
              const progressText = progress ? ` (${formatTime(progress.currentTime)}/${formatTime(progress.duration)})` : '';
              return `<button onclick="playEpisode('${ep.link}', '${ep.title.replace(/'/g, "\\'")}')">${ep.title}${progressText}</button>`;
          }).join('')}
        </div>
        <button onclick="goBackToList('series')" class="back">Back</button>
      `;

    // When showing details, the active genre for the section should still be the one saved
    saveState('series', 'series', i, localStorage.getItem('activeGenre_series'), originSection);
    window.scrollTo(0, 0);

    document.querySelector('nav').style.display = 'none';
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
}

// *** MODIFIED showMovieDetails FUNCTION (for saving state) ***
function showMovieDetails(i, originSection = null) {
    const m = content.movies[i];
    if (!m) {
        console.error("Error: Movie item not found at index:", i);
        alert("Could not load movie details. Data might be missing or corrupted.");
        if (originSection === 'watchLater') {
            showSection('watchLater');
        } else {
            showSection('movies');
        }
        return;
    }
    const container = document.getElementById('movieDetails');

    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('movies').classList.add('active');

    document.getElementById('movieList').innerHTML = ''; // Clear list when showing details
    document.getElementById('movieDetails').style.display = 'block';

    const videoId = m.link;
    const progress = getVideoPosition(videoId);
    const progressText = progress ? ` (${formatTime(progress.currentTime)}/${formatTime(progress.duration)})` : '';

    container.innerHTML = `
        <img src="${m.image}" alt="${m.title}" />
        <h2>${m.title}</h2>
        <p>${m.description}</p>
        <div class="episode-buttons">
          <button onclick="playEpisode('${m.link}', '${m.title.replace(/'/g, "\\'")}')">Watch Now${progressText}</button>
        </div>
        <button onclick="goBackToList('movies')" class="back">Back</button>
      `;
    // When showing details, the active genre for the section should still be the one saved
    saveState('movies', 'movie', i, localStorage.getItem('activeGenre_movies'), originSection);
    window.scrollTo(0, 0);

    document.querySelector('nav').style.display = 'none';
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
}

function formatTime(seconds) {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// *** MODIFIED goBackToList FUNCTION (retrieves section-specific genre) ***
function goBackToList(type) {
    // Before going back, ensure the search input is cleared
    if (type === 'series' && document.getElementById('seriesSearch')) {
        document.getElementById('seriesSearch').value = '';
    } else if (type === 'movies' && document.getElementById('movieSearch')) {
        document.getElementById('movieSearch').value = '';
    }

    // No longer need to retrieve activeGenre here, as showSection will handle it
    const originSection = localStorage.getItem('originSection');

    if (type === 'series') {
        document.getElementById('seriesDetails').style.display = 'none';
    } else {
        document.getElementById('movieDetails').style.display = 'none';
    }

    let targetSectionId;
    if (originSection === 'watchLater') {
        targetSectionId = 'watchLater';
    } else {
        targetSectionId = type;
    }

    showSection(targetSectionId); // showSection now automatically re-applies the correct genre
    window.scrollTo(0, 0);
}

// --- Watch Later Functionality (No changes needed here) ---
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
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
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
    // When showing Watch Later, no active genre for series/movies is relevant, so pass null
    saveState('watchLater', null, null, null, null);
    window.scrollTo(0, 0);
}

// --- Initialize on DOM Content Loaded ---
// *** MODIFIED DOMContentLoaded LISTENER ***
document.addEventListener('DOMContentLoaded', function() {
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    // We no longer retrieve a single 'activeGenre' here
    const originSection = localStorage.getItem('originSection');

    // Initialize genre buttons for both sections, they will pick up their specific active genre
    renderGenreButtons('series');
    renderGenreButtons('movies');

    // Attach event listeners for search inputs
    const seriesSearchInput = document.getElementById('seriesSearch');
    if (seriesSearchInput) {
        // Trigger suggestions on 'input' event (real-time typing)
        seriesSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('series'));
        // Trigger search on 'Enter' key press
        seriesSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission if input is part of a form
                searchContent('series');
            }
        });
        // Hide suggestions when input loses focus (with a small delay for click events to register)
        seriesSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('series'), 100));
        // Show suggestions again if user focuses on the input with text already present
        seriesSearchInput.addEventListener('focus', (event) => {
            const query = event.target.value.toLowerCase().trim();
            if (query.length > 0) { // Show on focus if there's text
                showSuggestions('series', query);
            }
        });
    }

    const movieSearchInput = document.getElementById('movieSearch');
    if (movieSearchInput) {
        // Trigger suggestions on 'input' event (real-time typing)
        movieSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('movies'));
        // Trigger search on 'Enter' key press
        movieSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent default form submission
                searchContent('movies');
            }
        });
        // Hide suggestions when input loses focus (with a small delay for click events to register)
        movieSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('movies'), 100));
        // Show suggestions again if user focuses on the input with text already present
        movieSearchInput.addEventListener('focus', (event) => {
            const query = event.target.value.toLowerCase().trim();
            if (query.length > 0) { // Show on focus if there's text
                showSuggestions('movies', query);
            }
        });
    }

    if (lastActiveSection) {
        if (lastDetailType && lastDetailIndex !== null) {
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
        restoreScrollPosition();
    } else {
        // If no last active section, default to 'home' or your desired starting section
        showSection('home');
    }

    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            saveScrollPosition();
        }, 200);
    });

    window.addEventListener('beforeunload', saveScrollPosition);
});
