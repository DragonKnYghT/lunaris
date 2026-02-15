/**
 * statusEffects.js
 * Status effect system for Lunaris
 */

// LUNARIS_TODO: add custom Lunaris status effects later

/**
 * Status effect definitions
 */
const statusEffects = {
    /**
     * Burn status
     * - Deals damage each turn
     * - Reduces attack stat
     */
    burn: {
        name: "Burn",
        description: "Takes damage each turn. Attack stat is reduced.",
        type: "damage",
        onApply: function(creature) {
            // Burn reduces attack by 50%
            creature.stats.atk = Math.floor(creature.stats.atk * 0.5);
            return { success: true, message: `${creature.name} is burned!` };
        },
        onTurnStart: function(creature) {
            // Take 1/8 of max HP as damage
            const damage = Math.floor(creature.maxHp / 8);
            const fainted = creature.takeDamage(damage);
            return { 
                damage: damage, 
                fainted: fainted, 
                message: `${creature.name} is hurt by its burn!` 
            };
        },
        onTurnEnd: function(creature) {
            // Burn doesn't have end of turn effects
            return null;
        },
        canApply: function(creature) {
            // Can apply to any non-fire type creature
            return !creature.types.includes("Fire");
        }
    },
    
    /**
     * Poison status
     * - Deals damage each turn (less than burn)
     */
    poison: {
        name: "Poison",
        description: "Takes damage each turn.",
        type: "damage",
        onApply: function(creature) {
            return { success: true, message: `${creature.name} was poisoned!` };
        },
        onTurnStart: function(creature) {
            // Take 1/8 of max HP as damage (like burn)
            const damage = Math.floor(creature.maxHp / 8);
            const fainted = creature.takeDamage(damage);
            return { 
                damage: damage, 
                fainted: fainted, 
                message: `${creature.name} is hurt by poison!` 
            };
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            // Can apply to any non-poison/steel type creature
            return !creature.types.includes("Poison") && !creature.types.includes("Metal");
        }
    },
    
    /**
     * Badly Poison status
     * - Deals increasing damage each turn
     */
    toxic: {
        name: "Badly Poison",
        description: "Takes increasing damage each turn.",
        type: "damage",
        turnsActive: 0,
        onApply: function(creature) {
            creature.statusData = { turnsActive: 0 };
            return { success: true, message: `${creature.name} was badly poisoned!` };
        },
        onTurnStart: function(creature) {
            if (!creature.statusData) creature.statusData = { turnsActive: 0 };
            creature.statusData.turnsActive++;
            
            // Damage increases each turn (1/16, 2/16, 3/16, etc.)
            const damage = Math.floor(creature.maxHp * creature.statusData.turnsActive / 16);
            const fainted = creature.takeDamage(damage);
            return { 
                damage: damage, 
                fainted: fainted, 
                message: `${creature.name} is hurt by toxic poison!` 
            };
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            return !creature.types.includes("Poison") && !creature.types.includes("Metal");
        }
    },
    
    /**
     * Sleep status
     * - Creature cannot act for 1-3 turns
     */
    sleep: {
        name: "Sleep",
        description: "Cannot act for 1-3 turns.",
        type: "immobilize",
        onApply: function(creature) {
            // Random sleep duration: 1-3 turns
            const duration = Math.floor(Math.random() * 3) + 1;
            creature.statusData = { turnsRemaining: duration };
            return { success: true, message: `${creature.name} fell asleep!` };
        },
        onTurnStart: function(creature) {
            if (!creature.statusData || creature.statusData.turnsRemaining <= 0) {
                // Wake up
                creature.removeStatus();
                return { 
                    damage: 0, 
                    fainted: false, 
                    message: `${creature.name} woke up!`,
                    wokeUp: true
                };
            }
            
            creature.statusData.turnsRemaining--;
            return { 
                damage: 0, 
                fainted: false, 
                message: `${creature.name} is fast asleep!`,
                cannotAct: true
            };
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            return true;
        }
    },
    
    /**
     * Paralysis status
     * - Reduces speed significantly
     * - May cause creature to be unable to act
     */
    paralysis: {
        name: "Paralysis",
        description: "Speed is reduced. May cause inability to act.",
        type: "stat_modifier",
        onApply: function(creature) {
            // Paralysis reduces speed by 50%
            creature.stats.spe = Math.floor(creature.stats.spe * 0.5);
            return { success: true, message: `${creature.name} is paralyzed! It may not attack!` };
        },
        onTurnStart: function(creature) {
            // 25% chance to be unable to act
            const cannotAct = Math.random() < 0.25;
            if (cannotAct) {
                return { 
                    damage: 0, 
                    fainted: false, 
                    message: `${creature.name} is paralyzed! It can't move!`,
                    cannotAct: true
                };
            }
            return { 
                damage: 0, 
                fainted: false, 
                message: "",
                cannotAct: false
            };
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            return !creature.types.includes("Electric");
        }
    },
    
    /**
     * Freeze status
     * - Creature cannot act
     * - Can be thawed by fire moves or random chance
     */
    freeze: {
        name: "Freeze",
        description: "Cannot act. Can be thawed by fire moves or at random.",
        type: "immobilize",
        onApply: function(creature) {
            return { success: true, message: `${creature.name} was frozen!` };
        },
        onTurnStart: function(creature) {
            // 20% chance to thaw naturally
            const thawed = Math.random() < 0.20;
            if (thawed) {
                creature.removeStatus();
                return { 
                    damage: 0, 
                    fainted: false, 
                    message: `${creature.name} thawed out!`,
                    thawed: true
                };
            }
            
            return { 
                damage: 0, 
                fainted: false, 
                message: `${creature.name} is frozen solid!`,
                cannotAct: true
            };
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            return !creature.types.includes("Ice");
        }
    },
    
    /**
     * Confusion status
     * - Creature may hurt itself instead of attacking
     */
    confusion: {
        name: "Confusion",
        description: "May hurt itself instead of attacking.",
        type: "volatile",
        onApply: function(creature) {
            // Confusion lasts 2-5 turns
            const duration = Math.floor(Math.random() * 4) + 2;
            creature.volatileStatus = creature.volatileStatus || [];
            creature.volatileStatus.push({
                type: "confusion",
                turnsRemaining: duration
            });
            return { success: true, message: `${creature.name} became confused!` };
        },
        onTurnStart: function(creature) {
            const confusion = creature.volatileStatus?.find(s => s.type === "confusion");
            if (!confusion) return null;
            
            confusion.turnsRemaining--;
            if (confusion.turnsRemaining <= 0) {
                // Remove confusion
                creature.volatileStatus = creature.volatileStatus.filter(s => s.type !== "confusion");
                return { 
                    damage: 0, 
                    fainted: false, 
                    message: `${creature.name} is no longer confused!`
                };
            }
            
            // 50% chance to hurt itself
            const hurtSelf = Math.random() < 0.5;
            if (hurtSelf) {
                const damage = Math.floor(creature.maxHp / 4);
                const fainted = creature.takeDamage(damage);
                return {
                    damage: damage,
                    fainted: fainted,
                    message: `${creature.name} hurt itself in its confusion!`,
                    confused: true,
                    hurtSelf: true
                };
            }
            
            return {
                damage: 0,
                fainted: false,
                message: `${creature.name} is confused!`,
                confused: true
            };
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            return true;
        }
    },
    
    /**
     * Attraction (Infatuation) status
     * - Creature may not attack the one it loves
     */
    attraction: {
        name: "Attraction",
        description: "May not attack the creature it's attracted to.",
        type: "volatile",
        onApply: function(creature, attractor) {
            creature.volatileStatus = creature.volatileStatus || [];
            creature.volatileStatus.push({
                type: "attraction",
                attractor: attractor
            });
            return { success: true, message: `${creature.name} fell in love!` };
        },
        onTurnStart: function(creature) {
            const attraction = creature.volatileStatus?.find(s => s.type === "attraction");
            if (!attraction) return null;
            
            // 50% chance to not attack
            const cannotAct = Math.random() < 0.5;
            if (cannotAct) {
                return {
                    damage: 0,
                    fainted: false,
                    message: `${creature.name} is in love with ${attraction.attractor.name}! It can't attack!`,
                    cannotAct: true
                };
            }
            return null;
        },
        onTurnEnd: function(creature) {
            return null;
        },
        canApply: function(creature) {
            return true;
        }
    }
};

