// Assuming seriesData and movieData are defined elsewhere in your application.
// For consistency, consider defining content using 'const' if it's not reassigned.
const content = {
  series: seriesData,
  movies: movieData,
};

// --- Local Storage Utilities ---

/**
 * Saves the current scroll position to local storage.
 */
function saveScrollPosition() {
    localStorage.setItem('scrollPosition', window.scrollY);
}

/**
 * Restores the scroll position from local storage.
 */
function restoreScrollPosition() {
    const storedScrollY = localStorage.getItem('scrollPosition');
    if (storedScrollY) {
        window.scrollTo(0, parseInt(storedScrollY, 10));
    }
}

/**
 * Saves the application's state to local storage.
 * @param {string} sectionId - The ID of the currently active section.
 * @param {string|null} detailType - The type of detail being viewed ('series' or 'movie'), or null.
 * @param {number|null} detailIndex - The index of the item being viewed, or null.
 * @param {string|null} activeGenre - The currently active genre filter, or null.
 * @param {string|null} originSection - The section from which the detail view was accessed (e.g., 'watchLater'), or null.
 */
function saveState(sectionId, detailType = null, detailIndex = null, activeGenre = null, originSection = null) {
    localStorage.setItem('lastActiveSection', sectionId);

    // Use a helper for conditional storage to reduce repetition
    const setOrRemove = (key, value) => {
        if (value !== null) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    };

    setOrRemove('lastDetailType', detailType);
    setOrRemove('lastDetailIndex', detailIndex); // Convert index to string for consistency if needed, but localStorage handles numbers fine
    setOrRemove('activeGenre', activeGenre);
    setOrRemove('originSection', originSection);

    saveScrollPosition();
}

// --- Section Management ---

/**
 * Shows the specified section and hides others.
 * Manages visibility of search boxes and genre buttons based on the active section.
 * @param {string} id - The ID of the section to show.
 */
function showSection(id) {
    // Cache DOM queries for repeated elements
    const sections = document.querySelectorAll('.section');
    const searchBoxes = document.querySelectorAll('.search-box');
    const genreButtonsContainers = document.querySelectorAll('.genre-buttons');
    const seriesDetails = document.getElementById('seriesDetails');
    const movieDetails = document.getElementById('movieDetails');
    const nav = document.querySelector('nav');

    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    saveState(id, null, null, localStorage.getItem('activeGenre'), null);

    seriesDetails.style.display = 'none';
    movieDetails.style.display = 'none';
    nav.style.display = 'flex';

    // Hide all search boxes and genre buttons first
    searchBoxes.forEach(sb => sb.style.display = 'none');
    genreButtonsContainers.forEach(gb => gb.style.display = 'none');

    // Show relevant controls based on section ID
    if (id === 'series' || id === 'movies') {
        const type = id; // 'series' or 'movies'
        document.querySelector(`#${type} .search-box`).style.display = 'flex';
        document.getElementById(`${type}GenreButtons`).style.display = 'flex';
        renderGenreButtons(type);
        filterContentByGenre(type, localStorage.getItem('activeGenre') || 'All');
    } else if (id === 'watchLater') {
        showWatchLater();
    }
    window.scrollTo(0, 0);
}

// --- Search Functionality ---

/**
 * Filters content based on user search input.
 * @param {'series'|'movies'} type - The type of content to search.
 */
function searchContent(type) {
    const input = document.getElementById(`${type}Search`).value.toLowerCase();
    const filtered = content[type].filter(item => item.title.toLowerCase().includes(input));

    localStorage.setItem('activeGenre', 'All'); // Reset genre filter on search
    renderGenreButtons(type);

    if (type === 'series') {
        showSeriesList(filtered);
    } else {
        showMovieList(filtered);
    }
    saveScrollPosition();
}

// --- Genre Filtering ---

/**
 * Gets unique genres for a given content type.
 * @param {'series'|'movies'} type - The type of content.
 * @returns {string[]} An array of unique genres, including 'All', sorted alphabetically.
 */
function getUniqueGenres(type) {
    const allGenres = content[type].flatMap(item => item.genres || []);
    return ['All', ...new Set(allGenres)].sort();
}

/**
 * Renders genre filter buttons for a given content type.
 * @param {'series'|'movies'} type - The type of content.
 */
