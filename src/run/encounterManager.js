/**
 * encounterManager.js
 * Manages encounters in Lunaris roguelike runs
 */

// LUNARIS_TODO: integrate combat engine later

/**
 * EncounterManager class
 * Handles all types of encounters
 */
class EncounterManager {
    /**
     * @param {Object} data - Game data
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Generate a wild encounter
     * @param {Object} zoneData - Zone data
     * @param {Object} rng - Random number generator
     * @returns {Object} Encounter object
     */
    generateWildEncounter(zoneData, rng) {
        if (!zoneData || !zoneData.encounters || zoneData.encounters.length === 0) {
            return this.generateDefaultEncounter(rng);
        }
        
        // Select random creature based on rarity
        const encounters = zoneData.encounters;
        const totalRarity = encounters.reduce((sum, e) => sum + e.rarity, 0);
        const roll = rng.next() * totalRarity;
        
        let cumulative = 0;
        let selectedEncounter = encounters[0];
        
        for (const encounter of encounters) {
            cumulative += encounter.rarity;
            if (roll < cumulative) {
                selectedEncounter = encounter;
                break;
            }
        }
        
        // Generate level
        const level = rng.nextInt(
            selectedEncounter.minLevel || 1,
            selectedEncounter.maxLevel || selectedEncounter.minLevel || 1
        );
        
        // Get creature data
        const creatureData = this.data.creatures[selectedEncounter.creature];
        
        const encounter = {
            type: 'wild',
            creatureId: selectedEncounter.creature,
            creature: creatureData ? { ...creatureData } : null,
            level: level,
            isBoss: false,
            canCatch: true,
            canRun: true,
            rewards: {
                exp: level * 10,
                items: []
            }
        };
        
        return encounter;
    }

    /**
     * Generate a trainer encounter (placeholder)
     * @param {Object} zoneData - Zone data
     * @param {Object} rng - Random number generator
     * @returns {Object} Encounter object
     */
    generateTrainerEncounter(zoneData, rng) {
        // LUNARIS_TODO: Implement trainer encounters
        // For now, generate a stronger wild encounter
        
        const encounter = this.generateWildEncounter(zoneData, rng);
        encounter.type = 'trainer';
        encounter.isBoss = false;
        encounter.canCatch = false;
        
        // Trainer creatures are slightly stronger
        encounter.level = Math.min(encounter.level + 2, 100);
        
        return encounter;
    }

    /**
     * Generate a boss encounter
     * @param {Object} zoneData - Zone data
     * @param {Object} rng - Random number generator
     * @returns {Object} Encounter object
     */
    generateBossEncounter(zoneData, rng) {
        if (!zoneData || !zoneData.boss) {
            // No boss, fall back to wild encounter
            return this.generateWildEncounter(zoneData, rng);
        }
        
        const bossId = zoneData.boss;
        const creatureData = this.data.creatures[bossId];
        
        // Boss level is typically higher
        const level = rng.nextInt(
            (zoneData.difficulty || 1) * 10,
            (zoneData.difficulty || 1) * 15
        );
        
        const encounter = {
            type: 'boss',
            creatureId: bossId,
            creature: creatureData ? { ...creatureData } : null,
            level: level,
            isBoss: true,
            canCatch: false,
            canRun: false,
            rewards: {
                exp: level * 50,
                items: ['MoonStone'],
                guaranteed: true
            }
        };
        
        return encounter;
    }

    /**
     * Generate a default encounter when zone has none
     * @param {Object} rng - Random number generator
     * @returns {Object} Encounter object
     */
    generateDefaultEncounter(rng) {
        // Get random creature from data
        const creatureIds = Object.keys(this.data.creatures).filter(
            k => !k.startsWith('_')
        );
        
        const creatureId = rng.choice(creatureIds);
        const creatureData = this.data.creatures[creatureId];
        const level = rng.nextInt(1, 10);
        
        return {
            type: 'wild',
            creatureId: creatureId,
            creature: creatureData ? { ...creatureData } : null,
            level: level,
            isBoss: false,
            canCatch: true,
            canRun: true,
            rewards: {
                exp: level * 10,
                items: []
            }
        };
    }

    /**
     * Generate a random encounter based on zone
     * @param {Object} zoneData - Zone data
     * @param {Object} rng - Random number generator
     * @param {string} type - Encounter type ('wild', 'trainer', 'boss', 'random')
     * @returns {Object} Encounter object
     */
    generateEncounter(zoneData, rng, type = 'random') {
        // If specific type requested
        if (type !== 'random') {
            switch (type) {
                case 'wild':
                    return this.generateWildEncounter(zoneData, rng);
                case 'trainer':
                    return this.generateTrainerEncounter(zoneData, rng);
                case 'boss':
                    return this.generateBossEncounter(zoneData, rng);
            }
        }
        
        // Random encounter type
        const roll = rng.next();
        
        // Check for boss encounter first (if zone has boss and on final floor)
        if (zoneData && zoneData.boss && rng.next() < 0.1) {
            return this.generateBossEncounter(zoneData, rng);
        }
        
        // 20% chance for trainer, 80% for wild
        if (roll < 0.2) {
            return this.generateTrainerEncounter(zoneData, rng);
        }
        
        return this.generateWildEncounter(zoneData, rng);
    }

