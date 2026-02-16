/**
 * weather.js
 * Weather system for Lunaris battles
 */

// LUNARIS_TODO: add terrain system later

/**
 * Weather types
 */
const WeatherType = {
    CLEAR: 'clear',
    SUN: 'sun',
    RAIN: 'rain',
    STORM: 'storm',
    ECLIPSE: 'eclipse',  // Lunaris-specific
    HAIL: 'hail',
    SANDSTORM: 'sandstorm'
};

/**
 * Weather registry
 */
const weatherEffects = {};

/**
 * Register a weather type
 * @param {string} type - Weather type
 * @param {Object} effect - Weather effect definition
 */
function registerWeather(type, effect) {
    weatherEffects[type] = effect;
    console.log(`[Weather] Registered weather: ${type}`);
}

/**
 * Get weather effect
 * @param {string} type - Weather type
 * @returns {Object|null} Weather effect
 */
function getWeatherEffect(type) {
    return weatherEffects[type] || null;
}

// ============================================
// Weather Implementations
// ============================================

/**
 * Clear weather (no effect)
 */
registerWeather(WeatherType.CLEAR, {
    name: 'Clear',
    description: 'Normal weather conditions.',
    duration: -1,  // -1 means infinite
    onStart: function(battleState) {
        return { message: 'The weather is clear.' };
    },
    onEnd: function(battleState) {
        return { message: 'The weather returned to normal.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        return 1.0;
    },
    onTurnStart: function(battleState) {
        return { message: '' };
    }
});

/**
 * Sun weather
 * Boosts Fire moves, weakens Water moves
 */
registerWeather(WeatherType.SUN, {
    name: 'Sun',
    description: 'Sunny weather. Fire moves are boosted, Water moves are weakened.',
    duration: 5,
    onStart: function(battleState) {
        return { message: 'The sun started shining!' };
    },
    onEnd: function(battleState) {
        return { message: 'The sun stopped shining.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        if (moveType === 'Fire') return 1.5;
        if (moveType === 'Water') return 0.5;
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        // Fire moves have better accuracy in sun
        if (move.type === 'Fire') return 1.1;
        return 1.0;
    },
    onTurnStart: function(battleState) {
        // Check for drought activation
        // LUNARIS_TODO: Check for drought ability
        return { message: '' };
    }
});

/**
 * Rain weather
 * Boosts Water moves, weakens Fire moves
 */
registerWeather(WeatherType.RAIN, {
    name: 'Rain',
    description: 'Rainy weather. Water moves are boosted, Fire moves are weakened.',
    duration: 5,
    onStart: function(battleState) {
        return { message: 'It started to rain!' };
    },
    onEnd: function(battleState) {
        return { message: 'The rain stopped.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        if (moveType === 'Water') return 1.5;
        if (moveType === 'Fire') return 0.5;
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        // Water moves have better accuracy in rain
        if (move.type === 'Water') return 1.1;
        return 1.0;
    },
    onTurnStart: function(battleState) {
        // LUNARIS_TODO: Check for torrent ability
        return { message: '' };
    }
});

/**
 * Storm weather
 * Boosts Electric moves, reduces accuracy
 */
registerWeather(WeatherType.STORM, {
    name: 'Storm',
    description: 'Stormy weather. Electric moves are boosted, accuracy is reduced.',
    duration: 5,
    onStart: function(battleState) {
        return { message: 'A storm appeared!' };
    },
    onEnd: function(battleState) {
        return { message: 'The storm passed.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        if (moveType === 'Electric') return 1.5;
        if (moveType === 'Flying') return 1.2;  // Gust is boosted
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        // Reduced accuracy during storms
        return 0.9;
    },
    onTurnStart: function(battleState) {
        return { message: 'The storm rages!' };
    }
});

/**
 * Eclipse weather (Lunaris-specific)
 * Boosts Astral and Shadow moves
 */
registerWeather(WeatherType.ECLIPSE, {
    name: 'Eclipse',
    description: 'Eclipse weather. Astral and Shadow moves are boosted.',
    duration: 5,
    onStart: function(battleState) {
        return { message: 'An eclipse has begun!' };
    },
    onEnd: function(battleState) {
        return { message: 'The eclipse has ended.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        if (moveType === 'Astral') return 1.5;
        if (moveType === 'Shadow') return 1.5;
        if (moveType === 'Light') return 0.5;  // Light is weakened
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        return 1.0;
    },
    onTurnStart: function(battleState) {
        return { message: 'The eclipse darkens the sky!' };
    }
});

/**
 * Hail weather
 * Damages non-Ice types
 */
registerWeather(WeatherType.HAIL, {
    name: 'Hail',
    description: 'Hailstorm. Ice moves are boosted, non-Ice types take damage.',
    duration: 5,
    onStart: function(battleState) {
        return { message: 'It started to hail!' };
    },
    onEnd: function(battleState) {
        return { message: 'The hail stopped.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        if (moveType === 'Ice') return 1.5;
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        return 1.0;
    },
    onTurnStart: function(battleState) {
        // Deal hail damage to all creatures
        const creatures = [battleState.playerActive, battleState.enemyActive];
        let message = '';
        
        for (const creature of creatures) {
            if (creature && !creature.isFainted && !creature.types.includes('Ice')) {
                const damage = Math.floor(creature.maxHp / 16);
                creature.takeDamage(damage);
                message += `${creature.name} is hurt by the hail! `;
            }
        }
        
        return { message };
    }
});

/**
 * Sandstorm weather
 * Damages non-Rock/Ground/Steel types, boosts Rock
 */
registerWeather(WeatherType.SANDSTORM, {
    name: 'Sandstorm',
    description: 'Sandstorm. Rock moves are boosted, special defense of Rock types is raised.',
    duration: 5,
    onStart: function(battleState) {
        return { message: 'A sandstorm appeared!' };
    },
    onEnd: function(battleState) {
        return { message: 'The sandstorm cleared.' };
    },
    getDamageModifier: function(moveType, attacker, defender) {
        if (moveType === 'Rock') return 1.5;
        return 1.0;
    },
    getAccuracyModifier: function(move, target, battleState) {
        return 0.9;  // Reduced accuracy
    },
    onTurnStart: function(battleState) {
        // Deal sandstorm damage
        const creatures = [battleState.playerActive, battleState.enemyActive];
        let message = '';
        
        for (const creature of creatures) {
            if (creature && !creature.isFainted) {
                const isRock = creature.types.includes('Rock');
                const isGround = creature.types.includes('Ground');
                const isSteel = creature.types.includes('Metal');
                
                if (!isRock && !isGround && !isSteel) {
                    const damage = Math.floor(creature.maxHp / 16);
                    creature.takeDamage(damage);
                    message += `${creature.name} is hurt by the sandstorm! `;
                }
            }
        }
        
        return { message };
    }
});

// ============================================
// Weather Manager
// ============================================

/**
 * WeatherManager class
 * Manages weather in battles
 */
class WeatherManager {
    constructor(battleState) {
        this.battleState = battleState;
        this.currentWeather = WeatherType.CLEAR;
        this.turnsRemaining = 0;
    }
    
    /**
     * Set weather
     * @param {string} type - Weather type
     * @returns {Object} Result
     */
    setWeather(type) {
        const effect = getWeatherEffect(type);
        if (!effect) {
            return { success: false, message: `Unknown weather type: ${type}` };
        }
        
        const wasClear = this.currentWeather === WeatherType.CLEAR;
        
        if (!wasClear) {
            // End previous weather
            const oldEffect = getWeatherEffect(this.currentWeather);
            if (oldEffect && oldEffect.onEnd) {
                const endResult = oldEffect.onEnd(this.battleState);
                this.battleState.log(endResult.message);
            }
        }
        
        this.currentWeather = type;
        this.turnsRemaining = effect.duration;
        
        // Start new weather
        if (effect.onStart) {
            const startResult = effect.onStart(this.battleState);
            this.battleState.log(startResult.message);
        }
        
        console.log(`[Weather] Weather set to: ${type}`);
        
        return { success: true, message: effect.name + ' weather started!' };
    }
    
    /**
     * Clear weather
     * @returns {Object} Result
     */
    clearWeather() {
        return this.setWeather(WeatherType.CLEAR);
    }
    
    /**
     * Process weather at start of turn
     */
    processTurnStart() {
        const effect = getWeatherEffect(this.currentWeather);
        
        if (effect && effect.onTurnStart) {
            const result = effect.onTurnStart(this.battleState);
            if (result.message) {
                this.battleState.log(result.message);
            }
        }
        
        // Decrement turns (if not infinite)
        if (this.turnsRemaining > 0) {
            this.turnsRemaining--;
            
            if (this.turnsRemaining === 0) {
                const effect = getWeatherEffect(this.currentWeather);
                if (effect && effect.onEnd) {
                    const endResult = effect.onEnd(this.battleState);
                    this.battleState.log(endResult.message);
                }
                this.currentWeather = WeatherType.CLEAR;
            }
        }
    }
    
    /**
     * Get damage modifier for a move
     * @param {string} moveType - Move type
     * @param {Object} attacker - Attacking creature
     * @param {Object} defender - Defending creature
     * @returns {number} Damage modifier
     */
    getDamageModifier(moveType, attacker, defender) {
        const effect = getWeatherEffect(this.currentWeather);
        if (!effect || !effect.getDamageModifier) return 1.0;
        
        return effect.getDamageModifier(moveType, attacker, defender);
    }
    
    /**
     * Get accuracy modifier for a move
     * @param {Object} move - Move being used
     * @param {Object} target - Target creature
     * @returns {number} Accuracy modifier
     */
    getAccuracyModifier(move, target) {
        const effect = getWeatherEffect(this.currentWeather);
        if (!effect || !effect.getAccuracyModifier) return 1.0;
        
        return effect.getAccuracyModifier(move, target, this.battleState);
    }
    
    /**
     * Get current weather info
     * @returns {Object} Weather info
     */
    getWeatherInfo() {
        return {
            type: this.currentWeather,
            turnsRemaining: this.turnsRemaining,
            name: getWeatherEffect(this.currentWeather)?.name || 'Clear'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WeatherType,
        weatherEffects,
        registerWeather,
        getWeatherEffect,
        WeatherManager
    };
}
