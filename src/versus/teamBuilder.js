/**
 * teamBuilder.js
 * Manages team building for versus mode in Lunaris
 */

// LUNARIS_TODO: add UI integration and drag/drop later

/**
 * TeamBuilder class
 * Handles team creation and validation for versus mode
 */
class TeamBuilder {
    /**
     * @param {Object} data - Game data (creatures)
     */
    constructor(data) {
        this.data = data;
        this.team = [];
        this.maxTeamSize = 6;
    }

    /**
     * Create an empty team
     * @returns {Array} Empty team
     */
    createEmptyTeam() {
        this.team = [];
        console.log('[TeamBuilder] Created empty team');
        return this.team;
    }

    /**
     * Add a creature to the team
     * @param {string} creatureId - Creature ID
     * @param {number} level - Level (default 50)
     * @returns {Object} Result
     */
    addCreatureToTeam(creatureId, level = 50) {
        // Check team size
        if (this.team.length >= this.maxTeamSize) {
            return {
                success: false,
                message: 'Team is full!'
            };
        }
        
        // Check if creature exists
        const creatureData = this.data.creatures[creatureId];
        if (!creatureData) {
            return {
                success: false,
                message: 'Creature not found!'
            };
        }
        
        // Check for duplicates
        const alreadyInTeam = this.team.some(c => c.id === creatureId);
        if (alreadyInTeam) {
            return {
                success: false,
                message: 'Creature already in team!'
            };
        }
        
        // Create team member
        const teamMember = {
            id: creatureId,
            name: creatureData.name,
            types: creatureData.types,
            level: level,
            moves: [...creatureData.moveset],
            // Calculate stats for level
            stats: this.calculateStats(creatureData.baseStats, level)
        };
        
        this.team.push(teamMember);
        console.log(`[TeamBuilder] Added ${creatureData.name} to team`);
        
        return {
            success: true,
            message: `${creatureData.name} added to team!`,
            team: this.team
        };
    }

    /**
     * Remove a creature from the team
     * @param {number} slot - Team slot (0-5)
     * @returns {Object} Result
     */
    removeCreatureFromTeam(slot) {
        if (slot < 0 || slot >= this.team.length) {
            return {
                success: false,
                message: 'Invalid slot!'
            };
        }
        
        const removed = this.team.splice(slot, 1)[0];
        console.log(`[TeamBuilder] Removed ${removed.name} from team`);
        
        return {
            success: true,
            message: `${removed.name} removed from team!`,
            team: this.team
        };
    }

    /**
     * Validate team against ruleset
     * @param {Object} ruleset - Ruleset to validate against
     * @returns {Object} Validation result
     */
    validateTeam(ruleset = {}) {
        const errors = [];
        const warnings = [];
        
        // Check team size
        if (this.team.length === 0) {
            errors.push('Team is empty!');
        } else if (this.team.length < ruleset.minTeamSize) {
            errors.push(`Team must have at least ${ruleset.minTeamSize} creatures`);
        }
        
        // Check for duplicate types (if required)
        if (ruleset.noDuplicateTypes) {
            const types = this.team.flatMap(c => c.types);
            const uniqueTypes = new Set(types);
            if (types.length !== uniqueTypes.size) {
                warnings.push('Team has duplicate types');
            }
        }
        
        // Check for legendary creatures (if restricted)
        if (ruleset.noLegendaries) {
            const legendaryIds = ['example_creature_stage3']; // Placeholder
            const hasLegendary = this.team.some(c => legendaryIds.includes(c.id));
            if (hasLegendary) {
                errors.push('Legendary creatures are not allowed in this ruleset');
            }
        }
        
        // Check level restrictions
        if (ruleset.levelCap) {
            const overLevel = this.team.filter(c => c.level > ruleset.levelCap);
            if (overLevel.length > 0) {
                errors.push(`Level cap is ${ruleset.levelCap}. Over-leveled: ${overLevel.map(c => c.name).join(', ')}`);
            }
        }
        
        // Check for duplicates
        const ids = this.team.map(c => c.id);
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
        if (duplicates.length > 0) {
            errors.push('Team has duplicate creatures');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings,
            team: this.team
        };
    }

    /**
     * Calculate stats for a creature at a given level
     * @param {Object} baseStats - Base stats
     * @param {number} level - Level
     * @returns {Object} Calculated stats
     */
    calculateStats(baseStats, level) {
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
     * Get current team
     * @returns {Array} Current team
     */
    getTeam() {
        return [...this.team];
    }

    /**
     * Get team summary
     * @returns {Object} Team summary
     */
    getTeamSummary() {
        return {
            size: this.team.length,
            maxSize: this.maxTeamSize,
            creatures: this.team.map((c, i) => ({
                slot: i,
                id: c.id,
                name: c.name,
                types: c.types,
                level: c.level
            }))
        };
    }

    /**
     * Swap creatures in team
     * @param {number} slot1 - First slot
     * @param {number} slot2 - Second slot
     * @returns {Object} Result
     */
    swapCreatures(slot1, slot2) {
        if (slot1 < 0 || slot1 >= this.team.length ||
            slot2 < 0 || slot2 >= this.team.length) {
            return {
                success: false,
                message: 'Invalid slots!'
            };
        }
        
        [this.team[slot1], this.team[slot2]] = [this.team[slot2], this.team[slot1]];
        
        return {
            success: true,
            message: 'Team reordered',
            team: this.team
        };
    }

    /**
     * Clear team
     */
    clearTeam() {
        this.team = [];
        console.log('[TeamBuilder] Team cleared');
    }

    /**
     * Load team from data
     * @param {Array} teamData - Team data
     */
    loadTeam(teamData) {
        this.team = [];
        for (const member of teamData) {
            this.addCreatureToTeam(member.id, member.level);
        }
    }

    /**
     * Get available creatures for team building
     * @param {Object} filters - Optional filters
     * @returns {Array} Available creatures
     */
    getAvailableCreatures(filters = {}) {
        let creatures = Object.entries(this.data.creatures)
            .filter(([id]) => !id.startsWith('_'))
            .map(([id, data]) => ({
                id: id,
                name: data.name,
                types: data.types,
                baseStats: data.baseStats
            }));
        
        // Apply filters
        if (filters.type) {
            creatures = creatures.filter(c => c.types.includes(filters.type));
        }
        
        if (filters.legends !== true) {
            // Filter out legendaries if needed
            // Placeholder - would check actual legendary status
        }
        
        return creatures;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TeamBuilder };
}
