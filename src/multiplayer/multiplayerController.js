/**
 * multiplayerController.js
 * Controller for multiplayer functionality on the client side
 */

// Import or define the message types (matching server protocol)
const MultiplayerMessageType = {
    HELLO: 'HELLO',
    WELCOME: 'WELCOME',
    QUEUE_JOIN: 'QUEUE_JOIN',
    QUEUE_LEAVE: 'QUEUE_LEAVE',
    QUEUE_STATUS: 'QUEUE_STATUS',
    MATCH_FOUND: 'MATCH_FOUND',
    MATCH_START: 'MATCH_START',
    MATCH_END: 'MATCH_END',
    PLAYER_ACTION: 'PLAYER_ACTION',
    TURN_RESULT: 'TURN_RESULT',
    SYNC_STATE: 'SYNC_STATE',
    PING: 'PING',
    PONG: 'PONG',
    ERROR: 'ERROR',
    DISCONNECT: 'DISCONNECT'
};

/**
 * MultiplayerController class
 * Manages multiplayer gameplay on the client side
 */
class MultiplayerController {
    /**
     * @param {Object} gameData - Game data
     */
    constructor(gameData) {
        this.gameData = gameData;
        this.socket = null;
        this.versusController = null;
        this.battleController = null;
        this.isInQueue = false;
        this.currentMatch = null;
        this.playerName = 'Player';
        
        console.log('[MultiplayerController] Initialized');
    }
    
    /**
     * Initialize the multiplayer controller
     * @param {string} serverUrl - WebSocket server URL
     */
    init(serverUrl = 'ws://localhost:8080') {
        // Create socket connection
        this.socket = new ClientSocket(serverUrl);
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Connect to server
        this.socket.connect();
        
        console.log('[MultiplayerController] Socket initialized');
    }
    
    /**
     * Set up socket event handlers
     */
    setupEventHandlers() {
        if (!this.socket) return;
        
        // Connection events
        this.socket.onConnect(() => {
            console.log('[MultiplayerController] Connected to server');
            // Send hello
            this.sendHello();
        });
        
        this.socket.onDisconnect((event) => {
            console.log('[MultiplayerController] Disconnected from server');
            this.isInQueue = false;
            this.currentMatch = null;
        });
        
        // Game events
        this.socket.onMessage(MultiplayerMessageType.WELCOME, (payload) => {
            console.log('[MultiplayerController] Welcome received:', payload);
        });
        
        this.socket.onMessage(MultiplayerMessageType.QUEUE_STATUS, (payload) => {
            console.log('[MultiplayerController] Queue status:', payload);
        });
        
        this.socket.onMessage(MultiplayerMessageType.MATCH_FOUND, (payload) => {
            this.handleMatchFound(payload);
        });
        
        this.socket.onMessage(MultiplayerMessageType.MATCH_START, (payload) => {
            this.handleMatchStart(payload);
        });
        
        this.socket.onMessage(MultiplayerMessageType.TURN_RESULT, (payload) => {
            this.receiveTurnResult(payload);
        });
        
        this.socket.onMessage(MultiplayerMessageType.MATCH_END, (payload) => {
            this.handleMatchEnd(payload);
        });
        
        this.socket.onMessage(MultiplayerMessageType.ERROR, (payload) => {
            console.error('[MultiplayerController] Server error:', payload);
        });
    }
    
    /**
     * Send hello message to server
     */
    sendHello() {
        this.socket.send({
            type: MultiplayerMessageType.HELLO,
            payload: {
                playerName: this.playerName
            },
            timestamp: Date.now()
        });
    }
    
    /**
     * Join matchmaking queue
     */
    joinQueue() {
        if (!this.socket || !this.socket.getIsConnected()) {
            console.error('[MultiplayerController] Not connected to server');
            return;
        }
        
        console.log('[MultiplayerController] Joining queue...');
        
        this.socket.send({
            type: MultiplayerMessageType.QUEUE_JOIN,
            payload: {
                queueType: 'versus'
            },
            timestamp: Date.now()
        });
        
        this.isInQueue = true;
    }
    
