/**
 * Cules United - FC Barcelona Main JavaScript Engine
 * Dynamic data powered by TheSportsDB (free, no key required, CORS-safe)
 * Graceful fallback to curated 2026-27 hardcoded data when offline / rate-limited.
 */

// ─── TheSportsDB API Config ────────────────────────────────────────────────────
// Free public API — no key required, browser CORS allowed
const TSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const TSDB_TEAM_ID  = '133604';                     // FC Barcelona
const TSDB_LEAGUE_ID = '335';                       // La Liga
const TSDB_UCL_ID    = '492';                       // UEFA Champions League
const BARCA_NAME     = 'FC Barcelona';

// ─── Static Image Assets ───────────────────────────────────────────────────────
const BARCA_CREST       = 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg';
const REAL_MADRID_CREST = 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg';
const BAYERN_CREST      = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg';
const PSG_CREST         = 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg';
const SEVILLA_CREST     = 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg';
const ATLETICO_CREST    = 'https://upload.wikimedia.org/wikipedia/en/c/c1/Atletico_Madrid_logo.svg';

// ─── Cache Keys & Durations ────────────────────────────────────────────────────
const CACHE_TIME              = 30 * 60 * 1000; // 30 min — fixtures don't change fast
const SQUAD_CACHE_TIME        = 24 * 60 * 60 * 1000; // 24 hrs — squad rarely changes
const NEWS_CACHE_DURATION     = 60 * 60 * 1000; // 1 hr
const NEWS_CACHE_KEY          = 'cules_united_news_v5';
const UPCOMING_CACHE_KEY      = 'cules_upcoming_v5';
const PAST_CACHE_KEY          = 'cules_past_v5';
const SQUAD_CACHE_KEY         = 'cules_squad_v5';

// ─── 2026-27 Fallback Data ─────────────────────────────────────────────────────
// Used when TheSportsDB is unreachable. Keeps site working offline.
const FALLBACK_UPCOMING = [
    {
        fixture: { id: 301, date: '2026-10-04T20:00:00Z', venue: { name: 'Spotify Camp Nou, Barcelona' } },
        league:  { name: 'La Liga 2026-27 • El Clásico' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Real Madrid',  logo: REAL_MADRID_CREST }
        }
    },
    {
        fixture: { id: 302, date: '2026-10-21T21:00:00Z', venue: { name: 'Spotify Camp Nou, Barcelona' } },
        league:  { name: 'UEFA Champions League 2026-27' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Bayern Munich', logo: BAYERN_CREST }
        }
    },
    {
        fixture: { id: 303, date: '2026-11-01T19:00:00Z', venue: { name: 'Spotify Camp Nou, Barcelona' } },
        league:  { name: 'La Liga 2026-27' },
        teams: {
            home: { name: 'FC Barcelona', logo: BARCA_CREST },
            away: { name: 'Sevilla FC', logo: SEVILLA_CREST }
        }
    },
    {
        fixture: { id: 304, date: '2026-11-22T17:30:00Z', venue: { name: 'Civitas Metropolitano, Madrid' } },
        league:  { name: 'La Liga 2026-27' },
        teams: {
            home: { name: 'Atletico Madrid', logo: ATLETICO_CREST },
            away: { name: 'FC Barcelona',    logo: BARCA_CREST }
        }
    },
    {
        fixture: { id: 305, date: '2026-12-02T21:00:00Z', venue: { name: 'Parc des Princes, Paris' } },
        league:  { name: 'UEFA Champions League 2026-27' },
        teams: {
            home: { name: 'Paris Saint-Germain', logo: PSG_CREST },
            away: { name: 'FC Barcelona',         logo: BARCA_CREST }
        }
    }
];

