// Replace with your API keys
const footballApiKey='8dfe6a0735759f476b47c6453fc4cfb7';
const newsApiKey = 'QI1oZoxu9DYOr5g7BoKb762czGNVB1tare-Ft0OEF6I';
const teamId = 529; // FC Barcelona team ID in API-Football

// Cache durations
const CACHE_TIME = 24 * 60 * 60 * 1000; // 24 hours for squad and upcoming matches
const PAST_MATCHES_CACHE_TIME = 60 * 60 * 1000; // 1 hour for past matches
const NEWS_CACHE_KEY = 'cachedNews';
const NEWS_CACHE_DURATION = 60 * 60 * 1000; // Cache duration set to 1 hour (in milliseconds)

// API Endpoints
const upcomingMatchesUrl = `https://v3.football.api-sports.io/fixtures?team=${teamId}&next=5`;
const previousMatchesUrl = `https://v3.football.api-sports.io/fixtures?team=${teamId}&last=5`;
const squadUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;
const newsUrl = `https://api.newscatcherapi.com/v2/search?q=FC%20Barcelona&lang=en&sort_by=relevancy`;

/**
 * Cache helper functions
 */
function getCachedData(key, cacheTime) {
    const cached = localStorage.getItem(key);
    const now = Date.now();

    if (cached) {
        const data = JSON.parse(cached);
        if (now - data.timestamp < cacheTime) {
            return data.value;
        }
    }
    return null;
}

function setCacheData(key, value) {
    const data = {
        timestamp: Date.now(),
        value: value
    };
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Helper function to create and append elements
 */
function createElement(type, attributes = {}, innerHTML = '') {
    const element = document.createElement(type);
    Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
    element.innerHTML = innerHTML;
    return element;
}

// Fetch and display news
async function fetchNews() {
    // Check if cached data is available and still valid
    const cachedData = getCachedData(NEWS_CACHE_KEY, NEWS_CACHE_DURATION);
    if (cachedData) {
        displayNews(cachedData);
        return;
    }

    // Fetch news from Newscatcher API
    try {
        const response = await fetch(newsUrl, {
            method: 'GET',
            headers: {
                'x-api-key': newsApiKey
            }
        });

        const data = await response.json();

        // Check for valid response
        if (data.articles && data.articles.length > 0) {
            setCacheData(NEWS_CACHE_KEY, data.articles);
            displayNews(data.articles);
        } else {
            document.getElementById('news-list').innerHTML = '<li>No news found.</li>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-list').innerHTML = '<li>Error loading news.</li>';
    }
}

// Display news on the page
function displayNews(articles) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ''; // Clear existing content

    articles.forEach(article => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.summary}</p>
            <a href="${article.link}" target="_blank">Read more</a>
        `;
        newsList.appendChild(listItem);
    });
}

// Utility functions for caching

// Retrieve cached data if valid
function getCachedData(key, duration) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp < duration) {
        return data;
    }

    localStorage.removeItem(key);
    return null;
}

// Cache data with timestamp
function setCacheData(key, data) {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
}

/**
 * Fetch and display upcoming matches
 */
async function fetchUpcomingMatches() {
    const cachedMatches = getCachedData('upcomingMatches', CACHE_TIME);
    if (cachedMatches) {
        displayMatches(cachedMatches, 'upcoming-matches-content');
        return;
    }

    try {
        const response = await fetch(upcomingMatchesUrl, {
            method: 'GET',
            headers: { 'x-apisports-key': footballApiKey }
        });
        const data = await response.json();

        if (data.response && data.response.length > 0) {
            setCacheData('upcomingMatches', data.response);
            displayMatches(data.response, 'upcoming-matches-content');
        } else {
            document.getElementById('upcoming-matches-content').innerHTML = '<p>No upcoming matches found.</p>';
        }
    } catch (error) {
        console.error('Error fetching upcoming matches:', error);
    }
}

/**
 * Fetch and display previous matches
 */
async function fetchPreviousMatches() {
    const cachedMatches = getCachedData('previousMatches', PAST_MATCHES_CACHE_TIME);
    if (cachedMatches) {
        displayMatches(cachedMatches, 'past-matches-content', true);
        return;
    }

    try {
        const response = await fetch(previousMatchesUrl, {
            method: 'GET',
            headers: { 'x-apisports-key': footballApiKey }
        });
        const data = await response.json();

        console.log('Previous Matches API Response:', data); // Log the response for debugging

        if (data.response && data.response.length > 0) {
            setCacheData('previousMatches', data.response);
            displayMatches(data.response, 'past-matches-content', true);
        } else {
            document.getElementById('past-matches-content').innerHTML = '<p>No previous matches found.</p>';
        }
    } catch (error) {
        console.error('Error fetching previous matches:', error);
    }
}


/**
 * Fetch and display squad information
 */
async function fetchSquad() {
    const cachedSquad = getCachedData('squad', CACHE_TIME);
    if (cachedSquad) {
        displaySquad(cachedSquad);
        return;
    }

    try {
        const response = await fetch(squadUrl, {
            method: 'GET',
            headers: { 'x-apisports-key': footballApiKey }
        });
        const data = await response.json();

        if (data.response && data.response.length > 0) {
            setCacheData('squad', data.response[0].players);
            displaySquad(data.response[0].players);
        } else {
            document.getElementById('squad-content').innerHTML = '<p>No squad information available.</p>';
        }
    } catch (error) {
        console.error('Error fetching squad:', error);
    }
}

/**
 * Helper function to display matches
 */
function displayMatches(matches, containerId, isPast = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    matches.forEach(match => {
        const matchDate = new Date(match.fixture.date).toLocaleString();
        const homeTeam = match.teams.home.name;
        const awayTeam = match.teams.away.name;
        const homeLogo = match.teams.home.logo;
        const awayLogo = match.teams.away.logo;
        const score = isPast ? `${match.goals.home} - ${match.goals.away}` : '';

        const matchElement = createElement('div', { class: 'match-container' }, `
            <div class="match-info">
                <div class="teams">
                    <div class="team">
                        <img src="${homeLogo}" alt="${homeTeam} logo" class="team-logo">
                        <p class="team-name">${homeTeam}</p>
                    </div>
                    <span class="vs">vs</span>
                    <div class="team">
                        <img src="${awayLogo}" alt="${awayTeam} logo" class="team-logo">
                        <p class="team-name">${awayTeam}</p>
                    </div>
                </div>
                <div class="match-timing">
                    <p>${isPast ? `${score}, ${matchDate}` : `${homeTeam} vs ${awayTeam} - ${matchDate}`}</p>
                </div>
            </div>
        `);
        container.appendChild(matchElement);
    });
}

/**
 * Helper function to display squad
 */
function displaySquad(players) {
    const squadContainer = document.getElementById('squad-content');
    squadContainer.innerHTML = ''; // Clear previous content

    players.forEach(player => {
        const playerElement = createElement('div', { class: 'player' }, `
            <h4 class="player-name">${player.name}</h4>
            <p class="player-position">Position: ${player.position}</p>
        `);
        squadContainer.appendChild(playerElement);
    });
}

// Initialize and fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    fetchUpcomingMatches();
    fetchPreviousMatches();
    fetchSquad();
});
