/**
 * damageCalculator.js
 * Calculates damage for moves in Lunaris
 */

// LUNARIS_TODO: implement full damage formula later

/**
 * Calculate damage dealt by a move
 * @param {Object} attacker - The attacking BattleCreature
 * @param {Object} defender - The defending BattleCreature
 * @param {Object} move - The move being used (from data/moves.json)
 * @param {Object} typeChart - The type effectiveness chart
 * @returns {Object} Damage calculation result
 */
function calculateDamage(attacker, defender, move, typeChart) {
    // If move does 0 damage (status moves, etc.)
    if (!move.power || move.power === 0) {
        return {
            damage: 0,
            effectiveness: 1.0,
            critical: false,
            stab: false,
            message: "But it had no effect!"
        };
    }
    
    // Get attacking stat (Attack for Physical, Special Attack for Special)
    const isPhysical = move.category === "Physical";
    const attackStat = isPhysical ? attacker.stats.atk : attacker.stats.spa;
    const defenseStat = isPhysical ? defender.stats.def : defender.stats.spd;
    
    // Base damage calculation (simplified formula)
    // In a full implementation, this would be more complex
    let baseDamage = Math.floor(
        (2 * attacker.level / 5 + 2) * move.power * attackStat / defenseStat / 50 + 2
    );
    
    // STAB (Same Type Attack Bonus)
    const stab = attacker.types.includes(move.type);
    let stabMultiplier = stab ? 1.5 : 1.0;
    
    // Type effectiveness
    let effectiveness = 1.0;
    if (typeChart && typeChart.calculateMoveEffectiveness) {
        effectiveness = typeChart.calculateMoveEffectiveness(move, defender.types);
    } else if (typeChart && typeChart.getTypeEffectiveness) {
        // Fallback if typeChart is passed as the module directly
        for (const defenderType of defender.types) {
            effectiveness *= typeChart.getTypeEffectiveness(move.type, defenderType);
        }
    }
    
    // Critical hit (1/16 chance normally, can be modified)
    const critical = Math.random() < 0.0625; // 6.25% chance
    const criticalMultiplier = critical ? 1.5 : 1.0;
    
    // Random variance (0.85 to 1.0)
    const randomVariance = 0.85 + Math.random() * 0.15;
    
    // Calculate final damage
    let finalDamage = Math.floor(
        baseDamage * stabMultiplier * effectiveness * criticalMultiplier * randomVariance
    );
    
    // Ensure minimum damage of 1
    finalDamage = Math.max(1, finalDamage);
    
    // Generate message based on effectiveness
    let message = "";
    if (effectiveness > 1.0) {
        message = "It's super effective!";
    } else if (effectiveness < 1.0 && effectiveness > 0) {
        message = "It's not very effective...";
    } else if (effectiveness === 0) {
        message = "It had no effect!";
        finalDamage = 0;
    }
    
    if (critical) {
        message = "A critical hit! " + message;
    }
    
    return {
        damage: finalDamage,
        effectiveness: effectiveness,
        critical: critical,
        stab: stab,
        message: message
    };
}

/**
 * Calculate damage with all modifiers (for future expansion)
 * @param {Object} attacker - The attacking BattleCreature
 * @param {Object} defender - The defending BattleCreature
 * @param {Object} move - The move being used
 * @param {Object} typeChart - The type effectiveness chart
 * @param {Object} modifiers - Additional modifiers (weather, abilities, etc.)
 * @returns {Object} Damage calculation result
 */
function calculateDamageWithModifiers(attacker, defender, move, typeChart, modifiers = {}) {
    // Start with base damage calculation
    let result = calculateDamage(attacker, defender, move, typeChart);
    
    // Apply additional modifiers from parameters
    // Weather modifier
    if (modifiers.weather) {
        if (modifiers.weather === 'rain' && move.type === 'Water') {
            result.damage = Math.floor(result.damage * 1.5);
        } else if (modifiers.weather === 'rain' && move.type === 'Fire') {
            result.damage = Math.floor(result.damage * 0.5);
        } else if (modifiers.weather === 'sun' && move.type === 'Fire') {
            result.damage = Math.floor(result.damage * 1.5);
        } else if (modifiers.weather === 'sun' && move.type === 'Water') {
            result.damage = Math.floor(result.damage * 0.5);
        }
    }
    
    // Terrain modifier
    if (modifiers.terrain) {
        if (modifiers.terrain === 'electric' && move.type === 'Electric') {
            result.damage = Math.floor(result.damage * 1.5);
        } else if (modifiers.terrain === 'grassy' && move.type === 'Grass') {
            result.damage = Math.floor(result.damage * 1.5);
        } else if (modifiers.terrain === 'psychic' && move.type === 'Psychic') {
            result.damage = Math.floor(result.damage * 1.5);
        } else if (modifiers.terrain === 'misty' && move.type === 'Fairy') {
            result.damage = Math.floor(result.damage * 1.5);
        }
    }
    
    // Ability modifiers (placeholder)
    if (modifiers.ability) {
        // LUNARIS_TODO: Add ability damage modifiers
    }
    
    // Item modifiers (placeholder)
    if (modifiers.item) {
        // LUNARIS_TODO: Add item damage modifiers
    }
    
    return result;
}

/**
 * Calculate catch rate for a creature
 * @param {Object} creature - The creature being caught
 * @param {number} ballMultiplier - Ball modifier (1.0 for standard)
 * @returns {number} Catch probability (0-1)
 */
function calculateCatchRate(creature, ballMultiplier = 1.0) {
    // Simplified catch rate formula
    // In a full implementation, this would use the actual catch formula
    
    const maxHp = creature.maxHp;
    const currentHp = creature.currentHp;
    const hpRatio = currentHp / maxHp;
    
    // Base catch rate (higher for weaker creatures)
    let catchRate = 0.5;
    
    // Adjust for HP (lower HP = easier to catch)
    catchRate += (1 - hpRatio) * 0.3;
    
    // Apply ball multiplier
    catchRate *= ballMultiplier;
    
    // Clamp to 0-1
    return Math.min(1.0, Math.max(0.0, catchRate));
}

/**
 * Attempt to catch a creature
 * @param {Object} creature - The creature being caught
 * @param {string} ballType - Type of ball being used
 * @returns {Object} Catch result
 */
function attemptCatch(creature, ballType = 'standard') {
    // Ball multipliers
    const ballMultipliers = {
        'standard': 1.0,
        'great': 1.5,
        'ultra': 2.0,
        'master': 3.0,
        'saffron': 1.0,
        'fast': 1.5,
        'level': 1.0,
        'lure': 1.0,
        'heavy': 1.0,
        'love': 1.0,
        'moon': 1.0,
        'sport': 1.5,
        'net': 1.0,
        'dive': 1.0,
        'repeat': 1.0,
        'timer': 1.0,
        'luxury': 1.0,
        'premier': 1.0
    };
    
    const ballMultiplier = ballMultipliers[ballType] || 1.0;
    const catchRate = calculateCatchRate(creature, ballMultiplier);
    
    // Attempt catch
    const roll = Math.random();
    const success = roll < catchRate;
    
    return {
        success: success,
        catchRate: catchRate,
        roll: roll,
        message: success ? "Gotcha!" : "The creature broke free!"
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateDamage,
        calculateDamageWithModifiers,
        calculateCatchRate,
        attemptCatch
    };
}
