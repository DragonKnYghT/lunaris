/**
 * runController.js
 * Controller for managing game runs
 */

// LUNARIS_TODO: integrate reward flow later

/**
 * RunController class
 * Manages game runs (roguelike mode)
 */
class RunController {
    constructor(gameData) {
        this.gameData = gameData;
        this.currentRun = null;
        this.currentZone = null;
        
        console.log('[RunController] Initialized');
    }

    /**
     * Start a new run
     * @param {string} mode - Run mode (e.g., 'roguelike')
     * @returns {Object} New run data
     */
    startNewRun(mode = 'roguelike') {
        console.log('[RunController] Starting new run:', mode);
        
        // Create new run data
        this.currentRun = {
            mode: mode,
            currentZone: null,
            zonesCompleted: [],
            team: [],
            inventory: { items: {}, currency: 0 },
            progress: 0,
            isActive: true
        };
        
        // Get starting zone
        const zones = Object.keys(this.gameData.zones);
        const startingZone = zones.find(z => !this.gameData.zones[z].requiredZone) || zones[0];
        
        if (startingZone) {
            this.enterZone(startingZone);
        }
        
        console.log('[RunController] New run started');
        return this.currentRun;
    }

    /**
     * Continue an existing run
     * @param {Object} savedRun - Saved run data
     * @returns {Object} Continued run
     */
    continueRun(savedRun) {
        console.log('[RunController] Continuing run');
        
        this.currentRun = savedRun;
        this.currentZone = savedRun.currentZone;
        
        console.log('[RunController] Run continued');
        return this.currentRun;
    }

    /**
     * Enter a zone
     * @param {string} zoneId - Zone ID
     */
    enterZone(zoneId) {
        const zoneData = this.gameData.zones[zoneId];
        
        if (!zoneData) {
            console.error('[RunController] Zone not found:', zoneId);
            return;
        }
        
        this.currentZone = zoneId;
        this.currentRun.currentZone = zoneId;
        
        console.log('[RunController] Entering zone:', zoneData.name);
        console.log('  Biome:', zoneData.biome);
        console.log('  Difficulty:', zoneData.difficulty);
    }

    /**
     * Start an encounter in the current zone
     * @returns {Object} Encounter data
     */
    startEncounter() {
        if (!this.currentZone) {
            console.error('[RunController] No current zone');
            return null;
        }
        
        const zoneData = this.gameData.zones[this.currentZone];
        
        if (!zoneData || !zoneData.encounters || zoneData.encounters.length === 0) {
            console.warn('[RunController] No encounters in zone');
            return null;
        }
        
        // Get random encounter
        const encounter = zoneData.encounters[Math.floor(Math.random() * zoneData.encounters.length)];
        const creatureData = this.gameData.creatures[encounter.creature];
        
        const encounterData = {
            creature: creatureData,
            level: Math.floor(Math.random() * (encounter.maxLevel - encounter.minLevel + 1)) + encounter.minLevel,
            isBoss: false
        };
        
        console.log('[RunController] Starting encounter:', creatureData.name, 'Level', encounterData.level);
        
        return encounterData;
    }

    /**
     * End an encounter
     * @param {string} result - Result: 'win', 'lose', 'flee'
     * @param {Object} rewards - Rewards from encounter
     */
    endEncounter(result, rewards = {}) {
        console.log('[RunController] Encounter ended:', result);
        
        if (result === 'win' && rewards) {
            // Add rewards to inventory
            if (rewards.items) {
                rewards.items.forEach(item => {
                    this.currentRun.inventory.items[item] = (this.currentRun.inventory.items[item] || 0) + 1;
                });
            }
            
            if (rewards.currency) {
                this.currentRun.inventory.currency += rewards.currency;
            }
            
            console.log('[RunController] Rewards:', rewards);
        }
        
        // Check if zone is complete
        this.checkZoneCompletion();
    }

    /**
     * Check if current zone is complete
     */
    checkZoneCompletion() {
        if (!this.currentZone) return;
        
        const zoneData = this.gameData.zones[this.currentZone];
        
        // Check if all encounters are done (simplified)
        this.currentRun.zonesCompleted.push(this.currentZone);
        
        // Find next zones
        const zones = Object.keys(this.gameData.zones);
        const nextZones = zones.filter(z => this.gameData.zones[z].requiredZone === this.currentZone);
        
        if (nextZones.length > 0) {
            console.log('[RunController] Zone completed. Available next zones:', nextZones);
        } else {
            console.log('[RunController] All zones completed!');
            this.endRun('completed');
        }
    }

    /**
     * End the run
     * @param {string} reason - Reason for ending (e.g., 'completed', 'defeat', 'quit')
     */
    endRun(reason = 'quit') {
        console.log('[RunController] Run ended:', reason);
        
        this.currentRun.isActive = false;
        
        const summary = {
            zonesCompleted: this.currentRun.zonesCompleted.length,
            finalCurrency: this.currentRun.inventory.currency,
            reason: reason
        };
        
        console.log('[RunController] Run summary:', summary);
        
        return summary;
    }

    /**
     * Get current run data
     * @returns {Object} Current run
     */
    getCurrentRun() {
        return this.currentRun;
    }

    /**
     * Get current zone data
     * @returns {Object} Current zone
     */
    getCurrentZone() {
        return this.currentZone ? this.gameData.zones[this.currentZone] : null;
    }

    /**
     * Add item to inventory
     * @param {string} itemId - Item ID
     * @param {number} quantity - Quantity
     */
    addItem(itemId, quantity = 1) {
        this.currentRun.inventory.items[itemId] = (this.currentRun.inventory.items[itemId] || 0) + quantity;
        console.log('[RunController] Added item:', itemId, 'x', quantity);
    }

    /**
     * Remove item from inventory
     * @param {string} itemId - Item ID
     * @param {number} quantity - Quantity
     * @returns {boolean} True if successful
     */
    removeItem(itemId, quantity = 1) {
        if (!this.currentRun.inventory.items[itemId]) {
            return false;
        }
        
        this.currentRun.inventory.items[itemId] -= quantity;
        
        if (this.currentRun.inventory.items[itemId] <= 0) {
            delete this.currentRun.inventory.items[itemId];
        }
        
        console.log('[RunController] Removed item:', itemId, 'x', quantity);
        return true;
    }

    /**
     * Get inventory
     * @returns {Object} Inventory
     */
    getInventory() {
        return this.currentRun.inventory;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RunController };
}
