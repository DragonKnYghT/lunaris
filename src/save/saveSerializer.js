/**
 * saveSerializer.js
 * Handles serialization and deserialization of save data
 */

// LUNARIS_TODO: add versioning for future updates

/**
 * SaveSerializer class
 * Handles converting objects to/from JSON for saving
 */
class SaveSerializer {
    constructor() {
        this.version = '1.0.0';
        console.log('[SaveSerializer] Initialized');
    }

    /**
     * Serialize run state
     * @param {Object} runState - Run state to serialize
     * @returns {Object} Serialized run state
     */
    serializeRun(runState) {
        return {
            version: this.version,
            type: 'run',
            timestamp: Date.now(),
            data: {
                mode: runState.mode || 'roguelike',
                currentZone: runState.currentZone || null,
                zonesCompleted: runState.zonesCompleted || [],
                team: runState.team || [],
                inventory: runState.inventory || {},
                currency: runState.currency || 0,
                progress: runState.progress || 0
            }
        };
    }

    /**
     * Deserialize run state
     * @param {Object} json - Serialized run state
     * @returns {Object} Deserialized run state
     */
    deserializeRun(json) {
        if (!json || !json.data) {
            return null;
        }
        
        return {
            mode: json.data.mode || 'roguelike',
            currentZone: json.data.currentZone || null,
            zonesCompleted: json.data.zonesCompleted || [],
            team: json.data.team || [],
            inventory: json.data.inventory || {},
            currency: json.data.currency || 0,
            progress: json.data.progress || 0,
            timestamp: json.timestamp || null
        };
    }

    /**
     * Serialize team
     * @param {Array} team - Team to serialize
     * @returns {Object} Serialized team
     */
    serializeTeam(team) {
        return {
            version: this.version,
            type: 'team',
            timestamp: Date.now(),
            data: {
                creatures: team || []
            }
        };
    }

    /**
     * Deserialize team
     * @param {Object} json - Serialized team
     * @returns {Array} Deserialized team
     */
    deserializeTeam(json) {
        if (!json || !json.data) {
            return [];
        }
        
        return json.data.creatures || [];
    }

    /**
     * Serialize inventory
     * @param {Object} inventory - Inventory to serialize
     * @returns {Object} Serialized inventory
     */
    serializeInventory(inventory) {
        return {
            version: this.version,
            type: 'inventory',
            timestamp: Date.now(),
            data: inventory || {}
        };
    }

    /**
     * Deserialize inventory
     * @param {Object} json - Serialized inventory
     * @returns {Object} Deserialized inventory
     */
    deserializeInventory(json) {
        if (!json || !json.data) {
            return {};
        }
        
        return json.data;
    }

    /**
     * Serialize settings
     * @param {Object} settings - Settings to serialize
     * @returns {Object} Serialized settings
     */
    serializeSettings(settings) {
        return {
            version: this.version,
            type: 'settings',
            timestamp: Date.now(),
            data: settings || {}
        };
    }

    /**
     * Deserialize settings
     * @param {Object} json - Serialized settings
     * @returns {Object} Deserialized settings
     */
    deserializeSettings(json) {
        if (!json || !json.data) {
            return {};
        }
        
        return json.data;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveSerializer };
}