/**
 * Apply a status effect to a creature
 * @param {Object} creature - The BattleCreature to apply status to
 * @param {string} statusType - The type of status (e.g., 'burn', 'poison')
 * @param {Object} source - The source of the status (for attraction, etc.)
 * @returns {Object} Result of applying status
 */
function applyStatus(creature, statusType, source = null) {
    const status = statusEffects[statusType];
    
    if (!status) {
        return { success: false, message: `Unknown status: ${statusType}` };
    }
    
    // Check if creature already has this status
    if (creature.status === statusType) {
        return { success: false, message: `${creature.name} already has ${status.name}!` };
    }
    
    // Check if status can be applied
    if (status.canApply && !status.canApply(creature)) {
        return { success: false, message: `But it had no effect!` };
    }
    
    // Apply status
    const result = status.onApply(creature, source);
    
    if (result.success) {
        creature.status = statusType;
    }
    
    return result;
}

/**
 * Update status effects at the start of a turn
 * @param {Object} creature - The BattleCreature to update
 * @returns {Object} Status update result
 */
function updateStatusOnTurnStart(creature) {
    if (!creature.status || !statusEffects[creature.status]) {
        return null;
    }
    
    const status = statusEffects[creature.status];
    
    if (status.onTurnStart) {
        return status.onTurnStart(creature);
    }
    
    return null;
}

/**
 * Update status effects at the end of a turn
 * @param {Object} creature - The BattleCreature to update
 * @returns {Object} Status update result
 */
function updateStatusOnTurnEnd(creature) {
    if (!creature.status || !statusEffects[creature.status]) {
        return null;
    }
    
    const status = statusEffects[creature.status];
    
    if (status.onTurnEnd) {
        return status.onTurnEnd(creature);
    }
    
    return null;
}

/**
 * Remove a status effect from a creature
 * @param {Object} creature - The BattleCreature
 * @param {string} statusType - Optional specific status to remove
 */
function removeStatus(creature, statusType = null) {
    if (statusType) {
        // Remove specific status
        if (creature.status === statusType) {
            creature.status = null;
            creature.statusData = null;
        }
    } else {
        // Remove all statuses
        creature.status = null;
        creature.statusData = null;
        creature.volatileStatus = [];
    }
}

/**
 * Get all available status effects
 * @returns {Array} Array of status effect keys
 */
function getAllStatusEffects() {
    return Object.keys(statusEffects);
}

/**
 * Get status effect info
 * @param {string} statusType - The status effect key
 * @returns {Object} Status effect definition
 */
function getStatusEffect(statusType) {
    return statusEffects[statusType];
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        statusEffects,
        applyStatus,
        updateStatusOnTurnStart,
        updateStatusOnTurnEnd,
        removeStatus,
        getAllStatusEffects,
        getStatusEffect
    };
}
