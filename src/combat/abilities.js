/**
 * abilities.js
 * Abilities system for Lunaris creatures
 */

// LUNARIS_TODO: add complex abilities later

/**
 * Ability registry
 * Maps ability names to their effect functions
 */
const abilityRegistry = {};

/**
 * Register an ability
 * @param {string} name - Ability name
 * @param {Object} ability - Ability definition
 */
function registerAbility(name, ability) {
    abilityRegistry[name] = ability;
    console.log(`[Abilities] Registered ability: ${name}`);
}

/**
 * Get an ability by name
 * @param {string} name - Ability name
 * @returns {Object|null} Ability definition
 */
function getAbility(name) {
    return abilityRegistry[name] || null;
}

/**
 * Check if a creature has an ability
 * @param {Object} creature - BattleCreature
 * @returns {boolean}
 */
function hasAbility(creature) {
    return creature.ability && abilityRegistry[creature.ability];
}

/**
 * Get creature's ability
 * @param {Object} creature - BattleCreature
 * @returns {Object|null}
 */
function getCreatureAbility(creature) {
    if (!creature.ability) return null;
    return abilityRegistry[creature.ability] || null;
}

// ============================================
// Ability Hooks
// ============================================

/**
 * Trigger onBeforeMove hook
 * @param {Object} creature - BattleCreature using the move
 * @param {Object} move - Move being used
 * @param {Object} target - Target creature
 * @param {Object} battleState - Current battle state
 * @returns {Object} Hook result {cancelled, message, modifiers}
 */
function onBeforeMove(creature, move, target, battleState) {
    const ability = getCreatureAbility(creature);
    if (!ability || !ability.onBeforeMove) return { cancelled: false, message: '', modifiers: {} };
    
    try {
        return ability.onBeforeMove(creature, move, target, battleState);
    } catch (e) {
        console.error(`[Abilities] Error in onBeforeMove for ${creature.ability}:`, e);
        return { cancelled: false, message: '', modifiers: {} };
    }
}

/**
 * Trigger onAfterMove hook
 * @param {Object} creature - BattleCreature that used the move
 * @param {Object} move - Move that was used
 * @param {Object} target - Target creature
 * @param {Object} result - Move result
 * @param {Object} battleState - Current battle state
 * @returns {Object} Hook result {message, effects}
 */
function onAfterMove(creature, move, target, result, battleState) {
    const ability = getCreatureAbility(creature);
    if (!ability || !ability.onAfterMove) return { message: '', effects: [] };
    
    try {
        return ability.onAfterMove(creature, move, target, result, battleState);
    } catch (e) {
        console.error(`[Abilities] Error in onAfterMove for ${creature.ability}:`, e);
        return { message: '', effects: [] };
    }
}

/**
 * Trigger onDamageTaken hook
 * @param {Object} creature - BattleCreature taking damage
 * @param {number} damage - Damage being taken
 * @param {Object} attacker - Attacking creature
 * @param {Object} battleState - Current battle state
 * @returns {Object} Hook result {modifiedDamage, message}
 */
function onDamageTaken(creature, damage, attacker, battleState) {
    const ability = getCreatureAbility(creature);
    if (!ability || !ability.onDamageTaken) return { modifiedDamage: damage, message: '' };
    
    try {
        return ability.onDamageTaken(creature, damage, attacker, battleState);
    } catch (e) {
        console.error(`[Abilities] Error in onDamageTaken for ${creature.ability}:`, e);
        return { modifiedDamage: damage, message: '' };
    }
}

/**
 * Trigger onDamageDealt hook
 * @param {Object} creature - BattleCreature dealing damage
 * @param {number} damage - Damage being dealt
 * @param {Object} target - Target creature
 * @param {Object} battleState - Current battle state
 * @returns {Object} Hook result {modifiedDamage, message}
 */
