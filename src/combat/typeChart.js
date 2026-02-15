/**
 * typeChart.js
 * Type effectiveness system for Lunaris
 */

// LUNARIS_TODO: complete Lunaris type chart later

/**
 * Type chart containing type effectiveness relationships
 * Format: attackingType: { defendingType: multiplier }
 */
const typeChart = {
    // Astral type relationships
    Astral: {
        Astral: 1.0,
        Shadow: 2.0,
        Light: 1.0,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Shadow type relationships
    Shadow: {
        Astral: 1.0,
        Shadow: 0.5,
        Light: 0.5,
        Metal: 1.0,
        Ghost: 2.0,
        Psychic: 2.0,
        Divine: 0.5,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 0.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Light type relationships
    Light: {
        Astral: 1.0,
        Shadow: 2.0,
        Light: 0.5,
        Metal: 1.0,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 1.5,
        Water: 0.5,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 2.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.5
    },
    
    // Divine type relationships
    Divine: {
        Astral: 1.5,
        Shadow: 2.0,
        Light: 1.0,
        Metal: 1.0,
        Ghost: 2.0,
        Psychic: 1.0,
        Divine: 0.5,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 1.5,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 0.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Ghost type relationships
    Ghost: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 0.5,
        Metal: 1.0,
        Ghost: 2.0,
        Psychic: 1.0,
        Divine: 0.5,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 0.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 0.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Psychic type relationships
    Psychic: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 1.0,
        Ghost: 2.0,
        Psychic: 0.5,
        Divine: 1.0,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 2.0,
        Poison: 2.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Metal type relationships
    Metal: {
        Astral: 1.5,
        Shadow: 1.0,
        Light: 1.5,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 0.5,
        Fire: 0.5,
        Water: 1.5,
        Grass: 1.0,
        Electric: 0.5,
        Ice: 2.0,
        Flying: 1.0,
        Ground: 2.0,
        Rock: 1.5,
        Fighting: 1.5,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.5
    },
    
    // Fire type relationships
    Fire: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 0.5,
        Metal: 2.0,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 0.5,
        Water: 0.5,
        Grass: 2.0,
        Electric: 1.0,
        Ice: 2.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 0.5,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 2.0,
        Normal: 1.0,
        Dragon: 0.5,
        Fairy: 1.0
    },
    
    // Water type relationships
    Water: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 1.0,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 2.0,
        Water: 0.5,
        Grass: 0.5,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 2.0,
        Rock: 2.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Grass type relationships
    Grass: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 0.5,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 0.5,
        Water: 2.0,
        Grass: 0.5,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 0.5,
        Ground: 2.0,
        Rock: 2.0,
        Fighting: 1.0,
        Poison: 0.5,
        Bug: 0.5,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Electric type relationships
    Electric: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 1.0,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 1.0,
        Water: 2.0,
        Grass: 0.5,
        Electric: 0.5,
        Ice: 1.0,
        Flying: 2.0,
        Ground: 0.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Ice type relationships
    Ice: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 0.5,
        Water: 0.5,
        Grass: 2.0,
        Electric: 1.0,
        Ice: 0.5,
        Flying: 2.0,
        Ground: 2.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 2.0,
        Fairy: 1.0
    },
    
    // Fighting type relationships
    Fighting: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 1.5,
        Ghost: 0.5,
        Psychic: 1.0,
        Divine: 0.5,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 2.0,
        Flying: 0.5,
        Ground: 1.0,
        Rock: 2.0,
        Fighting: 1.0,
        Poison: 0.5,
        Bug: 0.5,
        Normal: 2.0,
        Dragon: 1.0,
        Fairy: 0.5
    },
    
    // Poison type relationships
    Poison: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 0.0,
        Ghost: 0.5,
        Psychic: 2.0,
        Divine: 0.5,
        Fire: 1.0,
        Water: 1.0,
        Grass: 2.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 0.5,
        Rock: 0.5,
        Fighting: 1.0,
        Poison: 0.5,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 2.0
    },
    
    // Flying type relationships
    Flying: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 1.0,
        Water: 1.0,
        Grass: 2.0,
        Electric: 0.5,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 0.5,
        Fighting: 2.0,
        Poison: 1.0,
        Bug: 2.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Ground type relationships
    Ground: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 2.0,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 2.0,
        Water: 1.0,
        Grass: 0.5,
        Electric: 2.0,
        Ice: 1.0,
        Flying: 0.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 2.0,
        Bug: 0.5,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Rock type relationships
    Rock: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 2.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 2.0,
        Flying: 2.0,
        Ground: 0.5,
        Rock: 1.0,
        Fighting: 0.5,
        Poison: 1.0,
        Bug: 2.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Bug type relationships
    Bug: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 0.5,
        Metal: 0.5,
        Ghost: 0.5,
        Psychic: 2.0,
        Divine: 0.5,
        Fire: 0.5,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 0.5,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 0.5,
        Poison: 0.5,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 0.5
    },
    
    // Normal type relationships
    Normal: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 1.0,
        Ghost: 0.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 0.5,
        Fighting: 2.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.0,
        Fairy: 1.0
    },
    
    // Dragon type relationships
    Dragon: {
        Astral: 1.0,
        Shadow: 1.0,
        Light: 1.0,
        Metal: 0.5,
        Ghost: 1.0,
        Psychic: 1.0,
        Divine: 0.5,
        Fire: 1.0,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 1.0,
        Poison: 1.0,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 2.0,
        Fairy: 0.0
    },
    
    // Fairy type relationships
    Fairy: {
        Astral: 1.0,
        Shadow: 2.0,
        Light: 1.0,
        Metal: 0.5,
        Ghost: 2.0,
        Psychic: 1.0,
        Divine: 1.0,
        Fire: 0.5,
        Water: 1.0,
        Grass: 1.0,
        Electric: 1.0,
        Ice: 1.0,
        Flying: 1.0,
        Ground: 1.0,
        Rock: 1.0,
        Fighting: 2.0,
        Poison: 0.5,
        Bug: 1.0,
        Normal: 1.0,
        Dragon: 1.5,
        Fairy: 1.0
    }
};

/**
 * Get the type effectiveness multiplier
 * @param {string} attackingType - The type of the move
 * @param {string} defendingType - The type of the defending creature
 * @returns {number} The effectiveness multiplier
 */
function getTypeEffectiveness(attackingType, defendingType) {
    if (!attackingType || !defendingType) return 1.0;
    
    const attackChart = typeChart[attackingType];
    if (!attackChart) return 1.0;
    
    return attackChart[defendingType] || 1.0;
}

/**
 * Calculate type effectiveness for a move against a creature
 * @param {Object} move - The move being used
 * @param {Array} defenderTypes - Array of types for the defending creature
 * @returns {number} Combined effectiveness multiplier
 */
function calculateMoveEffectiveness(move, defenderTypes) {
    if (!move || !move.type || !Array.isArray(defenderTypes) || defenderTypes.length === 0) {
        return 1.0;
    }
    
    let effectiveness = 1.0;
    for (const defenderType of defenderTypes) {
        effectiveness *= getTypeEffectiveness(move.type, defenderType);
    }
    
    return effectiveness;
}

/**
 * Get all types in the game
 * @returns {Array} Array of type names
 */
function getAllTypes() {
    return Object.keys(typeChart);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        typeChart,
        getTypeEffectiveness,
        calculateMoveEffectiveness,
        getAllTypes
    };
}
