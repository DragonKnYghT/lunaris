/**
 * turnManager.js
 * Manages turn order and turn execution in battles
 */

// LUNARIS_TODO: implement priority, speed ties, etc.

/**
 * TurnManager class
 * Handles turn order determination and execution
 */
class TurnManager {
    /**
     * @param {BattleState} battleState - The current battle state
     * @param {Object} data - Game data (moves, etc.)
     */
    constructor(battleState, data) {
        this.battleState = battleState;
        this.data = data;
        this.turnNumber = 0;
    }

    /**
     * Determine turn order based on speed and priority
     * @returns {Array} Array of action objects in order
     */
    determineTurnOrder() {
        const actions = [];
        
        // Get player action
        if (this.battleState.playerAction) {
            actions.push({
                source: 'player',
                creature: this.battleState.playerActive,
                action: this.battleState.playerAction
            });
        }
        
        // Get enemy action
        if (this.battleState.enemyAction) {
            actions.push({
                source: 'enemy',
                creature: this.battleState.enemyActive,
                action: this.battleState.enemyAction
            });
        }
        
        // Sort by priority first, then speed
        actions.sort((a, b) => {
            // Priority check
            const priorityA = this.getMovePriority(a.action.move);
            const priorityB = this.getMovePriority(b.action.move);
            
            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Higher priority first
            }
            
            // Speed check (with random tiebreaker)
            const speedA = a.creature ? a.creature.stats.spe : 0;
            const speedB = b.creature ? b.creature.stats.spe : 0;
            
            if (speedA !== speedB) {
                return speedB - speedA; // Faster first
            }
            
            // Random tiebreaker
            return Math.random() - 0.5;
        });
        
