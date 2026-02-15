/**
 * BattleState.js
 * Manages the state of a battle in Lunaris
 */

// LUNARIS_TODO: expand battle state fields later

/**
 * Represents a creature in battle
 */
class BattleCreature {
    /**
     * @param {Object} creatureData - The creature data from JSON
     * @param {string} creatureId - The ID of the creature
     * @param {number} level - The level of the creature
     */
    constructor(creatureData, creatureId, level = 1) {
        this.id = creatureId;
        this.name = creatureData.name;
        this.types = creatureData.types || [];
        this.level = level;
        
        // Calculate stats based on level
        this.stats = this.calculateStats(creatureData.baseStats, level);
        
        // Current HP (starts at max)
        this.currentHp = this.stats.hp;
        this.maxHp = this.stats.hp;
        
        // Status effect
        this.status = null;
        
        // Moves available
        this.moves = creatureData.moveset || [];
        
        // Abilities
        this.abilities = creatureData.abilities || [];
        this.hiddenAbility = creatureData.hiddenAbility || null;
        
        // Battle-specific flags
        this.isFainted = false;
        this.isActive = true;
        this.volatileStatus = [];
    }

    /**
     * Calculate stats based on base stats and level
     * Simplified formula for now
     * @param {Object} baseStats - Base stats from creature data
     * @param {number} level - Creature level
     * @returns {Object} Calculated stats
     */
    calculateStats(baseStats, level) {
        // Simplified stat calculation
        // In a full implementation, this would use a proper formula
        return {
            hp: Math.floor((baseStats.hp * 2 + 31) * level / 100) + level + 10,
            atk: Math.floor((baseStats.atk * 2 + 31) * level / 100) + 5,
            def: Math.floor((baseStats.def * 2 + 31) * level / 100) + 5,
            spa: Math.floor((baseStats.spa * 2 + 31) * level / 100) + 5,
            spd: Math.floor((baseStats.spd * 2 + 31) * level / 100) + 5,
            spe: Math.floor((baseStats.spe * 2 + 31) * level / 100) + 5
        };
    }

    /**
     * Take damage
     * @param {number} damage - Amount of damage to take
     * @returns {boolean} True if creature fainted
     */
    takeDamage(damage) {
        this.currentHp = Math.max(0, this.currentHp - damage);
        this.isFainted = this.currentHp <= 0;
        return this.isFainted;
    }

    /**
     * Heal the creature
     * @param {number} amount - Amount of HP to restore
     */
    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    }

    /**
     * Apply a status effect
     * @param {string} status - Status effect to apply
     * @returns {boolean} True if status was applied
     */
    applyStatus(status) {
        if (this.status) return false; // Already has a status
        this.status = status;
        return true;
    }

    /**
     * Remove status effect
     */
    removeStatus() {
        this.status = null;
    }

    /**
     * Check if creature can act (not fainted, not frozen, etc.)
     * @returns {boolean}
     */
    canAct() {
        return !this.isFainted && this.isActive;
    }
}

/**
 * Main BattleState class
 * Stores all information about a battle
 */
class BattleState {
    /**
     * @param {Object} playerTeam - Array of creature IDs or objects
     * @param {Object} enemyTeam - Array of creature IDs or objects
     * @param {Object} data - Game data (creatures, moves, etc.)
     */
    constructor(playerTeam, enemyTeam, data) {
        this.data = data;
        
        // Initialize teams
        this.playerTeam = this.initializeTeam(playerTeam, 'player');
        this.enemyTeam = this.initializeTeam(enemyTeam, 'enemy');
        
        // Active creatures (first in each team)
        this.playerActive = this.playerTeam.find(c => c && !c.isFainted) || null;
        this.enemyActive = this.enemyTeam.find(c => c && !c.isFainted) || null;
        
        // Turn order
        this.turnOrder = [];
        this.currentTurn = 0;
        
        // Weather/Field effects
        this.weather = null;
        this.field = [];
        
        // Status effects on field
        this.turnCount = 0;
        
        // Battle logs
        this.logs = [];
        
        // Battle status
        this.isOver = false;
        this.winner = null;
        
        // Action queue for the current turn
        this.playerAction = null;
        this.enemyAction = null;
    }

    /**
     * Initialize a team of creatures
     * @param {Array} teamData - Array of creature data
     * @param {string} teamType - 'player' or 'enemy'
     * @returns {Array} Array of BattleCreature objects
     */
    initializeTeam(teamData, teamType) {
        const team = [];
        
        if (Array.isArray(teamData)) {
            for (const creatureEntry of teamData) {
                let creatureId, level;
                
                if (typeof creatureEntry === 'string') {
                    creatureId = creatureEntry;
                    level = 5; // Default level
                } else {
                    creatureId = creatureEntry.id || creatureEntry.creatureId;
                    level = creatureEntry.level || 5;
                }
                
                // Get creature data from game data
                const creatureData = this.data.creatures[creatureId];
                if (creatureData) {
                    const battleCreature = new BattleCreature(creatureData, creatureId, level);
                    team.push(battleCreature);
                } else {
                    console.warn(`Creature not found: ${creatureId}`);
                }
            }
        }
        
        return team;
    }

    /**
     * Add a message to the battle log
     * @param {string} message - Message to log
     */
    log(message) {
        this.logs.push({
            turn: this.turnCount,
            message: message
        });
        console.log(`[Battle] ${message}`);
    }

    /**
     * Check if the battle is over
     * @returns {boolean}
     */
    checkBattleEnd() {
        const playerAlive = this.playerTeam.some(c => c && !c.isFainted);
        const enemyAlive = this.enemyTeam.some(c => c && !c.isFainted);
        
        if (!playerAlive) {
            this.isOver = true;
            this.winner = 'enemy';
            this.log('Player team has been defeated!');
            return true;
        }
        
        if (!enemyAlive) {
            this.isOver = true;
            this.winner = 'player';
            this.log('Enemy team has been defeated!');
            return true;
        }
        
        return false;
    }

    /**
     * Switch the active creature
     * @param {string} teamType - 'player' or 'enemy'
     * @param {number} slot - Index of creature to switch to
     * @returns {boolean} True if switch was successful
     */
    switchCreature(teamType, slot) {
        const team = teamType === 'player' ? this.playerTeam : this.enemyTeam;
        const active = teamType === 'player' ? this.playerActive : this.enemyActive;
        
        if (slot < 0 || slot >= team.length) return false;
        
        const newCreature = team[slot];
        if (!newCreature || newCreature.isFainted) return false;
        
        // Log the switch
        this.log(`${newCreature.name} switched in!`);
        
        if (teamType === 'player') {
            this.playerActive = newCreature;
        } else {
            this.enemyActive = newCreature;
        }
        
        return true;
    }

    /**
     * Get the opposing creature
     * @param {BattleCreature} creature - The creature to get opponent for
     * @returns {BattleCreature} The opposing creature
     */
    getOpponent(creature) {
        if (this.playerActive === creature) {
            return this.enemyActive;
        }
        return this.playerActive;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BattleState, BattleCreature };
}
