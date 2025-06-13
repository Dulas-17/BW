// Ensure seriesData and movieData are loaded before this script runs.
// These are assumed to be globally available, e.g., from separate script files like 11.js and 12.js
const content = {
  series: typeof seriesData !== 'undefined' ? seriesData : [],
  movies: typeof movieData !== 'undefined' ? movieData : [],
};

// Global variables for debouncing search and suggestion inputs
let searchDebounceTimeout;
let suggestionDebounceTimeout;

---

// ## Video Position Tracking
// Functions to save, retrieve, and clear video playback progress in localStorage.

function saveVideoPosition(videoId, currentTime, duration) {
    const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    videoProgress[videoId] = {
        currentTime: currentTime,
        duration: duration,
        timestamp: Date.now()
    };
    localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
    console.log(`Video progress saved for ${videoId}: ${currentTime}/${duration}`);
}

function getVideoPosition(videoId) {
    const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    return videoProgress[videoId] || null;
}

function clearVideoPosition(videoId) {
    const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    delete videoProgress[videoId];
    localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
    console.log(`Video progress cleared for ${videoId}`);
}

/**
 * Plays a video in fullscreen.
 * @param {string} link The URL of the video.
 * @param {string} itemType 'series' or 'movie' to categorize the content.
 * @param {number} originalIndex The original index of the series or movie in its respective 'content' array.
 * @param {string|null} episodeTitle The title of the episode (if applicable for series).
 */
function playEpisode(link, itemType, originalIndex, episodeTitle = null) {
    const player = document.getElementById('videoFullScreen');
    const iframe = player.querySelector('iframe');
    const videoId = episodeTitle ? `${link}-${episodeTitle}` : link; // Unique ID for progress tracking

    const savedPosition = getVideoPosition(videoId);
    const startTime = savedPosition ? savedPosition.currentTime : 0;

    let videoUrl = link;
    // Append start time to URL if a saved position exists
    if (startTime > 0) {
        const separator = link.includes('?') ? '&' : '?';
        videoUrl = `${link}${separator}t=${Math.floor(startTime)}`;
    }

    iframe.src = videoUrl;
    player.style.display = 'flex'; // Show the fullscreen player

    // Save the state that the player is now active
    savePlayerState(true, itemType, originalIndex, episodeTitle, link);

    // Event listener for receiving video progress messages from the iframe
    // This assumes the iframe content sends messages with currentTime and duration
    window.addEventListener('message', function videoProgressListener(event) {
        // Ensure message comes from the loaded iframe
        if (event.source !== iframe.contentWindow) return;
        try {
            const data = JSON.parse(event.data);
            if (data.currentTime && data.duration) {
                saveVideoPosition(videoId, data.currentTime, data.duration);
            }
        } catch (e) {
            // console.log('Received non-progress message or parsing error from iframe:', e);
        }
    });

    iframe._progressListener = videoProgressListener; // Store listener reference for removal
}

function closeFullScreen() {
    const player = document.getElementById('videoFullScreen');
    const iframe = player.querySelector('iframe');

    // Remove the progress listener to prevent memory leaks and unnecessary calls
    if (iframe._progressListener) {
        window.removeEventListener('message', iframe._progressListener);
        delete iframe._progressListener;
    }

    iframe.src = ''; // Clear iframe src to stop playback
    player.style.display = 'none'; // Hide the fullscreen player
    restoreScrollPosition(); // Restore scroll position of the underlying page

    // Clear the player state when closing
    savePlayerState(false);
    console.log('Fullscreen player closed.');
}

---

// ## Local Storage Utilities
// Functions for saving and restoring scroll position and the current application state.

function saveScrollPosition() {
    localStorage.setItem('scrollPosition', window.scrollY);
    console.log(`Scroll position saved: ${window.scrollY}`);
}

function restoreScrollPosition() {
    const storedScrollY = localStorage.getItem('scrollPosition');
    if (storedScrollY) {
        window.scrollTo(0, parseInt(storedScrollY, 10));
        console.log(`Scroll position restored to: ${storedScrollY}`);
    }
}

