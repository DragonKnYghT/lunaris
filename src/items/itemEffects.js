/**
 * itemEffects.js
 * Registry of item effects in Lunaris
 */

// LUNARIS_TODO: implement full item logic later

/**
 * ItemEffects registry
 * Contains all item effect handlers
 */
const ItemEffects = {
    // Healing items
    healing: {
        LunarPotion: {
            description: "Restores 20 HP to a creature.",
            applyEffect: function(target, context) {
                const healAmount = 20;
                target.currentHp = Math.min(target.maxHp, target.currentHp + healAmount);
                return {
                    success: true,
                    message: `Restored ${healAmount} HP!`,
                    hpRestored: healAmount
                };
            }
        },
        SuperLunarPotion: {
            description: "Restores 50 HP to a creature.",
            applyEffect: function(target, context) {
                const healAmount = 50;
                target.currentHp = Math.min(target.maxHp, target.currentHp + healAmount);
                return {
                    success: true,
                    message: `Restored ${healAmount} HP!`,
                    hpRestored: healAmount
                };
            }
        },
        HyperLunarPotion: {
            description: "Restores 100 HP to a creature.",
            applyEffect: function(target, context) {
                const healAmount = 100;
                target.currentHp = Math.min(target.maxHp, target.currentHp + healAmount);
                return {
                    success: true,
                    message: `Restored ${healAmount} HP!`,
                    hpRestored: healAmount
                };
            }
        },
        FullRestore: {
            description: "Fully restores a creature's HP and cures status conditions.",
            applyEffect: function(target, context) {
                target.currentHp = target.maxHp;
                target.status = null;
                return {
                    success: true,
                    message: "Fully restored HP and cured status!",
                    hpRestored: target.maxHp,
                    statusCured: true
                };
            }
        }
    },
    
    // Evolution items
    evolution: {
        MoonStone: {
            description: "A mysterious stone that evolves certain creatures.",
            applyEffect: function(target, context) {
                // LUNARIS_TODO: Check if creature can evolve with Moon Stone
                return {
                    success: true,
                    message: `${target.name} is evolving!`,
                    evolutionTriggered: true
                };
            }
        },
        SunStone: {
            description: "A radiant stone that evolves certain creatures.",
            applyEffect: function(target, context) {
                // LUNARIS_TODO: Check if creature can evolve with Sun Stone
                return {
                    success: true,
                    message: `${target.name} is evolving!`,
                    evolutionTriggered: true
                };
            }
        }
    },
    
    // Revival items
    revival: {
        Revive: {
            description: "Revives a fainted creature with half HP.",
            applyEffect: function(target, context) {
                if (!target.isFainted) {
                    return {
                        success: false,
                        message: `${target.name} is not fainted!`
                    };
                }
                target.currentHp = Math.floor(target.maxHp / 2);
                target.isFainted = false;
                return {
                    success: true,
                    message: `${target.name} was revived with half HP!`,
                    hpRestored: target.currentHp
                };
            }
        },
        MaxRevive: {
            description: "Revives a fainted creature with full HP.",
            applyEffect: function(target, context) {
                if (!target.isFainted) {
                    return {
                        success: false,
                        message: `${target.name} is not fainted!`
                    };
                }
                target.currentHp = target.maxHp;
                target.isFainted = false;
                return {
                    success: true,
                    message: `${target.name} was fully revived!`,
                    hpRestored: target.currentHp
                };
            }
        }
    },
    
    // Status cure items
    status: {
        Antidote: {
            description: "Cures poison.",
            applyEffect: function(target, context) {
                if (target.status !== 'poison') {
                    return {
                        success: false,
                        message: `${target.name} is not poisoned!`
                    };
                }
                target.status = null;
                return {
                    success: true,
                    message: "Cured poison!",
                    statusCured: 'poison'
                };
            }
        },
        ParalyzeHeal: {
            description: "Cures paralysis.",
            applyEffect: function(target, context) {
                if (target.status !== 'paralysis') {
                    return {
                        success: false,
                        message: `${target.name} is not paralyzed!`
                    };
                }
                target.status = null;
                return {
                    success: true,
                    message: "Cured paralysis!",
                    statusCured: 'paralysis'
                };
            }
        },
        Awakening: {
            description: "Wakes up a sleeping creature.",
            applyEffect: function(target, context) {
                if (target.status !== 'sleep') {
                    return {
                        success: false,
                        message: `${target.name} is not asleep!`
                    };
                }
                target.status = null;
                return {
                    success: true,
                    message: "Woke up!",
                    statusCured: 'sleep'
                };
            }
        },
        IceHeal: {
            description: "Thaws a frozen creature.",
            applyEffect: function(target, context) {
                if (target.status !== 'freeze') {
                    return {
                        success: false,
                        message: `${target.name} is not frozen!`
                    };
                }
                target.status = null;
                return {
                    success: true,
                    message: "Thawed!",
                    statusCured: 'freeze'
                };
            }
        },
        BurnHeal: {
            description: "Cures a burn.",
            applyEffect: function(target, context) {
                if (target.status !== 'burn') {
                    return {
                        success: false,
                        message: `${target.name} is not burned!`
                    };
                }
                target.status = null;
                return {
                    success: true,
                    message: "Cured burn!",
                    statusCured: 'burn'
                };
            }
        }
    },
    
    // Run modifiers
    runModifiers: {
        RareCandy: {
            description: "Instantly levels up a creature by 1 level.",
            applyEffect: function(target, context) {
                target.level = (target.level || 1) + 1;
                // Recalculate stats
                // LUNARIS_TODO: Recalculate stats
                return {
                    success: true,
                    message: `${target.name} grew to level ${target.level}!`,
                    levelUp: true,
                    newLevel: target.level
                };
            }
        },
        AbilityCapsule: {
            description: "Allows changing between regular abilities.",
            applyEffect: function(target, context) {
                // LUNARIS_TODO: Show ability selection
                return {
                    success: true,
                    message: "Ability change available!",
                    abilityChangeAvailable: true
                };
            }
        }
    },
    
    // Tickets
    tickets: {
        run_ticket: {
            description: "Used to unlock a new run or continue after permadeath.",
            applyEffect: function(target, context) {
                return {
                    success: true,
                    message: "New run unlocked!",
                    effect: 'new_run'
                };
            }
        },
        revive_ticket: {
            description: "Used to revive a fainted creature in nuzlocke or challenge modes.",
            applyEffect: function(target, context) {
                target.isFainted = false;
                target.currentHp = Math.floor(target.maxHp / 2);
                return {
                    success: true,
                    message: `${target.name} was revived!`,
                    effect: 'revive'
                };
            }
        },
        capture_boost: {
            description: "Increases catch rate by 50% for one encounter.",
            applyEffect: function(target, context) {
                return {
                    success: true,
                    message: "Capture boost activated!",
                    effect: 'capture_boost',
                    bonus: 50
                };
            }
        },
        guaranteed_capture: {
            description: "Ensures the next capture attempt will succeed.",
            applyEffect: function(target, context) {
                return {
                    success: true,
                    message: "Guaranteed capture activated!",
                    effect: 'guaranteed_capture'
                };
            }
        }
    }
};

