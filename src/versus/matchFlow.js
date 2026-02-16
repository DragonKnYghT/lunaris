/**
 * matchFlow.js
 * Manages match flow for versus mode in Lunaris
 */

// LUNARIS_TODO: add animations and UI transitions later

/**
 * MatchFlow class
 * Handles the flow of a versus match
 */
class MatchFlow {
    /**
     * @param {Object} options - Options
     */
    constructor(options = {}) {
        this.match = options.match || null;
        this.combatEngine = options.combatEngine || null;
        this.syncManager = options.syncManager || null;
        this.currentTurn = 0;
        this.turnPlayerId = null;
    }

    /**
     * Initialize a new match
     * @param {Object} match - Match data
     * @returns {Object} Initialization result
     */
    initializeMatch(match) {
        this.match = match;
        this.currentTurn = 0;
        this.turnPlayerId = null;
        
        // Initialize round
        this.currentRound = {
            number: 1,
            players: match.players.map(p => ({
                playerId: p.id,
                creature: null,
                hp: p.maxHp || 100,
                maxHp: p.maxHp || 100
            })),
            turn: 0,
            actions: []
        };
        
        console.log('[MatchFlow] Match initialized');
        
        return {
            success: true,
            message: 'Match initialized'
        };
    }

    /**
     * Handle player turn
     * @param {string} playerId - Player ID
     * @param {Object} action - Player action
     * @returns {Object} Turn result
     */
    async handlePlayerTurn(playerId, action) {
        if (!this.match) {
            return { success: false, message: 'No match initialized' };
        }
        
        // Record action
        this.currentRound.actions.push({
            playerId: playerId,
            action: action,
            turn: this.currentTurn
        });
        
        // Process action based on type
        let result;
        switch (action.type) {
            case 'attack':
                result = await this.processAttack(playerId, action);
                break;
            case 'switch':
                result = this.processSwitch(playerId, action);
                break;
            case 'item':
                result = this.processItem(playerId, action);
                break;
            case 'run':
                result = this.processRun(playerId);
                break;
            default:
                result = { success: false, message: 'Unknown action type' };
        }
        
        // Sync action to other players
        if (this.syncManager) {
            this.syncManager.queueAction({
                type: 'match_action',
                playerId: playerId,
                action: action,
                result: result
            });
        }
        
        // Check win condition
        const winResult = this.checkWinCondition();
        if (winResult.gameOver) {
            return {
                ...result,
                gameOver: true,
                winner: winResult.winner
            };
        }
        
        // Advance turn
        this.currentTurn++;
        
        return result;
    }

    /**
     * Handle opponent turn (for AI or networked opponent)
     * @returns {Object} Turn result
     */
    async handleOpponentTurn() {
        // LUNARIS_TODO: Implement AI logic
        // For now, simulate a random action
        
        const actions = ['attack', 'switch'];
        const actionType = actions[Math.floor(Math.random() * actions.length)];
        
        return {
            success: true,
            message: 'Opponent action simulated',
            actionType: actionType
        };
    }

    /**
     * Process attack action
     * @param {string} playerId - Player ID
     * @param {Object} action - Attack action
     * @returns {Object} Attack result
     */
    async processAttack(playerId, action) {
        // LUNARIS_TODO: Use combat engine for actual damage calculation
        // Placeholder implementation
        
        const move = action.move;
        const damage = Math.floor(Math.random() * 30) + 10; // Placeholder damage
        
        console.log(`[MatchFlow] Player ${playerId} used ${move}! Dealt ${damage} damage!`);
        
        return {
            success: true,
            type: 'attack',
            move: move,
            damage: damage,
            message: `Dealt ${damage} damage!`
        };
    }

