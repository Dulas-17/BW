// Home Section Logic
// This file handles the home section functionality

// Initialize home section
function initializeHomeSection() {
    console.log("Initializing home section...");
    updateHomeContent();

    // Add scroll tracking for home section
    setupHomeScrollTracking();
}

// Setup scroll tracking for home section
function setupHomeScrollTracking() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    // Save scroll position when home section is active and user scrolls
    homeSection.addEventListener('scroll', () => {
        if (homeSection.classList.contains('active')) {
            saveScrollPosition('home');
        }
    });
}

// Update home section with latest content
function updateHomeContent() {
    updateLatestMovies();
    updateLatestSeries();
    updateFeaturedContent();
    updateRecentlyAdded();
}

// Get latest movies (last 6 added)
function getLatestMovies() {
    return content.movies.slice(-6).reverse();
}

// Get latest series (last 6 added)
function getLatestSeries() {
    return content.series.slice(-6).reverse();
}

// Get featured content (mix of popular movies and series)
function getFeaturedContent() {
    const featuredMovies = content.movies.filter(movie => 
        movie.featured || movie.rating > 4
    ).slice(0, 3);

    const featuredSeries = content.series.filter(series => 
        series.featured || series.rating > 4
    ).slice(0, 3);

    return [...featuredMovies, ...featuredSeries].sort(() => Math.random() - 0.5).slice(0, 6);
}

// Get recently added content (last 8 items from both movies and series)
function getRecentlyAdded() {
    const recentMovies = content.movies.slice(-4).reverse();
    const recentSeries = content.series.slice(-4).reverse();

    return [...recentMovies, ...recentSeries].sort((a, b) => {
        // Simple timestamp simulation - in real app, you'd have actual timestamps
        return Math.random() - 0.5;
    }).slice(0, 8);
}

// Update latest movies section
function updateLatestMovies() {
    const container = document.getElementById('latestMovies');
    const latestMovies = getLatestMovies();

    container.innerHTML = '';

    if (latestMovies.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No movies available yet.</p>';
        return;
    }

    latestMovies.forEach((movie, index) => {
        const originalIndex = content.movies.findIndex(m => m.title === movie.title);
        const movieElement = createHomeItem(movie, 'movie', originalIndex);
        container.appendChild(movieElement);
    });
}

// Update latest series section
function updateLatestSeries() {
    const container = document.getElementById('latestSeries');
    const latestSeries = getLatestSeries();

    container.innerHTML = '';

    if (latestSeries.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No series available yet.</p>';
        return;
    }

    latestSeries.forEach((series, index) => {
        const originalIndex = content.series.findIndex(s => s.title === series.title);
        const seriesElement = createHomeItem(series, 'series', originalIndex);
        container.appendChild(seriesElement);
    });
}

// Update featured content section
function updateFeaturedContent() {
    const container = document.getElementById('featuredContent');
    const featuredItems = getFeaturedContent();

    container.innerHTML = '';

    if (featuredItems.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No featured content available.</p>';
        return;
    }

    featuredItems.forEach((item, index) => {
        const type = item.episodes ? 'series' : 'movie';
        const originalIndex = type === 'series' ? 
            content.series.findIndex(s => s.title === item.title) : 
            content.movies.findIndex(m => m.title === item.title);

        const itemElement = createHomeItem(item, type, originalIndex, true);
        container.appendChild(itemElement);
    });
}

// Update recently added section
function updateRecentlyAdded() {
    const container = document.getElementById('recentlyAdded');
    const recentItems = getRecentlyAdded();

    container.innerHTML = '';

    if (recentItems.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: #666; text-align: center;">No recently added content.</p>';
        return;
    }

    recentItems.forEach((item, index) => {
        const type = item.episodes ? 'series' : 'movie';
        const originalIndex = type === 'series' ? 
            content.series.findIndex(s => s.title === item.title) : 
            content.movies.findIndex(m => m.title === item.title);

        const itemElement = createHomeItem(item, type, originalIndex);
        container.appendChild(itemElement);
    });
}

// Create home item element
function createHomeItem(item, type, originalIndex, isFeatured = false) {
    const div = document.createElement('div');
    div.className = 'home-item';

    // Add featured badge if needed
    const featuredBadge = isFeatured ? '<span class="featured-badge">Featured</span>' : '';

    div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" />
        ${featuredBadge}
        <div class="home-item-content">
            <h4>${item.title}</h4>
            <p>${item.description ? item.description.substring(0, 60) + '...' : 'No description available'}</p>
            <button onclick="navigateFromHome('${type}', ${originalIndex})" class="btn">View Details</button>
            <button onclick="addToWatchLater('${type}', ${originalIndex})" class="watch-later-btn">Watch Later</button>
        </div>
    `;

    return div;
}

// Navigate to item details from home section
function navigateFromHome(type, index) {
    // Save current scroll position before navigating
    saveScrollPosition('home');

    // Save that we're coming from home section
    localStorage.setItem('originSection', 'home');

    if (type === 'series') {
        showSeriesDetails(index, 'home');
    } else {
        showMovieDetails(index, 'home');
    }
}

// Listen for content updates to refresh home section
document.addEventListener('contentUpdated', function() {
    if (document.getElementById('home').classList.contains('active')) {
        updateHomeContent();
    }
});

// Simulate content update event (you would call this when adding new content)
function triggerContentUpdate() {
    const event = new Event('contentUpdated');
    document.dispatchEvent(event);
}