/**
 * Get effect for an item
 * @param {string} itemId - Item ID
 * @returns {Object|null} Effect handler
 */
function getItemEffect(itemId) {
    // Check healing items
    if (ItemEffects.healing[itemId]) {
        return ItemEffects.healing[itemId];
    }
    // Check evolution items
    if (ItemEffects.evolution[itemId]) {
        return ItemEffects.evolution[itemId];
    }
    // Check revival items
    if (ItemEffects.revival[itemId]) {
        return ItemEffects.revival[itemId];
    }
    // Check status items
    if (ItemEffects.status[itemId]) {
        return ItemEffects.status[itemId];
    }
    // Check run modifiers
    if (ItemEffects.runModifiers[itemId]) {
        return ItemEffects.runModifiers[itemId];
    }
    // Check tickets
    if (ItemEffects.tickets[itemId]) {
        return ItemEffects.tickets[itemId];
    }
    return null;
}

/**
 * Apply an item effect
 * @param {string} itemId - Item ID
 * @param {Object} target - Target object
 * @param {Object} context - Additional context
 * @returns {Object} Result
 */
function applyItemEffect(itemId, target, context = {}) {
    const effect = getItemEffect(itemId);
    
    if (!effect) {
        return {
            success: false,
            message: "Item effect not found!"
        };
    }
    
    return effect.applyEffect(target, context);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ItemEffects,
        getItemEffect,
        applyItemEffect
    };
}
