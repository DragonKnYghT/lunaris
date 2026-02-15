/**
 * networkPlaceholder.js
 * Placeholder networking layer for Lunaris multiplayer
 */

// LUNARIS_TODO: replace with WebSocket implementation later

/**
 * NetworkPlaceholder class
 * Simulates networking behavior without real network calls
 */
class NetworkPlaceholder {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        this.connected = false;
        this.connectionStatus = 'disconnected';
        this.latency = options.latency || 100; // Simulated latency in ms
        this.messageQueue = [];
        this.listeners = new Map();
        this.playerId = options.playerId || null;
        this.roomCode = null;
        
        // Simulated network events
        this.autoResponses = options.autoResponses || true;
    }

    /**
     * Connect to server (placeholder)
     * @param {string} serverUrl - Server URL (ignored)
     * @returns {Promise} Connection result
     */
    async connect(serverUrl = 'ws://localhost:8080') {
        console.log(`[Network] Connecting to ${serverUrl}...`);
        
        // Simulate connection delay
        await this.simulateDelay(500);
        
        this.connected = true;
        this.connectionStatus = 'connected';
        
        console.log('[Network] Connected successfully!');
        this.emit('connected', { playerId: this.playerId });
        
        return {
            success: true,
            message: 'Connected to server (simulated)'
        };
    }

    /**
     * Disconnect from server (placeholder)
     */
    disconnect() {
        if (!this.connected) {
            return;
        }
        
        console.log('[Network] Disconnecting...');
        
        this.connected = false;
        this.connectionStatus = 'disconnected';
        this.roomCode = null;
        
        console.log('[Network] Disconnected!');
        this.emit('disconnected', {});
    }

    /**
     * Send message to server (placeholder)
     * @param {Object} message - Message to send
     * @returns {Promise} Send result
     */
    async send(message) {
        if (!this.connected) {
            console.warn('[Network] Cannot send: not connected');
            return { success: false, message: 'Not connected' };
        }
        
        // Log the message
        console.log('[Network] Sending:', message.type, message);
        
        // Simulate network latency
        await this.simulateDelay(this.latency);
        
        // Queue for processing
        this.messageQueue.push(message);
        
        // Simulate auto-response for certain messages
        if (this.autoResponses) {
            this.handleAutoResponse(message);
        }
        
        return {
            success: true,
            message: 'Message sent (simulated)'
        };
    }

    /**
     * Broadcast message to all players (placeholder)
     * @param {Object} message - Message to broadcast
     */
    async broadcast(message) {
        if (!this.connected) {
            console.warn('[Network] Cannot broadcast: not connected');
            return;
        }
        
        console.log('[Network] Broadcasting:', message.type);
        
        // Simulate network latency
        await this.simulateDelay(this.latency);
        
        // In a real implementation, this would send to all players
        this.emit('broadcast', message);
    }

    /**
     * Receive message callback
     * @param {Function} callback - Callback function
     */
    receive(callback) {
        this.on('message', callback);
    }

    /**
     * Handle auto responses (placeholder logic)
     * @param {Object} message - Original message
     */
    handleAutoResponse(message) {
        // Simulate server responses
        switch (message.type) {
            case 'create_lobby':
                setTimeout(() => {
                    this.emit('message', {
                        type: 'lobby_created',
                        roomCode: message.roomCode || 'ABC123'
                    });
                }, this.latency);
                break;
                
            case 'join_lobby':
                setTimeout(() => {
                    this.emit('message', {
                        type: 'player_joined',
                        playerId: 'bot_player',
                        playerName: 'Bot Player'
                    });
                }, this.latency);
                break;
                
            case 'player_ready':
                setTimeout(() => {
                    this.emit('message', {
                        type: 'player_status',
                        playerId: message.playerId,
                        ready: message.ready
                    });
                }, this.latency);
                break;
                
            case 'game_action':
                setTimeout(() => {
                    this.emit('message', {
                        type: 'action_confirmed',
                        actionId: Date.now()
                    });
                }, this.latency);
                break;
        }
    }

    /**
     * Set up event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (!this.listeners.has(event)) return;
        
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Emit event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    emit(event, data) {
        if (!this.listeners.has(event)) return;
        
        for (const callback of this.listeners.get(event)) {
            try {
                callback(data);
            } catch (error) {
                console.error('[Network] Event callback error:', error);
            }
        }
    }

    /**
     * Simulate network delay
     * @param {number} ms - Milliseconds
     * @returns {Promise} Promise
     */
    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get connection status
     * @returns {string} Connection status
     */
    getStatus() {
        return this.connectionStatus;
    }

    /**
     * Get latency (simulated)
     * @returns {number} Latency in ms
     */
    getLatency() {
        return this.latency;
    }

    /**
     * Set latency (for testing)
     * @param {number} ms - Latency in ms
     */
    setLatency(ms) {
        this.latency = ms;
    }

    /**
     * Get queued messages
     * @returns {Array} Message queue
     */
    getQueuedMessages() {
        return [...this.messageQueue];
    }

    /**
     * Clear message queue
     */
    clearQueue() {
        this.messageQueue = [];
    }

    /**
     * Simulate network error
     * @param {string} errorType - Error type
     */
    simulateError(errorType) {
        console.error(`[Network] Simulated error: ${errorType}`);
        this.emit('error', { type: errorType });
    }

    /**
     * Simulate disconnect
     */
    simulateDisconnect() {
        this.disconnect();
        this.emit('disconnected', { reason: 'simulated' });
    }

    /**
     * Simulate reconnect
     */
    async simulateReconnect() {
        console.log('[Network] Simulating reconnection...');
        await this.simulateDelay(1000);
        this.connected = true;
        this.connectionStatus = 'connected';
        this.emit('reconnected', {});
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NetworkPlaceholder };
}
