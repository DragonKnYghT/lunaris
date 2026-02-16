/**
 * versusController.js
 * Controller for managing versus/multiplayer matches
 */

// LUNARIS_TODO: add matchmaking later

/**
 * VersusController class
 * Manages versus mode and multiplayer matches
 */
class VersusController {
    constructor(gameData) {
        this.gameData = gameData;
        this.currentMatch = null;
        this.isHost = false;
        this.roomCode = null;
        
        console.log('[VersusController] Initialized');
    }

    /**
     * Create a new versus match
     * @param {string} ruleset - Ruleset to use
     * @returns {Object} Match data
     */
    createVersusMatch(ruleset = 'standard') {
        console.log('[VersusController] Creating versus match');
        
        // Generate room code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.roomCode = '';
        for (let i = 0; i < 6; i++) {
            this.roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        this.isHost = true;
        
        this.currentMatch = {
            roomCode: this.roomCode,
            ruleset: ruleset,
            players: [
                { id: 'player_1', name: 'You', isHost: true, isReady: true }
            ],
            status: 'waiting',
            maxPlayers: 2
        };
        
        console.log('[VersusController] Match created:', this.roomCode);
        
        return this.currentMatch;
    }

    /**
     * Join an existing match
     * @param {string} roomCode - Room code to join
     * @returns {Object} Match data
     */
    joinVersusMatch(roomCode) {
        console.log('[VersusController] Joining match:', roomCode);
        
        this.roomCode = roomCode;
        this.isHost = false;
        
        // Simulate joining
        this.currentMatch = {
            roomCode: roomCode,
            ruleset: 'standard',
            players: [
                { id: 'player_1', name: 'Host', isHost: true, isReady: true },
                { id: 'player_2', name: 'You', isHost: false, isReady: true }
            ],
            status: 'ready',
            maxPlayers: 2
        };
        
        console.log('[VersusController] Joined match:', roomCode);
        
        return this.currentMatch;
    }

    /**
     * Start the versus battle
     * @returns {Object} Battle data
     */
    startVersusBattle() {
        if (!this.currentMatch) {
            console.error('[VersusController] No active match');
            return null;
        }
        
        console.log('[VersusController] Starting versus battle');
        
        this.currentMatch.status = 'battle';
        
        // Create battle data
        const battleData = {
            match: this.currentMatch,
            ruleset: this.currentMatch.ruleset,
            players: this.currentMatch.players
        };
        
        console.log('[VersusController] Versus battle started');
        
        return battleData;
    }

    /**
     * End the versus battle
     * @param {string} winnerId - Winner player ID
     * @returns {Object} Match result
     */
    endVersusBattle(winnerId) {
        if (!this.currentMatch) {
            console.error('[VersusController] No active match');
            return null;
        }
        
        console.log('[VersusController] Versus battle ended');
        
        const winner = this.currentMatch.players.find(p => p.id === winnerId);
        
        const result = {
            match: this.currentMatch,
            winner: winner,
            rewards: {
                currency: 100,
                rating: 15
            }
        };
        
        this.currentMatch.status = 'finished';
        
        console.log('[VersusController] Winner:', winner ? winner.name : 'Unknown');
        
        return result;
    }

    /**
     * Leave the current match
     */
    leaveMatch() {
        console.log('[VersusController] Leaving match');
        
        this.currentMatch = null;
        this.roomCode = null;
        this.isHost = false;
    }

    /**
     * Get current match
     * @returns {Object} Current match
     */
    getCurrentMatch() {
        return this.currentMatch;
    }

    /**
     * Check if in a match
     * @returns {boolean} True if in match
     */
    isInMatch() {
        return this.currentMatch !== null;
    }

    /**
     * Check if is host
     * @returns {boolean} True if host
     */
    getIsHost() {
        return this.isHost;
    }

    /**
     * Get room code
     * @returns {string} Room code
     */
    getRoomCode() {
        return this.roomCode;
    }

    /**
     * Set player ready
     * @param {boolean} ready - Ready status
     */
    setReady(ready) {
        if (!this.currentMatch) return;
        
        const player = this.currentMatch.players.find(p => !p.isHost);
        if (player) {
            player.isReady = ready;
            console.log('[VersusController] Player ready:', ready);
        }
        
        // Check if all ready
        const allReady = this.currentMatch.players.every(p => p.isReady);
        if (allReady && this.currentMatch.players.length === this.currentMatch.maxPlayers) {
            this.currentMatch.status = 'ready';
            console.log('[VersusController] All players ready');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VersusController };
}