    /**
     * Process switch action
     * @param {string} playerId - Player ID
     * @param {Object} action - Switch action
     * @returns {Object} Switch result
     */
    processSwitch(playerId, action) {
        console.log(`[MatchFlow] Player ${playerId} switched to ${action.creature}!`);
        
        return {
            success: true,
            type: 'switch',
            creature: action.creature,
            message: `Switched to ${action.creature}!`
        };
    }

    /**
     * Process item action
     * @param {string} playerId - Player ID
     * @param {Object} action - Item action
     * @returns {Object} Item result
     */
    processItem(playerId, action) {
        console.log(`[MatchFlow] Player ${playerId} used ${action.item}!`);
        
        return {
            success: true,
            type: 'item',
            item: action.item,
            message: `Used ${action.item}!`
        };
    }

    /**
     * Process run action (attempt to flee)
     * @param {string} playerId - Player ID
     * @returns {Object} Run result
     */
    processRun(playerId) {
        // In versus mode, running might not be allowed
        console.log(`[MatchFlow] Player ${playerId} tried to run!`);
        
        return {
            success: false,
            type: 'run',
            message: "Can't run from versus battles!"
        };
    }

    /**
     * Check win condition
     * @returns {Object} Win condition result
     */
    checkWinCondition() {
        if (!this.currentRound) {
            return { gameOver: false };
        }
        
        // Check if any player has been defeated
        const defeatedPlayers = this.currentRound.players.filter(p => p.hp <= 0);
        
        if (defeatedPlayers.length > 0) {
            const winner = this.currentRound.players.find(p => p.hp > 0);
            return {
                gameOver: true,
                winner: winner ? winner.playerId : null,
                defeated: defeatedPlayers.map(p => p.playerId)
            };
        }
        
        return { gameOver: false };
    }

    /**
     * Finalize match
     * @param {string} winnerId - Winner player ID
     * @returns {Object} Finalization result
     */
    finalizeMatch(winnerId = null) {
        if (!this.match) {
            return { success: false, message: 'No match to finalize' };
        }
        
        const result = {
            matchId: this.match.id,
            winner: winnerId,
            rounds: this.currentRound,
            totalTurns: this.currentTurn,
            timestamp: Date.now()
        };
        
        console.log(`[MatchFlow] Match finalized. Winner: ${winnerId}`);
        
        return {
            success: true,
            result: result
        };
    }

    /**
     * Get current match state
     * @returns {Object} Match state
     */
    getMatchState() {
        if (!this.match) {
            return null;
        }
        
        return {
            matchId: this.match.id,
            currentTurn: this.currentTurn,
            turnPlayerId: this.turnPlayerId,
            round: this.currentRound,
            players: this.match.players
        };
    }

    /**
     * Apply damage to player
     * @param {string} playerId - Player ID
     * @param {number} damage - Damage amount
     */
    applyDamage(playerId, damage) {
        const player = this.currentRound.players.find(p => p.playerId === playerId);
        if (player) {
            player.hp = Math.max(0, player.hp - damage);
            console.log(`[MatchFlow] Player ${playerId} HP: ${player.hp}/${player.maxHp}`);
        }
    }

    /**
     * Heal player
     * @param {string} playerId - Player ID
     * @param {number} amount - Heal amount
     */
    healPlayer(playerId, amount) {
        const player = this.currentRound.players.find(p => p.playerId === playerId);
        if (player) {
            player.hp = Math.min(player.maxHp, player.hp + amount);
            console.log(`[MatchFlow] Player ${playerId} HP: ${player.hp}/${player.maxHp}`);
        }
    }

    /**
     * Reset for new round
     */
    resetForNewRound() {
        if (!this.match) return;
        
        // Reset HP for new round (if not carrying over)
        for (const player of this.currentRound.players) {
            player.hp = player.maxHp;
            player.creature = null;
        }
        
        this.currentRound.number++;
        this.currentRound.turn = 0;
        this.currentRound.actions = [];
        
        console.log(`[MatchFlow] Starting round ${this.currentRound.number}`);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MatchFlow };
}
