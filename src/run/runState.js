/**
 * runState.js
 * Manages the state of a roguelike run in Lunaris
 */

// LUNARIS_TODO: expand run state fields later

/**
 * Inventory class for managing player items
 */
class Inventory {
    constructor() {
        this.items = {}; // itemId -> quantity
        this.tickets = {}; // ticketId -> quantity
        this.keyItems = []; // Array of key item IDs
    }

    /**
     * Add an item to inventory
     * @param {string} itemId - The item ID
     * @param {number} quantity - Amount to add
     */
    addItem(itemId, quantity = 1) {
        if (!this.items[itemId]) {
            this.items[itemId] = 0;
        }
        this.items[itemId] += quantity;
    }

    /**
     * Remove an item from inventory
     * @param {string} itemId - The item ID
     * @param {number} quantity - Amount to remove
     * @returns {boolean} True if successful
     */
    removeItem(itemId, quantity = 1) {
        if (!this.items[itemId] || this.items[itemId] < quantity) {
            return false;
        }
        this.items[itemId] -= quantity;
        if (this.items[itemId] <= 0) {
            delete this.items[itemId];
        }
        return true;
    }

    /**
     * Get item quantity
     * @param {string} itemId - The item ID
     * @returns {number} Quantity
     */
    getItemQuantity(itemId) {
        return this.items[itemId] || 0;
    }

    /**
     * Add a ticket
     * @param {string} ticketId - The ticket ID
     * @param {number} quantity - Amount to add
     */
    addTicket(ticketId, quantity = 1) {
        if (!this.tickets[ticketId]) {
            this.tickets[ticketId] = 0;
        }
        this.tickets[ticketId] += quantity;
    }

    /**
     * Remove a ticket
     * @param {string} ticketId - The ticket ID
     * @param {number} quantity - Amount to remove
     * @returns {boolean} True if successful
     */
    removeTicket(ticketId, quantity = 1) {
        if (!this.tickets[ticketId] || this.tickets[ticketId] < quantity) {
            return false;
        }
        this.tickets[ticketId] -= quantity;
        if (this.tickets[ticketId] <= 0) {
            delete this.tickets[ticketId];
        }
        return true;
    }

    /**
     * Get ticket quantity
     * @param {string} ticketId - The ticket ID
     * @returns {number} Quantity
     */
    getTicketQuantity(ticketId) {
        return this.tickets[ticketId] || 0;
    }

    /**
     * Add a key item
     * @param {string} keyItemId - The key item ID
     */
    addKeyItem(keyItemId) {
        if (!this.keyItems.includes(keyItemId)) {
            this.keyItems.push(keyItemId);
        }
    }

    /**
     * Check if has key item
     * @param {string} keyItemId - The key item ID
     * @returns {boolean} True if has key item
     */
    hasKeyItem(keyItemId) {
        return this.keyItems.includes(keyItemId);
    }

    /**
     * Get all inventory data
     * @returns {Object} Inventory data
     */
    getData() {
        return {
            items: { ...this.items },
            tickets: { ...this.tickets },
            keyItems: [...this.keyItems]
        };
    }
}

/**
 * RunState class
 * Stores all information about a roguelike run
 */
class RunState {
    /**
     * @param {Object} options - Run options
     * @param {string} options.mode - Game mode (roguelike, nuzlocke, casual, challenge)
     * @param {Object} options.data - Game data
     * @param {string} options.seed - Optional seed for RNG
     */
    constructor(options = {}) {
        this.mode = options.mode || 'roguelike';
        this.data = options.data;
        
        // Get mode rules from data
        this.rules = this.data?.modes?.[this.mode]?.rules || {};
        
        // Run seed for RNG consistency
        this.seed = options.seed || Date.now();
        this.rng = this.createRNG(this.seed);
        
        // Current zone progress
        this.currentZone = null;
        this.zoneIndex = 0;
        this.zonesCompleted = [];
        
        // Current floor/step in current zone
        this.currentFloor = 1;
        this.maxFloors = 5; // Default floors per zone
        
        // Player team
        this.team = [];
        this.activeCreatureIndex = 0;
        
        // Inventory
        this.inventory = new Inventory();
        
        // Caught creatures (for nuzlocke)
        this.caughtCreatures = [];
        this.zonesVisited = [];
        
        // Run statistics
        this.battlesWon = 0;
        this.battlesLost = 0;
        this.totalDamageDealt = 0;
        this.totalDamageTaken = 0;
        this.creaturesFainted = 0;
        
        // Run status
        this.isOver = false;
        this.isVictory = false;
        this.ending = null;
        
        // Run logs
        this.logs = [];
        
        // Current encounter (if in battle)
        this.currentEncounter = null;
        
        // Run start time
        this.startTime = Date.now();
    }

