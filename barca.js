/**
 * Cules United - FC Barcelona Main JavaScript Engine
 * Handles Match Fixtures, Dynamic News, Squad Roster, and Interactive Database Poll.
 */

// API Configuration
// Set USE_LIVE_API to true only when providing valid, active API keys.
// Kept false by default to prevent DNS/net::ERR_NAME_NOT_RESOLVED browser console errors on expired keys.
const USE_LIVE_API = false;
const footballApiKey = '496718d63839661001cc16645433342f';
const newsApiKey = 'QI1oZoxu9DYOr5g7BoKb762czGNVB1tare-Ft0OEF6I';
const teamId = 529; // FC Barcelona team ID in API-Football

// Cache Durations
const CACHE_TIME = 24 * 60 * 60 * 1000;
const PAST_MATCHES_CACHE_TIME = 60 * 60 * 1000;
const NEWS_CACHE_KEY = 'cules_united_news_v3';
const NEWS_CACHE_DURATION = 60 * 60 * 1000;

// API Endpoints
const upcomingMatchesUrl = `https://v3.football.api-sports.io/fixtures?team=${teamId}&next=5`;
const previousMatchesUrl = `https://v3.football.api-sports.io/fixtures?team=${teamId}&last=5`;
const squadUrl = `https://v3.football.api-sports.io/players/squads?team=${teamId}`;

// Barca Crest SVG & Team Crests
const BARCA_CREST = 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg';
const REAL_MADRID_CREST = 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg';
const BAYERN_CREST = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg';
const PSG_CREST = 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg';
const SEVILLA_CREST = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg';
const ATLETICO_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/c1/Atletico_Madrid_logo.svg';

// Current Season Match Fixtures (2025/2026 Season)
const CURRENT_SEASON_UPCOMING_MATCHES = [
    {
        fixture: { id: 301, date: '2026-09-27T20:00:00Z', venue: { name: 'Estadi Olímpic Lluís Companys, Barcelona' } },
        league: { name: 'La Liga • El Clásico' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Real Madrid', logo: REAL_MADRID_CREST }
        }
    },
    {
        fixture: { id: 302, date: '2026-10-01T21:00:00Z', venue: { name: 'Estadi Olímpic Lluís Companys, Barcelona' } },
        league: { name: 'UEFA Champions League' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Bayern Munich', logo: BAYERN_CREST }
        }
    },
    {
        fixture: { id: 303, date: '2026-10-18T19:00:00Z', venue: { name: 'Estadi Olímpic Lluís Companys, Barcelona' } },
        league: { name: 'La Liga' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Sevilla FC', logo: SEVILLA_CREST }
        }
    },
    {
        fixture: { id: 304, date: '2026-10-25T17:30:00Z', venue: { name: 'Civitas Metropolitano, Madrid' } },
        league: { name: 'La Liga' },
        teams: {
            home: { name: 'Atletico Madrid', logo: ATLETICO_CREST },
            away: { name: 'FC Barcelona', logo: BARCA_CREST }
        }
    },
    {
        fixture: { id: 305, date: '2026-11-04T21:00:00Z', venue: { name: 'Parc des Princes, Paris' } },
        league: { name: 'UEFA Champions League' },
        teams: {
            home: { name: 'Paris Saint-Germain', logo: PSG_CREST },
            away: { name: 'FC Barcelona', logo: BARCA_CREST }
        }
    }
];

const CURRENT_SEASON_PAST_MATCHES = [
    {
        fixture: { id: 401, date: '2026-09-20T20:00:00Z' },
        league: { name: 'La Liga • El Clásico' },
        teams: {
            home: { name: 'Real Madrid', logo: REAL_MADRID_CREST },
            away: { name: 'FC Barcelona', logo: BARCA_CREST }
        },
        goals: { home: 0, away: 4 },
        scorers: 'Lewandowski 54\', 56\', Lamine Yamal 77\', Raphinha 84\''
    },
    {
        fixture: { id: 402, date: '2026-09-15T21:00:00Z' },
        league: { name: 'UEFA Champions League' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Bayern Munich', logo: BAYERN_CREST }
        },
        goals: { home: 4, away: 1 },
        scorers: 'Raphinha 1\', 45\', 56\', Lewandowski 36\''
    },
    {
        fixture: { id: 403, date: '2026-09-08T18:30:00Z' },
        league: { name: 'La Liga' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Sevilla FC', logo: SEVILLA_CREST }
        },
        goals: { home: 5, away: 1 },
        scorers: 'Lewandowski 24\', 39\', Pedri 28\', Pablo Torre 82\', 88\''
    }
];

