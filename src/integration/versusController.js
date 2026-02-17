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
        this.multiplayerController = null;
        
        console.log('[VersusController] Initialized');
    }

    /**
     * Set the multiplayer controller
     * @param {MultiplayerController} controller - Multiplayer controller instance
     */
    setMultiplayerController(controller) {
        this.multiplayerController = controller;
    }

    /**
     * Create a new versus match (now joins queue via networking)
     * @param {string} ruleset - Ruleset to use
     * @returns {Object} Match data
     */
    createVersusMatch(ruleset = 'standard') {
        console.log('[VersusController] Creating versus match via networking');
        
        // If we have a multiplayer controller, join the queue
        if (this.multiplayerController) {
            this.multiplayerController.joinQueue();
            
            this.currentMatch = {
                ruleset: ruleset,
                status: 'searching',
                players: [
                    { id: 'player_1', name: 'You', isHost: true, isReady: true }
                ]
            };
            
            this.isHost = true;
            console.log('[VersusController] Joined matchmaking queue');
            
            return this.currentMatch;
        }
        
        // Fallback to local mode if no multiplayer controller
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
        
        console.log('[VersusController] Match created (offline):', this.roomCode);
        
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
        
        // If we have a multiplayer controller, leave queue and wait for match
        if (this.multiplayerController) {
            this.currentMatch = {
                roomCode: roomCode,
                ruleset: 'standard',
                status: 'found',
                players: [
                    { id: 'player_1', name: 'Host', isHost: true, isReady: true },
                    { id: 'player_2', name: 'You', isHost: false, isReady: true }
                ]
            };
            
            console.log('[VersusController] Joined match via networking:', roomCode);
            
            return this.currentMatch;
        }
        
        // Fallback to local mode
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
        
        console.log('[VersusController] Joined match (offline):', roomCode);
        
        return this.currentMatch;
    }

    /**
     * Start the versus battle (triggered by MATCH_START from server)
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
     * End the versus battle (triggered by MATCH_END from server)
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
        
        // If in queue, leave queue via multiplayer controller
        if (this.multiplayerController && this.currentMatch && this.currentMatch.status === 'searching') {
            this.multiplayerController.leaveQueue();
        }
        
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