function renderGenreButtons(type) {
    const container = document.getElementById(`${type}GenreButtons`);
    if (!container) {
        console.warn(`Genre buttons container not found for type: ${type}`);
        return;
    }

    container.innerHTML = ''; // Clear existing buttons

    const genres = getUniqueGenres(type);
    const activeGenre = localStorage.getItem('activeGenre') || 'All';

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

/**
 * Filters content by the selected genre and updates the display.
 * @param {'series'|'movies'} type - The type of content to filter.
 * @param {string} genre - The genre to filter by.
 */
function filterContentByGenre(type, genre) {
    const genreButtonsContainer = document.getElementById(`${type}GenreButtons`);
    const buttons = genreButtonsContainer ? genreButtonsContainer.querySelectorAll('button') : [];

    buttons.forEach(button => {
        button.classList.toggle('active-genre', button.textContent === genre);
    });

    const currentContent = content[type];
    const filteredList = (genre === 'All')
        ? currentContent
        : currentContent.filter(item => item.genres && item.genres.includes(genre));

    if (type === 'series') {
        showSeriesList(filteredList);
    } else {
        showMovieList(filteredList);
    }
    saveState(type, null, null, genre, null);
    window.scrollTo(0, 0);
}

// --- Display List Functions ---

/**
 * Renders the list of series.
 * @param {Array<Object>|null} list - Optional list of series to display. If null, uses content.series, potentially filtered by active genre.
 */
function showSeriesList(list = null) {
    const container = document.getElementById('seriesList');
    container.innerHTML = ''; // Clear previous list

    const activeGenre = localStorage.getItem('activeGenre');
    // Determine the list to display: provided list, or content.series filtered by genre if applicable
    const displayList = (list !== null)
        ? list
        : (activeGenre && activeGenre !== 'All'
            ? content.series.filter(s => s.genres && s.genres.includes(activeGenre))
            : content.series);

    displayList.forEach((s) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        const originalIndex = content.series.indexOf(s);
        if (originalIndex === -1) {
             console.warn(`Series item not found in original content array: ${s.title}`);
             return; // Skip if item not found, indicating it might be from a search/filtered list
        }

        div.innerHTML = `
          <img src="${s.image}" alt="${s.title}" />
          <h4>${s.title}</h4>
          <button onclick="showSeriesDetails(${originalIndex})" class="btn">Open</button>
          <button onclick="addToWatchLater('series', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
        container.appendChild(div);
    });

    // Restore scroll position only if returning to the main list view, not from a detail view
    if (list === null && localStorage.getItem('lastActiveSection') === 'series' && !localStorage.getItem('lastDetailType')) {
        restoreScrollPosition();
    }
}

/**
 * Renders the list of movies.
 * @param {Array<Object>|null} list - Optional list of movies to display. If null, uses content.movies, potentially filtered by active genre.
 */
function showMovieList(list = null) {
    const container = document.getElementById('movieList');
    container.innerHTML = ''; // Clear previous list

    const activeGenre = localStorage.getItem('activeGenre');
    // Determine the list to display: provided list, or content.movies filtered by genre if applicable
    const displayList = (list !== null)
        ? list
        : (activeGenre && activeGenre !== 'All'
            ? content.movies.filter(m => m.genres && m.genres.includes(activeGenre))
            : content.movies);

    displayList.forEach((m) => {
        const div = document.createElement('div');
        div.className = 'series-item';
        const originalIndex = content.movies.indexOf(m);
        if (originalIndex === -1) {
            console.warn(`Movie item not found in original content array: ${m.title}`);
            return; // Skip if item not found
        }

        div.innerHTML = `
          <img src="${m.image}" alt="${m.title}" />
          <h4>${m.title}</h4>
          <button onclick="showMovieDetails(${originalIndex})" class="btn">Watch</button>
          <button onclick="addToWatchLater('movie', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        `;
        container.appendChild(div);
    });

    // Restore scroll position only if returning to the main list view, not from a detail view
    if (list === null && localStorage.getItem('lastActiveSection') === 'movies' && !localStorage.getItem('lastDetailType')) {
        restoreScrollPosition();
    }
}

// --- Detail View Functions ---

/**
 * Displays details for a specific series.
 * @param {number} i - The index of the series in the content.series array.
 * @param {string|null} originSection - The section from which the detail view was accessed (e.g., 'watchLater').
 */
