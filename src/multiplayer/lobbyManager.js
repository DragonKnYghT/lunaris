/**
 * lobbyManager.js
 * Manages multiplayer lobbies in Lunaris
 */

// LUNARIS_TODO: integrate real networking later

/**
 * LobbyManager class
 * Handles multiplayer lobby creation and management
 */
class LobbyManager {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        this.multiplayerState = null;
        this.networkPlaceholder = options.networkPlaceholder || null;
        this.localPlayerId = options.localPlayerId || this.generatePlayerId();
    }

    /**
     * Generate a unique player ID
     * @returns {string} Player ID
     */
    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create a new lobby
     * @param {Object} settings - Lobby settings
     * @returns {Object} Result
     */
    createLobby(settings = {}) {
        const { MultiplayerState } = require('./multiplayerState.js');
        
        // Create new multiplayer state
        this.multiplayerState = new MultiplayerState({
            roomCode: settings.roomCode,
            gameMode: settings.gameMode || 'versus',
            localPlayerId: this.localPlayerId,
            maxPlayers: settings.maxPlayers || 4
        });
        
        // Apply additional settings
        if (settings.allowSpectators !== undefined) {
            this.multiplayerState.settings.allowSpectators = settings.allowSpectators;
        }
        if (settings.timerEnabled !== undefined) {
            this.multiplayerState.settings.timerEnabled = settings.timerEnabled;
        }
        if (settings.private !== undefined) {
            this.multiplayerState.settings.private = settings.private;
        }
        if (settings.password) {
            this.multiplayerState.settings.password = settings.password;
        }
        
        // Add local player as host
        const { Player } = require('./multiplayerState.js');
        const hostPlayer = new Player(this.localPlayerId, settings.hostName || 'Host', {
            isHost: true
        });
        hostPlayer.isHost = true;
        
        this.multiplayerState.addPlayer(hostPlayer);
        this.multiplayerState.setHost(this.localPlayerId);
        
        // Simulate network call
        if (this.networkPlaceholder) {
            this.networkPlaceholder.send({
                type: 'create_lobby',
                roomCode: this.multiplayerState.roomCode,
                settings: settings
            });
        }
        
        this.multiplayerState.log(`Created lobby with code: ${this.multiplayerState.roomCode}`);
        
        return {
            success: true,
            roomCode: this.multiplayerState.roomCode,
            roomId: this.multiplayerState.roomId,
            message: `Lobby created! Share code: ${this.multiplayerState.roomCode}`
        };
    }

    /**
     * Join an existing lobby
     * @param {string} roomCode - Room code to join
     * @param {string} playerName - Player name
     * @param {string} password - Optional password
     * @returns {Object} Result
     */
    async joinLobby(roomCode, playerName = 'Player', password = null) {
        // Simulate network delay
        await this.simulateNetworkDelay();
        
        // In a real implementation, this would verify the room code with a server
        // For now, we'll create a state as if we joined
        
        const { MultiplayerState, Player } = require('./multiplayerState.js');
        
        this.multiplayerState = new MultiplayerState({
            roomCode: roomCode,
            gameMode: 'versus',
            localPlayerId: this.localPlayerId
        });
        
        // Add local player
        const player = new Player(this.localPlayerId, playerName);
        this.multiplayerState.addPlayer(player);
        
        // Add some placeholder players
        const bot1 = new Player('bot_1', 'Bot_Alpha');
        const bot2 = new Player('bot_2', 'Bot_Beta');
        this.multiplayerState.addPlayer(bot1);
        this.multiplayerState.addPlayer(bot2);
        
        // Set first real player as host (simulated)
        this.multiplayerState.setHost(this.localPlayerId);
        
        this.multiplayerState.updateConnectionStatus('connected');
        
        if (this.networkPlaceholder) {
            this.networkPlaceholder.send({
                type: 'join_lobby',
                roomCode: roomCode,
                playerId: this.localPlayerId
            });
        }
        
        this.multiplayerState.log(`Joined lobby: ${roomCode}`);
        
        return {
            success: true,
            roomCode: roomCode,
            message: 'Joined lobby successfully!'
        };
    }

    /**
     * Leave current lobby
     * @returns {Object} Result
     */
    leaveLobby() {
        if (!this.multiplayerState) {
            return { success: false, message: 'Not in a lobby' };
        }
        
        if (this.networkPlaceholder) {
            this.networkPlaceholder.send({
                type: 'leave_lobby',
                roomCode: this.multiplayerState.roomCode,
                playerId: this.localPlayerId
            });
        }
        
        this.multiplayerState.log('Left the lobby');
        
        const roomCode = this.multiplayerState.roomCode;
        this.multiplayerState = null;
        
        return {
            success: true,
            message: `Left lobby: ${roomCode}`
        };
    }

    /**
     * List all players in the lobby
     * @returns {Array} Array of player info
     */
    listPlayers() {
        if (!this.multiplayerState) {
            return [];
        }
        
        return this.multiplayerState.getAllPlayers().map(p => ({
            id: p.id,
            name: p.name,
            isHost: p.isHost,
            isReady: p.isReady,
            isLocal: p.id === this.localPlayerId
        }));
    }

    /**
     * Set host player
     * @param {string} playerId - Player ID
     * @returns {Object} Result
     */
    setHost(playerId) {
        if (!this.multiplayerState) {
            return { success: false, message: 'Not in a lobby' };
        }
        
        // Only current host can change host
        const currentHost = this.multiplayerState.getPlayer(this.multiplayerState.hostPlayerId);
        if (currentHost && !currentHost.isHost && currentHost.id !== this.localPlayerId) {
            return { success: false, message: 'Only the host can change host' };
        }
        
        this.multiplayerState.setHost(playerId);
        
        if (this.networkPlaceholder) {
            this.networkPlaceholder.broadcast({
                type: 'host_changed',
                newHost: playerId
            });
        }
        
        return {
            success: true,
            message: 'Host updated'
        };
    }

    /**
     * Update lobby settings
     * @param {Object} settings - New settings
     * @returns {Object} Result
     */
    updateLobbySettings(settings) {
        if (!this.multiplayerState) {
            return { success: false, message: 'Not in a lobby' };
        }
        
        // Only host can change settings
        const host = this.multiplayerState.getPlayer(this.multiplayerState.hostPlayerId);
        if (host && !host.isHost && host.id !== this.localPlayerId) {
            return { success: false, message: 'Only the host can change settings' };
        }
        
        // Apply settings
        if (settings.gameMode !== undefined) {
            this.multiplayerState.gameMode = settings.gameMode;
        }
        if (settings.maxPlayers !== undefined) {
            this.multiplayerState.settings.maxPlayers = settings.maxPlayers;
        }
        if (settings.allowSpectators !== undefined) {
            this.multiplayerState.settings.allowSpectators = settings.allowSpectators;
        }
        if (settings.timerEnabled !== undefined) {
            this.multiplayerState.settings.timerEnabled = settings.timerEnabled;
        }
        
        this.multiplayerState.log('Lobby settings updated');
        
        if (this.networkPlaceholder) {
            this.networkPlaceholder.broadcast({
                type: 'settings_updated',
                settings: settings
            });
        }
        
        return {
            success: true,
            message: 'Settings updated'
        };
    }

    /**
     * Set player ready status
     * @param {boolean} ready - Ready status
     * @returns {Object} Result
     */
    setReady(ready = true) {
        if (!this.multiplayerState) {
            return { success: false, message: 'Not in a lobby' };
        }
        
        const player = this.multiplayerState.getPlayer(this.localPlayerId);
        if (!player) {
            return { success: false, message: 'Player not found' };
        }
        
        player.isReady = ready;
        this.multiplayerState.log(`Player ${ready ? 'ready' : 'not ready'}`);
        
        if (this.networkPlaceholder) {
            this.networkPlaceholder.broadcast({
                type: 'player_ready',
                playerId: this.localPlayerId,
                ready: ready
            });
        }
        
        return {
            success: true,
            message: ready ? 'Ready!' : 'Not ready'
        };
    }

    /**
     * Start the game (host only)
     * @returns {Object} Result
     */
    startGame() {
        if (!this.multiplayerState) {
            return { success: false, message: 'Not in a lobby' };
        }
        
        // Only host can start
        const host = this.multiplayerState.getPlayer(this.multiplayerState.hostPlayerId);
        if (host && !host.isHost && host.id !== this.localPlayerId) {
            return { success: false, message: 'Only the host can start the game' };
        }
        
        // Check if all players are ready
        if (!this.multiplayerState.areAllPlayersReady()) {
            return { success: false, message: 'Not all players are ready' };
        }
        
        this.multiplayerState.gameState = 'playing';
        this.multiplayerState.startedAt = Date.now();
        this.multiplayerState.log('Game started!');
        
        if (this.networkPlaceholder) {
            this.networkPlaceholder.broadcast({
                type: 'game_start',
                timestamp: this.multiplayerState.startedAt
            });
        }
        
        return {
            success: true,
            message: 'Game starting!'
        };
    }

    /**
     * Get current lobby state
     * @returns {Object} Lobby state
     */
    getLobbyState() {
        if (!this.multiplayerState) {
            return null;
        }
        
        return this.multiplayerState.serialize();
    }

    /**
     * Get room info
     * @returns {Object} Room info
     */
    getRoomInfo() {
        if (!this.multiplayerState) {
            return null;
        }
        
        return this.multiplayerState.getRoomInfo();
    }

    /**
     * Simulate network delay
     * @param {number} ms - Milliseconds
     * @returns {Promise} Promise
     */
    simulateNetworkDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LobbyManager };
}
