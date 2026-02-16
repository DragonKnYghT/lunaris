/**
 * rulesetManager.js
 * Manages rulesets for versus mode in Lunaris
 */

// LUNARIS_TODO: expand rulesets later

/**
 * RulesetManager class
 * Handles ruleset loading and validation
 */
class RulesetManager {
    /**
     * @param {Object} data - Game data
     */
    constructor(data) {
        this.data = data;
        this.rulesets = this.loadDefaultRulesets();
    }

    /**
     * Load default rulesets
     * @returns {Object} Default rulesets
     */
    loadDefaultRulesets() {
        return {
            standard: {
                name: "Standard",
                description: "Standard versus rules",
                minTeamSize: 1,
                maxTeamSize: 6,
                levelCap: 100,
                noDuplicateTypes: false,
                noLegendaries: false,
                allowMegaEvolutions: true,
                allowZMoves: true,
                allowDynamax: true,
                timerEnabled: false,
                timerSeconds: 300
            },
            no_legendaries: {
                name: "No Legendaries",
                description: "No legendary creatures allowed",
                minTeamSize: 1,
                maxTeamSize: 6,
                levelCap: 100,
                noDuplicateTypes: false,
                noLegendaries: true,
                legendaryIds: ["example_creature_stage3"], // Placeholder
                allowMegaEvolutions: true,
                allowZMoves: true,
                allowDynamax: true,
                timerEnabled: false,
                timerSeconds: 300
            },
            balanced_level_50: {
                name: "Balanced Level 50",
                description: "Level 50 balanced format",
                minTeamSize: 1,
                maxTeamSize: 6,
                levelCap: 50,
                noDuplicateTypes: false,
                noLegendaries: false,
                allowMegaEvolutions: false,
                allowZMoves: false,
                allowDynamax: false,
                timerEnabled: true,
                timerSeconds: 300
            },
            monotype: {
                name: "Monotype",
                description: "All creatures must share a type",
                minTeamSize: 1,
                maxTeamSize: 6,
                levelCap: 100,
                noDuplicateTypes: true,
                noLegendaries: false,
                requireSameType: true,
                allowMegaEvolutions: true,
                allowZMoves: true,
                allowDynamax: true,
                timerEnabled: false,
                timerSeconds: 300
            },
            little_cup: {
                name: "Little Cup",
                description: "Only unevolved creatures, Level 5",
                minTeamSize: 1,
                maxTeamSize: 6,
                levelCap: 5,
                noDuplicateTypes: false,
                noLegendaries: true,
                onlyUn-evolved: true,
                allowMegaEvolutions: false,
                allowZMoves: false,
                allowDynamax: false,
                timerEnabled: false,
                timerSeconds: 300
            },
            inverse: {
                name: "Inverse Battle",
                description: "Type matchups are reversed",
                minTeamSize: 1,
                maxTeamSize: 6,
                levelCap: 100,
                noDuplicateTypes: false,
                noLegendaries: false,
                inverseMode: true,
                allowMegaEvolutions: true,
                allowZMoves: true,
                allowDynamax: true,
                timerEnabled: false,
                timerSeconds: 300
            }
        };
    }

    /**
     * Load a ruleset by name
     * @param {string} name - Ruleset name
     * @returns {Object|null} Ruleset data
     */
    loadRuleset(name) {
        const ruleset = this.rulesets[name];
        if (!ruleset) {
            console.warn(`[RulesetManager] Ruleset not found: ${name}`);
            return null;
        }
        
        console.log(`[RulesetManager] Loaded ruleset: ${name}`);
        return { ...ruleset };
    }

    /**
     * Get all available rulesets
     * @returns {Array} Array of ruleset info
     */
    getAllRulesets() {
        return Object.entries(this.rulesets).map(([id, ruleset]) => ({
            id: id,
            name: ruleset.name,
            description: ruleset.description
        }));
    }

