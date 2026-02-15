/**
 * zoneManager.js
 * Manages zones and zone progression in Lunaris
 */

// LUNARIS_TODO: add zone modifiers and special events later

/**
 * ZoneManager class
 * Handles zone-related operations
 */
class ZoneManager {
    /**
     * @param {Object} data - Game data (zones, etc.)
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Get current zone data
     * @param {RunState} runState - Current run state
     * @returns {Object} Zone data
     */
    getCurrentZone(runState) {
        const zoneId = runState.currentZone;
        return this.data.zones[zoneId] || null;
    }

    /**
     * Get next available zones
     * @param {RunState} runState - Current run state
     * @returns {Array} Array of next zone IDs
     */
    getNextZones(runState) {
        const currentZoneId = runState.currentZone;
        const zones = Object.keys(this.data.zones);
        
        return zones.filter(zoneId => {
            const zone = this.data.zones[zoneId];
            return zone.requiredZone === currentZoneId;
        });
    }

    /**
     * Get all zones
     * @returns {Object} All zones
     */
    getAllZones() {
        return this.data.zones || {};
    }

    /**
     * Get zone by ID
     * @param {string} zoneId - Zone ID
     * @returns {Object} Zone data
     */
    getZone(zoneId) {
        return this.data.zones[zoneId] || null;
    }

    /**
     * Generate zone encounter table
     * @param {Object} zoneData - Zone data
     * @param {Object} rng - Random number generator
     * @returns {Array} Encounter table
     */
    generateZoneEncounterTable(zoneData, rng) {
        if (!zoneData || !zoneData.encounters) {
            return [];
        }
        
        const encounterTable = [];
        
        for (const encounter of zoneData.encounters) {
            encounterTable.push({
                creature: encounter.creature,
                rarity: encounter.rarity,
                minLevel: encounter.minLevel,
                maxLevel: encounter.maxLevel,
                // Calculate weight based on rarity
                weight: this.rarityToWeight(encounter.rarity)
            });
        }
        
        return encounterTable;
    }

    /**
     * Convert rarity percentage to weight
     * @param {number} rarity - Rarity percentage
     * @returns {number} Weight
     */
    rarityToWeight(rarity) {
        // Simple conversion - could be more sophisticated
        return rarity;
    }

    /**
     * Select random encounter from table
     * @param {Array} encounterTable - Encounter table
     * @param {Object} rng - Random number generator
     * @returns {Object} Selected encounter
     */
    selectRandomEncounter(encounterTable, rng) {
        if (!encounterTable || encounterTable.length === 0) {
            return null;
        }
        
        // Calculate total weight
        const totalWeight = encounterTable.reduce((sum, e) => sum + e.weight, 0);
        
        // Random selection
        const roll = rng.next() * totalWeight;
        let cumulative = 0;
        
        for (const encounter of encounterTable) {
            cumulative += encounter.weight;
            if (roll < cumulative) {
                return encounter;
            }
        }
        
        // Fallback to first encounter
        return encounterTable[0];
    }

    /**
     * Generate level for encounter
     * @param {Object} encounter - Encounter data
     * @param {Object} rng - Random number generator
     * @returns {number} Level
     */
    generateEncounterLevel(encounter, rng) {
        const min = encounter.minLevel || 1;
        const max = encounter.maxLevel || min;
        
        if (min === max) {
            return min;
        }
        
        return rng.nextInt(min, max);
    }

    /**
     * Get zone difficulty
     * @param {string} zoneId - Zone ID
     * @returns {number} Difficulty level
     */
    getZoneDifficulty(zoneId) {
        const zone = this.data.zones[zoneId];
        return zone?.difficulty || 1;
    }

    /**
     * Check if zone is accessible
     * @param {string} zoneId - Zone ID
     * @param {RunState} runState - Current run state
     * @returns {boolean} True if accessible
     */
    isZoneAccessible(zoneId, runState) {
        const zone = this.data.zones[zoneId];
        if (!zone) return false;
        
        // Check if required zone is completed
        if (zone.requiredZone) {
            return runState.zonesCompleted.includes(zone.requiredZone);
        }
        
        return true;
    }

    /**
     * Get zone biome
     * @param {string} zoneId - Zone ID
     * @returns {string} Biome type
     */
    getZoneBiome(zoneId) {
        const zone = this.data.zones[zoneId];
        return zone?.biome || 'unknown';
    }

    /**
     * Get zone description
     * @param {string} zoneId - Zone ID
     * @returns {string} Description
     */
    getZoneDescription(zoneId) {
        const zone = this.data.zones[zoneId];
        return zone?.description || '';
    }

    /**
     * Get boss for zone
     * @param {string} zoneId - Zone ID
     * @returns {string|null} Boss creature ID
     */
    getZoneBoss(zoneId) {
        const zone = this.data.zones[zoneId];
        return zone?.boss || null;
    }

    /**
     * Check if zone has a boss
     * @param {string} zoneId - Zone ID
     * @returns {boolean} True if has boss
     */
    zoneHasBoss(zoneId) {
        return this.getZoneBoss(zoneId) !== null;
    }

    /**
     * Get zone progression info
     * @param {RunState} runState - Current run state
     * @returns {Object} Progression info
     */
    getZoneProgression(runState) {
        return {
            currentZone: runState.currentZone,
            zoneIndex: runState.zoneIndex,
            zonesCompleted: runState.zonesCompleted.length,
            currentFloor: runState.currentFloor,
            maxFloors: runState.maxFloors
        };
    }

    /**
     * Advance floor in current zone
     * @param {RunState} runState - Current run state
     * @returns {Object} Result
     */
    advanceFloor(runState) {
        runState.currentFloor++;
        
        if (runState.currentFloor > runState.maxFloors) {
            return {
                success: true,
                zoneComplete: true,
                message: `Completed ${runState.currentZone}!`
            };
        }
        
        return {
            success: true,
            zoneComplete: false,
            message: `Advanced to floor ${runState.currentFloor}`
        };
    }

    /**
     * Get zone modifiers (placeholder for future expansion)
     * @param {string} zoneId - Zone ID
     * @returns {Object} Zone modifiers
     */
    getZoneModifiers(zoneId) {
        // LUNARIS_TODO: Add zone-specific modifiers
        return {
            weather: null,
            terrain: null,
            catchRateModifier: 1.0,
            expModifier: 1.0,
            itemDropRate: 1.0
        };
    }

    /**
     * Generate zone event (placeholder for future expansion)
     * @param {RunState} runState - Current run state
     * @returns {Object} Zone event
     */
    generateZoneEvent(runState) {
        // LUNARIS_TODO: Implement random zone events
        const events = [
            { type: 'nothing', message: 'Nothing happened.' },
            { type: 'item', message: 'Found an item!' },
            { type: 'heal', message: 'Found a healing spot!' }
        ];
        
        return runState.rng.choice(events);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ZoneManager };
}