/**
 * Saves the current state of the fullscreen video player.
 * @param {boolean} isPlaying True if the player is currently open and playing.
 * @param {string|null} videoType The type of content ('series' or 'movie').
 * @param {number|null} videoIndex The original index of the content item.
 * @param {string|null} episodeTitle The title of the episode (if a series episode).
 * @param {string|null} videoLink The direct link to the video being played.
 */
function savePlayerState(isPlaying, videoType = null, videoIndex = null, episodeTitle = null, videoLink = null) {
    const playerState = {
        isPlaying: isPlaying,
        videoType: videoType,
        videoIndex: videoIndex,
        episodeTitle: episodeTitle,
        videoLink: videoLink
    };
    localStorage.setItem('currentPlayerState', JSON.stringify(playerState));
    console.log('Saved player state:', playerState);
}

/**
 * Saves the general application section and detail view state.
 * Automatically clears player state when a non-player view is saved.
 * @param {string} sectionId The ID of the currently active main section (e.g., 'home', 'series').
 * @param {string|null} detailType The type of detail being viewed ('series' or 'movie').
 * @param {number|null} detailIndex The index of the item in detail view.
 * @param {string|null} originSection The section from which the detail view was opened (e.g., 'watchLater').
 */
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
    saveScrollPosition();

    // IMPORTANT: Clear player state if we're saving a non-player view
    savePlayerState(false);
}

---

// ## Section Management
// Controls which main content section is visible and updates the application state.

/**
 * Shows a specific content section and hides others.
 * @param {string} id The ID of the section to show (e.g., 'home', 'series', 'movies', 'watchLater').
 */
function showSection(id) {
    console.log(`showSection called for: ${id}`);
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    saveState(id); // Save this section as the last active state

    // Hide detail views
    document.getElementById('seriesDetails').style.display = 'none';
    document.getElementById('movieDetails').style.display = 'none';

    // Ensure the navigation bar is visible when showing a main section
    document.querySelector('nav').style.display = 'flex';

    // Hide search and genre buttons by default for all sections, then show for relevant ones
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

    // Clear search inputs and hide suggestions when switching sections
    if (document.getElementById('seriesSearch')) {
        document.getElementById('seriesSearch').value = '';
        hideSuggestions('series');
    }
    if (document.getElementById('movieSearch')) {
        document.getElementById('movieSearch').value = '';
        hideSuggestions('movies');
    }

    // Specific logic for 'series' and 'movies' sections
    if (id === 'series') {
        document.querySelector('#series .search-container').style.display = 'block';
        document.getElementById('seriesGenreButtons').style.display = 'flex';
        const activeGenreSeries = localStorage.getItem('activeGenre_series') || 'All';
        console.log(`Series section active. Stored genre: ${activeGenreSeries}`);
        renderGenreButtons('series');
        filterContentByGenre('series', activeGenreSeries);
    } else if (id === 'movies') {
        document.querySelector('#movies .search-container').style.display = 'block';
        document.getElementById('movieGenreButtons').style.display = 'flex';
        const activeGenreMovies = localStorage.getItem('activeGenre_movies') || 'All';
        console.log(`Movies section active. Stored genre: ${activeGenreMovies}`);
        renderGenreButtons('movies');
        filterContentByGenre('movies', activeGenreMovies);
    } else if (id === 'watchLater') {
        showWatchLater(); // Special handling for watch later section
    }
    window.scrollTo(0, 0); // Scroll to top when changing main sections
}

---

// ## Search Functionality
// Handles text search, debouncing, and displaying results/suggestions.

/**
 * Performs a search based on the input query for a given content type.
 * @param {'series'|'movies'} type The type of content to search within.
 */
function performSearch(type) {
    const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
    const query = inputElement.value.toLowerCase().trim();
    console.log(`Performing search for ${type} with query: "${query}"`);

    hideSuggestions(type); // Hide suggestions once search is initiated

    // Filter content based on title, description, or genres
    const filtered = content[type].filter(item => {
        if (item.title.toLowerCase().includes(query)) return true;
        if (item.description && item.description.toLowerCase().includes(query)) return true;
        if (item.genres && item.genres.some(genre => genre.toLowerCase().includes(query))) return true;
        return false;
    });

    // Reset active genre to 'All' when a search is performed
    localStorage.setItem(`activeGenre_${type}`, 'All');
    console.log(`Search performed, activeGenre_${type} set to 'All'.`);
    renderGenreButtons(type); // Re-render genre buttons to reflect 'All' active

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
    saveScrollPosition(); // Save scroll position after rendering search results
}

