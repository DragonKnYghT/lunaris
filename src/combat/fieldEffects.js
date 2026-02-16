/**
 * fieldEffects.js
 * Field effects system for Lunaris battles
 */

// LUNARIS_TODO: add more field effects later

/**
 * FieldEffect types
 */
const FieldEffectType = {
    REFLECT: 'reflect',
    BARRIER: 'barrier',
    SPIKES: 'spikes',
    MIST: 'mist',
    LIGHT_SCREEN: 'lightScreen',
    AURORA_VEIL: 'auroraVeil'
};

/**
 * Field effects registry
 */
const fieldEffects = {};

/**
 * Register a field effect
 * @param {string} type - Effect type
 * @param {Object} effect - Effect definition
 */
function registerFieldEffect(type, effect) {
    fieldEffects[type] = effect;
    console.log(`[FieldEffects] Registered: ${type}`);
}

/**
 * Get field effect
 * @param {string} type - Effect type
 * @returns {Object|null} Effect definition
 */
function getFieldEffect(type) {
    return fieldEffects[type] || null;
}

// ============================================
// Field Effect Implementations
// ============================================

/**
 * Reflect - Doubles defense of friendly team
 */
registerFieldEffect(FieldEffectType.REFLECT, {
    name: 'Reflect',
    description: 'Doubles the defense of friendly team for 5 turns.',
    duration: 5,
    target: 'team',  // 'self' or 'enemy' or 'team'
    side: 'player',  // 'player' or 'enemy'
    onApply: function(battleState, side) {
        return { message: 'Reflect raised your team\'s defense!' };
    },
    onDamageModify: function(damage, attacker, defender, move, battleState) {
        // Only affects physical moves
        if (move.category === 'Physical') {
            return Math.floor(damage * 0.5);
        }
        return damage;
    },
    onEnd: function(battleState, side) {
        return { message: 'Your team\'s defense returned to normal.' };
    }
});

/**
 * Barrier - Doubles special defense of friendly team
 */
registerFieldEffect(FieldEffectType.BARRIER, {
    name: 'Barrier',
    description: 'Doubles the special defense of friendly team for 5 turns.',
    duration: 5,
    target: 'team',
    side: 'player',
    onApply: function(battleState, side) {
        return { message: 'Barrier raised your team\'s special defense!' };
    },
    onDamageModify: function(damage, attacker, defender, move, battleState) {
        // Only affects special moves
        if (move.category === 'Special') {
            return Math.floor(damage * 0.5);
        }
        return damage;
    },
    onEnd: function(battleState, side) {
        return { message: 'Your team\'s special defense returned to normal.' };
    }
});

/**
 * Spikes - Damages enemies when they switch in
 */
registerFieldEffect(FieldEffectType.SPIKES, {
    name: 'Spikes',
    description: 'Damages enemies when they switch in.',
    duration: -1,  // Permanent until removed
    layers: 3,  // Can stack up to 3 layers
    target: 'enemy',
    side: 'player',
    onApply: function(battleState, side) {
        const layers = (battleState.fieldEffects[side]?.spikes?.layers || 0) + 1;
        return { message: `Spikes scattered on the ${side} side! (Layer ${layers})` };
    },
    onSwitchIn: function(creature, battleState, side) {
        // Check if spikes are on the opposite side
        const oppositeSide = side === 'player' ? 'enemy' : 'player';
        const spikes = battleState.fieldEffects[oppositeSide]?.spikes;
        
        if (!spikes) return null;
        
        const layers = spikes.layers || 1;
        const damage = Math.floor(creature.maxHp * layers / 8);
        creature.takeDamage(damage);
        
        return { message: `${creature.name} is hurt by Spikes!`, damage: damage };
    },
    onEnd: function(battleState, side) {
        return { message: 'Spikes disappeared from the ' + side + ' side.' };
    }
});

/**
 * Mist - Prevents stat reduction
 */
registerFieldEffect(FieldEffectType.MIST, {
    name: 'Mist',
    description: 'Protects team from stat reduction for 5 turns.',
    duration: 5,
    target: 'team',
    side: 'player',
    onApply: function(battleState, side) {
        return { message: 'Mist surrounded your team!' };
    },
    canReduceStat: function(creature, stat, battleState, side) {
        // Check if mist is active on creature's side
        const mist = battleState.fieldEffects[side]?.mist;
        if (mist && mist.duration > 0) {
            return false;
        }
        return true;
    },
    onEnd: function(battleState, side) {
        return { message: 'The mist faded.' };
    }
});

/**
 * Light Screen - Same as Barrier but for special
 */
registerFieldEffect(FieldEffectType.LIGHT_SCREEN, {
    name: 'Light Screen',
    description: 'Doubles the special defense of friendly team for 5 turns.',
    duration: 5,
    target: 'team',
    side: 'player',
    onApply: function(battleState, side) {
        return { message: 'Light Screen raised your team\'s special defense!' };
    },
    onDamageModify: function(damage, attacker, defender, move, battleState) {
        // Only affects special moves
        if (move.category === 'Special') {
            return Math.floor(damage * 0.5);
        }
        return damage;
    },
    onEnd: function(battleState, side) {
        return { message: 'Your team\'s special defense returned to normal.' };
    }
});

/**
 * Aurora Veil - Reduces damage in hail/snow
 */