// Current Curated News
const BARCA_NEWS_FEED = [
    {
        title: "Lamine Yamal & Raphinha Lead Barça's Electrifying Attack in 2025/26 Campaign",
        summary: "FC Barcelona's forward line continues to mesmerize Europe with high-octane pressing, clinical finishing, and creative brilliance under Hansi Flick.",
        link: "https://www.fcbarcelona.com/en/first-team/news",
        tag: "Match Analysis",
        date: "Sept 22, 2026",
        image: "photos/Messi.jpg"
    },
    {
        title: "Hansi Flick Outlines Tactical Masterplan Ahead of El Clásico",
        summary: "Head coach Hansi Flick praised team discipline and midfield control while discussing squad rotation and preparation for upcoming key fixtures.",
        link: "https://www.fcbarcelona.com/en/club/news",
        tag: "Tactics",
        date: "Sept 21, 2026",
        image: "photos/Guardiola.jpg"
    },
    {
        title: "Dani Olmo & Pedri Partnership Elevates Midfield Play to New Heights",
        summary: "Analysing how Barcelona's Spanish midfield duo unlocks low blocks with rapid 1-2 passing and sharp line-breaking vision.",
        link: "https://www.fcbarcelona.com/en/first-team/news",
        tag: "Squad Spotlight",
        date: "Sept 20, 2026",
        image: "photos/Iniesta.jpg"
    },
    {
        title: "Spotify Camp Nou Renovation Nears Crucial Milestone For Fan Return",
        summary: "The club confirms rapid progress on the stadium transformation, paving the way for Culés to return to a modern football cathedral.",
        link: "https://www.fcbarcelona.com/en/club/news",
        tag: "Club News",
        date: "Sept 19, 2026",
        image: "photos/Cruyff.jpg"
    }
];

// Squad Roster
const BARCA_SQUAD_ROSTER = [
    { name: 'Marc-André ter Stegen', position: 'Goalkeeper', number: 1 },
    { name: 'Wojciech Szczęsny', position: 'Goalkeeper', number: 25 },
    { name: 'Pau Cubarsí', position: 'Defender', number: 2 },
    { name: 'Alejandro Balde', position: 'Defender', number: 3 },
    { name: 'Ronald Araújo', position: 'Defender', number: 4 },
    { name: 'Jules Koundé', position: 'Defender', number: 23 },
    { name: 'Íñigo Martínez', position: 'Defender', number: 5 },
    { name: 'Pedri', position: 'Midfielder', number: 8 },
    { name: 'Gavi', position: 'Midfielder', number: 6 },
    { name: 'Dani Olmo', position: 'Midfielder', number: 20 },
    { name: 'Frenkie de Jong', position: 'Midfielder', number: 21 },
    { name: 'Marc Casadó', position: 'Midfielder', number: 17 },
    { name: 'Fermín López', position: 'Midfielder', number: 16 },
    { name: 'Lamine Yamal', position: 'Forward', number: 19 },
    { name: 'Robert Lewandowski', position: 'Forward', number: 9 },
    { name: 'Raphinha', position: 'Forward', number: 11 },
    { name: 'Ferran Torres', position: 'Forward', number: 7 },
    { name: 'Ansu Fati', position: 'Forward', number: 10 }
];

/**
 * Cache Helpers
 */
function getCachedData(key, duration) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < duration) {
            return parsed.data;
        }
        localStorage.removeItem(key);
    } catch (e) {
        console.warn('Cache read error:', e);
    }
    return null;
}

function setCacheData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) {
        console.warn('Cache write error:', e);
    }
}

/**
 * Fetch & Display News (Safe execution without unhandled console errors)
 */