const FALLBACK_PAST = [
    {
        fixture: { id: 401, date: '2026-09-20T20:00:00Z' },
        league:  { name: 'La Liga 2026-27' },
        teams: {
            home: { name: 'Villarreal',   logo: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg' },
            away: { name: 'FC Barcelona', logo: BARCA_CREST }
        },
        goals:   { home: 1, away: 5 },
        scorers: "Lewandowski 20', 35', Pablo Torre 58', Raphinha 74', 83'"
    },
    {
        fixture: { id: 402, date: '2026-09-15T20:00:00Z' },
        league:  { name: 'La Liga 2026-27' },
        teams: {
            home: { name: 'FC Barcelona',  logo: BARCA_CREST },
            away: { name: 'Athletic Club', logo: 'https://upload.wikimedia.org/wikipedia/en/7/75/Athletic_Club_logo.svg' }
        },
        goals:   { home: 2, away: 1 },
        scorers: "Lamine Yamal 24', Lewandowski 75'"
    },
    {
        fixture: { id: 403, date: '2026-09-01T19:00:00Z' },
        league:  { name: 'La Liga 2026-27' },
        teams: {
            home: { name: 'FC Barcelona',    logo: BARCA_CREST },
            away: { name: 'Real Valladolid', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Real_Valladolid_Logo.svg' }
        },
        goals:   { home: 7, away: 0 },
        scorers: "Raphinha 20', 64', 72', Lewandowski 24', Koundé 45+2', Olmo 82', Ferran 85'"
    }
];

const FALLBACK_SQUAD = [
    { name: 'Marc-André ter Stegen', position: 'Goalkeeper', number: 1,  photo: null },
    { name: 'Wojciech Szczęsny',     position: 'Goalkeeper', number: 25, photo: null },
    { name: 'Pau Cubarsí',           position: 'Defender',   number: 2,  photo: null },
    { name: 'Alejandro Balde',       position: 'Defender',   number: 3,  photo: null },
    { name: 'Ronald Araújo',         position: 'Defender',   number: 4,  photo: null },
    { name: 'Jules Koundé',          position: 'Defender',   number: 23, photo: null },
    { name: 'Íñigo Martínez',        position: 'Defender',   number: 5,  photo: null },
    { name: 'Pedri',                 position: 'Midfielder', number: 8,  photo: null },
    { name: 'Gavi',                  position: 'Midfielder', number: 6,  photo: null },
    { name: 'Dani Olmo',             position: 'Midfielder', number: 20, photo: null },
    { name: 'Frenkie de Jong',       position: 'Midfielder', number: 21, photo: null },
    { name: 'Marc Casadó',           position: 'Midfielder', number: 17, photo: null },
    { name: 'Fermín López',          position: 'Midfielder', number: 16, photo: null },
    { name: 'Lamine Yamal',          position: 'Forward',    number: 19, photo: null },
    { name: 'Robert Lewandowski',    position: 'Forward',    number: 9,  photo: null },
    { name: 'Raphinha',              position: 'Forward',    number: 11, photo: null },
    { name: 'Ferran Torres',         position: 'Forward',    number: 7,  photo: null },
    { name: 'Ansu Fati',             position: 'Forward',    number: 10, photo: null }
];

const BARCA_NEWS_FEED = [
    {
        title:   "Lamine Yamal & Raphinha Lead Barça's Electrifying Attack in 2026/27 Campaign",
        summary: "FC Barcelona's forward line continues to mesmerize Europe with high-octane pressing, clinical finishing, and creative brilliance under Hansi Flick.",
        link:    'https://www.fcbarcelona.com/en/first-team/news',
        tag:     'Match Analysis',
        date:    'Sept 22, 2026',
        image:   'photos/Messi.jpg'
    },
    {
        title:   'Hansi Flick Outlines Tactical Masterplan Ahead of El Clásico',
        summary: 'Head coach Hansi Flick praised team discipline and midfield control while discussing squad rotation and preparation for upcoming key 2026-27 fixtures.',
        link:    'https://www.fcbarcelona.com/en/club/news',
        tag:     'Tactics',
        date:    'Sept 21, 2026',
        image:   'photos/Guardiola.jpg'
    },
    {
        title:   'Dani Olmo & Pedri Partnership Elevates Midfield Play to New Heights',
        summary: "Analysing how Barcelona's Spanish midfield duo unlocks low blocks with rapid 1-2 passing and sharp line-breaking vision.",
        link:    'https://www.fcbarcelona.com/en/first-team/news',
        tag:     'Squad Spotlight',
        date:    'Sept 20, 2026',
        image:   'photos/Iniesta.jpg'
    },
    {
        title:   'Spotify Camp Nou Renovation Nears Crucial Milestone For Fan Return',
        summary: 'The club confirms rapid progress on the stadium transformation, paving the way for Culés to return to a modern football cathedral.',
        link:    'https://www.fcbarcelona.com/en/club/news',
        tag:     'Club News',
        date:    'Sept 19, 2026',
        image:   'photos/Cruyff.jpg'
    }
];

// ─── Cache Helpers ─────────────────────────────────────────────────────────────
function getCachedData(key, duration) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < duration) return parsed.data;
        localStorage.removeItem(key);
    } catch (e) { /* ignore */ }
    return null;
}