    /**
     * Validate a team against a ruleset
     * @param {Array} team - Team to validate
     * @param {string} rulesetName - Ruleset name
     * @returns {Object} Validation result
     */
    validateTeam(team, rulesetName) {
        const ruleset = this.loadRuleset(rulesetName);
        if (!ruleset) {
            return {
                valid: false,
                errors: ['Ruleset not found']
            };
        }
        
        const errors = [];
        const warnings = [];
        
        // Check team size
        if (team.length < ruleset.minTeamSize) {
            errors.push(`Team must have at least ${ruleset.minTeamSize} creatures`);
        }
        if (team.length > ruleset.maxTeamSize) {
            errors.push(`Team can have at most ${ruleset.maxTeamSize} creatures`);
        }
        
        // Check level cap
        for (const creature of team) {
            if (creature.level > ruleset.levelCap) {
                errors.push(`${creature.name} exceeds level cap of ${ruleset.levelCap}`);
            }
        }
        
        // Check for legendaries
        if (ruleset.noLegendaries && ruleset.legendaryIds) {
            const hasLegendary = team.some(c => ruleset.legendaryIds.includes(c.id));
            if (hasLegendary) {
                errors.push('Legendary creatures are not allowed in this ruleset');
            }
        }
        
        // Check for duplicate types
        if (ruleset.noDuplicateTypes) {
            const types = team.flatMap(c => c.types || []);
            const uniqueTypes = new Set(types);
            if (types.length !== uniqueTypes.size) {
                warnings.push('Team has duplicate types');
            }
        }
        
        // Check for same type (monotype)
        if (ruleset.requireSameType) {
            const allTypes = team.map(c => c.types || []).flat();
            const firstTypes = team[0]?.types || [];
            const hasMixedTypes = allTypes.some(t => !firstTypes.includes(t));
            if (hasMixedTypes && team.length > 1) {
                errors.push('All creatures must share at least one type');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }

    /**
     * Apply rules to a match
     * @param {Object} match - Match object
     * @param {string} rulesetName - Ruleset name
     * @returns {Object} Updated match
     */
    applyRulesToMatch(match, rulesetName) {
        const ruleset = this.loadRuleset(rulesetName);
        if (!ruleset) {
            console.error(`[RulesetManager] Could not apply ruleset: ${rulesetName}`);
            return match;
        }
        
        // Apply ruleset settings to match
        match.ruleset = rulesetName;
        match.rules = {
            levelCap: ruleset.levelCap,
            noLegendaries: ruleset.noLegendaries,
            timerEnabled: ruleset.timerEnabled,
            timerSeconds: ruleset.timerSeconds,
            inverseMode: ruleset.inverseMode || false
        };
        
        console.log(`[RulesetManager] Applied ruleset ${rulesetName} to match`);
        
        return match;
    }

    /**
     * Create custom ruleset
     * @param {string} name - Ruleset name
     * @param {Object} rules - Rules
     * @returns {Object} Created ruleset
     */
    createCustomRuleset(name, rules) {
        const customRuleset = {
            name: rules.name || name,
            description: rules.description || 'Custom ruleset',
            minTeamSize: rules.minTeamSize || 1,
            maxTeamSize: rules.maxTeamSize || 6,
            levelCap: rules.levelCap || 100,
            noDuplicateTypes: rules.noDuplicateTypes || false,
            noLegendaries: rules.noLegendaries || false,
            allowMegaEvolutions: rules.allowMegaEvolutions !== false,
            allowZMoves: rules.allowZMoves !== false,
            allowDynamax: rules.allowDynamax !== false,
            timerEnabled: rules.timerEnabled || false,
            timerSeconds: rules.timerSeconds || 300
        };
        
        this.rulesets[name] = customRuleset;
        
        console.log(`[RulesetManager] Created custom ruleset: ${name}`);
        
        return customRuleset;
    }

    /**
     * Get ruleset info
     * @param {string} name - Ruleset name
     * @returns {Object} Ruleset info
     */
    getRulesetInfo(name) {
        const ruleset = this.rulesets[name];
        if (!ruleset) {
            return null;
        }
        
        return {
            id: name,
            name: ruleset.name,
            description: ruleset.description,
            settings: {
                levelCap: ruleset.levelCap,
                maxTeamSize: ruleset.maxTeamSize,
                noLegendaries: ruleset.noLegendaries,
                timerEnabled: ruleset.timerEnabled
            }
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RulesetManager };
}