function showSeriesDetails(i, originSection = null) {
    const s = content.series[i];
    if (!s) {
        console.error("Error: Series item not found at index:", i);
        alert("Could not load series details. Data might be missing or corrupted.");
        // Go back to the correct section if item not found
        showSection(originSection === 'watchLater' ? 'watchLater' : 'series');
        return;
    }

    const container = document.getElementById('seriesDetails');
    const sections = document.querySelectorAll('.section');
    const nav = document.querySelector('nav');
    const searchBoxes = document.querySelectorAll('.search-box');
    const genreButtonsContainers = document.querySelectorAll('.genre-buttons');

    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById('series').classList.add('active'); // Keep 'series' section active to contain details

    document.getElementById('seriesList').innerHTML = ''; // Clear list when showing details
    container.style.display = 'block';

    container.innerHTML = `
        <img src="${s.image}" alt="${s.title}" />
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        <div class="episode-buttons">
          ${s.episodes.map(ep => `<button onclick="playEpisode('${ep.link}')">${ep.title}</button>`).join('')}
        </div>
        <button onclick="goBackToList('series')" class="back">Back</button>
      `;

    saveState('series', 'series', i, localStorage.getItem('activeGenre'), originSection);
    window.scrollTo(0, 0);

    nav.style.display = 'none';
    searchBoxes.forEach(sb => sb.style.display = 'none');
    genreButtonsContainers.forEach(gb => gb.style.display = 'none');
}

/**
 * Displays details for a specific movie.
 * @param {number} i - The index of the movie in the content.movies array.
 * @param {string|null} originSection - The section from which the detail view was accessed (e.g., 'watchLater').
 */
function showMovieDetails(i, originSection = null) {
    const m = content.movies[i];
    if (!m) {
        console.error("Error: Movie item not found at index:", i);
        alert("Could not load movie details. Data might be missing or corrupted.");
        // Go back to the correct section if item not found
        showSection(originSection === 'watchLater' ? 'watchLater' : 'movies');
        return;
    }

    const container = document.getElementById('movieDetails');
    const sections = document.querySelectorAll('.section');
    const nav = document.querySelector('nav');
    const searchBoxes = document.querySelectorAll('.search-box');
    const genreButtonsContainers = document.querySelectorAll('.genre-buttons');

    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById('movies').classList.add('active'); // Keep 'movies' section active to contain details

    document.getElementById('movieList').innerHTML = ''; // Clear list when showing details
    container.style.display = 'block';

    container.innerHTML = `
        <img src="${m.image}" alt="${m.title}" />
        <h2>${m.title}</h2>
        <p>${m.description}</p>
        <div class="episode-buttons">
          <button onclick="playEpisode('${m.link}')">Watch Now</button>
        </div>
        <button onclick="goBackToList('movies')" class="back">Back</button>
      `;
    saveState('movies', 'movie', i, localStorage.getItem('activeGenre'), originSection);
    window.scrollTo(0, 0);

    nav.style.display = 'none';
    searchBoxes.forEach(sb => sb.style.display = 'none');
    genreButtonsContainers.forEach(gb => gb.style.display = 'none');
}

/**
 * Navigates back from a detail view to the appropriate content list or Watch Later section.
 * @param {'series'|'movies'} type - The type of content (series or movies) being viewed.
 */
function goBackToList(type) {
    // Hide the specific detail section
    document.getElementById(`${type}Details`).style.display = 'none';

    // Determine the target section based on origin or default to content type
    const originSection = localStorage.getItem('originSection');
    const targetSectionId = originSection === 'watchLater' ? 'watchLater' : type;

    showSection(targetSectionId); // This will handle showing lists and restoring visibility of search/genre buttons
    window.scrollTo(0, 0); // Scroll to top for consistency
}

// --- Video Player Functions ---

/**
 * Opens and plays a video in full-screen mode.
 * @param {string} link - The URL of the video to play.
 */
function playEpisode(link) {
    const player = document.getElementById('videoFullScreen');
    player.querySelector('iframe').src = link;
    player.style.display = 'flex';
    // Consider adding focus to the iframe for accessibility
}

/**
 * Closes the full-screen video player.
 */
function closeFullScreen() {
    const player = document.getElementById('videoFullScreen');
    // Stop video playback by clearing src
    player.querySelector('iframe').src = '';
    player.style.display = 'none';
    restoreScrollPosition();
}

// --- Watch Later Functionality ---

/**
 * Retrieves the Watch Later list from local storage.
 * @returns {Array<Object>} The Watch Later list, or an empty array if none exists.
 */
function getWatchLaterList() {
    try {
        const watchLaterJson = localStorage.getItem('watchLater');
        return watchLaterJson ? JSON.parse(watchLaterJson) : [];
    } catch (e) {
        console.error("Error parsing watch later list from local storage:", e);
        return []; // Return empty list on parse error
    }
}

/**
 * Saves the Watch Later list to local storage.
 * @param {Array<Object>} list - The Watch Later list to save.
 */