    /**
     * Create a seeded RNG
     * @param {number} seed - Seed value
     * @returns {Object} RNG object
     */
    createRNG(seed) {
        // Simple seeded random number generator (Mulberry32)
        let state = seed;
        return {
            next: function() {
                state += 0x6D2B79F5;
                let t = Math.imul(state ^ (state >>> 15), 1 | state);
                t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            },
            // Get random integer between min and max (inclusive)
            nextInt: function(min, max) {
                return Math.floor(this.next() * (max - min + 1)) + min;
            },
            // Get random array element
            choice: function(array) {
                return array[Math.floor(this.next() * array.length)];
            },
            // Shuffle array
            shuffle: function(array) {
                const result = [...array];
                for (let i = result.length - 1; i > 0; i--) {
                    const j = Math.floor(this.next() * (i + 1));
                    [result[i], result[j]] = [result[j], result[i]];
                }
                return result;
            }
        };
    }

    /**
     * Add a message to the run log
     * @param {string} message - Message to log
     */
    log(message) {
        const timestamp = Date.now() - this.startTime;
        this.logs.push({
            timestamp: timestamp,
            message: message
        });
        console.log(`[Run] ${message}`);
    }

    /**
     * Get active creature
     * @returns {Object} Active creature
     */
    getActiveCreature() {
        return this.team[this.activeCreatureIndex] || null;
    }

    /**
     * Switch active creature
     * @param {number} index - Index to switch to
     * @returns {boolean} Success
     */
    switchCreature(index) {
        if (index < 0 || index >= this.team.length) {
            return false;
        }
        
        const creature = this.team[index];
        if (!creature || creature.isFainted) {
            return false;
        }
        
        this.activeCreatureIndex = index;
        this.log(`Switched to ${creature.name}!`);
        return true;
    }

    /**
     * Add creature to team
     * @param {Object} creature - Creature to add
     * @returns {boolean} Success
     */
    addToTeam(creature) {
        const maxPartySize = this.rules.max_party_size || 6;
        
        if (this.team.length >= maxPartySize) {
            return false;
        }
        
        this.team.push(creature);
        this.log(`${creature.name} joined the team!`);
        return true;
    }

    /**
     * Remove creature from team
     * @param {number} index - Index to remove
     * @returns {Object} Removed creature
     */
    removeFromTeam(index) {
        if (index < 0 || index >= this.team.length) {
            return null;
        }
        
        const creature = this.team.splice(index, 1)[0];
        
        // Adjust active creature index if needed
        if (this.activeCreatureIndex >= this.team.length) {
            this.activeCreatureIndex = Math.max(0, this.team.length - 1);
        }
        
        return creature;
    }

    /**
     * Check if zone was already visited (for nuzlocke)
     * @param {string} zoneId - Zone ID
     * @returns {boolean} True if visited
     */
    hasVisitedZone(zoneId) {
        return this.zonesVisited.includes(zoneId);
    }

    /**
     * Mark zone as visited
     * @param {string} zoneId - Zone ID
     */
    markZoneVisited(zoneId) {
        if (!this.hasVisitedZone(zoneId)) {
            this.zonesVisited.push(zoneId);
        }
    }

