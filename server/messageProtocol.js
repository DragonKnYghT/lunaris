/**
 * messageProtocol.js
 * Defines the Lunaris network protocol for WebSocket communication
 * 
 * LUNARIS_TODO: add encryption later
 */

// Message types for Lunaris network protocol
const MessageType = {
    // Connection
    HELLO: 'HELLO',
    WELCOME: 'WELCOME',
    
    // Queue/Matchmaking
    QUEUE_JOIN: 'QUEUE_JOIN',
    QUEUE_LEAVE: 'QUEUE_LEAVE',
    QUEUE_STATUS: 'QUEUE_STATUS',
    
    // Match
    MATCH_FOUND: 'MATCH_FOUND',
    MATCH_START: 'MATCH_START',
    MATCH_END: 'MATCH_END',
    
    // Gameplay
    PLAYER_ACTION: 'PLAYER_ACTION',
    TURN_RESULT: 'TURN_RESULT',
    SYNC_STATE: 'SYNC_STATE',
    
    // Heartbeat
    PING: 'PING',
    PONG: 'PONG',
    
    // Error/Disconnect
    ERROR: 'ERROR',
    DISCONNECT: 'DISCONNECT'
};

/**
 * Create a protocol message
 * @param {string} type - Message type
 * @param {Object} payload - Message payload
 * @returns {Object} Protocol message
 */
function createMessage(type, payload = {}) {
    return {
        type: type,
        payload: payload,
        timestamp: Date.now()
    };
}

/**
 * Parse incoming message
 * @param {string} data - Raw message data
 * @returns {Object|null} Parsed message or null if invalid
 */
function parseMessage(data) {
    try {
        const message = JSON.parse(data);
        
        // Validate message structure
        if (!message.type || !message.payload) {
            console.warn('[MessageProtocol] Invalid message structure');
            return null;
        }
        
        return message;
    } catch (error) {
        console.error('[MessageProtocol] Failed to parse message:', error);
        return null;
    }
}

/**
 * Serialize message for sending
 * @param {Object} message - Message object
 * @returns {string} JSON string
 */
function serializeMessage(message) {
    return JSON.stringify(message);
}

// Connection messages
const Messages = {
    // Send hello to server
    hello: (clientId, playerName) => {
        return createMessage(MessageType.HELLO, {
            clientId: clientId,
            playerName: playerName
        });
    },
    
    // Server welcomes client
    welcome: (clientId, serverInfo) => {
        return createMessage(MessageType.WELCOME, {
            clientId: clientId,
            serverInfo: serverInfo
        });
    },
    
    // Join matchmaking queue
    joinQueue: (queueType = 'versus') => {
        return createMessage(MessageType.QUEUE_JOIN, {
            queueType: queueType
        });
    },
    
    // Leave matchmaking queue
    leaveQueue: () => {
        return createMessage(MessageType.QUEUE_LEAVE, {});
    },
    
    // Queue status update
    queueStatus: (position, estimatedWait) => {
        return createMessage(MessageType.QUEUE_STATUS, {
            position: position,
            estimatedWait: estimatedWait
        });
    },
    
    // Match found notification
    matchFound: (matchId, opponent) => {
        return createMessage(MessageType.MATCH_FOUND, {
            matchId: matchId,
            opponent: opponent
        });
    },
    
    // Match start notification
    matchStart: (matchId, ruleset, teams) => {
        return createMessage(MessageType.MATCH_START, {
            matchId: matchId,
            ruleset: ruleset,
            teams: teams
        });
    },
    
    // Match end notification
    matchEnd: (matchId, result, rewards) => {
        return createMessage(MessageType.MATCH_END, {
            matchId: matchId,
            result: result,
            rewards: rewards
        });
    },
    
    // Player action (move, item, switch)
    playerAction: (matchId, action) => {
        return createMessage(MessageType.PLAYER_ACTION, {
            matchId: matchId,
            action: action
        });
    },
    
    // Turn result from server
    turnResult: (matchId, turn, results) => {
        return createMessage(MessageType.TURN_RESULT, {
            matchId: matchId,
            turn: turn,
            results: results
        });
    },
    
    // Sync game state
    syncState: (matchId, state) => {
        return createMessage(MessageType.SYNC_STATE, {
            matchId: matchId,
            state: state
        });
    },
    
    // Ping for heartbeat
    ping: () => {
        return createMessage(MessageType.PING, {
            timestamp: Date.now()
        });
    },
    
    // Pong response
    pong: (originalTimestamp) => {
        return createMessage(MessageType.PONG, {
            originalTimestamp: originalTimestamp,
            serverTimestamp: Date.now()
        });
    },
    
    // Error message
    error: (code, message) => {
        return createMessage(MessageType.ERROR, {
            code: code,
            message: message
        });
    },
    
    // Disconnect notification
    disconnect: (reason) => {
        return createMessage(MessageType.DISCONNECT, {
            reason: reason
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MessageType,
        Messages,
        createMessage,
        parseMessage,
        serializeMessage
    };
}
