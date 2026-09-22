/**
 * Cules United - Match Poll Database System
 * Persistent client-side database module managing poll votes and percentage calculations.
 */

class PollDatabase {
    constructor() {
        this.STORAGE_KEY = 'cules_united_poll_db_v2';
        this.db = this.loadDatabase();
    }

    /**
     * Default seed data for upcoming FC Barcelona matches (2026-27 Season)
     */
    getDefaultData() {
        return {
            matches: {
                'match_barca_realmadrid': {
                    id: 'match_barca_realmadrid',
                    homeTeam: 'FC Barcelona',
                    awayTeam: 'Real Madrid',
                    competition: 'La Liga 2026-27 • El Clásico',
                    date: 'Sunday, Oct 4, 2026 • 20:00 CET',
                    homeLogo: 'photos/logo.png',
                    votes: {
                        win: 1845,
                        draw: 312,
                        loss: 268
                    }
                },
                'match_barca_bayern': {
                    id: 'match_barca_bayern',
                    homeTeam: 'FC Barcelona',
                    awayTeam: 'Bayern Munich',
                    competition: 'UEFA Champions League 2026-27',
                    date: 'Wednesday, Oct 21, 2026 • 21:00 CET',
                    votes: {
                        win: 1420,
                        draw: 405,
                        loss: 310
                    }
                }
            },
            userVotes: {} // Tracks votes cast by current user: { matchId: 'win'|'draw'|'loss' }
        };
    }

    /**
     * Load database from localStorage or seed with default data
     */
    loadDatabase() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const defaults = this.getDefaultData();
                return {
                    matches: { ...defaults.matches, ...parsed.matches },
                    userVotes: parsed.userVotes || {}
                };
            }
        } catch (e) {
            console.warn('PollDatabase: Failed to read from localStorage, using fallback in-memory DB', e);
        }
        const initial = this.getDefaultData();
        this.saveDatabase(initial);
        return initial;
    }

    /**
     * Persist current state to localStorage
     */
    saveDatabase(data = this.db) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('PollDatabase: Error saving to localStorage', e);
        }
    }

    /**
     * Get poll data for a specific match
     */
    getPollData(matchId) {
        const match = this.db.matches[matchId];
        if (!match) return null;

        const totalVotes = match.votes.win + match.votes.draw + match.votes.loss;
        const winPercent = totalVotes > 0 ? Math.round((match.votes.win / totalVotes) * 100) : 0;
        const drawPercent = totalVotes > 0 ? Math.round((match.votes.draw / totalVotes) * 100) : 0;
        const lossPercent = totalVotes > 0 ? Math.max(0, 100 - winPercent - drawPercent) : 0;

        return {
            ...match,
            totalVotes,
            percentages: {
                win: winPercent,
                draw: drawPercent,
                loss: lossPercent
            },
            userChoice: this.db.userVotes[matchId] || null
        };
    }

    /**
     * Submit or change user vote
     */
    submitVote(matchId, choice) {
        if (!['win', 'draw', 'loss'].includes(choice)) {
            throw new Error('Invalid vote choice. Must be "win", "draw", or "loss".');
        }

        const match = this.db.matches[matchId];
        if (!match) return null;

        const previousVote = this.db.userVotes[matchId];

        // Retract previous choice if voted before
        if (previousVote && match.votes[previousVote] > 0) {
            match.votes[previousVote] -= 1;
        }

        // Add new choice
        match.votes[choice] += 1;
        this.db.userVotes[matchId] = choice;

        this.saveDatabase();
        return this.getPollData(matchId);
    }

    /**
     * Reset votes for testing or debug
     */
    resetPoll(matchId) {
        if (this.db.matches[matchId]) {
            const defaults = this.getDefaultData().matches[matchId];
            if (defaults) {
                this.db.matches[matchId].votes = { ...defaults.votes };
            }
            delete this.db.userVotes[matchId];
            this.saveDatabase();
        }
        return this.getPollData(matchId);
    }
}

// Global singleton instance
window.barcaPollDB = new PollDatabase();