/**
 * Debounced search function. Calls performSearch after a delay.
 * @param {'series'|'movies'} type The type of content.
 */
function searchContent(type) {
    clearTimeout(searchDebounceTimeout);
    clearTimeout(suggestionDebounceTimeout); // Clear suggestion debounce too
    // performSearch will be called directly when 'Enter' is pressed or a suggestion is selected.
    // This function is kept for consistency if a general "search button" was implemented.
    performSearch(type);
}

/**
 * Handles input for search suggestions with debouncing.
 * @param {'series'|'movies'} type The type of content.
 */
function handleSearchInputForSuggestions(type) {
    const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
    const query = inputElement.value.toLowerCase().trim();

    clearTimeout(suggestionDebounceTimeout);
    if (query.length > 0) {
        suggestionDebounceTimeout = setTimeout(() => {
            showSuggestions(type, query);
        }, 100); // Small debounce for suggestions
    } else {
        hideSuggestions(type);
    }
}

---

// ## Search Suggestions
// Displays interactive suggestions as the user types in the search bar.

/**
 * Displays search suggestions based on the query.
 * @param {'series'|'movies'} type The type of content.
 * @param {string} query The search query.
 */
function showSuggestions(type, query) {
    const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (query.length === 0) {
        hideSuggestions(type);
        return;
    }

    const relevantContent = content[type];
    const matchingSuggestions = relevantContent.filter(item =>
        item.title.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 suggestions

    if (matchingSuggestions.length > 0) {
        matchingSuggestions.forEach(item => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            // Highlight the matching part of the title
            const highlightedText = item.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`);
            suggestionItem.innerHTML = highlightedText;
            suggestionItem.onclick = () => selectSuggestion(type, item.title);
            suggestionsContainer.appendChild(suggestionItem);
        });
        suggestionsContainer.classList.add('active'); // Show suggestions container
    } else {
        hideSuggestions(type); // Hide if no matches
    }
}

/**
 * Selects a suggestion, populates the search input, and performs a search.
 * @param {'series'|'movies'} type The type of content.
 * @param {string} title The title of the selected suggestion.
 */
function selectSuggestion(type, title) {
    const inputElement = document.getElementById(type === 'series' ? 'seriesSearch' : 'movieSearch');
    inputElement.value = title; // Set input value to selected title
    hideSuggestions(type); // Hide suggestions
    performSearch(type); // Perform search for the selected title
}

/**
 * Hides the search suggestions container.
 * @param {'series'|'movies'} type The type of content.
 */
function hideSuggestions(type) {
    const suggestionsContainer = document.getElementById(type === 'series' ? 'seriesSuggestions' : 'movieSuggestions');
    suggestionsContainer.classList.remove('active');
}

---

// ## Genre Filtering
// Manages the display and filtering of content by genre.

/**
 * Retrieves a sorted list of unique genres for a given content type.
 * @param {'series'|'movies'} type The type of content.
 * @returns {string[]} An array of unique genres, including 'All'.
 */
function getUniqueGenres(type) {
    const allGenres = content[type].flatMap(item => item.genres || []);
    return ['All', ...new Set(allGenres)].sort();
}

/**
 * Renders genre filter buttons for a given content type.
 * @param {'series'|'movies'} type The type of content.
 */
function renderGenreButtons(type) {
    const containerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear existing buttons
    const genres = getUniqueGenres(type);
    const activeGenre = localStorage.getItem(`activeGenre_${type}`) || 'All';
    console.log(`Rendering genre buttons for ${type}. Active genre from storage: ${activeGenre}`);

    genres.forEach(genre => {
        const button = document.createElement('button');
        button.textContent = genre;
        button.onclick = () => filterContentByGenre(type, genre);
        if (genre === activeGenre) {
            button.classList.add('active-genre'); // Highlight active genre
        }
        container.appendChild(button);
    });
}

/**
 * Filters and displays content based on the selected genre.
 * @param {'series'|'movies'} type The type of content.
 * @param {string} genre The genre to filter by.
 */
function filterContentByGenre(type, genre) {
    console.log(`filterContentByGenre called for ${type} with genre: ${genre}`);
    const genreButtonsContainerId = type === 'series' ? 'seriesGenreButtons' : 'movieGenreButtons';
    const buttons = document.getElementById(genreButtonsContainerId).querySelectorAll('button');

    // Update active class on genre buttons
    buttons.forEach(button => {
        button.classList.toggle('active-genre', button.textContent === genre);
    });

    let filteredList;
    if (genre === 'All') {
        filteredList = content[type];
    } else {
        filteredList = content[type].filter(item => item.genres && item.genres.includes(genre));
    }

    // Clear search input and suggestions when applying a genre filter
    if (type === 'series') {
        document.getElementById('seriesSearch').value = '';
        hideSuggestions('series');
    } else if (type === 'movies') {
        document.getElementById('movieSearch').value = '';
        hideSuggestions('movies');
    }

    // Display the filtered list
    if (type === 'series') {
        showSeriesList(filteredList);
    } else {
        showMovieList(filteredList);
    }

    localStorage.setItem(`activeGenre_${type}`, genre); // Save the active genre
    console.log(`activeGenre_${type} saved as: ${genre}`);
    window.scrollTo(0, 0); // Scroll to top after filtering
}

---

// ## Display List Functions
// Renders content lists for series and movies.

/**
 * Displays a list of series items.
 * @param {Array|null} list Optional: a specific list to display (e.g., filtered results).
 * @param {string} query Optional: the search query used for highlighting titles.
 */
function showSeriesList(list = null, query = '') {
    const currentList = list || content.series; // Use provided list or all series data
    const container = document.getElementById('seriesList');
    container.innerHTML = ''; // Clear previous content

    const activeGenre = localStorage.getItem('activeGenre_series');
    console.log(`showSeriesList called. Active series genre: ${activeGenre}. Query: "${query}"`);

    // If no specific list is provided and a genre is active, filter by that genre
    const displayList = (list === null && activeGenre && activeGenre !== 'All')
        ? currentList.filter(s => s.genres && s.genres.includes(activeGenre))
        : currentList;

    if (displayList.length === 0) {
        const message = query !== ''
            ? `No results found for "${query}".`
            : `No items to display here.`;
        container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem;">${message}</p>`;
        return;
    }

    displayList.forEach((s) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        const originalIndex = content.series.indexOf(s);
        if (originalIndex === -1) return; // Skip if item not found in original array

        // Check for playback progress for series episodes
        const hasProgress = s.episodes && s.episodes.some(ep => {
            const videoId = `${ep.link}-${ep.title}`;
            return getVideoPosition(videoId);
        });

        // Highlight search query in titles
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

    // Restore scroll position only if returning to a main list view (not detail)
    if (list === null && localStorage.getItem('lastActiveSection') === 'series' && !localStorage.getItem('lastDetailType')) {
        restoreScrollPosition();
    }
}

/**
 * Displays a list of movie items.
 * @param {Array|null} list Optional: a specific list to display (e.g., filtered results).
 * @param {string} query Optional: the search query used for highlighting titles.
 */
function showMovieList(list = null, query = '') {
    const currentList = list || content.movies; // Use provided list or all movie data
    const container = document.getElementById('movieList');
    container.innerHTML = ''; // Clear previous content

    const activeGenre = localStorage.getItem('activeGenre_movies');
    console.log(`showMovieList called. Active movie genre: ${activeGenre}. Query: "${query}"`);

    // If no specific list is provided and a genre is active, filter by that genre
    const displayList = (list === null && activeGenre && activeGenre !== 'All')
        ? currentList.filter(m => m.genres && m.genres.includes(activeGenre))
        : currentList;

    if (displayList.length === 0) {
        const message = query !== ''
            ? `No results found for "${query}".`
            : `No items to display here.`;
        container.innerHTML = `<p style="text-align: center; color: #aaa; margin-top: 2rem; justify-content:center; font-size:1.5rem;">${message}</p>`;
        return;
    }

    displayList.forEach((m) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        const originalIndex = content.movies.indexOf(m);
        if (originalIndex === -1) return; // Skip if item not found in original array

        // Check for playback progress for movies
        const videoId = m.link;
        const hasProgress = getVideoPosition(videoId);

        // Highlight search query in titles
        const highlightedTitle = query ? m.title.replace(new RegExp(query, 'gi'), match => `<span style="background-color: #5a9bd8; color: #121212; border-radius: 3px; padding: 0 2px;">${match}</span>`) : m.title;

        div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${highlightedTitle}</h4>
          ${hasProgress ? '<div class="resume-badge">Continue Watching</div>' : ''}
          <button onclick="showMovieDetails(${originalIndex})" class="btn">Open</button>
          <button onclick="addToWatchLater('movie', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
        container.appendChild(div);
    });

    // Restore scroll position only if returning to a main list view (not detail)
    if (list === null && localStorage.getItem('lastActiveSection') === 'movies' && !localStorage.getItem('lastDetailType')) {
        restoreScrollPosition();
    }
}

---

// ## Share Functionality
// Provides options to share content links.

/**
 * Generates a shareable URL for a content item.
 * @param {'series'|'movie'} type The type of content.
 * @param {number} index The index of the item in its content array.
 * @returns {string} The shareable URL.
 */
function generateShareLink(type, index) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?type=${type}&id=${index}`;
}

/**
 * Shares content using Web Share API or falls back to WhatsApp share.
 * @param {'series'|'movie'} type The type of content.
 * @param {number} index The index of the item.
 */
async function shareContent(type, index) {
    const item = type === 'series' ? content.series[index] : content.movies[index];
    if (!item) {
        console.error('Item not found for sharing:', type, index);
        alert('Could not find item to share.');
        return;
    }

    const shareUrl = generateShareLink(type, index);
    const shareData = {
        title: `Check out ${item.title} on My Streaming App!`,
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
        // AbortError means the user cancelled the share, no alert needed
        if (error.name !== 'AbortError') {
            alert('Failed to share. Please try again or copy the link directly.');
        }
    }
}

/**
 * Copies the content item's share link to the clipboard.
 * @param {'series'|'movie'} type The type of content.
 * @param {number} index The index of the item.
 */
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

---

// ## Detail View Functions
// Displays detailed information for series and movies.

/**
 * Shows the detail view for a specific series.
 * @param {number} i The index of the series in the content.series array.
 * @param {string|null} originSection The section from which this detail view was opened.
 */
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

    // Ensure the parent section is active, even if details are hiding the list
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('series').classList.add('active');

    // Hide series list and show details container
    document.getElementById('seriesList').innerHTML = '';
    document.getElementById('seriesDetails').style.display = 'block';

    // Hide navigation bar, search, and genre buttons when in detail view
    document.querySelector('nav').style.display = 'none';
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

    container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map(ep => {
              const videoId = `${ep.link}-${ep.title}`;
              const progress = getVideoPosition(videoId);
              const progressText = progress ? ` (${formatTime(progress.currentTime)}/${formatTime(progress.duration)})` : '';
              // Updated playEpisode call with itemType and originalIndex
              return `<button onclick="playEpisode('${ep.link}', 'series', ${i}, '${ep.title.replace(/'/g, "\\'")}')">${ep.title}${progressText}</button>`;
          }).join('')}
        </div>
        <div class="detail-bottom-actions">
            <button onclick="shareContent('series', ${i})" class="btn share-btn">Share</button>
            <button onclick="goBackToList('series')" class="back">Back</button>
            <button onclick="copyLinkToClipboard('series', ${i})" class="btn copy-link-btn">Copy Link</button>
        </div>
      `;

    saveState('series', 'series', i, originSection); // Save series detail state
    window.scrollTo(0, 0); // Scroll to top of details
}

/**
 * Shows the detail view for a specific movie.
 * @param {number} i The index of the movie in the content.movies array.
 * @param {string|null} originSection The section from which this detail view was opened.
 */
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

    // Ensure the parent section is active, even if details are hiding the list
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('movies').classList.add('active');

    // Hide movie list and show details container
    document.getElementById('movieList').innerHTML = '';
    document.getElementById('movieDetails').style.display = 'block';

    // Hide navigation bar, search, and genre buttons when in detail view
    document.querySelector('nav').style.display = 'none';
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

    const videoId = m.link;
    const progress = getVideoPosition(videoId);
    const progressText = progress ? ` (${formatTime(progress.currentTime)}/${formatTime(progress.duration)})` : '';

    container.innerHTML = `
        <img src="${m.image}" alt="${m.title}" />
        <h2>${m.title}</h2>
        <p>${m.description}</p>
        <div class="episode-buttons">
          <button onclick="playEpisode('${m.link}', 'movie', ${i}, '${m.title.replace(/'/g, "\\'")}')">Watch Now${progressText}</button>
        </div>
        <div class="detail-bottom-actions">
            <button onclick="goBackToList('movies')" class="back">Back</button>
            <button onclick="shareContent('movie', ${i})" class="btn share-btn">Share</button>
            <button onclick="copyLinkToClipboard('movie', ${i})" class="btn copy-link-btn">Copy Link</button>
        </div>
      `;
    saveState('movies', 'movie', i, originSection); // Save movie detail state
    window.scrollTo(0, 0); // Scroll to top of details
}

/**
 * Formats seconds into a human-readable "MM:SS" string.
 * @param {number} seconds The time in seconds.
 * @returns {string} Formatted time string.
 */
function formatTime(seconds) {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Navigates back from a detail view to the appropriate list view.
 * @param {'series'|'movies'} type The type of content that was in detail view.
 */
function goBackToList(type) {
    console.log(`goBackToList called for: ${type}`);

    // Clear search inputs when going back to list
    if (type === 'series') {
        document.getElementById('seriesSearch').value = '';
    } else if (type === 'movies') {
        document.getElementById('movieSearch').value = '';
    }

    // Determine the target section (original section or default to content type)
    const originSection = localStorage.getItem('originSection');
    let targetSectionId = originSection === 'watchLater' ? 'watchLater' : type;

    // Hide the current detail view
    if (type === 'series') {
        document.getElementById('seriesDetails').style.display = 'none';
    } else {
        document.getElementById('movieDetails').style.display = 'none';
    }

    showSection(targetSectionId); // Show the target list section
    window.scrollTo(0, 0); // Scroll to top of the list
}

---

// ## Watch Later Functionality
// Manages adding, removing, and displaying items in a "Watch Later" list.

function getWatchLaterList() {
    const watchLaterJson = localStorage.getItem('watchLater');
    return watchLaterJson ? JSON.parse(watchLaterJson) : [];
}

function saveWatchLaterList(list) {
    localStorage.setItem('watchLater', JSON.stringify(list));
}

/**
 * Adds a series or movie to the "Watch Later" list.
 * @param {'series'|'movie'} type The type of content.
 * @param {number} index The index of the item.
 */
function addToWatchLater(type, index) {
    const item = type === 'series' ? content.series[index] : content.movies[index];
    if (!item) {
        console.error("Item not found for adding to Watch Later:", type, index);
        alert("Could not add item to Watch Later. Data missing.");
        return;
    }
    const watchLaterList = getWatchLaterList();
    const itemId = `${type}-${index}`; // Unique ID for watch later item

    const isAlreadyAdded = watchLaterList.some(
        (wlItem) => wlItem.uniqueId === itemId
    );

    if (!isAlreadyAdded) {
        watchLaterList.push({ uniqueId: itemId, type: type, originalIndex: index, itemData: item });
        saveWatchLaterList(watchLaterList);
        alert(`${item.title} added to Watch Later!`);
        console.log(`${item.title} added to Watch Later. List:`, watchLaterList);
    } else {
        alert(`${item.title} is already in your Watch Later list.`);
    }
}

/**
 * Removes an item from the "Watch Later" list.
 * @param {'series'|'movie'} type The type of content.
 * @param {number} originalIndex The original index of the item.
 */
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
        console.log(`Item removed from Watch Later. New list:`, watchLaterList);
        showWatchLater(); // Re-render the watch later list
    }
}

/**
 * Displays the "Watch Later" section and its content.
 */
function showWatchLater() {
    console.log('showWatchLater called');
    // Hide search, genre buttons, and detail views specific to main content sections
    document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
    document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');
    document.querySelector('nav').style.display = 'flex'; // Ensure nav is visible
    document.getElementById('seriesDetails').style.display = 'none';
    document.getElementById('movieDetails').style.display = 'none';

    // Activate the watchLater section
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('watchLater').classList.add('active');

    const container = document.getElementById('watchLaterList');
    container.innerHTML = ''; // Clear existing content

    const watchLaterItems = getWatchLaterList();

    if (watchLaterItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #aaa;">Your Watch Later list is empty. Add some series or movies!</p>';
    } else {
        watchLaterItems.forEach((wlItem) => {
            const item = wlItem.itemData;
            const div = document.createElement('div');
            div.className = 'series-item';

            // Determine the correct detail function call based on item type
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
    saveState('watchLater'); // Save watch later section as active
    window.scrollTo(0, 0); // Scroll to top
}

---

// ## Initialize on DOM Content Loaded
// This block runs when the page is fully loaded and sets up initial state and event listeners.

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded. Initializing app state...');

    // Retrieve all relevant state from localStorage
    const currentPlayerState = JSON.parse(localStorage.getItem('currentPlayerState') || '{}');
    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    const originSection = localStorage.getItem('originSection');
    const urlParams = new URLSearchParams(window.location.search);
    const paramType = urlParams.get('type');
    const paramId = urlParams.get('id');

    // --- State Restoration Logic Priority ---
    // 1. Handle Direct Links (highest priority)
    if (paramType && paramId !== null) {
        const id = parseInt(paramId, 10);
        if (!isNaN(id)) {
            console.log(`Direct link detected: type=${paramType}, id=${id}`);
            // Clear any previous state to ensure clean load for direct link
            localStorage.removeItem('lastActiveSection');
            localStorage.removeItem('lastDetailType');
            localStorage.removeItem('lastDetailIndex');
            localStorage.removeItem('originSection');
            savePlayerState(false); // Ensure player state is cleared when loading via direct link

            if (paramType === 'series' && content.series[id]) {
                showSeriesDetails(id);
            } else if (paramType === 'movie' && content.movies[id]) {
                showMovieDetails(id);
            } else {
                console.warn('Direct link item not found or invalid type. Defaulting to home.');
                showSection('home');
            }
        } else {
            console.warn('Invalid ID in direct link. Defaulting to home.');
            showSection('home');
        }
    }
    // 2. Handle Restoring Fullscreen Player State (next priority)
    else if (currentPlayerState.isPlaying && currentPlayerState.videoLink) {
        console.log('Restoring fullscreen player state:', currentPlayerState);
        const { videoType, videoIndex, episodeTitle, videoLink } = currentPlayerState;

        let itemToPlay;
        if (videoType === 'series' && content.series[videoIndex]) {
            itemToPlay = content.series[videoIndex];
        } else if (videoType === 'movie' && content.movies[videoIndex]) {
            itemToPlay = content.movies[videoIndex];
        }

        if (itemToPlay) {
            // Hide navigation, search, genre buttons, as player will be fullscreen
            document.querySelector('nav').style.display = 'none';
            document.querySelectorAll('.search-container').forEach(sc => sc.style.display = 'none');
            document.querySelectorAll('.genre-buttons').forEach(gb => gb.style.display = 'none');

            // Set the appropriate section as active to provide context.
            // This is crucial for when the user closes the player, so `goBackToList` knows where to go.
            document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(videoType).classList.add('active');

            // Manually populate and set detail state in localStorage.
            // We avoid calling `showSeriesDetails`/`showMovieDetails` directly here
            // because they would call `saveState`, which in turn clears `currentPlayerState`.
            localStorage.setItem('lastActiveSection', videoType);
            localStorage.setItem('lastDetailType', videoType === 'series' ? 'series' : 'movie');
            localStorage.setItem('lastDetailIndex', videoIndex);
            // originSection is not strictly needed for player restore, but can be carried if useful

            // Populate the detail HTML but keep it hidden as the player will be shown.
            // This prepares the DOM so that when `closeFullScreen()` calls `restoreScrollPosition()`
            // and `goBackToList()`, the elements and state are ready.
            if (videoType === 'series') {
                const s = content.series[videoIndex];
                const container = document.getElementById('seriesDetails');
                container.innerHTML = `
                    <img src="${s.image}" alt="${s.title}" />
                    <h2>${s.title}</h2>
                    <p>${s.description}</p>
                    <div class="episode-buttons">
                        ${s.episodes.map(ep => {
                            const videoId = `${ep.link}-${ep.title}`;
                            const progress = getVideoPosition(videoId);
                            const progressText = progress ? ` (${formatTime(progress.currentTime)}/${formatTime(progress.duration)})` : '';
                            return `<button onclick="playEpisode('${ep.link}', 'series', ${videoIndex}, '${ep.title.replace(/'/g, "\\'")}')">${ep.title}${progressText}</button>`;
                        }).join('')}
                    </div>
                    <div class="detail-bottom-actions">
                        <button onclick="shareContent('series', ${videoIndex})" class="btn share-btn">Share</button>
                        <button onclick="goBackToList('series')" class="back">Back</button>
                        <button onclick="copyLinkToClipboard('series', ${videoIndex})" class="btn copy-link-btn">Copy Link</button>
                    </div>
                `;
                document.getElementById('seriesDetails').style.display = 'none'; // Keep hidden
            } else if (videoType === 'movie') {
                const m = content.movies[videoIndex];
                const container = document.getElementById('movieDetails');
                const videoId = m.link;
                const progress = getVideoPosition(videoId);
                const progressText = progress ? ` (${formatTime(progress.currentTime)}/${formatTime(progress.duration)})` : '';
                container.innerHTML = `
                    <img src="${m.image}" alt="${m.title}" />
                    <h2>${m.title}</h2>
                    <p>${m.description}</p>
                    <div class="episode-buttons">
                        <button onclick="playEpisode('${m.link}', 'movie', ${videoIndex}, '${m.title.replace(/'/g, "\\'")}')">Watch Now${progressText}</button>
                    </div>
                    <div class="detail-bottom-actions">
                        <button onclick="goBackToList('movies')" class="back">Back</button>
                        <button onclick="shareContent('movie', ${videoIndex})" class="btn share-btn">Share</button>
                        <button onclick="copyLinkToClipboard('movie', ${videoIndex})" class="btn copy-link-btn">Copy Link</button>
                    </div>
                `;
                document.getElementById('movieDetails').style.display = 'none'; // Keep hidden
            }

            // Finally, open the video in fullscreen
            playEpisode(videoLink, videoType, videoIndex, episodeTitle);
            window.scrollTo(0,0); // Ensure player is at the top of the viewport
        } else {
            console.warn('Could not restore player state: content item not found. Falling back to general section state.');
            // Fallback if the content item for the stored player state is missing
            if (lastActiveSection) {
                if (lastDetailType && lastDetailIndex !== null) {
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
                showSection('home');
            }
        }
    }
    // 3. Handle Restoring General Section/Detail State (lowest priority)
    else {
        if (lastActiveSection) {
            console.log(`Restoring last active section: ${lastActiveSection}`);
            if (lastDetailType && lastDetailIndex !== null) {
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
            restoreScrollPosition();
        } else {
            console.log('No last active section found. Defaulting to "home".');
            showSection('home');
        }
    }

    // --- General Event Listeners Setup (apply regardless of initial state) ---
    // Render genre buttons on initial load
    renderGenreButtons('series');
    renderGenreButtons('movies');

    // Event listeners for series search input
    const seriesSearchInput = document.getElementById('seriesSearch');
    if (seriesSearchInput) {
        seriesSearchInput.addEventListener('input', () => handleSearchInputForSuggestions('series'));
        seriesSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                searchContent('series');
            }
        });
        // Hide suggestions on blur (with a slight delay to allow click on suggestion)
        seriesSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions('series'), 100));
        // Show suggestions on focus if there's already a query
        seriesSearchInput.addEventListener('focus', (event) => {
            const query = event.target.value.toLowerCase().trim();
            if (query.length > 0) {
                showSuggestions('series', query);
            }
        });
    }

    // Event listeners for movie search input (similar to series)
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

    // Debounced scroll position saving
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            saveScrollPosition();
        }, 200);
    });

    // Use Page Visibility API for reliable state saving when page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            console.log('Page is hidden. Saving current scroll position...');
            saveScrollPosition(); // Save scroll position
            // The player state (if active) is saved by playEpisode,
            // and general section state is saved by saveState.
            // This ensures state is persistent when tabs are switched or app is minimized.
        }
    });

    // `beforeunload` listener removed as `visibilitychange` is more reliable for this purpose.
});