function onDamageDealt(creature, damage, target, battleState) {
    const ability = getCreatureAbility(creature);
    if (!ability || !ability.onDamageDealt) return { modifiedDamage: damage, message: '' };
    
    try {
        return ability.onDamageDealt(creature, damage, target, battleState);
    } catch (e) {
        console.error(`[Abilities] Error in onDamageDealt for ${creature.ability}:`, e);
        return { modifiedDamage: damage, message: '' };
    }
}

/**
 * Trigger onSwitchIn hook
 * @param {Object} creature - BattleCreature switching in
 * @param {Object} battleState - Current battle state
 * @returns {Object} Hook result {message, effects}
 */
function onSwitchIn(creature, battleState) {
    const ability = getCreatureAbility(creature);
    if (!ability || !ability.onSwitchIn) return { message: '', effects: [] };
    
    try {
        return ability.onSwitchIn(creature, battleState);
    } catch (e) {
        console.error(`[Abilities] Error in onSwitchIn for ${creature.ability}:`, e);
        return { message: '', effects: [] };
    }
}

/**
 * Trigger onSwitchOut hook
 * @param {Object} creature - BattleCreature switching out
 * @param {Object} battleState - Current battle state
 * @returns {Object} Hook result {message}
 */
function onSwitchOut(creature, battleState) {
    const ability = getCreatureAbility(creature);
    if (!ability || !ability.onSwitchOut) return { message: '' };
    
    try {
        return ability.onSwitchOut(creature, battleState);
    } catch (e) {
        console.error(`[Abilities] Error in onSwitchOut for ${creature.ability}:`, e);
        return { message: '' };
    }
}

// ============================================
// Placeholder Abilities
// ============================================

/**
 * Overgrow ability
 * Boosts Grass moves when HP is low
 */
registerAbility('Overgrow', {
    name: 'Overgrow',
    description: 'Boosts Grass moves when HP is below 33%.',
    onBeforeMove: function(creature, move, target, battleState) {
        const hpPercent = creature.currentHp / creature.maxHp;
        if (move.type === 'Grass' && hpPercent < 0.33) {
            return {
                cancelled: false,
                message: `${creature.name}'s Overgrow activated!`,
                modifiers: { power: 1.5 }
            };
        }
        return { cancelled: false, message: '', modifiers: {} };
    }
});

/**
 * Swift Feet ability
 * Boosts Speed when statused
 */
registerAbility('Swift Feet', {
    name: 'Swift Feet',
    description: 'Boosts Speed when affected by a status condition.',
    onSwitchIn: function(creature, battleState) {
        if (creature.status) {
            const originalSpeed = creature.stats.spe;
            creature.stats.spe = Math.floor(originalSpeed * 1.5);
            return {
                message: `${creature.name}'s Swift Feet activated! Speed boosted!`,
                effects: []
            };
        }
        return { message: '', effects: [] };
    }
});

/**
 * Thick Hide ability
 * Reduces physical damage
 */
registerAbility('Thick Hide', {
    name: 'Thick Hide',
    description: 'Reduces damage from physical moves.',
    onDamageTaken: function(creature, damage, attacker, battleState) {
        // Check if the attack was physical
        // This would need move data passed in
        return {
            modifiedDamage: Math.floor(damage * 0.9),
            message: `${creature.name}'s Thick Hide reduced the damage!`
        };
    }
});

// ============================================
// Ability Utility Functions
// ============================================

/**
 * Get all registered abilities
 * @returns {Array} Array of ability names
 */
function getAllAbilities() {
    return Object.keys(abilityRegistry);
}

/**
 * Get ability description
 * @param {string} name - Ability name
 * @returns {string} Ability description
 */
function getAbilityDescription(name) {
    const ability = abilityRegistry[name];
    return ability ? ability.description : 'Unknown ability';
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        abilityRegistry,
        registerAbility,
        getAbility,
        hasAbility,
        getCreatureAbility,
        onBeforeMove,
        onAfterMove,
        onDamageTaken,
        onDamageDealt,
        onSwitchIn,
        onSwitchOut,
        getAllAbilities,
        getAbilityDescription
    };
}