    /**
     * Leave matchmaking queue
     */
    leaveQueue() {
        if (!this.socket || !this.socket.getIsConnected()) {
            console.error('[MultiplayerController] Not connected to server');
            return;
        }
        
        console.log('[MultiplayerController] Leaving queue...');
        
        this.socket.send({
            type: MultiplayerMessageType.QUEUE_LEAVE,
            payload: {},
            timestamp: Date.now()
        });
        
        this.isInQueue = false;
    }
    
    /**
     * Handle match found event
     * @param {Object} payload - Match found payload
     */
    handleMatchFound(payload) {
        console.log('[MultiplayerController] Match found!', payload);
        
        this.currentMatch = {
            matchId: payload.matchId,
            opponent: payload.opponent,
            status: 'found'
        };
        
        // If we have a versus controller, update it
        if (this.versusController) {
            this.versusController.joinVersusMatch(payload.matchId);
        }
    }
    
    /**
     * Handle match start event
     * @param {Object} payload - Match start payload
     */
    handleMatchStart(payload) {
        console.log('[MultiplayerController] Match started!', payload);
        
        this.currentMatch = {
            ...this.currentMatch,
            matchId: payload.matchId,
            ruleset: payload.ruleset,
            teams: payload.teams,
            status: 'in_progress'
        };
        
        // If we have a versus controller, start the battle
        if (this.versusController) {
            const battleData = this.versusController.startVersusBattle();
            console.log('[MultiplayerController] Battle started via VersusController');
        }
    }
    
    /**
     * Receive turn result from server
     * @param {Object} payload - Turn result payload
     */
    receiveTurnResult(payload) {
        console.log('[MultiplayerController] Turn result received:', payload);
        
        // If we have a battle controller, process the turn
        if (this.battleController) {
            // Process turn result
            console.log('[MultiplayerController] Processing turn in BattleController');
        }
    }
    
    /**
     * Handle match end event
     * @param {Object} payload - Match end payload
     */
    handleMatchEnd(payload) {
        console.log('[MultiplayerController] Match ended!', payload);
        
        const result = payload.result;
        const rewards = payload.rewards;
        
        // If we have a versus controller, end the battle
        if (this.versusController) {
            const winnerId = result === 'win' ? this.socket.getClientId() : 'opponent';
            this.versusController.endVersusBattle(winnerId);
        }
        
        this.currentMatch = null;
        this.isInQueue = false;
        
        console.log('[MultiplayerController] Final result:', result);
        console.log('[MultiplayerController] Rewards:', rewards);
    }
    
    /**
     * Send player action to server
     * @param {Object} action - Action to send
     */
    sendAction(action) {
        if (!this.socket || !this.socket.getIsConnected()) {
            console.error('[MultiplayerController] Not connected to server');
            return;
        }
        
        if (!this.currentMatch || this.currentMatch.status !== 'in_progress') {
            console.error('[MultiplayerController] Not in a match');
            return;
        }
        
        console.log('[MultiplayerController] Sending action:', action);
        
        this.socket.send({
            type: MultiplayerMessageType.PLAYER_ACTION,
            payload: {
                matchId: this.currentMatch.matchId,
                action: action
            },
            timestamp: Date.now()
        });
    }
    
    /**
     * Set the versus controller
     * @param {VersusController} controller - Versus controller instance
     */
    setVersusController(controller) {
        this.versusController = controller;
    }
    
    /**
     * Set the battle controller
     * @param {BattleController} controller - Battle controller instance
     */
    setBattleController(controller) {
        this.battleController = controller;
    }
    
    /**
     * Set player name
     * @param {string} name - Player name
     */
    setPlayerName(name) {
        this.playerName = name;
    }
    
    /**
     * Check if in queue
     * @returns {boolean} In queue status
     */
    getIsInQueue() {
        return this.isInQueue;
    }
    
    /**
     * Check if in match
     * @returns {boolean} In match status
     */
    isInMatch() {
        return this.currentMatch !== null && this.currentMatch.status === 'in_progress';
    }
    
    /**
     * Get current match
     * @returns {Object} Current match
     */
    getCurrentMatch() {
        return this.currentMatch;
    }
    
    /**
     * Get socket connection status
     * @returns {boolean} Connected status
     */
    isConnected() {
        return this.socket && this.socket.getIsConnected();
    }
    
    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.isInQueue) {
            this.leaveQueue();
        }
        
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        this.currentMatch = null;
        this.isInQueue = false;
        
        console.log('[MultiplayerController] Disconnected');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MultiplayerController };
}