async function fetchNews() {
    const newsContainer = document.getElementById('news-grid');
    if (!newsContainer) return;

    // Check Cache
    const cachedNews = getCachedData(NEWS_CACHE_KEY, NEWS_CACHE_DURATION);
    if (cachedNews && cachedNews.length > 0) {
        displayNews(cachedNews);
        return;
    }

    if (USE_LIVE_API) {
        try {
            const response = await fetch(
                `https://api.newscatcherapi.com/v2/search?q=FC%20Barcelona&lang=en&sort_by=relevancy`,
                { headers: { 'x-api-key': newsApiKey } }
            );
            if (response.ok) {
                const data = await response.json();
                if (data.articles && data.articles.length > 0) {
                    const formatted = data.articles.map(art => ({
                        title: art.title,
                        summary: art.summary || art.excerpt || 'Latest news update from FC Barcelona.',
                        link: art.link,
                        tag: art.topic || 'Club News',
                        date: new Date(art.published_date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        image: art.media || 'photos/Messi.jpg'
                    }));
                    setCacheData(NEWS_CACHE_KEY, formatted);
                    displayNews(formatted);
                    return;
                }
            }
        } catch (e) {
            // Silence unneeded console error logs when API fails
        }
    }

    // Default to clean curated news feed
    displayNews(BARCA_NEWS_FEED);
}

function displayNews(articles) {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;
    newsGrid.innerHTML = '';

    articles.forEach(art => {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="news-image-wrapper">
                <img src="${art.image || 'photos/Messi.jpg'}" alt="${art.title}" class="news-thumb" onerror="this.src='photos/Messi.jpg'">
                <span class="news-tag">${art.tag || 'Barça News'}</span>
            </div>
            <div class="news-body">
                <span class="news-date">${art.date || 'Recent'}</span>
                <h3 class="news-title">${art.title}</h3>
                <p class="news-summary">${art.summary.length > 130 ? art.summary.substring(0, 130) + '...' : art.summary}</p>
                <a href="${art.link}" target="_blank" rel="noopener noreferrer" class="news-read-btn">
                    Read Article →
                </a>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}

/**
 * Fetch & Display Upcoming Matches (Current 2025/2026 Season)
 */
async function fetchUpcomingMatches() {
    const container = document.getElementById('upcoming-matches-content');
    if (!container) return;

    const cached = getCachedData('cules_upcoming_matches_v3', CACHE_TIME);
    if (cached) {
        displayUpcomingMatches(cached);
        return;
    }

    if (USE_LIVE_API) {
        try {
            const res = await fetch(upcomingMatchesUrl, { headers: { 'x-apisports-key': footballApiKey } });
            if (res.ok) {
                const data = await res.json();
                if (data.response && data.response.length > 0) {
                    setCacheData('cules_upcoming_matches_v3', data.response);
                    displayUpcomingMatches(data.response);
                    return;
                }
            }
        } catch (e) {
            // Silence unneeded API logs
        }
    }

    displayUpcomingMatches(CURRENT_SEASON_UPCOMING_MATCHES);
}

function displayUpcomingMatches(matches) {
    const container = document.getElementById('upcoming-matches-content');
    if (!container) return;
    container.innerHTML = '';

    matches.forEach(m => {
        const dateObj = new Date(m.fixture.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const home = m.teams.home;
        const away = m.teams.away;
        const leagueName = m.league?.name || 'La Liga';

        const matchCard = document.createElement('div');
        matchCard.className = 'match-card upcoming-card';
        matchCard.innerHTML = `
            <div class="match-card-header">
                <span class="competition-badge">${leagueName}</span>
                <span class="match-time-badge">${formattedDate}</span>
            </div>
            <div class="teams-versus-container">
                <div class="team-block home-team">
                    <img src="${home.logo}" alt="${home.name}" class="team-crest" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${home.name}</span>
                </div>
                <div class="versus-badge">VS</div>
                <div class="team-block away-team">
                    <img src="${away.logo}" alt="${away.name}" class="team-crest" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${away.name}</span>
                </div>
            </div>
            <div class="match-venue">📍 ${m.fixture.venue?.name || 'Camp Nou'}</div>
        `;
        container.appendChild(matchCard);
    });
}

/**
 * Fetch & Display Previous Matches (Current 2025/2026 Season Results)
 */
async function fetchPreviousMatches() {
    const container = document.getElementById('past-matches-content');
    if (!container) return;

    const cached = getCachedData('cules_past_matches_v3', PAST_MATCHES_CACHE_TIME);
    if (cached) {
        displayPreviousMatches(cached);
        return;
    }

    if (USE_LIVE_API) {
        try {
            const res = await fetch(previousMatchesUrl, { headers: { 'x-apisports-key': footballApiKey } });
            if (res.ok) {
                const data = await res.json();
                if (data.response && data.response.length > 0) {
                    setCacheData('cules_past_matches_v3', data.response);
                    displayPreviousMatches(data.response);
                    return;
                }
            }
        } catch (e) {
            // Silence unneeded API error logs
        }
    }

    displayPreviousMatches(CURRENT_SEASON_PAST_MATCHES);
}

function displayPreviousMatches(matches) {
    const container = document.getElementById('past-matches-content');
    if (!container) return;
    container.innerHTML = '';

    matches.forEach(m => {
        const dateObj = new Date(m.fixture.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const home = m.teams.home;
        const away = m.teams.away;
        const homeScore = m.goals?.home ?? 0;
        const awayScore = m.goals?.away ?? 0;
        const isBarcaWin = (home.name.includes('Barcelona') && homeScore > awayScore) || (away.name.includes('Barcelona') && awayScore > homeScore);

        const matchCard = document.createElement('div');
        matchCard.className = `match-card past-card ${isBarcaWin ? 'barca-win' : ''}`;
        matchCard.innerHTML = `
            <div class="match-card-header">
                <span class="competition-badge">${m.league?.name || 'La Liga'}</span>
                <span class="result-status-badge ${isBarcaWin ? 'win' : 'draw'}">${isBarcaWin ? 'WIN 🏆' : 'RESULT'}</span>
            </div>
            <div class="teams-score-container">
                <div class="team-block">
                    <img src="${home.logo}" alt="${home.name}" class="team-crest" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${home.name}</span>
                </div>
                <div class="score-display">${homeScore} - ${awayScore}</div>
                <div class="team-block">
                    <img src="${away.logo}" alt="${away.name}" class="team-crest" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${away.name}</span>
                </div>
            </div>
            <div class="match-date-footer">
                <span>🗓️ ${formattedDate}</span>
                ${m.scorers ? `<span class="scorers-text">⚽ ${m.scorers}</span>` : ''}
            </div>
        `;
        container.appendChild(matchCard);
    });
}

/**
 * Display Squad Roster
 */
function fetchSquad() {
    const container = document.getElementById('squad-content');
    if (!container) return;
    container.innerHTML = '';

    BARCA_SQUAD_ROSTER.forEach(p => {
        const posClass = p.position.toLowerCase();
        const card = document.createElement('div');
        card.className = `player-card-modern ${posClass}`;
        card.innerHTML = `
            <div class="player-number-badge">#${p.number || '—'}</div>
            <div class="player-info">
                <h4 class="player-name">${p.name}</h4>
                <span class="player-position-tag">${p.position}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Render Database-Driven Match Poll
 */
function renderMatchPoll() {
    const pollContainer = document.getElementById('poll-container');
    if (!pollContainer || !window.barcaPollDB) return;

    const matchId = 'match_barca_realmadrid';
    const pollData = window.barcaPollDB.getPollData(matchId);

    if (!pollData) return;

    const userChoice = pollData.userChoice;

    pollContainer.innerHTML = `
        <div class="poll-card glass-card">
            <div class="poll-header">
                <span class="poll-comp-tag">${pollData.competition}</span>
                <span class="poll-date">${pollData.date}</span>
            </div>

            <div class="poll-matchup">
                <div class="poll-team">
                    <img src="${BARCA_CREST}" alt="FC Barcelona" class="poll-crest">
                    <span class="poll-team-name">${pollData.homeTeam}</span>
                </div>
                <div class="poll-vs">VS</div>
                <div class="poll-team">
                    <img src="${REAL_MADRID_CREST}" alt="Real Madrid" class="poll-crest">
                    <span class="poll-team-name">${pollData.awayTeam}</span>
                </div>
            </div>

            <div class="poll-options">
                <!-- FC Barcelona Win -->
                <div class="poll-option ${userChoice === 'win' ? 'selected' : ''}" data-choice="win">
                    <div class="option-header">
                        <span class="option-title">💙❤️ Barça Win</span>
                        <span class="option-percent">${pollData.percentages.win}%</span>
                    </div>
                    <div class="bar-background">
                        <div class="bar-fill win-fill" style="width: ${pollData.percentages.win}%"></div>
                    </div>
                    <span class="vote-count-text">${pollData.votes.win.toLocaleString()} votes</span>
                </div>

                <!-- Draw -->
                <div class="poll-option ${userChoice === 'draw' ? 'selected' : ''}" data-choice="draw">
                    <div class="option-header">
                        <span class="option-title">🤝 Draw</span>
                        <span class="option-percent">${pollData.percentages.draw}%</span>
                    </div>
                    <div class="bar-background">
                        <div class="bar-fill draw-fill" style="width: ${pollData.percentages.draw}%"></div>
                    </div>
                    <span class="vote-count-text">${pollData.votes.draw.toLocaleString()} votes</span>
                </div>

                <!-- Opponent Win / Loss -->
                <div class="poll-option ${userChoice === 'loss' ? 'selected' : ''}" data-choice="loss">
                    <div class="option-header">
                        <span class="option-title">🤍 Real Madrid Win</span>
                        <span class="option-percent">${pollData.percentages.loss}%</span>
                    </div>
                    <div class="bar-background">
                        <div class="bar-fill loss-fill" style="width: ${pollData.percentages.loss}%"></div>
                    </div>
                    <span class="vote-count-text">${pollData.votes.loss.toLocaleString()} votes</span>
                </div>
            </div>

            <div class="poll-footer">
                <span class="total-votes">Total Votes: <strong>${pollData.totalVotes.toLocaleString()}</strong></span>
                <span class="user-status-msg">
                    ${userChoice ? `✓ Your vote (${userChoice.toUpperCase()}) recorded in DB` : 'Click an option to cast your vote!'}
                </span>
            </div>
        </div>
    `;

    // Attach Click Handlers
    const options = pollContainer.querySelectorAll('.poll-option');
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            const choice = opt.getAttribute('data-choice');
            window.barcaPollDB.submitVote(matchId, choice);
            renderMatchPoll();
        });
    });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    fetchUpcomingMatches();
    fetchPreviousMatches();
    fetchSquad();
    renderMatchPoll();
});