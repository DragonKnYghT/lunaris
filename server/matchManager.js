/**
 * matchManager.js
 * Manages matches between players
 * 
 * LUNARIS_TODO: add ranked matchmaking later
 */

// Placeholder for BattleController - in production this would be imported
// For now, we'll create a simple battle resolution system

/**
 * MatchManager class
 * Manages multiplayer matches
 */
class MatchManager {
    constructor() {
        this.activeMatches = new Map();
        this.matchQueue = [];
        this.matchIdCounter = 0;
        
        console.log('[MatchManager] Initialized');
    }
    
    /**
     * Create a new match between two players
     * @param {Object} playerA - First player session
     * @param {Object} playerB - Second player session
     * @returns {Object} Match object
     */
    createMatch(playerA, playerB) {
        const matchId = `match_${++this.matchIdCounter}`;
        
        const match = {
            id: matchId,
            players: [playerA, playerB],
            status: 'waiting', // waiting, ready, in_progress, finished
            ruleset: 'standard',
            turn: 0,
            currentPlayerIndex: 0,
            battleState: this.initializeBattleState(),
            createdAt: Date.now()
        };
        
        // Set current match for both players
        playerA.setCurrentMatch(match);
        playerB.setCurrentMatch(match);
        
        // Store match
        this.activeMatches.set(matchId, match);
        
        console.log(`[MatchManager] Match created: ${matchId} between ${playerA.getPlayerName()} and ${playerB.getPlayerName()}`);
        
        return match;
    }
    
    /**
     * Initialize battle state for a match
     * @returns {Object} Battle state
     */
    initializeBattleState() {
        return {
            playerTeam: [],
            enemyTeam: [],
            turn: 0,
            weather: null,
            fieldEffects: [],
            isActive: true,
            result: null
        };
    }
    
    /**
     * Start a match
     * @param {Object} match - Match to start
     */
    startMatch(match) {
        if (!match) {
            console.error('[MatchManager] Cannot start null match');
            return;
        }
        
        match.status = 'in_progress';
        match.turn = 0;
        match.currentPlayerIndex = 0;
        
        console.log(`[MatchManager] Match started: ${match.id}`);
        
        // Notify both players that match has started
        const { Messages } = require('./messageProtocol.js');
        
        match.players.forEach((player, index) => {
            const teams = {
                player: index === 0 ? 'player' : 'opponent',
                opponent: index === 0 ? 'opponent' : 'player'
            };
            
            player.send(Messages.matchStart(match.id, match.ruleset, teams));
        });
    }
    
    /**
     * Process a player's action
     * @param {Object} match - Match object
     * @param {string} playerId - Player who took action
     * @param {Object} action - Action data
     * @returns {Object} Turn result
     */
    processPlayerAction(match, playerId, action) {
        if (!match || match.status !== 'in_progress') {
            console.error('[MatchManager] Match not in progress');
            return null;
        }
        
        match.turn++;
        
        console.log(`[MatchManager] Processing action in match ${match.id}:`, action);
        
        // Process the action using battle logic
        const result = this.resolveAction(match, playerId, action);
        
        // Create turn result
        const turnResult = {
            turn: match.turn,
            action: action,
            result: result,
            currentPlayer: match.players[match.currentPlayerIndex].getClientId()
        };
        
        // Broadcast turn result to both players
        const { Messages } = require('./messageProtocol.js');
        
        match.players.forEach(player => {
            player.send(Messages.turnResult(match.id, match.turn, turnResult));
        });
        
        // Check if match should end
        if (this.checkMatchEnd(match)) {
            this.endMatch(match, result.winner);
        } else {
            // Switch to next player
            match.currentPlayerIndex = (match.currentPlayerIndex + 1) % match.players.length;
        }
        
        return turnResult;
    }
    
