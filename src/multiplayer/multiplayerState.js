/**
 * multiplayerState.js
 * Manages the state of multiplayer sessions in Lunaris
 */

// LUNARIS_TODO: expand multiplayer state later

/**
 * Player data structure
 */
class Player {
    /**
     * @param {string} id - Unique player ID
     * @param {string} name - Player display name
     * @param {Object} data - Additional player data
     */
    constructor(id, name, data = {}) {
        this.id = id;
        this.name = name;
        this.status = 'connected'; // connected, disconnected, ready, not_ready
        this.isHost = false;
        this.isReady = false;
        this.team = data.team || [];
        this.creature = data.creature || null;
        this.stats = data.stats || {
            wins: 0,
            losses: 0,
            creaturesCaught: 0
        };
        this.lastUpdate = Date.now();
    }

    /**
     * Update player data
     * @param {Object} data - Data to update
     */
    update(data) {
        if (data.name) this.name = data.name;
        if (data.status) this.status = data.status;
        if (data.isReady !== undefined) this.isReady = data.isReady;
        if (data.team) this.team = data.team;
        if (data.creature) this.creature = data.creature;
        if (data.stats) this.stats = { ...this.stats, ...data.stats };
        this.lastUpdate = Date.now();
    }
}

/**
 * MultiplayerState class
 * Stores all information about a multiplayer session
 */
class MultiplayerState {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        // Room identification
        this.roomCode = options.roomCode || this.generateRoomCode();
        this.roomId = options.roomId || this.generateRoomId();
        
        // Game mode
        this.gameMode = options.gameMode || 'versus'; // versus, co_op, tournament
        
        // Players
        this.players = new Map();
        this.hostPlayerId = null;
        this.localPlayerId = options.localPlayerId || null;
        
        // Connection status (placeholder)
        this.connectionStatus = 'disconnected'; // disconnected, connecting, connected, error
        this.lastPing = 0;
        this.latency = 0;
        
        // Sync queue (placeholder)
        this.syncQueue = [];
        this.pendingActions = [];
        
        // Game state
        this.gameState = 'lobby'; // lobby, ready, playing, finished
        this.currentTurn = 0;
        this.turnPlayerId = null;
        
        // Match state
        this.matchData = {
            round: 0,
            bestOf: 3,
            currentMatch: 0,
            playerWins: {},
            draws: 0
        };
        
        // Settings
        this.settings = {
            allowSpectators: true,
            maxPlayers: options.maxPlayers || 4,
            timerEnabled: false,
            timerSeconds: 300,
            private: false,
            password: null
        };
        
        // Logs
        this.logs = [];
        
        // Timestamps
        this.createdAt = Date.now();
        this.startedAt = null;
    }

    /**
     * Generate a random room code
     * @returns {string} Room code
     */
    generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /**
     * Generate a unique room ID
     * @returns {string} Room ID
     */
    generateRoomId() {
        return 'room_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Add a player to the room
     * @param {Player} player - Player to add
     * @returns {boolean} Success
     */
    addPlayer(player) {
        if (this.players.size >= this.settings.maxPlayers) {
            return false;
        }
        
        this.players.set(player.id, player);
        this.log(`${player.name} joined the room.`);
        return true;
    }

    /**
     * Remove a player from the room
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (!player) return false;
        
        this.players.delete(playerId);
        this.log(`${player.name} left the room.`);
        
        // If host left, assign new host
        if (playerId === this.hostPlayerId) {
            const remaining = Array.from(this.players.keys());
            if (remaining.length > 0) {
                this.hostPlayerId = remaining[0];
                const newHost = this.players.get(this.hostPlayerId);
                if (newHost) newHost.isHost = true;
                this.log(`${newHost.name} is now the host.`);
            }
        }
        
        return true;
    }

    /**
     * Get player by ID
     * @param {string} playerId - Player ID
     * @returns {Player|null} Player
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
     * Set host player
     * @param {string} playerId - Player ID
     */
    setHost(playerId) {
        // Remove host from current host
        if (this.hostPlayerId) {
            const currentHost = this.players.get(this.hostPlayerId);
            if (currentHost) currentHost.isHost = false;
        }
        
        // Set new host
        this.hostPlayerId = playerId;
        const newHost = this.players.get(playerId);
        if (newHost) {
            newHost.isHost = true;
            this.log(`${newHost.name} is now the host.`);
        }
    }

    /**
     * Check if all players are ready
     * @returns {boolean} All ready
     */
    areAllPlayersReady() {
        if (this.players.size < 2) return false;
        
        for (const player of this.players.values()) {
            if (!player.isReady) return false;
        }
        return true;
    }

    /**
     * Add action to sync queue
     * @param {Object} action - Action to sync
     */
    queueSyncAction(action) {
        this.syncQueue.push({
            ...action,
            timestamp: Date.now(),
            playerId: this.localPlayerId
        });
    }

    /**
     * Process sync queue
     */
    processSyncQueue() {
        const actions = [...this.syncQueue];
        this.syncQueue = [];
        return actions;
    }

    /**
     * Update connection status
     * @param {string} status - New status
     */
    updateConnectionStatus(status) {
        this.connectionStatus = status;
        this.log(`Connection status: ${status}`);
    }

    /**
     * Add message to log
     * @param {string} message - Message
     */
    log(message) {
        const entry = {
            timestamp: Date.now(),
            message: message
        };
        this.logs.push(entry);
        console.log(`[Multiplayer] ${message}`);
    }

    /**
     * Get room info
     * @returns {Object} Room info
     */
    getRoomInfo() {
        return {
            roomCode: this.roomCode,
            roomId: this.roomId,
            gameMode: this.gameMode,
            players: this.players.size,
            maxPlayers: this.settings.maxPlayers,
            host: this.hostPlayerId,
            status: this.gameState,
            connectionStatus: this.connectionStatus
        };
    }

    /**
     * Serialize state for network transmission
     * @returns {Object} Serialized state
     */
    serialize() {
        return {
            roomCode: this.roomCode,
            gameMode: this.gameMode,
            gameState: this.gameState,
            players: Array.from(this.players.entries()).map(([id, p]) => ({
                id: id,
                name: p.name,
                status: p.status,
                isHost: p.isHost,
                isReady: p.isReady
            })),
            currentTurn: this.currentTurn,
            turnPlayerId: this.turnPlayerId,
            matchData: this.matchData
        };
    }

    /**
     * Reset for new game
     */
    resetForNewGame() {
        this.gameState = 'lobby';
        this.currentTurn = 0;
        this.turnPlayerId = null;
        this.matchData = {
            round: 0,
            bestOf: 3,
            currentMatch: 0,
            playerWins: {},
            draws: 0
        };
        
        // Reset player ready states
        for (const player of this.players.values()) {
            player.isReady = false;
        }
        
        this.log('Room reset for new game.');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiplayerState, Player };
}
