/**
 * versusManager.js
 * Manages versus mode in Lunaris
 */

// LUNARIS_TODO: integrate combat engine here later

/**
 * VersusManager class
 * Handles versus mode matches
 */
class VersusManager {
    /**
     * @param {Object} data - Game data
     */
    constructor(data) {
        this.data = data;
        this.currentMatch = null;
        this.matchHistory = [];
    }

    /**
     * Create a new match
     * @param {Object} settings - Match settings
     * @returns {Object} Match result
     */
    createMatch(settings = {}) {
        const matchId = this.generateMatchId();
        
        this.currentMatch = {
            id: matchId,
            settings: {
                ruleset: settings.ruleset || 'standard',
                bestOf: settings.bestOf || 3,
                timerEnabled: settings.timerEnabled || false,
                timerSeconds: settings.timerSeconds || 300,
                allowSpectators: settings.allowSpectators !== false
            },
            players: [],
            state: 'waiting', // waiting, ready, playing, finished
            currentRound: 0,
            rounds: [],
            winner: null,
            createdAt: Date.now()
        };
        
        console.log(`[VersusManager] Created match: ${matchId}`);
        
        return {
            success: true,
            matchId: matchId,
            message: 'Match created'
        };
    }

    /**
     * Join an existing match
     * @param {string} matchId - Match ID
     * @param {Object} playerData - Player data
     * @returns {Object} Join result
     */
    joinMatch(matchId, playerData) {
        // In a real implementation, this would verify the match exists
        if (!this.currentMatch || this.currentMatch.id !== matchId) {
            return {
                success: false,
                message: 'Match not found'
            };
        }
        
        if (this.currentMatch.players.length >= 2) {
            return {
                success: false,
                message: 'Match is full'
            };
        }
        
        this.currentMatch.players.push({
            id: playerData.id,
            name: playerData.name,
            team: playerData.team || [],
            ready: false,
            score: 0
        });
        
        console.log(`[VersusManager] Player ${playerData.name} joined match ${matchId}`);
        
        return {
            success: true,
            message: 'Joined match'
        };
    }

    /**
     * Start the match
     * @returns {Object} Start result
     */
    startMatch() {
        if (!this.currentMatch) {
            return {
                success: false,
                message: 'No match created'
            };
        }
        
        if (this.currentMatch.players.length < 2) {
            return {
                success: false,
                message: 'Need 2 players to start'
            };
        }
        
        // Check if all players are ready
        const allReady = this.currentMatch.players.every(p => p.ready);
        if (!allReady) {
            return {
                success: false,
                message: 'Not all players are ready'
            };
        }
        
        this.currentMatch.state = 'playing';
        this.currentMatch.currentRound = 1;
        
        console.log(`[VersusManager] Match ${this.currentMatch.id} started!`);
        
        return {
            success: true,
            message: 'Match started'
        };
    }

    /**
     * End the match
     * @param {string} winnerId - Winner player ID
     * @returns {Object} End result
     */
    endMatch(winnerId = null) {
        if (!this.currentMatch) {
            return {
                success: false,
                message: 'No match in progress'
            };
        }
        
        this.currentMatch.state = 'finished';
        this.currentMatch.winner = winnerId;
        this.currentMatch.endedAt = Date.now();
        
        // Add to history
        this.matchHistory.push({ ...this.currentMatch });
        
        console.log(`[VersusManager] Match ${this.currentMatch.id} ended. Winner: ${winnerId}`);
        
        return {
            success: true,
            winner: winnerId,
            message: winnerId ? 'Player wins!' : 'Draw!'
        };
    }

    /**
     * Generate unique match ID
     * @returns {string} Match ID
     */
    generateMatchId() {
        return 'match_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get current match state
     * @returns {Object} Match state
     */
    getMatchState() {
        if (!this.currentMatch) {
            return null;
        }
        
        return {
            id: this.currentMatch.id,
            state: this.currentMatch.state,
            currentRound: this.currentMatch.currentRound,
            players: this.currentMatch.players.map(p => ({
                id: p.id,
                name: p.name,
                ready: p.ready,
                score: p.score
            })),
            settings: this.currentMatch.settings
        };
    }

    /**
     * Set player ready
     * @param {string} playerId - Player ID
     * @param {boolean} ready - Ready status
     */
    setPlayerReady(playerId, ready = true) {
        if (!this.currentMatch) return;
        
        const player = this.currentMatch.players.find(p => p.id === playerId);
        if (player) {
            player.ready = ready;
            console.log(`[VersusManager] Player ${player.name} ready: ${ready}`);
        }
    }

    /**
     * Set player team
     * @param {string} playerId - Player ID
     * @param {Array} team - Team array
     */
    setPlayerTeam(playerId, team) {
        if (!this.currentMatch) return;
        
        const player = this.currentMatch.players.find(p => p.id === playerId);
        if (player) {
            player.team = team;
            console.log(`[VersusManager] Player ${player.name} team set`);
        }
    }

    /**
     * Record round result
     * @param {string} winnerId - Winner player ID
     * @param {Object} roundData - Round data
     */
    recordRoundResult(winnerId, roundData = {}) {
        if (!this.currentMatch) return;
        
        this.currentMatch.rounds.push({
            round: this.currentMatch.currentRound,
            winner: winnerId,
            ...roundData
        });
        
        // Update scores
        if (winnerId) {
            const winner = this.currentMatch.players.find(p => p.id === winnerId);
            if (winner) {
                winner.score++;
            }
        }
        
        // Check if match is over
        const bestOf = this.currentMatch.settings.bestOf;
        const winningScore = Math.ceil(bestOf / 2);
        
        for (const player of this.currentMatch.players) {
            if (player.score >= winningScore) {
                this.endMatch(player.id);
                return;
            }
        }
        
        // Advance to next round
        this.currentMatch.currentRound++;
        
        if (this.currentMatch.currentRound > bestOf) {
            // Draw - no winner
            this.endMatch(null);
        }
    }

    /**
     * Get match history
     * @returns {Array} Match history
     */
    getMatchHistory() {
        return this.matchHistory;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VersusManager };
}