    /**
     * Resolve an action in the match
     * @param {Object} match - Match object
     * @param {string} playerId - Player ID
     * @param {Object} action - Action to resolve
     * @returns {Object} Resolution result
     */
    resolveAction(match, playerId, action) {
        // Simple action resolution
        // In production, this would use BattleController for full battle logic
        
        const result = {
            success: true,
            damage: 0,
            effects: [],
            targetFainted: false,
            winner: null
        };
        
        // Process different action types
        switch (action.type) {
            case 'attack':
                // Calculate damage (simplified)
                const attackerIndex = match.players.findIndex(p => p.getClientId() === playerId);
                const defenderIndex = (attackerIndex + 1) % match.players.length;
                
                // Random damage between 10-30
                result.damage = Math.floor(Math.random() * 20) + 10;
                
                console.log(`[MatchManager] Player ${playerId} attacked for ${result.damage} damage`);
                break;
                
            case 'item':
                result.success = true;
                console.log(`[MatchManager] Player ${playerId} used item: ${action.itemId}`);
                break;
                
            case 'switch':
                result.success = true;
                console.log(`[MatchManager] Player ${playerId} switched creature`);
                break;
                
            default:
                result.success = false;
                console.warn(`[MatchManager] Unknown action type: ${action.type}`);
        }
        
        return result;
    }
    
    /**
     * Check if match should end
     * @param {Object} match - Match object
     * @returns {boolean} True if match should end
     */
    checkMatchEnd(match) {
        // Check win conditions
        // For now, end after 10 turns or if a player surrenders
        
        if (match.turn >= 10) {
            return true;
        }
        
        return false;
    }
    
    /**
     * End a match
     * @param {Object} match - Match to end
     * @param {string} winnerId - Winner player ID (optional)
     * @returns {Object} Match result
     */
    endMatch(match, winnerId = null) {
        if (!match) {
            console.error('[MatchManager] Cannot end null match');
            return;
        }
        
        match.status = 'finished';
        match.battleState.isActive = false;
        
        // Determine winner if not provided
        if (!winnerId) {
            // Random winner for now
            const winnerIndex = Math.floor(Math.random() * match.players.length);
            winnerId = match.players[winnerIndex].getClientId();
        }
        
        const winner = match.players.find(p => p.getClientId() === winnerId);
        
        // Calculate rewards
        const rewards = {
            currency: 100,
            rating: 15,
            experience: 50
        };
        
        const result = {
            matchId: match.id,
            winner: winner ? winner.getPlayerName() : 'Unknown',
            winnerId: winnerId,
            rewards: rewards,
            turns: match.turn
        };
        
        console.log(`[MatchManager] Match ended: ${match.id}, Winner: ${result.winner}`);
        
        // Send match end to both players
        const { Messages } = require('./messageProtocol.js');
        
        match.players.forEach(player => {
            const isWinner = player.getClientId() === winnerId;
            player.send(Messages.matchEnd(match.id, isWinner ? 'win' : 'lose', rewards));
            
            // Clear player's current match
            player.setCurrentMatch(null);
        });
        
        // Remove from active matches
        this.activeMatches.delete(match.id);
        
        return result;
    }
    
    /**
     * Get match by ID
     * @param {string} matchId - Match ID
     * @returns {Object|null} Match object
     */
    getMatch(matchId) {
        return this.activeMatches.get(matchId) || null;
    }
    
    /**
     * Get all active matches
     * @returns {Array} Array of active matches
     */
    getActiveMatches() {
        return Array.from(this.activeMatches.values());
    }
    
    /**
     * Add player to queue
     * @param {Object} player - Player session
     */
    addToQueue(player) {
        this.matchQueue.push(player);
        console.log(`[MatchManager] Player ${player.getPlayerName()} added to queue. Queue size: ${this.matchQueue.length}`);
        
        // Try to find a match
        this.tryMatchPlayers();
    }
    
    /**
     * Remove player from queue
     * @param {Object} player - Player session
     */
    removeFromQueue(player) {
        const index = this.matchQueue.indexOf(player);
        if (index > -1) {
            this.matchQueue.splice(index, 1);
            console.log(`[MatchManager] Player ${player.getPlayerName()} removed from queue`);
        }
    }
    
    /**
     * Try to match players in queue
     */
    tryMatchPlayers() {
        if (this.matchQueue.length < 2) {
            return;
        }
        
        // Take first two players from queue
        const playerA = this.matchQueue.shift();
        const playerB = this.matchQueue.shift();
        
        // Create and start match
        const match = this.createMatch(playerA, playerB);
        this.startMatch(match);
        
        console.log(`[MatchManager] Matched ${playerA.getPlayerName()} vs ${playerB.getPlayerName()}`);
    }
    
    /**
     * Get queue status
     * @returns {Object} Queue status
     */
    getQueueStatus() {
        return {
            queueSize: this.matchQueue.length,
            activeMatches: this.activeMatches.size
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MatchManager
    };
}