    /**
     * Check if creature was already caught
     * @param {string} creatureId - Creature ID
     * @returns {boolean} True if caught
     */
    hasCaughtCreature(creatureId) {
        return this.caughtCreatures.includes(creatureId);
    }

    /**
     * Add caught creature
     * @param {string} creatureId - Creature ID
     */
    addCaughtCreature(creatureId) {
        if (!this.hasCaughtCreature(creatureId)) {
            this.caughtCreatures.push(creatureId);
        }
    }

    /**
     * Check if run should end
     * @returns {boolean} True if run is over
     */
    checkRunEnd() {
        // Check if all creatures fainted
        const allFainted = this.team.length > 0 && this.team.every(c => c.isFainted);
        
        if (allFainted) {
            // Check if player has revive tickets
            const reviveTickets = this.inventory.getTicketQuantity('revive_ticket');
            
            if (reviveTickets > 0 && this.rules.permadeath !== true) {
                // Use revive ticket
                this.inventory.removeTicket('revive_ticket');
                this.log("Used a revive ticket!");
                
                // Revive first fainted creature
                const faintedCreature = this.team.find(c => c.isFainted);
                if (faintedCreature) {
                    faintedCreature.isFainted = false;
                    faintedCreature.currentHp = Math.floor(faintedCreature.maxHp / 2);
                    this.log(`${faintedCreature.name} was revived!`);
                }
                return false;
            }
            
            this.isOver = true;
            this.isVictory = false;
            this.ending = 'defeat';
            this.log("All creatures have fainted! Run ended.");
            return true;
        }
        
        return false;
    }

    /**
     * Get run summary
     * @returns {Object} Run summary
     */
    getSummary() {
        return {
            mode: this.mode,
            isOver: this.isOver,
            isVictory: this.isVictory,
            ending: this.ending,
            zonesCompleted: this.zonesCompleted.length,
            currentZone: this.currentZone,
            battlesWon: this.battlesWon,
            battlesLost: this.battlesLost,
            teamSize: this.team.length,
            inventory: this.inventory.getData(),
            caughtCreatures: this.caughtCreatures.length,
            duration: Date.now() - this.startTime,
            logs: this.logs
        };
    }

    /**
     * Serialize run state for saving
     * @returns {Object} Serialized state
     */
    serialize() {
        return {
            mode: this.mode,
            seed: this.seed,
            currentZone: this.currentZone,
            zoneIndex: this.zoneIndex,
            zonesCompleted: this.zonesCompleted,
            currentFloor: this.currentFloor,
            team: this.team,
            activeCreatureIndex: this.activeCreatureIndex,
            inventory: this.inventory.getData(),
            caughtCreatures: this.caughtCreatures,
            zonesVisited: this.zonesVisited,
            battlesWon: this.battlesWon,
            battlesLost: this.battlesLost,
            isOver: this.isOver,
            isVictory: this.isVictory,
            ending: this.ending,
            startTime: this.startTime
        };
    }

    /**
     * Deserialize run state
     * @param {Object} data - Serialized data
     * @param {Object} data.gameData - Game data for restoring
     * @returns {RunState} RunState instance
     */
    static deserialize(data, gameData) {
        const runState = new RunState({
            mode: data.mode,
            data: gameData,
            seed: data.seed
        });
        
        runState.currentZone = data.currentZone;
        runState.zoneIndex = data.zoneIndex;
        runState.zonesCompleted = data.zonesCompleted;
        runState.currentFloor = data.currentFloor;
        runState.team = data.team;
        runState.activeCreatureIndex = data.activeCreatureIndex;
        runState.inventory = Object.assign(new Inventory(), data.inventory);
        runState.caughtCreatures = data.caughtCreatures;
        runState.zonesVisited = data.zonesVisited;
        runState.battlesWon = data.battlesWon;
        runState.battlesLost = data.battlesLost;
        runState.isOver = data.isOver;
        runState.isVictory = data.isVictory;
        runState.ending = data.ending;
        runState.startTime = data.startTime;
        
        return runState;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RunState, Inventory };
}
