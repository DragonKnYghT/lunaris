/**
 * syncManager.js
 * Manages state synchronization in Lunaris multiplayer
 */

// LUNARIS_TODO: add delta compression and conflict resolution later

/**
 * SyncManager class
 * Handles state synchronization between players
 */
class SyncManager {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        this.network = options.network || null;
        this.multiplayerState = options.multiplayerState || null;
        this.syncInterval = options.syncInterval || 1000; // ms
        this.lastSync = 0;
        this.pendingActions = [];
        this.actionHistory = [];
        this.maxHistorySize = options.maxHistorySize || 100;
        
        // Sync settings
        this.compressionEnabled = options.compressionEnabled || false;
        this.deltaSync = options.deltaSync || true;
        
        // Callbacks
        this.onStateUpdate = null;
        this.onActionProcessed = null;
        
        // Timer
        this.syncTimer = null;
    }

    /**
     * Set network instance
     * @param {Object} network - Network instance
     */
    setNetwork(network) {
        this.network = network;
    }

    /**
     * Set multiplayer state
     * @param {Object} state - Multiplayer state
     */
    setMultiplayerState(state) {
        this.multiplayerState = state;
    }

    /**
     * Start automatic sync
     */
    startSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        
        this.syncTimer = setInterval(() => {
            this.processSyncQueue();
        }, this.syncInterval);
        
        console.log('[SyncManager] Automatic sync started');
    }

    /**
     * Stop automatic sync
     */
    stopSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
        
        console.log('[SyncManager] Automatic sync stopped');
    }

    /**
     * Queue an action for sync
     * @param {Object} action - Action to queue
     */
    queueAction(action) {
        const syncedAction = {
            ...action,
            id: this.generateActionId(),
            timestamp: Date.now(),
            playerId: action.playerId || 'local'
        };
        
        this.pendingActions.push(syncedAction);
        this.actionHistory.push(syncedAction);
        
        // Trim history if needed
        if (this.actionHistory.length > this.maxHistorySize) {
            this.actionHistory = this.actionHistory.slice(-this.maxHistorySize);
        }
        
        console.log('[SyncManager] Action queued:', syncedAction.type);
        
        return syncedAction.id;
    }

    /**
     * Generate unique action ID
     * @returns {string} Action ID
     */
    generateActionId() {
        return 'action_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Process sync queue
     * @returns {Promise<void>}
     */
    async processSyncQueue() {
        if (!this.network || !this.multiplayerState) {
            return;
        }
        
        if (this.pendingActions.length === 0) {
            return;
        }
        
        // Get actions to sync
        const actions = [...this.pendingActions];
        this.pendingActions = [];
        
        // Send actions to server
        for (const action of actions) {
            try {
                await this.network.send({
                    type: 'sync_action',
                    action: action
                });
                
                if (this.onActionProcessed) {
                    this.onActionProcessed(action);
                }
            } catch (error) {
                console.error('[SyncManager] Failed to sync action:', error);
                // Re-queue failed action
                this.pendingActions.push(action);
            }
        }
        
        this.lastSync = Date.now();
    }

    /**
     * Broadcast current state to all players
     * @returns {Promise<void>}
     */
    async broadcastState() {
        if (!this.network || !this.multiplayerState) {
            return;
        }
        
        const state = this.prepareStateForSync();
        
        await this.network.broadcast({
            type: 'state_sync',
            state: state,
            timestamp: Date.now()
        });
        
        console.log('[SyncManager] State broadcasted');
    }

    /**
     * Prepare state for network transmission
     * @returns {Object} Prepared state
     */
    prepareStateForSync() {
        if (!this.multiplayerState) {
            return null;
        }
        
        // Basic state serialization
        const state = {
            gameState: this.multiplayerState.gameState,
            currentTurn: this.multiplayerState.currentTurn,
            turnPlayerId: this.multiplayerState.turnPlayerId,
            matchData: this.multiplayerState.matchData,
            timestamp: Date.now()
        };
        
        // Apply delta compression if enabled
        if (this.compressionEnabled) {
            return this.applyCompression(state);
        }
        
        return state;
    }

    /**
     * Apply compression (placeholder)
     * @param {Object} state - State to compress
     * @returns {Object} Compressed state
     */
    applyCompression(state) {
        // LUNARIS_TODO: Implement actual compression
        return state;
    }

    /**
     * Apply incoming state from network
     * @param {Object} state - State to apply
     */
    applyIncomingState(state) {
        if (!this.multiplayerState) {
            return;
        }
        
        console.log('[SyncManager] Applying incoming state');
        
        // Update local state
        if (state.gameState !== undefined) {
            this.multiplayerState.gameState = state.gameState;
        }
        if (state.currentTurn !== undefined) {
            this.multiplayerState.currentTurn = state.currentTurn;
        }
        if (state.turnPlayerId !== undefined) {
            this.multiplayerState.turnPlayerId = state.turnPlayerId;
        }
        if (state.matchData !== undefined) {
            this.multiplayerState.matchData = state.matchData;
        }
        
        // Notify callback
        if (this.onStateUpdate) {
            this.onStateUpdate(state);
        }
    }

    /**
     * Handle incoming action from network
     * @param {Object} action - Action to handle
     */
    handleIncomingAction(action) {
        console.log('[SyncManager] Handling incoming action:', action.type);
        
        // Apply action to local state
        switch (action.type) {
            case 'player_action':
                this.applyPlayerAction(action);
                break;
            case 'game_action':
                this.applyGameAction(action);
                break;
            case 'chat_message':
                this.handleChatMessage(action);
                break;
            default:
                console.log('[SyncManager] Unknown action type:', action.type);
        }
        
        // Confirm to sender
        if (this.network) {
            this.network.send({
                type: 'action_confirmed',
                actionId: action.id
            });
        }
    }

    /**
     * Apply player action
     * @param {Object} action - Player action
     */
    applyPlayerAction(action) {
        if (!this.multiplayerState) return;
        
        // Update player state based on action
        const player = this.multiplayerState.getPlayer(action.playerId);
        if (player) {
            player.update(action.data);
        }
    }

    /**
     * Apply game action
     * @param {Object} action - Game action
     */
    applyGameAction(action) {
        if (!this.multiplayerState) return;
        
        // Handle game-specific actions
        switch (action.actionType) {
            case 'attack':
                // LUNARIS_TODO: Apply attack to game state
                break;
            case 'switch':
                // LUNARIS_TODO: Apply switch to game state
                break;
            case 'use_item':
                // LUNARIS_TODO: Apply item use to game state
                break;
        }
    }

    /**
     * Handle chat message
     * @param {Object} action - Chat message
     */
    handleChatMessage(action) {
        console.log(`[Chat] ${action.playerName}: ${action.message}`);
    }

    /**
     * Request full state sync from server
     * @returns {Promise<Object>} Full state
     */
    async requestFullSync() {
        if (!this.network) {
            return null;
        }
        
        console.log('[SyncManager] Requesting full state sync');
        
        const response = await this.network.send({
            type: 'request_full_sync',
            timestamp: Date.now()
        });
        
        return response;
    }

    /**
     * Resolve conflicts (placeholder)
     * @param {Object} localState - Local state
     * @param {Object} remoteState - Remote state
     * @returns {Object} Resolved state
     */
    resolveConflicts(localState, remoteState) {
        // LUNARIS_TODO: Implement conflict resolution
        // For now, just use remote state
        return remoteState;
    }

    /**
     * Get sync statistics
     * @returns {Object} Sync stats
     */
    getSyncStats() {
        return {
            pendingActions: this.pendingActions.length,
            actionHistory: this.actionHistory.length,
            lastSync: this.lastSync,
            syncInterval: this.syncInterval,
            compressionEnabled: this.compressionEnabled,
            deltaSync: this.deltaSync
        };
    }

    /**
     * Clear sync history
     */
    clearHistory() {
        this.actionHistory = [];
        console.log('[SyncManager] Sync history cleared');
    }

    /**
     * Reset sync manager
     */
    reset() {
        this.stopSync();
        this.pendingActions = [];
        this.actionHistory = [];
        this.lastSync = 0;
        console.log('[SyncManager] Reset');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SyncManager };
}