function saveWatchLaterList(list) {
    localStorage.setItem('watchLater', JSON.stringify(list));
}

/**
 * Adds a series or movie to the Watch Later list.
 * @param {'series'|'movie'} type - The type of content to add.
 * @param {number} index - The original index of the item in its respective content array.
 */
function addToWatchLater(type, index) {
    const item = type === 'series' ? content.series[index] : content.movies[index];
    if (!item) {
        console.error(`Item not found for type: ${type}, index: ${index}`);
        alert("Could not add item to Watch Later. Item data is missing.");
        return;
    }

    const watchLaterList = getWatchLaterList();
    const itemId = `${type}-${index}`; // Create a unique ID for the item

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

/**
 * Removes an item from the Watch Later list.
 * @param {'series'|'movie'} type - The type of content to remove.
 * @param {number} originalIndex - The original index of the item in its respective content array.
 */
function removeFromWatchLater(type, originalIndex) {
    let watchLaterList = getWatchLaterList();
    const initialLength = watchLaterList.length;
    const itemIdToRemove = `${type}-${originalIndex}`;

    // Filter out the item to remove
    watchLaterList = watchLaterList.filter(
        (wlItem) => wlItem.uniqueId !== itemIdToRemove
    );

    if (watchLaterList.length < initialLength) {
        saveWatchLaterList(watchLaterList);
        alert('Item removed from Watch Later!');
        showWatchLater(); // Re-render the Watch Later list
    } else {
        console.warn(`Attempted to remove item not found: ${itemIdToRemove}`);
    }
}

/**
 * Displays the Watch Later section with its content.
 */
function showWatchLater() {
    // Consolidate common hide operations into a helper or a single call
    document.querySelectorAll('.search-box, .genre-buttons').forEach(el => el.style.display = 'none');
    document.getElementById('seriesDetails').style.display = 'none';
    document.getElementById('movieDetails').style.display = 'none';

    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('watchLater').classList.add('active');

    const container = document.getElementById('watchLaterList');
    container.innerHTML = ''; // Clear previous content

    const watchLaterItems = getWatchLaterList();

    if (watchLaterItems.length === 0) {
        container.innerHTML = '<p class="empty-list-message">Your Watch Later list is empty. Add some series or movies!</p>';
    } else {
        watchLaterItems.forEach((wlItem) => {
            const item = wlItem.itemData;
            const div = document.createElement('div');
            div.className = 'series-item'; // Reusing class name for consistency

            // Dynamically create the detail function call string
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
    saveState('watchLater', null, null, null, null);
    window.scrollTo(0, 0);
}

// --- Initialize on DOM Content Loaded ---

document.addEventListener('DOMContentLoaded', function() {
    // Cache common DOM elements used at initialization
    const nav = document.querySelector('nav');
    const searchBoxes = document.querySelectorAll('.search-box');
    const genreButtonsContainers = document.querySelectorAll('.genre-buttons');

    const lastActiveSection = localStorage.getItem('lastActiveSection');
    const lastDetailType = localStorage.getItem('lastDetailType');
    const lastDetailIndex = localStorage.getItem('lastDetailIndex');
    const activeGenre = localStorage.getItem('activeGenre'); // Kept for consistency if needed later
    const originSection = localStorage.getItem('originSection'); // Kept for consistency if needed later

    renderGenreButtons('series'); // Render genre buttons for both types initially
    renderGenreButtons('movies');

    if (lastActiveSection) {
        if (lastDetailType && lastDetailIndex !== null) {
            // If returning to a detail view, hide navigation and search/genre controls
            nav.style.display = 'none';
            searchBoxes.forEach(sb => sb.style.display = 'none');
            genreButtonsContainers.forEach(gb => gb.style.display = 'none');

            // Convert index back to integer before passing to detail functions
            const parsedIndex = parseInt(lastDetailIndex, 10);
            if (lastDetailType === 'series') {
                showSeriesDetails(parsedIndex, originSection);
            } else if (lastDetailType === 'movie') {
                showMovieDetails(parsedIndex, originSection);
            }
        } else {
            // If returning to a section list, show that section
            showSection(lastActiveSection);
        }
        restoreScrollPosition(); // Always try to restore scroll if a last state was found
    } else {
        // Default to 'home' section if no last state
        showSection('home');
    }

    // Event listener for scroll position saving with a debounce
    let scrollTimer;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            saveScrollPosition();
        }, 200); // Debounce to prevent excessive local storage writes
    });

    // Save scroll position before the user leaves the page
    window.addEventListener('beforeunload', saveScrollPosition);
});
