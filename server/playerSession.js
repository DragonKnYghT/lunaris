/**
 * playerSession.js
 * Handles individual player sessions on the server
 * 
 * LUNARIS_TODO: add reconnection support later
 */

const { Messages, createMessage, serializeMessage } = require('./messageProtocol.js');

/**
 * PlayerSession class
 * Manages a single player's connection and state
 */
class PlayerSession {
    /**
     * @param {WebSocket} ws - WebSocket connection
     * @param {string} clientId - Unique client identifier
     */
    constructor(ws, clientId) {
        this.ws = ws;
        this.clientId = clientId;
        this.playerName = null;
        this.currentMatch = null;
        this.lastPing = Date.now();
        this.pingInterval = null;
        this.isConnected = true;
        
        // Set up ping interval
        this.startPingInterval();
        
        console.log(`[PlayerSession] New session created: ${this.clientId}`);
    }
    
    /**
     * Send a message to this player
     * @param {Object} message - Message to send
     */
    send(message) {
        if (!this.isConnected || !this.ws) {
            console.warn(`[PlayerSession] Cannot send to disconnected client: ${this.clientId}`);
            return false;
        }
        
        try {
            const serialized = serializeMessage(message);
            this.ws.send(serialized);
            return true;
        } catch (error) {
            console.error(`[PlayerSession] Failed to send message:`, error);
            return false;
        }
    }
    
    /**
     * Receive a message from this player
     * @param {Object} message - Received message
     */
    receive(message) {
        console.log(`[PlayerSession] Received from ${this.clientId}:`, message.type);
        
        // Update last ping timestamp
        if (message.type === 'PONG') {
            this.lastPing = Date.now();
        }
        
        // Store player name if hello message
        if (message.type === 'HELLO' && message.payload.playerName) {
            this.playerName = message.payload.playerName;
            console.log(`[PlayerSession] Player ${this.clientId} identified as: ${this.playerName}`);
        }
    }
    
    /**
     * Handle disconnection
     */
    disconnect() {
        console.log(`[PlayerSession] Disconnecting client: ${this.clientId}`);
        
        this.isConnected = false;
        this.currentMatch = null;
        
        // Clear ping interval
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        
        // Close WebSocket
        if (this.ws) {
            try {
                this.ws.close();
            } catch (error) {
                console.error(`[PlayerSession] Error closing WebSocket:`, error);
            }
            this.ws = null;
        }
    }
    
    /**
     * Set the current match for this player
     * @param {Object|null} match - Match object
     */
    setCurrentMatch(match) {
        this.currentMatch = match;
    }
    
    /**
     * Get the current match
     * @returns {Object|null} Current match
     */
    getCurrentMatch() {
        return this.currentMatch;
    }
    
    /**
     * Get client ID
     * @returns {string} Client ID
     */
    getClientId() {
        return this.clientId;
    }
    
    /**
     * Get player name
     * @returns {string|null} Player name
     */
    getPlayerName() {
        return this.playerName;
    }
    
    /**
     * Check if player is connected
     * @returns {boolean} Connection status
     */
    isPlayerConnected() {
        return this.isConnected;
    }
    
    /**
     * Get latency (based on last ping)
     * @returns {number} Latency in ms
     */
    getLatency() {
        return Date.now() - this.lastPing;
    }
    
    /**
     * Start ping interval for heartbeat
     */
    startPingInterval() {
        this.pingInterval = setInterval(() => {
            if (!this.isConnected) {
                if (this.pingInterval) {
                    clearInterval(this.pingInterval);
                }
                return;
            }
            
            // Send ping
            this.send(Messages.ping());
            
            // Check for timeout (30 seconds)
            if (Date.now() - this.lastPing > 30000) {
                console.log(`[PlayerSession] Client ${this.clientId} timed out`);
                this.disconnect();
            }
        }, 10000); // Ping every 10 seconds
    }
    
    /**
     * Send welcome message
     * @param {Object} serverInfo - Server information
     */
    sendWelcome(serverInfo) {
        this.send(Messages.welcome(this.clientId, serverInfo));
    }
    
    /**
     * Send error message
     * @param {string} code - Error code
     * @param {string} message - Error message
     */
    sendError(code, message) {
        this.send(Messages.error(code, message));
    }
    
    /**
     * Send disconnect notification
     * @param {string} reason - Disconnect reason
     */
    sendDisconnect(reason) {
        this.send(Messages.disconnect(reason));
    }
}

/**
 * Generate a unique client ID
 * @returns {string} Unique ID
 */
function generateClientId() {
    return 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PlayerSession,
        generateClientId
    };
}
