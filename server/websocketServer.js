/**
 * websocketServer.js
 * WebSocket server implementation for Lunaris multiplayer
 * 
 * LUNARIS_TODO: add authentication later
 */

const WebSocket = require('ws');
const { PlayerSession, generateClientId } = require('./playerSession.js');
const { MatchManager } = require('./matchManager.js');
const { parseMessage, Messages, MessageType } = require('./messageProtocol.js');

/**
 * WebSocketServer class
 * Main WebSocket server for Lunaris
 */
class LunarisWebSocketServer {
    /**
     * @param {number} port - Port to listen on
     */
    constructor(port = 8080) {
        this.port = port;
        this.wss = null;
        this.sessions = new Map(); // clientId -> PlayerSession
        this.matchManager = new MatchManager();
        this.lobbies = new Map(); // roomCode -> { hostId, members: Set<clientId> }
        this.serverInfo = {
            name: 'Lunaris Server',
            version: '0.1.0',
            maxPlayers: 100,
            currentPlayers: 0
        };
        
        console.log('[WebSocketServer] Server instance created');
    }
    
    /**
     * Start the WebSocket server
     * @param {number} port - Port to listen on
     * @returns {Promise} Server start result
     */
    startServer(port = this.port) {
        return new Promise((resolve, reject) => {
            try {
                this.wss = new WebSocket.Server({ port: port });
                this.port = port;
                
                this.wss.on('connection', (ws) => this.handleConnection(ws));
                
                this.wss.on('error', (error) => {
                    console.error('[WebSocketServer] Server error:', error);
                    reject(error);
                });
                
                this.wss.on('listening', () => {
                    console.log(`[WebSocketServer] Server started on port ${port}`);
                    resolve(this);
                });
                
            } catch (error) {
                console.error('[WebSocketServer] Failed to start server:', error);
                reject(error);
            }
        });
    }
    
    /**
     * Handle new WebSocket connection
     * @param {WebSocket} ws - WebSocket connection
     */
    handleConnection(ws) {
        const clientId = generateClientId();
        console.log(`[WebSocketServer] New connection: ${clientId}`);
        
        // Create player session
        const session = new PlayerSession(ws, clientId);
        this.sessions.set(clientId, session);
        
        // Update player count
        this.serverInfo.currentPlayers = this.sessions.size;
        
        // Send welcome message
        session.sendWelcome(this.serverInfo);
        
        // Handle messages
        ws.on('message', (data) => {
            this.handleMessage(session, data);
        });
        
        // Handle disconnect
        ws.on('close', () => {
            this.handleDisconnect(session);
        });
        
        // Handle errors
        ws.on('error', (error) => {
            console.error(`[WebSocketServer] WebSocket error for ${clientId}:`, error);
        });
    }
    
    /**
     * Handle incoming message
     * @param {PlayerSession} session - Player session
     * @param {string} data - Message data
     */
    handleMessage(session, data) {
        // Parse message
        const message = parseMessage(data);
        
        if (!message) {
            console.warn(`[WebSocketServer] Invalid message from ${session.getClientId()}`);
            return;
        }
        
        // Process message
        session.receive(message);
        
        // Route message to appropriate handler
        switch (message.type) {
            case MessageType.QUEUE_JOIN:
                this.handleQueueJoin(session, message);
                break;
                
            case MessageType.QUEUE_LEAVE:
                this.handleQueueLeave(session, message);
                break;
                
            case MessageType.PLAYER_ACTION:
                this.handlePlayerAction(session, message);
                break;
                
            case MessageType.PING:
                // Pong is handled in PlayerSession
                break;
            
            case MessageType.LOBBY_CREATE:
                this.handleLobbyCreate(session, message);
                break;
            
            case MessageType.LOBBY_JOIN:
                this.handleLobbyJoin(session, message);
                break;
            
            case MessageType.LOBBY_LEAVE:
                this.handleLobbyLeave(session, message);
                break;
                
            case MessageType.HELLO:
                // Already handled in receive
                break;
                
            default:
                console.log(`[WebSocketServer] Unhandled message type: ${message.type}`);
        }
    }
    
    /**
     * Handle queue join request
     * @param {PlayerSession} session - Player session
     * @param {Object} message - Message data
     */
    handleQueueJoin(session, message) {
        console.log(`[WebSocketServer] Player ${session.getPlayerName()} joining queue`);
        
        // Add player to matchmaking queue
        this.matchManager.addToQueue(session);
        
        // Send queue status
        const queueStatus = this.matchManager.getQueueStatus();
        session.send(Messages.queueStatus(queueStatus.queueSize, 0));
    }
    
    /**
     * Handle queue leave request
     * @param {PlayerSession} session - Player session
     * @param {Object} message - Message data
     */
    handleQueueLeave(session, message) {
        console.log(`[WebSocketServer] Player ${session.getPlayerName()} leaving queue`);
        this.matchManager.removeFromQueue(session);
    }
    
    /**
     * Handle player action
     * @param {PlayerSession} session - Player session
     * @param {Object} message - Message data
     */
    handlePlayerAction(session, message) {
        const match = session.getCurrentMatch();
        
        if (!match) {
            session.sendError('NO_MATCH', 'You are not in a match');
            return;
        }
        
        const { matchId, action } = message.payload;
        
        if (match.id !== matchId) {
            session.sendError('INVALID_MATCH', 'Match ID does not match');
            return;
        }
        
        // Process the action
        this.matchManager.processPlayerAction(match, session.getClientId(), action);
    }
    
