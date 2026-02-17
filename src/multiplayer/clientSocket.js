/**
 * clientSocket.js
 * WebSocket client implementation for Lunaris multiplayer
 * 
 * LUNARIS_TODO: add heartbeat system later
 */

/**
 * ClientSocket class
 * Handles WebSocket communication from the client side
 */
class ClientSocket {
    /**
     * @param {string} url - WebSocket server URL
     */
    constructor(url = 'ws://localhost:8080') {
        this.url = url;
        this.ws = null;
        this.isConnected = false;
        this.clientId = null;
        this.messageCallbacks = new Map();
        this.disconnectCallbacks = [];
        this.connectCallbacks = [];
        
        console.log('[ClientSocket] Instance created');
    }
    
    /**
     * Connect to WebSocket server
     */
    connect() {
        console.log(`[ClientSocket] Connecting to ${this.url}...`);
        
        try {
            this.ws = new WebSocket(this.url);
            
            this.ws.onopen = () => {
                console.log('[ClientSocket] Connected successfully');
                this.isConnected = true;
                
                // Trigger connect callbacks
                this.connectCallbacks.forEach(cb => cb());
            };
            
            this.ws.onmessage = (event) => {
                this.handleMessage(event.data);
            };
            
            this.ws.onerror = (error) => {
                console.error('[ClientSocket] WebSocket error:', error);
            };
            
            this.ws.onclose = (event) => {
                console.log('[ClientSocket] Disconnected:', event.code, event.reason);
                this.isConnected = false;
                
                // Trigger disconnect callbacks
                this.disconnectCallbacks.forEach(cb => cb(event));
            };
            
        } catch (error) {
            console.error('[ClientSocket] Failed to connect:', error);
        }
    }
    
    /**
     * Send message to server
     * @param {Object} message - Message to send
     */
    send(message) {
        if (!this.isConnected || !this.ws) {
            console.warn('[ClientSocket] Cannot send: not connected');
            return false;
        }
        
        try {
            const serialized = JSON.stringify(message);
            this.ws.send(serialized);
            console.log('[ClientSocket] Sent:', message.type);
            return true;
        } catch (error) {
            console.error('[ClientSocket] Failed to send message:', error);
            return false;
        }
    }
    
    /**
     * Handle incoming message
     * @param {string} data - Raw message data
     */
    handleMessage(data) {
        try {
            const message = JSON.parse(data);
            console.log('[ClientSocket] Received:', message.type);
            
            // Store client ID if welcome message
            if (message.type === 'WELCOME') {
                this.clientId = message.payload.clientId;
                console.log('[ClientSocket] Assigned client ID:', this.clientId);
            }
            
            // Trigger message callbacks
            const callbacks = this.messageCallbacks.get(message.type) || [];
            callbacks.forEach(cb => cb(message.payload));
            
            // Also trigger 'any' callbacks
            const anyCallbacks = this.messageCallbacks.get('*') || [];
            anyCallbacks.forEach(cb => cb(message));
            
        } catch (error) {
            console.error('[ClientSocket] Failed to parse message:', error);
        }
    }
    
    /**
     * Register message callback
     * @param {string} type - Message type to listen for
     * @param {Function} callback - Callback function
     */
    onMessage(type, callback) {
        if (!this.messageCallbacks.has(type)) {
            this.messageCallbacks.set(type, []);
        }
        this.messageCallbacks.get(type).push(callback);
    }
    
    /**
     * Register disconnect callback
     * @param {Function} callback - Callback function
     */
    onDisconnect(callback) {
        this.disconnectCallbacks.push(callback);
    }
    
    /**
     * Register connect callback
     * @param {Function} callback - Callback function
     */
    onConnect(callback) {
        this.connectCallbacks.push(callback);
    }
    
    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
    }
    
    /**
     * Get connection status
     * @returns {boolean} Connection status
     */
    getIsConnected() {
        return this.isConnected;
    }
    
    /**
     * Get client ID
     * @returns {string|null} Client ID
     */
    getClientId() {
        return this.clientId;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClientSocket };
}
