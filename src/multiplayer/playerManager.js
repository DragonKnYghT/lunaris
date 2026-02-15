/**
 * playerManager.js
 * Manages players in multiplayer sessions
 */

// LUNARIS_TODO: sync player data with server later

/**
 * PlayerManager class
 * Handles player management in multiplayer
 */
class PlayerManager {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        this.localPlayerId = options.localPlayerId || null;
        this.players = new Map();
        this.playerData = new Map();
    }

    /**
     * Add a player
     * @param {string} playerId - Unique player ID
     * @param {Object} playerData - Player data
     * @returns {Object} Player
     */
    addPlayer(playerId, playerData = {}) {
        const player = {
            id: playerId,
            name: playerData.name || 'Unknown',
            status: playerData.status || 'connected',
            isHost: playerData.isHost || false,
            isReady: playerData.isReady || false,
            isLocal: playerId === this.localPlayerId,
            team: playerData.team || [],
            stats: playerData.stats || {
                wins: 0,
                losses: 0,
                creaturesCaught: 0
            },
            lastUpdate: Date.now()
        };
        
        this.players.set(playerId, player);
        this.playerData.set(playerId, { ...playerData });
        
        console.log(`[PlayerManager] Added player: ${player.name} (${playerId})`);
        
        return player;
    }

    /**
     * Remove a player
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (!player) {
            return false;
        }
        
        this.players.delete(playerId);
        this.playerData.delete(playerId);
        
        console.log(`[PlayerManager] Removed player: ${playerId}`);
        
        return true;
    }

    /**
     * Update player status
     * @param {string} playerId - Player ID
     * @param {string} status - New status
     * @returns {boolean} Success
     */
    updatePlayerStatus(playerId, status) {
        const player = this.players.get(playerId);
        if (!player) {
            return false;
        }
        
        player.status = status;
        player.lastUpdate = Date.now();
        
        console.log(`[PlayerManager] Player ${player.name} status: ${status}`);
        
        return true;
    }

    /**
     * Update player ready status
     * @param {string} playerId - Player ID
     * @param {boolean} ready - Ready status
     * @returns {boolean} Success
     */
    updatePlayerReady(playerId, ready) {
        const player = this.players.get(playerId);
        if (!player) {
            return false;
        }
        
        player.isReady = ready;
        player.lastUpdate = Date.now();
        
        console.log(`[PlayerManager] Player ${player.name} ready: ${ready}`);
        
        return true;
    }

    /**
     * Update player team
     * @param {string} playerId - Player ID
     * @param {Array} team - New team
     * @returns {boolean} Success
     */
    updatePlayerTeam(playerId, team) {
        const player = this.players.get(playerId);
        if (!player) {
            return false;
        }
        
        player.team = team;
        player.lastUpdate = Date.now();
        
        return true;
    }

    /**
     * Get player
     * @param {string} playerId - Player ID
     * @returns {Object|null} Player
     */
    getPlayer(playerId) {
        return this.players.get(playerId) || null;
    }

    /**
     * Get all players
     * @returns {Array} Array of players
     */
    getAllPlayers() {
        return Array.from(this.players.values());
    }

    /**
     * Get local player
     * @returns {Object|null} Local player
     */
    getLocalPlayer() {
        if (!this.localPlayerId) {
            return null;
        }
        return this.players.get(this.localPlayerId) || null;
    }

    /**
     * Get player count
     * @returns {number} Player count
     */
    getPlayerCount() {
        return this.players.size;
    }

    /**
     * Get players by status
     * @param {string} status - Status to filter
     * @returns {Array} Filtered players
     */
    getPlayersByStatus(status) {
        return Array.from(this.players.values()).filter(p => p.status === status);
    }

    /**
     * Get ready players
     * @returns {Array} Ready players
     */
    getReadyPlayers() {
        return Array.from(this.players.values()).filter(p => p.isReady);
    }

    /**
     * Check if all players are ready
     * @returns {boolean} All ready
     */
    areAllReady() {
        if (this.players.size === 0) return false;
        
        for (const player of this.players.values()) {
            if (!player.isReady) return false;
        }
        return true;
    }

    /**
     * Update player stats
     * @param {string} playerId - Player ID
     * @param {string} stat - Stat to update ('wins', 'losses', 'creaturesCaught')
     * @param {number} amount - Amount to add
     * @returns {boolean} Success
     */
    updatePlayerStats(playerId, stat, amount = 1) {
        const player = this.players.get(playerId);
        if (!player) {
            return false;
        }
        
        if (player.stats[stat] !== undefined) {
            player.stats[stat] += amount;
        }
        
        return true;
    }

    /**
     * Increment wins for player
     * @param {string} playerId - Player ID
     */
    addWin(playerId) {
        this.updatePlayerStats(playerId, 'wins', 1);
    }

    /**
     * Increment losses for player
     * @param {string} playerId - Player ID
     */
    addLoss(playerId) {
        this.updatePlayerStats(playerId, 'losses', 1);
    }

    /**
     * Increment creatures caught for player
     * @param {string} playerId - Player ID
     * @param {number} amount - Amount
     */
    addCreaturesCaught(playerId, amount = 1) {
        this.updatePlayerStats(playerId, 'creaturesCaught', amount);
    }

    /**
     * Get player leaderboard
     * @param {string} sortBy - Stat to sort by ('wins', 'losses', 'creaturesCaught')
     * @returns {Array} Sorted players
     */
    getLeaderboard(sortBy = 'wins') {
        return Array.from(this.players.values())
            .sort((a, b) => (b.stats[sortBy] || 0) - (a.stats[sortBy] || 0));
    }

    /**
     * Sync player data from server
     * @param {Array} playersData - Array of player data from server
     */
    syncFromServer(playersData) {
        // Clear existing
        this.players.clear();
        
        // Add players from server data
        for (const data of playersData) {
            this.addPlayer(data.id, data);
        }
        
        console.log(`[PlayerManager] Synced ${playersData.length} players from server`);
    }

    /**
     * Prepare player data for server
     * @returns {Array} Player data
     */
    prepareForServer() {
        return Array.from(this.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            status: p.status,
            isHost: p.isHost,
            isReady: p.isReady,
            team: p.team,
            stats: p.stats
        }));
    }

    /**
     * Reset all players
     */
    reset() {
        this.players.clear();
        this.playerData.clear();
        console.log('[PlayerManager] Reset all players');
    }

    /**
     * Set local player ID
     * @param {string} playerId - Player ID
     */
    setLocalPlayer(playerId) {
        this.localPlayerId = playerId;
        
        // Update isLocal flag
        const player = this.players.get(playerId);
        if (player) {
            player.isLocal = true;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PlayerManager };
}
