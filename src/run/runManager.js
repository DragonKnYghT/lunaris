/**
 * runManager.js
 * Manages roguelike runs in Lunaris
 */

// LUNARIS_TODO: integrate UI choices later

/**
 * RunManager class
 * Manages the overall roguelike run flow
 */
class RunManager {
    /**
     * @param {Object} data - Game data (creatures, moves, zones, modes, etc.)
     */
    constructor(data) {
        this.data = data;
        this.currentRun = null;
        this.savedRuns = {};
    }

    /**
     * Start a new run
     * @param {string} mode - Game mode (roguelike, nuzlocke, casual, challenge)
     * @param {Object} options - Additional options
     * @returns {RunState} The new run state
     */
    startNewRun(mode = 'roguelike', options = {}) {
        // Validate mode
        if (!this.data.modes[mode]) {
            console.error(`Unknown mode: ${mode}`);
            mode = 'roguelike'; // Fallback to default
        }
        
        // Create new run state
        this.currentRun = new RunState({
            mode: mode,
            data: this.data,
            seed: options.seed || Date.now()
        });
        
        // Initialize starting team
        this.initializeStartingTeam(options.starterCreatures);
        
        // Initialize starting inventory
        this.initializeStartingInventory();
        
        // Set starting zone
        const startingZone = this.getStartingZone();
        this.currentRun.currentZone = startingZone;
        this.currentRun.markZoneVisited(startingZone);
        
        // Log run start
        this.currentRun.log(`=== New ${mode} Run Started ===`);
        this.currentRun.log(`Mode: ${this.data.modes[mode].description}`);
        this.currentRun.log(`Starting zone: ${this.data.zones[startingZone]?.name || startingZone}`);
        
        // Log rules
        if (this.currentRun.rules) {
            this.currentRun.log(`Rules: permadeath=${this.currentRun.rules.permadeath}, ` +
                `randomized_zones=${this.currentRun.rules.randomized_zones}, ` +
                `max_party_size=${this.currentRun.rules.max_party_size}`);
        }
        
        return this.currentRun;
    }

    /**
     * Initialize starting team
     * @param {Array} starterCreatures - Optional custom starters
     */
    initializeStartingTeam(starterCreatures = null) {
        // Use provided starters or get from data
        const starters = starterCreatures || this.getDefaultStarters();
        
        for (const starterId of starters) {
            const creatureData = this.data.creatures[starterId];
            if (creatureData) {
                const level = 5; // Default starter level
                const creature = this.createCreature(starterId, level);
                this.currentRun.addToTeam(creature);
            } else {
                console.warn(`Starter creature not found: ${starterId}`);
            }
        }
        
        this.currentRun.log(`Team: ${this.currentRun.team.map(c => c.name).join(', ')}`);
    }

    /**
     * Get default starter creatures
     * @returns {Array} Array of starter creature IDs
     */
    getDefaultStarters() {
        // Default to example_creature
        return ['example_creature'];
    }