    /**
     * Create a creature instance from encounter
     * @param {Object} encounter - Encounter object
     * @returns {Object} Creature instance
     */
    createCreatureFromEncounter(encounter) {
        const creatureData = encounter.creature;
        const level = encounter.level;
        
        // Calculate stats
        const calculateStat = (base) => {
            return Math.floor((base * 2 + 31) * level / 100) + level + 5;
        };
        
        return {
            id: encounter.creatureId,
            name: creatureData.name,
            types: creatureData.types,
            level: level,
            hp: calculateStat(creatureData.baseStats.hp),
            maxHp: calculateStat(creatureData.baseStats.hp),
            atk: calculateStat(creatureData.baseStats.atk),
            def: calculateStat(creatureData.baseStats.def),
            spa: calculateStat(creatureData.baseStats.spa),
            spd: calculateStat(creatureData.baseStats.spd),
            spe: calculateStat(creatureData.baseStats.spe),
            moves: [...creatureData.moveset],
            abilities: [...creatureData.abilities],
            hiddenAbility: creatureData.hiddenAbility,
            isFainted: false,
            exp: 0,
            expToNextLevel: level * 100
        };
    }

    /**
     * Calculate catch rate for encounter
     * @param {Object} encounter - Encounter object
     * @param {Object} runState - Current run state
     * @returns {number} Catch rate (0-1)
     */
    calculateCatchRate(encounter, runState) {
        // Base catch rate
        let catchRate = 0.5;
        
        // Adjust for level difference
        const playerLevel = runState.getActiveCreature()?.level || 1;
        if (encounter.level > playerLevel) {
            catchRate -= 0.1;
        } else if (encounce.level < playerLevel) {
            catchRate += 0.1;
        }
        
        // Boss encounters are harder to catch
        if (encounter.isBoss) {
            catchRate = 0.1;
        }
        
        // Wild encounters are easier
        if (encounter.type === 'wild') {
            catchRate += 0.1;
        }
        
        return Math.max(0.05, Math.min(0.95, catchRate));
    }

    /**
     * Attempt to catch creature
     * @param {Object} encounter - Encounter object
     * @param {string} ballType - Ball type
     * @param {Object} runState - Current run state
     * @returns {Object} Catch result
     */
    attemptCatch(encounter, ballType, runState) {
        const ballMultipliers = {
            'standard': 1.0,
            'great': 1.5,
            'ultra': 2.0,
            'master': 3.0,
            'saffron': 1.0
        };
        
        const multiplier = ballMultipliers[ballType] || 1.0;
        const catchRate = this.calculateCatchRate(encounter, runState) * multiplier;
        
        const roll = runState.rng.next();
        const success = roll < catchRate;
        
        return {
            success: success,
            catchRate: catchRate,
            roll: roll,
            message: success ? 'Gotcha!' : 'The creature broke free!'
        };
    }

    /**
     * Calculate escape success rate
     * @param {Object} encounter - Encounter object
     * @param {Object} runState - Current run state
     * @returns {number} Escape rate (0-1)
     */
    calculateEscapeRate(encounter, runState) {
        // Base escape rate
        let escapeRate = 0.9;
        
        // Boss encounters are harder to escape
        if (encounter.isBoss) {
            escapeRate = 0.3;
        }
        
        // Compare speeds
        const playerSpeed = runState.getActiveCreature()?.spe || 50;
        const enemySpeed = encounter.creature?.baseStats?.spe || 50;
        
        if (playerSpeed > enemySpeed) {
            escapeRate += 0.05;
        } else if (playerSpeed < enemySpeed) {
            escapeRate -= 0.1;
        }
        
        return Math.max(0.1, Math.min(0.99, escapeRate));
    }

    /**
     * Attempt to escape
     * @param {Object} encounter - Encounter object
     * @param {Object} runState - Current run state
     * @returns {Object} Escape result
     */
    attemptEscape(encounter, runState) {
        if (!encounter.canRun) {
            return {
                success: false,
                message: "Can't escape from this encounter!"
            };
        }
        
        const escapeRate = this.calculateEscapeRate(encounter, runState);
        const roll = runState.rng.next();
        const success = roll < escapeRate;
        
        return {
            success: success,
            escapeRate: escapeRate,
            roll: roll,
            message: success ? 'Got away safely!' : "Couldn't escape!"
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EncounterManager };
}