    /**
     * Handle disconnection
     * @param {PlayerSession} session - Player session
     */
    handleDisconnect(session) {
        const clientId = session.getClientId();
        console.log(`[WebSocketServer] Client disconnected: ${clientId}`);
        
        // Remove from queue if in queue
        this.matchManager.removeFromQueue(session);
        
        // End match if in progress
        const currentMatch = session.getCurrentMatch();
        if (currentMatch) {
            this.matchManager.endMatch(currentMatch, null);
        }
        
        // Remove session
        this.sessions.delete(clientId);
        
        // Update player count
        this.serverInfo.currentPlayers = this.sessions.size;
        
        // Remove from any lobby
        this.removeFromLobbies(session);
    }

    /**
     * Handle lobby creation
     * @param {PlayerSession} session
     * @param {Object} message
     */
    handleLobbyCreate(session, message) {
        const desiredCode = (message.payload && message.payload.roomCode) || null;
        const roomCode = desiredCode || this.generateRoomCode();
        
        if (this.lobbies.has(roomCode)) {
            session.send(Messages.lobbyError('ROOM_EXISTS', 'Lobby code already in use'));
            return;
        }
        
        const lobby = {
            roomCode,
            hostId: session.getClientId(),
            members: new Set([session.getClientId()])
        };
        this.lobbies.set(roomCode, lobby);
        
        this.broadcastLobbyState(lobby);
        console.log(`[WebSocketServer] Lobby created: ${roomCode} by ${session.getClientId()}`);
    }

    /**
     * Handle lobby join
     * @param {PlayerSession} session
     * @param {Object} message
     */
    handleLobbyJoin(session, message) {
        const roomCode = message.payload && message.payload.roomCode;
        if (!roomCode) {
            session.send(Messages.lobbyError('NO_ROOM', 'Missing room code'));
            return;
        }
        
        const lobby = this.lobbies.get(roomCode);
        if (!lobby) {
            session.send(Messages.lobbyError('NOT_FOUND', 'Lobby not found'));
            return;
        }
        
        lobby.members.add(session.getClientId());
        this.broadcastLobbyState(lobby);
        console.log(`[WebSocketServer] ${session.getClientId()} joined lobby ${roomCode}`);
    }

    /**
     * Handle lobby leave
     * @param {PlayerSession} session
     * @param {Object} message
     */
    handleLobbyLeave(session, message) {
        this.removeFromLobbies(session);
    }

    /**
     * Remove session from all lobbies
     * @param {PlayerSession} session
     */
    removeFromLobbies(session) {
        const clientId = session.getClientId();
        
        for (const [code, lobby] of this.lobbies.entries()) {
            if (!lobby.members.has(clientId)) continue;
            
            lobby.members.delete(clientId);
            console.log(`[WebSocketServer] ${clientId} left lobby ${code}`);
            
            // If lobby empty, delete
            if (lobby.members.size === 0) {
                this.lobbies.delete(code);
                continue;
            }
            
            // If host left, assign new host
            if (lobby.hostId === clientId) {
                const [newHostId] = lobby.members.values();
                lobby.hostId = newHostId;
            }
            
            this.broadcastLobbyState(lobby);
        }
    }

    /**
     * Broadcast lobby state to all its members
     * @param {Object} lobby
     */
    broadcastLobbyState(lobby) {
        const payload = Messages.lobbyState(
            lobby.roomCode,
            lobby.hostId,
            Array.from(lobby.members.values()).map(id => {
                const s = this.sessions.get(id);
                return {
                    id,
                    name: s ? (s.getPlayerName() || id) : id
                };
            })
        );
        
        lobby.members.forEach(id => {
            const s = this.sessions.get(id);
            if (s && s.isPlayerConnected()) {
                s.send(payload);
            }
        });
    }

    /**
     * Generate a simple 6-char room code
     * @returns {string}
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
     * Broadcast message to all connected clients
     * @param {Object} message - Message to broadcast
     */
    broadcast(message) {
        const serialized = JSON.stringify(message);
        
        this.sessions.forEach((session) => {
            if (session.isPlayerConnected()) {
                session.send(message);
            }
        });
    }
    
    /**
     * Send message to specific client
     * @param {string} clientId - Client ID
     * @param {Object} message - Message to send
     * @returns {boolean} Success
     */
    sendToClient(clientId, message) {
        const session = this.sessions.get(clientId);
        
        if (!session) {
            console.warn(`[WebSocketServer] Client not found: ${clientId}`);
            return false;
        }
        
        return session.send(message);
    }
    
    /**
     * Get server info
     * @returns {Object} Server info
     */
    getServerInfo() {
        return { ...this.serverInfo };
    }
    
    /**
     * Get all connected sessions
     * @returns {Array} Array of sessions
     */
    getSessions() {
        return Array.from(this.sessions.values());
    }
    
    /**
     * Stop the server
     */
    stopServer() {
        if (this.wss) {
            // Disconnect all clients
            this.sessions.forEach((session) => {
                session.sendDisconnect('Server shutting down');
                session.disconnect();
            });
            
            // Close server
            this.wss.close(() => {
                console.log('[WebSocketServer] Server stopped');
            });
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LunarisWebSocketServer
    };
}