function setCacheData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch (e) { /* ignore */ }
}

// ─── TheSportsDB Fetch Helpers ─────────────────────────────────────────────────
async function tsdbFetch(endpoint) {
    const res = await fetch(`${TSDB_BASE}/${endpoint}`);
    if (!res.ok) throw new Error(`TSDB ${res.status}`);
    return res.json();
}

/** Convert TheSportsDB event object → our internal match format */
function tsdbEventToMatch(ev) {
    const isHome = ev.strHomeTeam === BARCA_NAME;
    return {
        fixture: {
            id:    ev.idEvent,
            date:  ev.strTimestamp || ev.dateEvent + 'T' + (ev.strTime || '18:00:00') + 'Z',
            venue: { name: ev.strVenue || 'Spotify Camp Nou' }
        },
        league:  { name: ev.strLeague || 'La Liga 2026-27' },
        teams: {
            home: {
                name: ev.strHomeTeam,
                logo: ev.strHomeTeamBadge || (isHome ? BARCA_CREST : '')
            },
            away: {
                name: ev.strAwayTeam,
                logo: ev.strAwayTeamBadge || (!isHome ? BARCA_CREST : '')
            }
        },
        goals: {
            home: ev.intHomeScore !== null && ev.intHomeScore !== '' ? parseInt(ev.intHomeScore) : null,
            away: ev.intAwayScore !== null && ev.intAwayScore !== '' ? parseInt(ev.intAwayScore) : null
        }
    };
}

/** Convert TheSportsDB player object → our squad format */
function tsdbPlayerToSquad(p) {
    const pos = (p.strPosition || 'Midfielder').trim();
    const posMap = {
        'Goalkeeper': 'Goalkeeper',
        'Defender':   'Defender', 'Centre-Back': 'Defender', 'Left-Back': 'Defender', 'Right-Back': 'Defender',
        'Midfielder': 'Midfielder', 'Central Midfield': 'Midfielder', 'Defensive Midfield': 'Midfielder',
        'Attacking Midfield': 'Midfielder', 'Left Midfield': 'Midfielder', 'Right Midfield': 'Midfielder',
        'Forward':    'Forward', 'Centre-Forward': 'Forward', 'Left Winger': 'Forward', 'Right Winger': 'Forward',
        'Striker':    'Forward'
    };
    return {
        name:     p.strPlayer,
        position: posMap[pos] || 'Midfielder',
        number:   p.strNumber ? parseInt(p.strNumber) : null,
        photo:    p.strThumb || p.strCutout || null,
        nationality: p.strNationality || ''
    };
}