        this.battleState.turnOrder = actions;
        return actions;
    }

    /**
     * Get the priority of a move
     * @param {string} moveId - The move ID
     * @returns {number} Priority value
     */
    getMovePriority(moveId) {
        const move = this.data.moves[moveId];
        if (!move) return 0;
        return move.priority || 0;
    }

    /**
     * Execute a single turn
     * @returns {Object} Turn result
     */
    async executeTurn() {
        this.turnNumber++;
        this.battleState.turnCount = this.turnNumber;
        
        this.battleState.log(`=== Turn ${this.turnNumber} ===`);
        
        // Determine turn order
        const turnOrder = this.determineTurnOrder();
        
        // Execute each action in order
        for (const action of turnOrder) {
            if (this.battleState.isOver) break;
            
            // Check if creature can act
            if (!action.creature || !action.creature.canAct()) {
                continue;
            }
            
            // Update status effects at start of turn
            const statusResult = this.updateStatusOnTurnStart(action.creature);
            if (statusResult && statusResult.cannotAct) {
                this.battleState.log(statusResult.message);
                continue;
            }
            
            // Execute the action
            await this.executeAction(action);
        }
        
        // Apply end of turn effects
        await this.applyEndOfTurnEffects();
        
        // Check if battle is over
        this.battleState.checkBattleEnd();
        
        return {
            turnNumber: this.turnNumber,
            isOver: this.battleState.isOver,
            winner: this.battleState.winner
        };
    }

    /**
     * Execute a single action
     * @param {Object} action - The action to execute
     */
    async executeAction(action) {
        const { source, creature, action: actionData } = action;
        
        // Get the target
        const target = source === 'player' 
            ? this.battleState.enemyActive 
            : this.battleState.playerActive;
        
        if (!target) {
            this.battleState.log(`${creature.name} has no target!`);
            return;
        }
        
        const actionType = actionData.type;
        
        switch (actionType) {
            case 'attack':
                await this.executeAttack(creature, target, actionData.move);
                break;
            case 'switch':
                this.executeSwitch(source, actionData.slot);
                break;
            case 'item':
                await this.executeItem(creature, actionData.item);
                break;
            case 'run':
                this.executeRun(source);
                break;
            default:
                this.battleState.log(`${creature.name} did something unexpected!`);
        }
    }

    /**
     * Execute an attack action
     * @param {Object} attacker - The attacking creature
     * @param {Object} defender - The defending creature
     * @param {string} moveId - The move being used
     */
    async executeAttack(attacker, defender, moveId) {
        const move = this.data.moves[moveId];
        
        if (!move) {
            this.battleState.log(`${attacker.name} tried to use ${moveId}, but it failed!`);
            return;
        }
        
        // Check if move has enough PP (placeholder)
        // LUNARIS_TODO: Implement PP tracking
        
        // Log the attack
        this.battleState.log(`${attacker.name} used ${move.name}!`);
        
        // Check accuracy (placeholder)
        // LUNARIS_TODO: Implement accuracy check
        const hit = true; // Simplified for now
        
        if (!hit) {
            this.battleState.log(`${attacker.name}'s attack missed!`);
            return;
        }
        
        // Calculate damage using damageCalculator
        const damageCalculator = require('./damageCalculator.js');
        const typeChart = require('./typeChart.js');
        
        const result = damageCalculator.calculateDamage(attacker, defender, move, typeChart);
        
        // Apply damage
        const fainted = defender.takeDamage(result.damage);
        
        // Log result
        if (result.message) {
            this.battleState.log(result.message);
        }
        
        this.battleState.log(`${defender.name} took ${result.damage} damage!`);
        
        if (fainted) {
            this.battleState.log(`${defender.name} fainted!`);
            
            // Check for level up (placeholder)
            // LUNARIS_TODO: Implement level up logic
            
            // Switch to next creature if needed
            this.handleFaint(source === 'player' ? 'enemy' : 'player');
        }
    }

    /**
     * Execute a switch action
     * @param {string} teamType - 'player' or 'enemy'
     * @param {number} slot - The slot to switch to
     */
    executeSwitch(teamType, slot) {
        const success = this.battleState.switchCreature(teamType, slot);
        
        if (success) {
            this.battleState.log(`${teamType === 'player' ? 'Player' : 'Enemy'} switched creatures!`);
        } else {
            this.battleState.log("But it failed!");
        }
    }

    /**
     * Execute an item action
     * @param {Object} user - The creature using the item
     * @param {Object} item - The item being used
     */
    async executeItem(user, item) {
        // LUNARIS_TODO: Implement item usage
        this.battleState.log(`${user.name} used ${item.name}!`);
    }

    /**
     * Execute a run action
     * @param {string} teamType - 'player' or 'enemy'
     */
    executeRun(teamType) {
        // LUNARIS_TODO: Implement run logic
        // For now, always succeed in test battle
        this.battleState.log("Got away safely!");
        this.battleState.isOver = true;
        this.battleState.winner = 'player'; // Player ran away
    }

    /**
     * Handle a creature fainting
     * @param {string} teamType - The team that had the fainted creature
     */
    handleFaint(teamType) {
        const team = teamType === 'player' 
            ? this.battleState.playerTeam 
            : this.battleState.enemyTeam;
        
        const active = teamType === 'player' 
            ? this.battleState.playerActive 
            : this.battleState.enemyActive;
        
        // Check if there are any remaining creatures
        const hasRemaining = team.some(c => c && !c.isFainted);
        
        if (!hasRemaining) {
            // Team has no more creatures
            this.battleState.checkBattleEnd();
            return;
        }
        
        // For player team, prompt to switch
        // For enemy team, auto-switch
        if (teamType === 'enemy') {
            // LUNARIS_TODO: Implement enemy auto-switch
            const nextCreature = team.find(c => c && !c.isFainted);
            if (nextCreature) {
                if (teamType === 'player') {
                    // LUNARIS_TODO: Prompt player to switch
                } else {
                    this.battleState.enemyActive = nextCreature;
                    this.battleState.log(`Enemy sent out ${nextCreature.name}!`);
                }
            }
        }
    }

    /**
     * Update status effects at the start of a turn
     * @param {Object} creature - The creature to update
     * @returns {Object} Status update result
     */
    updateStatusOnTurnStart(creature) {
        const statusEffects = require('./statusEffects.js');
        return statusEffects.updateStatusOnTurnStart(creature);
    }

    /**
     * Apply end of turn effects
     */
    async applyEndOfTurnEffects() {
        // Update status effects for all active creatures
        const creatures = [
            this.battleState.playerActive,
            this.battleState.enemyActive
        ];
        
        for (const creature of creatures) {
            if (!creature) continue;
            
            // Status effects that apply at end of turn
            const statusEffects = require('./statusEffects.js');
            const result = statusEffects.updateStatusOnTurnEnd(creature);
            
            if (result) {
                this.battleState.log(result.message);
            }
            
            // Check for fainted creatures
            if (creature.isFainted) {
                this.battleState.log(`${creature.name} fainted!`);
            }
        }
        
        // LUNARIS_TODO: Add weather/field effect updates
        // LUNARIS_TODO: Add trapping move duration tracking
        // LUNARIS_TODO: Add recoil/curse damage
    }

    /**
     * Reset for a new battle
     */
    reset() {
        this.turnNumber = 0;
        this.battleState.turnCount = 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TurnManager };
}