    /**
     * Create a creature instance
     * @param {string} creatureId - Creature ID
     * @param {number} level - Level
     * @returns {Object} Creature instance
     */
    createCreature(creatureId, level = 1) {
        const creatureData = this.data.creatures[creatureId];
        if (!creatureData) return null;
        
        // Calculate stats
        const calculateStat = (base) => {
            return Math.floor((base * 2 + 31) * level / 100) + level + 5;
        };
        
        return {
            id: creatureId,
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
     * Initialize starting inventory
     */
    initializeStartingInventory() {
        // Add some starting items based on mode
        this.currentRun.inventory.addItem('LunarPotion', 3);
        this.currentRun.inventory.addTicket('run_ticket', 1);
        
        this.currentRun.log(`Starting inventory: ${JSON.stringify(this.currentRun.inventory.getData())}`);
    }

    /**
     * Get starting zone
     * @returns {string} Zone ID
     */
    getStartingZone() {
        // Find the zone with no requiredZone (starting zones)
        const zones = Object.keys(this.data.zones);
        for (const zoneId of zones) {
            const zone = this.data.zones[zoneId];
            if (!zone.requiredZone) {
                return zoneId;
            }
        }
        
        // Fallback to first zone
        return zones[0];
    }

    /**
     * Advance to next zone
     * @returns {Object} Result
     */
    advanceToNextZone() {
        if (!this.currentRun) {
            return { success: false, message: 'No active run' };
        }
        
        const currentZoneId = this.currentRun.currentZone;
        const currentZone = this.data.zones[currentZoneId];
        
        if (!currentZone) {
            return { success: false, message: 'Invalid current zone' };
        }
        
        // Get available next zones
        const nextZones = this.getNextZones(currentZoneId);
        
        if (nextZones.length === 0) {
            // No more zones - run complete!
            this.currentRun.isOver = true;
            this.currentRun.isVictory = true;
            this.currentRun.ending = 'victory';
            this.currentRun.log('=== RUN COMPLETE - VICTORY! ===');
            return { success: true, message: 'Victory!', victory: true };
        }
        
        // Choose next zone (random if randomized, otherwise first available)
        let nextZoneId;
        if (this.currentRun.rules.randomized_zones) {
            nextZoneId = this.currentRun.rng.choice(nextZones);
        } else {
            nextZoneId = nextZones[0];
        }
        
        // Record zone completion
        this.currentRun.zonesCompleted.push(currentZoneId);
        
        // Advance to next zone
        this.currentRun.currentZone = nextZoneId;
        this.currentRun.zoneIndex++;
        this.currentRun.currentFloor = 1;
        this.currentRun.markZoneVisited(nextZoneId);
        
        const nextZone = this.data.zones[nextZoneId];
        this.currentRun.log(`=== Advanced to ${nextZone.name} ===`);
        
        return {
            success: true,
            message: `Advanced to ${nextZone.name}`,
            nextZone: nextZoneId,
            zone: nextZone
        };
    }

    /**
     * Get next available zones
     * @param {string} currentZoneId - Current zone ID
     * @returns {Array} Array of zone IDs
     */
    getNextZones(currentZoneId) {
        const zones = Object.keys(this.data.zones);
        return zones.filter(zoneId => {
            const zone = this.data.zones[zoneId];
            return zone.requiredZone === currentZoneId;
        });
    }

    /**
     * Handle player choice
     * @param {string} choice - Choice type
     * @param {Object} data - Choice data
     * @returns {Object} Result
     */
    handlePlayerChoice(choice, data = {}) {
        if (!this.currentRun) {
            return { success: false, message: 'No active run' };
        }
        
        switch (choice) {
            case 'explore':
                return this.handleExplore();
            case 'rest':
                return this.handleRest();
            case 'shop':
                return this.handleShop();
            case 'battle':
                return this.handleBattle();
            case 'continue':
                return this.advanceToNextZone();
            case 'use_item':
                return this.handleUseItem(data);
            case 'switch_creature':
                return this.handleSwitchCreature(data);
            default:
                return { success: false, message: `Unknown choice: ${choice}` };
        }
    }

    /**
     * Handle explore choice
     * @returns {Object} Result
     */
    handleExplore() {
        this.currentRun.log('Exploring the zone...');
        
        // LUNARIS_TODO: Generate random exploration events
        return {
            success: true,
            message: 'Explored the zone',
            event: 'exploration'
        };
    }

    /**
     * Handle rest choice
     * @returns {Object} Result
     */
    handleRest() {
        // Heal all creatures
        for (const creature of this.currentRun.team) {
            creature.hp = creature.maxHp;
            creature.status = null;
        }
        
        this.currentRun.log('Rested at a safe spot. All creatures fully healed!');
        
        return {
            success: true,
            message: 'Rested and healed team'
        };
    }

    /**
     * Handle shop choice
     * @returns {Object} Result
     */
    handleShop() {
        // LUNARIS_TODO: Implement shop system
        this.currentRun.log('Visited a shop...');
        
        return {
            success: true,
            message: 'Shop visited',
            shopItems: []
        };
    }

    /**
     * Handle battle choice
     * @returns {Object} Result
     */
    handleBattle() {
        // LUNARIS_TODO: Integrate with combat engine
        this.currentRun.log('Starting a battle...');
        
        return {
            success: true,
            message: 'Battle started',
            encounter: null // Will be filled by encounter manager
        };
    }

    /**
     * Handle use item
     * @param {Object} data - Item data
     * @returns {Object} Result
     */
    handleUseItem(data) {
        const { itemId, targetIndex } = data;
        
        if (!this.currentRun.inventory.removeItem(itemId)) {
            return { success: false, message: 'Item not found' };
        }
        
        const item = this.data.items[itemId];
        
        // Apply item effect
        if (item.type === 'healing') {
            const target = this.currentRun.team[targetIndex];
            if (target) {
                const healAmount = item.heal === 'full' ? target.maxHp : item.heal;
                target.hp = Math.min(target.maxHp, target.hp + healAmount);
                this.currentRun.log(`Used ${item.name}. ${target.name} restored ${healAmount} HP!`);
            }
        }
        
        return {
            success: true,
            message: `Used ${item.name}`
        };
    }

    /**
     * Handle switch creature
     * @param {Object} data - Switch data
     * @returns {Object} Result
     */
    handleSwitchCreature(data) {
        const { index } = data;
        const success = this.currentRun.switchCreature(index);
        
        return {
            success: success,
            message: success ? 'Switched creature' : 'Failed to switch'
        };
    }

    /**
     * Save current run
     * @param {string} slot - Save slot ID
     * @returns {Object} Save result
     */
    saveRun(slot = 'auto') {
        if (!this.currentRun) {
            return { success: false, message: 'No active run to save' };
        }
        
        const saveData = this.currentRun.serialize();
        this.savedRuns[slot] = saveData;
        
        // Also save to localStorage if in browser
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(`lunaris_run_${slot}`, JSON.stringify(saveData));
        }
        
        this.currentRun.log(`Run saved to slot: ${slot}`);
        
        return { success: true, message: 'Run saved', slot: slot };
    }

    /**
     * Load a saved run
     * @param {string} slot - Save slot ID
     * @returns {Object} Load result
     */
    loadRun(slot = 'auto') {
        let saveData = this.savedRuns[slot];
        
        // Try localStorage if not in memory
        if (!saveData && typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(`lunaris_run_${slot}`);
            if (stored) {
                saveData = JSON.parse(stored);
            }
        }
        
        if (!saveData) {
            return { success: false, message: 'No save found in slot' };
        }
        
        this.currentRun = RunState.deserialize(saveData, this.data);
        this.currentRun.log(`Run loaded from slot: ${slot}`);
        
        return {
            success: true,
            message: 'Run loaded',
            run: this.currentRun
        };
    }

    /**
     * End the run
     * @param {boolean} victory - Whether run was victorious
     * @returns {Object} Run summary
     */
    endRun(victory = false) {
        if (!this.currentRun) {
            return null;
        }
        
        this.currentRun.isOver = true;
        this.currentRun.isVictory = victory;
        this.currentRun.ending = victory ? 'victory' : 'defeat';
        
        const summary = this.currentRun.getSummary();
        
        if (victory) {
            this.currentRun.log('=== RUN COMPLETE - VICTORY! ===');
        } else {
            this.currentRun.log('=== RUN COMPLETE - DEFEAT ===');
        }
        
        return summary;
    }

    /**
     * Get current run state
     * @returns {RunState} Current run state
     */
    getCurrentRun() {
        return this.currentRun;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RunManager };
}
