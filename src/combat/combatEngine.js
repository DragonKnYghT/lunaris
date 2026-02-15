/**
 * combatEngine.js
 * Main combat engine for Lunaris battles
 */

// LUNARIS_TODO: integrate UI and animations later

// Import modules
const { BattleState, BattleCreature } = require('./battleState.js');
const { TurnManager } = require('./turnManager.js');
const { calculateDamage } = require('./damageCalculator.js');
const { typeChart, calculateMoveEffectiveness, getTypeEffectiveness } = require('./typeChart.js');
const { statusEffects, applyStatus, updateStatusOnTurnStart, updateStatusOnTurnEnd } = require('./statusEffects.js');

/**
 * CombatEngine class
 * Main class for managing battles
 */
class CombatEngine {
    /**
     * @param {BattleState} battleState - The battle state
     * @param {Object} data - Game data (creatures, moves, items, etc.)
     */
    constructor(battleState, data) {
        this.battleState = battleState;
        this.data = data;
        this.turnManager = new TurnManager(battleState, data);
        this.isRunning = false;
        this.isPaused = false;
    }

    /**
     * Start a new battle
     */
    startBattle() {
        console.log("=== Battle Started ===");
        this.isRunning = true;
        
        // Log battle start
        this.battleState.log("A wild battle begins!");
        
        // Log teams
        this.battleState.log(`Player's team: ${this.battleState.playerTeam.map(c => c.name).join(', ')}`);
        this.battleState.log(`Enemy team: ${this.battleState.enemyTeam.map(c => c.name).join(', ')}`);
        
        // Log active creatures
        if (this.battleState.playerActive) {
            this.battleState.log(`Go! ${this.battleState.playerActive.name}!`);
        }
        if (this.battleState.enemyActive) {
            this.battleState.log(`Enemy sent out ${this.battleState.enemyActive.name}!`);
        }
        
        return this;
    }

    /**
     * Process a player action
     * @param {Object} action - The action to process
     * @returns {Object} Action result
     */
    processPlayerAction(action) {
        if (!action || !action.type) {
            return { success: false, message: "Invalid action" };
        }
        
        // Store player action in battle state
        this.battleState.playerAction = action;
        
        console.log("Player action:", action);
        
        return { success: true, message: "Player action queued" };
    }

    /**
     * Process an enemy action (AI)
     * @returns {Object} The action chosen
     */
    processEnemyAction() {
        // Simple AI: randomly choose attack or switch
        const enemyCreature = this.battleState.enemyActive;
        
        if (!enemyCreature) {
            return null;
        }
        
        // Simple AI: always attack with a random move
        const moves = enemyCreature.moves;
        
        if (moves.length === 0) {
            // No moves available, try to switch
            // LUNARIS_TODO: Implement switch AI
            return { type: 'run' };
        }
        
        // Pick a random move
        const move = moves[Math.floor(Math.random() * moves.length)];
        
        const action = {
            type: 'attack',
            move: move
        };
        
        // Store enemy action in battle state
        this.battleState.enemyAction = action;
        
        console.log("Enemy action:", action);
        
        return action;
    }

    /**
     * Run a complete turn
     * @returns {Object} Turn result
     */
    async runTurn() {
        if (!this.isRunning || this.isPaused) {
            return { success: false, message: "Battle not running" };
        }
        
        // Check if battle is already over
        if (this.battleState.isOver) {
            return { success: false, message: "Battle is over" };
        }
        
        // Process enemy action if not already set
        if (!this.battleState.enemyAction) {
            this.processEnemyAction();
        }
        
        // Execute turn through turn manager
        const result = await this.turnManager.executeTurn();
        
        // Clear actions for next turn
        this.battleState.playerAction = null;
        this.battleState.enemyAction = null;
        
        // Check for battle end
        if (this.battleState.isOver) {
            this.endBattle();
        }
        
        return result;
    }

    /**
     * Execute a player attack
     * @param {string} moveId - The ID of the move to use
     * @returns {Object} Attack result
     */
    async executePlayerAttack(moveId) {
        const attacker = this.battleState.playerActive;
        const defender = this.battleState.enemyActive;
        
        if (!attacker || attacker.isFainted) {
            return { success: false, message: "Your creature can't attack!" };
        }
        
        if (!defender || defender.isFainted) {
            return { success: false, message: "There's no target!" };
        }
        
        // Get move data
        const move = this.data.moves[moveId];
        if (!move) {
            return { success: false, message: "Unknown move!" };
        }
        
        // Log attack
        this.battleState.log(`${attacker.name} used ${move.name}!`);
        
        // Calculate damage
        const result = calculateDamage(attacker, defender, move, { getTypeEffectiveness, calculateMoveEffectiveness });
        
        // Apply damage
        const fainted = defender.takeDamage(result.damage);
        
        // Log result
        if (result.message) {
            this.battleState.log(result.message);
        }
        
        this.battleState.log(`${defender.name} took ${result.damage} damage!`);
        
        if (fainted) {
            this.battleState.log(`${defender.name} fainted!`);
            this.battleState.checkBattleEnd();
        }
        
        return {
            success: true,
            damage: result.damage,
            fainted: fainted,
            message: result.message
        };
    }