// ─── News ──────────────────────────────────────────────────────────────────────
async function fetchNews() {
    const newsContainer = document.getElementById('news-grid');
    if (!newsContainer) return;

    const cached = getCachedData(NEWS_CACHE_KEY, NEWS_CACHE_DURATION);
    if (cached && cached.length > 0) { displayNews(cached); return; }

    // TheSportsDB doesn't provide news; serve curated feed
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
                <img src="${art.image || 'photos/Messi.jpg'}" alt="${art.title}" class="news-thumb" loading="lazy" onerror="this.src='photos/Messi.jpg'">
                <span class="news-tag">${art.tag || 'Barça News'}</span>
            </div>
            <div class="news-body">
                <span class="news-date">${art.date || 'Recent'}</span>
                <h3 class="news-title">${art.title}</h3>
                <p class="news-summary">${art.summary.length > 130 ? art.summary.substring(0, 130) + '...' : art.summary}</p>
                <a href="${art.link}" target="_blank" rel="noopener noreferrer" class="news-read-btn">Read Article →</a>
            </div>
        `;
        newsGrid.appendChild(card);
    });
}

// ─── Upcoming Fixtures ─────────────────────────────────────────────────────────
async function fetchUpcomingMatches() {
    const container = document.getElementById('upcoming-matches-content');
    if (!container) return;

    // Show loading shimmer
    container.innerHTML = '<p class="loading-text">⏳ Fetching live fixtures from TheSportsDB…</p>';

    const cached = getCachedData(UPCOMING_CACHE_KEY, CACHE_TIME);
    if (cached) { displayUpcomingMatches(cached); return; }

    try {
        // Fetch next 5 La Liga events for Barça
        const [laLigaData, uclData] = await Promise.allSettled([
            tsdbFetch(`eventsnextleague.php?id=${TSDB_LEAGUE_ID}`),
            tsdbFetch(`eventsnextleague.php?id=${TSDB_UCL_ID}`)
        ]);

        let events = [];

        if (laLigaData.status === 'fulfilled' && laLigaData.value.events) {
            const barcaEvents = laLigaData.value.events.filter(
                ev => ev.strHomeTeam === BARCA_NAME || ev.strAwayTeam === BARCA_NAME
            ).slice(0, 4);
            events = events.concat(barcaEvents.map(tsdbEventToMatch));
        }

        if (uclData.status === 'fulfilled' && uclData.value.events) {
            const barcaUCL = uclData.value.events.filter(
                ev => ev.strHomeTeam === BARCA_NAME || ev.strAwayTeam === BARCA_NAME
            ).slice(0, 2);
            events = events.concat(barcaUCL.map(tsdbEventToMatch));
        }

        // Sort by date ascending
        events.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

        if (events.length > 0) {
            setCacheData(UPCOMING_CACHE_KEY, events);
            displayUpcomingMatches(events);
            return;
        }
    } catch (e) {
        // Fall through to static data
    }

    // Silent fallback
    displayUpcomingMatches(FALLBACK_UPCOMING);
}

function displayUpcomingMatches(matches) {
    const container = document.getElementById('upcoming-matches-content');
    if (!container) return;
    container.innerHTML = '';

    matches.forEach(m => {
        const dateObj      = new Date(m.fixture.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        const home       = m.teams.home;
        const away       = m.teams.away;
        const leagueName = m.league?.name || 'La Liga 2026-27';

        const matchCard = document.createElement('div');
        matchCard.className = 'match-card upcoming-card';
        matchCard.innerHTML = `
            <div class="match-card-header">
                <span class="competition-badge">${leagueName}</span>
                <span class="match-time-badge">${formattedDate}</span>
            </div>
            <div class="teams-versus-container">
                <div class="team-block home-team">
                    <img src="${home.logo || BARCA_CREST}" alt="${home.name}" class="team-crest" loading="lazy" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${home.name}</span>
                </div>
                <div class="versus-badge">VS</div>
                <div class="team-block away-team">
                    <img src="${away.logo || BARCA_CREST}" alt="${away.name}" class="team-crest" loading="lazy" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${away.name}</span>
                </div>
            </div>
            <div class="match-venue">📍 ${m.fixture.venue?.name || 'Spotify Camp Nou'}</div>
        `;
        container.appendChild(matchCard);
    });
}

// ─── Previous Results ──────────────────────────────────────────────────────────
async function fetchPreviousMatches() {
    const container = document.getElementById('past-matches-content');
    if (!container) return;

    container.innerHTML = '<p class="loading-text">⏳ Fetching live results from TheSportsDB…</p>';

    const cached = getCachedData(PAST_CACHE_KEY, CACHE_TIME);
    if (cached) { displayPreviousMatches(cached); return; }

    try {
        const [laLigaData, uclData] = await Promise.allSettled([
            tsdbFetch(`eventspastleague.php?id=${TSDB_LEAGUE_ID}`),
            tsdbFetch(`eventspastleague.php?id=${TSDB_UCL_ID}`)
        ]);

        let events = [];

        if (laLigaData.status === 'fulfilled' && laLigaData.value.events) {
            const barcaEvents = laLigaData.value.events.filter(
                ev => ev.strHomeTeam === BARCA_NAME || ev.strAwayTeam === BARCA_NAME
            ).slice(-4);
            events = events.concat(barcaEvents.map(tsdbEventToMatch));
        }

        if (uclData.status === 'fulfilled' && uclData.value.events) {
            const barcaUCL = uclData.value.events.filter(
                ev => ev.strHomeTeam === BARCA_NAME || ev.strAwayTeam === BARCA_NAME
            ).slice(-2);
            events = events.concat(barcaUCL.map(tsdbEventToMatch));
        }

        // Sort newest first
        events.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));

        if (events.length > 0) {
            setCacheData(PAST_CACHE_KEY, events);
            displayPreviousMatches(events);
            return;
        }
    } catch (e) {
        // Fall through
    }

    displayPreviousMatches(FALLBACK_PAST);
}

function displayPreviousMatches(matches) {
    const container = document.getElementById('past-matches-content');
    if (!container) return;
    container.innerHTML = '';

    matches.forEach(m => {
        const dateObj      = new Date(m.fixture.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        const home      = m.teams.home;
        const away      = m.teams.away;
        const homeScore = m.goals?.home ?? 0;
        const awayScore = m.goals?.away ?? 0;
        const isBarcaWin = (home.name.includes('Barcelona') && homeScore > awayScore)
                        || (away.name.includes('Barcelona') && awayScore > homeScore);
        const isDraw     = homeScore === awayScore;

        const matchCard = document.createElement('div');
        matchCard.className = `match-card past-card ${isBarcaWin ? 'barca-win' : ''}`;
        matchCard.innerHTML = `
            <div class="match-card-header">
                <span class="competition-badge">${m.league?.name || 'La Liga 2026-27'}</span>
                <span class="result-status-badge ${isBarcaWin ? 'win' : isDraw ? 'draw' : 'loss'}">
                    ${isBarcaWin ? 'WIN 🏆' : isDraw ? 'DRAW' : 'LOSS'}
                </span>
            </div>
            <div class="teams-score-container">
                <div class="team-block">
                    <img src="${home.logo || BARCA_CREST}" alt="${home.name}" class="team-crest" loading="lazy" onerror="this.src='${BARCA_CREST}'">
                    <span class="team-name">${home.name}</span>
                </div>
                <div class="score-display">${homeScore} - ${awayScore}</div>
                <div class="team-block">
                    <img src="${away.logo || BARCA_CREST}" alt="${away.name}" class="team-crest" loading="lazy" onerror="this.src='${BARCA_CREST}'">
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

// ─── Squad Roster (Live via TheSportsDB) ───────────────────────────────────────
async function fetchSquad() {
    const container = document.getElementById('squad-content');
    if (!container) return;

    container.innerHTML = '<p class="loading-text">⏳ Loading squad from TheSportsDB…</p>';

    const cached = getCachedData(SQUAD_CACHE_KEY, SQUAD_CACHE_TIME);
    if (cached) { displaySquad(cached); return; }

    try {
        const data = await tsdbFetch(`lookup_all_players.php?id=${TSDB_TEAM_ID}`);
        if (data.player && data.player.length > 0) {
            const squad = data.player
                .filter(p => p.strSigning !== 'retired')
                .map(tsdbPlayerToSquad);

            // Sort: GK → DEF → MID → FWD, then by number
            const posOrder = { 'Goalkeeper': 0, 'Defender': 1, 'Midfielder': 2, 'Forward': 3 };
            squad.sort((a, b) => (posOrder[a.position] ?? 4) - (posOrder[b.position] ?? 4)
                               || (a.number || 99) - (b.number || 99));

            setCacheData(SQUAD_CACHE_KEY, squad);
            displaySquad(squad);
            return;
        }
    } catch (e) {
        // Fall through to fallback
    }

    displaySquad(FALLBACK_SQUAD);
}

function displaySquad(players) {
    const container = document.getElementById('squad-content');
    if (!container) return;
    container.innerHTML = '';

    players.forEach(p => {
        const posClass = (p.position || 'midfielder').toLowerCase();
        const card = document.createElement('div');
        card.className = `player-card-modern ${posClass}`;

        const photoHtml = p.photo
            ? `<img src="${p.photo}" alt="${p.name}" class="player-photo" loading="lazy" onerror="this.style.display='none'">`
            : '';

        card.innerHTML = `
            <div class="player-number-badge">#${p.number || '—'}</div>
            ${photoHtml}
            <div class="player-info">
                <h4 class="player-name">${p.name}</h4>
                <span class="player-position-tag">${p.position}</span>
                ${p.nationality ? `<span class="player-nationality">${p.nationality}</span>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// ─── Match Prediction Poll (localStorage DB) ───────────────────────────────────
function renderMatchPoll() {
    const pollContainer = document.getElementById('poll-container');
    if (!pollContainer || !window.barcaPollDB) return;

    const matchId  = 'match_barca_realmadrid';
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
                <div class="poll-option ${userChoice === 'win'  ? 'selected' : ''}" data-choice="win">
                    <div class="option-header">
                        <span class="option-title">💙❤️ Barça Win</span>
                        <span class="option-percent">${pollData.percentages.win}%</span>
                    </div>
                    <div class="bar-background"><div class="bar-fill win-fill"  style="width: ${pollData.percentages.win}%"></div></div>
                    <span class="vote-count-text">${pollData.votes.win.toLocaleString()} votes</span>
                </div>
                <div class="poll-option ${userChoice === 'draw' ? 'selected' : ''}" data-choice="draw">
                    <div class="option-header">
                        <span class="option-title">🤝 Draw</span>
                        <span class="option-percent">${pollData.percentages.draw}%</span>
                    </div>
                    <div class="bar-background"><div class="bar-fill draw-fill" style="width: ${pollData.percentages.draw}%"></div></div>
                    <span class="vote-count-text">${pollData.votes.draw.toLocaleString()} votes</span>
                </div>
                <div class="poll-option ${userChoice === 'loss' ? 'selected' : ''}" data-choice="loss">
                    <div class="option-header">
                        <span class="option-title">🤍 Real Madrid Win</span>
                        <span class="option-percent">${pollData.percentages.loss}%</span>
                    </div>
                    <div class="bar-background"><div class="bar-fill loss-fill" style="width: ${pollData.percentages.loss}%"></div></div>
                    <span class="vote-count-text">${pollData.votes.loss.toLocaleString()} votes</span>
                </div>
            </div>
            <div class="poll-footer">
                <span class="total-votes">Total Votes: <strong>${pollData.totalVotes.toLocaleString()}</strong></span>
                <span class="user-status-msg">
                    ${userChoice
                        ? `✓ Your vote (${userChoice.toUpperCase()}) recorded`
                        : 'Click an option to cast your vote!'}
                </span>
            </div>
        </div>
    `;

    pollContainer.querySelectorAll('.poll-option').forEach(opt => {
        opt.addEventListener('click', () => {
            window.barcaPollDB.submitVote(matchId, opt.getAttribute('data-choice'));
            renderMatchPoll();
        });
    });
}

// ─── Initialise ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    fetchUpcomingMatches();
    fetchPreviousMatches();
    fetchSquad();
    renderMatchPoll();

    // ── Scroll-spy: highlight active nav link as user scrolls ──────────────────
    const sections   = document.querySelectorAll('main section[id]');
    const navLinks   = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.35 });

    sections.forEach(sec => observer.observe(sec));
});