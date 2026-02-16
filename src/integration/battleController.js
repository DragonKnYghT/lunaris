/**
 * battleController.js
 * Controller for managing battles
 */

// LUNARIS_TODO: add animations and effects later

/**
 * BattleController class
 * Manages battles in the game
 */
class BattleController {
    constructor(gameData) {
        this.gameData = gameData;
        this.currentBattle = null;
        
        console.log('[BattleController] Initialized');
    }

    /**
     * Start a battle
     * @param {Object} encounter - Encounter data
     * @returns {Object} Battle data
     */
    startBattle(encounter) {
        console.log('[BattleController] Starting battle');
        
        // Create battle data
        this.currentBattle = {
            encounter: encounter,
            playerTeam: [],
            enemyTeam: [],
            turn: 0,
            isActive: true,
            result: null
        };
        
        console.log('[BattleController] Battle started');
        console.log('  Enemy:', encounter.creature.name, 'Level', encounter.level);
        
        return this.currentBattle;
    }

    /**
     * Process a turn
     * @param {Object} playerAction - Player's action
     * @returns {Object} Turn result
     */
    processTurn(playerAction) {
        if (!this.currentBattle || !this.currentBattle.isActive) {
            console.error('[BattleController] No active battle');
            return null;
        }
        
        this.currentBattle.turn++;
        
        console.log('[BattleController] Processing turn', this.currentBattle.turn);
        
        // Process player action
        const playerResult = this.processPlayerAction(playerAction);
        
        // Check if battle ended
        if (playerResult.enemyFainted) {
            this.endBattle('win');
            return playerResult;
        }
        
        // Process enemy action (AI)
        const enemyResult = this.processEnemyAction();
        
        // Check if battle ended
        if (enemyResult.playerFainted) {
            this.endBattle('lose');
            return { playerResult, enemyResult };
        }
        
        return { playerResult, enemyResult };
    }

    /**
     * Process player's action
     * @param {Object} action - Player action
     * @returns {Object} Action result
     */
    processPlayerAction(action) {
        console.log('[BattleController] Player action:', action);
        
        // Calculate damage (simplified)
        const result = {
            action: action,
            damage: Math.floor(Math.random() * 20) + 10,
            enemyFainted: false
        };
        
        return result;
    }

    /**
     * Process enemy's action
     * @returns {Object} Action result
     */
    processEnemyAction() {
        console.log('[BattleController] Enemy action');
        
        // Simple AI (random attack)
        const result = {
            action: 'attack',
            damage: Math.floor(Math.random() * 15) + 5,
            playerFainted: false
        };
        
        return result;
    }

    /**
     * End the battle
     * @param {string} result - Battle result: 'win', 'lose', 'draw'
     */
    endBattle(result) {
        if (!this.currentBattle) {
            console.warn('[BattleController] No active battle to end');
            return;
        }
        
        this.currentBattle.isActive = false;
        this.currentBattle.result = result;
        
        console.log('[BattleController] Battle ended:', result);
        
        // Generate rewards if won
        if (result === 'win') {
            const rewards = this.calculateRewards();
            console.log('[BattleController] Rewards:', rewards);
            return rewards;
        }
        
        return null;
    }

    /**
     * Calculate rewards for winning
     * @returns {Object} Rewards
     */
    calculateRewards() {
        if (!this.currentBattle) return null;
        
        const encounter = this.currentBattle.encounter;
        
        const rewards = {
            experience: encounter.level * 10,
            currency: encounter.level * 5,
            items: []
        };
        
        // Chance to drop items
        if (Math.random() < 0.3) {
            rewards.items.push('lunar_potion');
        }
        
        return rewards;
    }

    /**
     * Get current battle data
     * @returns {Object} Current battle
     */
    getCurrentBattle() {
        return this.currentBattle;
    }

    /**
     * Check if battle is active
     * @returns {boolean} True if active
     */
    isBattleActive() {
        return this.currentBattle && this.currentBattle.isActive;
    }

    /**
     * Flee from battle
     * @returns {boolean} True if successful
     */
    flee() {
        if (!this.currentBattle) return false;
        
        // 50% chance to flee
        const success = Math.random() < 0.5;
        
        if (success) {
            console.log('[BattleController] Successfully fled');
            this.endBattle('fled');
        } else {
            console.log('[BattleController] Failed to flee');
        }
        
        return success;
    }

    /**
     * Use item in battle
     * @param {string} itemId - Item ID
     * @returns {Object} Item use result
     */
    useItem(itemId) {
        console.log('[BattleController] Using item:', itemId);
        
        const result = {
            success: true,
            effect: 'heal',
            value: 20
        };
        
        return result;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BattleController };
}