    /**
     * Execute an enemy attack (for testing)
     * @param {string} moveId - The ID of the move to use
     * @returns {Object} Attack result
     */
    async executeEnemyAttack(moveId) {
        const attacker = this.battleState.enemyActive;
        const defender = this.battleState.playerActive;
        
        if (!attacker || attacker.isFainted) {
            return { success: false, message: "Enemy creature can't attack!" };
        }
        
        if (!defender || defender.isFainted) {
            return { success: false, message: "There's no target!" };
        }
        
        // Get move data
        const move = this.data.moves[moveId];
        if (!move) {
            return { success: false, message: "Unknown move!" };
        }
        
        // Log attack
        this.battleState.log(`Enemy ${attacker.name} used ${move.name}!`);
        
        // Calculate damage
        const result = calculateDamage(attacker, defender, move, { getTypeEffectiveness, calculateMoveEffectiveness });
        
        // Apply damage
        const fainted = defender.takeDamage(result.damage);
        
        // Log result
        if (result.message) {
            this.battleState.log(result.message);
        }
        
        this.battleState.log(`${defender.name} took ${result.damage} damage!`);
        
        if (fainted) {
            this.battleState.log(`${defender.name} fainted!`);
            this.battleState.checkBattleEnd();
        }
        
        return {
            success: true,
            damage: result.damage,
            fainted: fainted,
            message: result.message
        };
    }

    /**
     * Switch player's active creature
     * @param {number} slot - The slot index to switch to
     * @returns {Object} Switch result
     */
    switchPlayerCreature(slot) {
        const success = this.battleState.switchCreature('player', slot);
        
        if (success) {
            const creature = this.battleState.playerActive;
            this.battleState.log(`Return! Go! ${creature.name}!`);
        } else {
            this.battleState.log("But it failed!");
        }
        
        return { success };
    }

    /**
     * Use an item
     * @param {string} itemId - The ID of the item
     * @param {string} target - Target (creature ID or 'playerActive' or 'enemyActive')
     * @returns {Object} Item use result
     */
    useItem(itemId, target) {
        // LUNARIS_TODO: Implement item usage
        const item = this.data.items[itemId];
        
        if (!item) {
            return { success: false, message: "Unknown item!" };
        }
        
        this.battleState.log(`Used ${item.name}!`);
        
        // LUNARIS_TODO: Implement actual item effects
        return { success: true, message: "Item used!" };
    }

    /**
     * Attempt to catch a creature
     * @param {string} ballType - Type of ball to use
     * @returns {Object} Catch result
     */
    attemptCatch(ballType = 'standard') {
        // LUNARIS_TODO: Implement actual catch mechanics
        const creature = this.battleState.enemyActive;
        
        if (!creature) {
            return { success: false, message: "No creature to catch!" };
        }
        
        // Simple catch test
        const roll = Math.random();
        const success = roll < 0.3; // 30% base chance
        
        if (success) {
            this.battleState.log(`Gotcha! ${creature.name} was caught!`);
            this.battleState.isOver = true;
            this.battleState.winner = 'player';
        } else {
            this.battleState.log(`${creature.name} broke free!`);
        }
        
        return { success };
    }

    /**
     * End the battle
     */
    endBattle() {
        this.isRunning = false;
        
        console.log("=== Battle Ended ===");
        
        if (this.battleState.winner === 'player') {
            this.battleState.log("You won!");
            console.log("You won!");
        } else if (this.battleState.winner === 'enemy') {
            this.battleState.log("You lost!");
            console.log("You lost!");
        } else {
            this.battleState.log("The battle ended!");
            console.log("The battle ended!");
        }
        
        return {
            winner: this.battleState.winner,
            logs: this.battleState.logs
        };
    }

    /**
     * Get battle state for UI
     * @returns {Object} Battle state for display
     */
    getBattleState() {
        return {
            playerActive: this.battleState.playerActive ? {
                name: this.battleState.playerActive.name,
                types: this.battleState.playerActive.types,
                hp: this.battleState.playerActive.currentHp,
                maxHp: this.battleState.playerActive.maxHp,
                status: this.battleState.playerActive.status,
                moves: this.battleState.playerActive.moves
            } : null,
            enemyActive: this.battleState.enemyActive ? {
                name: this.battleState.enemyActive.name,
                types: this.battleState.enemyActive.types,
                hp: this.battleState.enemyActive.currentHp,
                maxHp: this.battleState.enemyActive.maxHp,
                status: this.battleState.enemyActive.status,
                moves: this.battleState.enemyActive.moves
            } : null,
            playerTeam: this.battleState.playerTeam.map(c => ({
                name: c.name,
                hp: c.currentHp,
                maxHp: c.maxHp,
                isFainted: c.isFainted
            })),
            enemyTeam: this.battleState.enemyTeam.map(c => ({
                name: c.name,
                hp: c.currentHp,
                maxHp: c.maxHp,
                isFainted: c.isFainted
            })),
            isOver: this.battleState.isOver,
            winner: this.battleState.winner,
            logs: this.battleState.logs
        };
    }

    /**
     * Pause the battle
     */
    pause() {
        this.isPaused = true;
        this.battleState.log("Battle paused!");
    }

    /**
     * Resume the battle
     */
    resume() {
        this.isPaused = false;
        this.battleState.log("Battle resumed!");
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CombatEngine };
}