registerFieldEffect(FieldEffectType.AURORA_VEIL, {
    name: 'Aurora Veil',
    description: 'Halves damage from attacks for 5 turns. Only works in hail.',
    duration: 5,
    target: 'team',
    side: 'player',
    onApply: function(battleState, side) {
        return { message: 'Aurora Veil raised your team\'s defense!' };
    },
    onDamageModify: function(damage, attacker, defender, move, battleState) {
        // Only works in hail
        if (battleState.weather?.type === 'hail') {
            return Math.floor(damage * 0.5);
        }
        return damage;
    },
    onEnd: function(battleState, side) {
        return { message: 'Your team\'s defense returned to normal.' };
    }
});

// ============================================
// Field Effects Manager
// ============================================

/**
 * FieldEffectsManager class
 * Manages field effects in battles
 */
class FieldEffectsManager {
    constructor(battleState) {
        this.battleState = battleState;
        // Initialize field effects for both sides
        this.battleState.fieldEffects = {
            player: {},
            enemy: {}
        };
    }
    
    /**
     * Add a field effect
     * @param {string} type - Effect type
     * @param {string} side - 'player' or 'enemy'
     * @returns {Object} Result
     */
    addEffect(type, side) {
        const effect = getFieldEffect(type);
        if (!effect) {
            return { success: false, message: `Unknown field effect: ${type}` };
        }
        
        // Check if effect can be applied
        if (this.battleState.fieldEffects[side][type]) {
            // Effect already exists
            if (type === FieldEffectType.SPIKES) {
                // Spikes can stack
                const currentLayers = this.battleState.fieldEffects[side][type].layers || 0;
                if (currentLayers < 3) {
                    this.battleState.fieldEffects[side][type].layers = currentLayers + 1;
                    const result = effect.onApply(this.battleState, side);
                    return { success: true, message: result.message };
                }
            }
            return { success: false, message: `${effect.name} is already active!` };
        }
        
        // Apply effect
        this.battleState.fieldEffects[side][type] = {
            type: type,
            duration: effect.duration,
            layers: type === FieldEffectType.SPIKES ? 1 : 0
        };
        
        const result = effect.onApply(this.battleState, side);
        this.battleState.log(result.message);
        
        console.log(`[FieldEffects] Added ${type} to ${side} side`);
        
        return { success: true, message: result.message };
    }
    
    /**
     * Remove a field effect
     * @param {string} type - Effect type
     * @param {string} side - 'player' or 'enemy'
     */
    removeEffect(type, side) {
        const effect = getFieldEffect(type);
        if (!effect) return;
        
        if (this.battleState.fieldEffects[side][type]) {
            const result = effect.onEnd(this.battleState, side);
            this.battleState.log(result.message);
            
            delete this.battleState.fieldEffects[side][type];
        }
    }
    
    /**
     * Process effects at end of turn
     * @param {string} side - Side to process
     */
    processTurnEnd(side) {
        const effects = this.battleState.fieldEffects[side];
        
        for (const [type, data] of Object.entries(effects)) {
            if (data.duration > 0) {
                data.duration--;
                
                if (data.duration === 0) {
                    this.removeEffect(type, side);
                }
            }
        }
    }
    
    /**
     * Process switch in effects
     * @param {Object} creature - Creature switching in
     * @param {string} side - Side the creature is switching to
     */
    processSwitchIn(creature, side) {
        const oppositeSide = side === 'player' ? 'enemy' : 'player';
        const effects = this.battleState.fieldEffects[oppositeSide];
        
        for (const [type, data] of Object.entries(effects)) {
            const effect = getFieldEffect(type);
            
            if (effect && effect.onSwitchIn) {
                const result = effect.onSwitchIn(creature, this.battleState, oppositeSide);
                if (result) {
                    this.battleState.log(result.message);
                }
            }
        }
    }
    
    /**
     * Get damage modification from field effects
     * @param {number} damage - Original damage
     * @param {Object} attacker - Attacking creature
     * @param {Object} defender - Defending creature
     * @param {Object} move - Move being used
     * @param {string} defenderSide - Side of defender
     * @returns {number} Modified damage
     */
    getDamageModification(damage, attacker, defender, move, defenderSide) {
        const effects = this.battleState.fieldEffects[defenderSide];
        let modifiedDamage = damage;
        
        for (const [type, data] of Object.entries(effects)) {
            const effect = getFieldEffect(type);
            
            if (effect && effect.onDamageModify) {
                modifiedDamage = effect.onDamageModify(modifiedDamage, attacker, defender, move, this.battleState);
            }
        }
        
        return modifiedDamage;
    }
    
    /**
     * Check if a stat can be reduced
     * @param {Object} creature - Creature
     * @param {string} stat - Stat being reduced
     * @param {string} side - Side of the creature
     * @returns {boolean} True if stat can be reduced
     */
    canReduceStat(creature, stat, side) {
        const effects = this.battleState.fieldEffects[side];
        
        for (const [type, data] of Object.entries(effects)) {
            const effect = getFieldEffect(type);
            
            if (effect && effect.canReduceStat) {
                if (!effect.canReduceStat(creature, stat, this.battleState, side)) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    /**
     * Get active effects info
     * @param {string} side - Side to get info for
     * @returns {Array} Array of active effects
     */
    getActiveEffects(side) {
        const effects = this.battleState.fieldEffects[side];
        return Object.entries(effects).map(([type, data]) => {
            const effect = getFieldEffect(type);
            return {
                name: effect?.name || type,
                type: type,
                duration: data.duration,
                layers: data.layers
            };
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FieldEffectType,
        fieldEffects,
        registerFieldEffect,
        getFieldEffect,
        FieldEffectsManager
    };
}
