/**
 * saveManager.js
 * Main save system manager
 */

// LUNARIS_TODO: add cloud save support later

/**
 * SaveManager class
 * Main class for managing game saves
 */
class SaveManager {
    constructor() {
        this.storageKey = 'lunaris_';
        this.saveSlots = null;
        this.serializer = null;
        this.validator = null;
        
        // Import other save modules
        const { SaveSlots } = require('./saveSlots.js');
        const { SaveSerializer } = require('./saveSerializer.js');
        const { SaveValidator } = require('./saveValidator.js');
        
        this.saveSlots = new SaveSlots();
        this.serializer = new SaveSerializer();
        this.validator = new SaveValidator();
        
        console.log('[SaveManager] Initialized');
    }

    /**
     * Save a run state
     * @param {Object} runState - Run state to save
     * @param {string} slot - Save slot ID
     * @returns {Object} Save result
     */
    saveRun(runState, slot = 'auto') {
        // Validate run data
        if (!this.validator.validateRunData(runState)) {
            console.warn('[SaveManager] Invalid run data, saving anyway');
        }
        
        // Serialize run state
        const serialized = this.serializer.serializeRun(runState);
        
        // Save to localStorage
        const key = `${this.storageKey}run_${slot}`;
        try {
            localStorage.setItem(key, JSON.stringify(serialized));
            console.log('[SaveManager] Run saved to slot:', slot);
            return { success: true, slot: slot };
        } catch (error) {
            console.error('[SaveManager] Failed to save run:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Load a run state
     * @param {string} slot - Save slot ID
     * @returns {Object|null} Loaded run state
     */
    loadRun(slot = 'auto') {
        const key = `${this.storageKey}run_${slot}`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            console.log('[SaveManager] No save found in slot:', slot);
            return null;
        }
        
        try {
            const parsed = JSON.parse(data);
            
            // Validate loaded data
            if (!this.validator.validateRunData(parsed)) {
                console.warn('[SaveManager] Loaded run data may be corrupted');
            }
            
            // Deserialize
            const runState = this.serializer.deserializeRun(parsed);
            console.log('[SaveManager] Run loaded from slot:', slot);
            return runState;
        } catch (error) {
            console.error('[SaveManager] Failed to load run:', error);
            return null;
        }
    }

    /**
     * Delete a save slot
     * @param {string} slot - Save slot ID
     * @returns {Object} Delete result
     */
    deleteRun(slot) {
        const key = `${this.storageKey}run_${slot}`;
        try {
            localStorage.removeItem(key);
            console.log('[SaveManager] Run deleted from slot:', slot);
            return { success: true };
        } catch (error) {
            console.error('[SaveManager] Failed to delete run:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Save a team
     * @param {Object} team - Team data to save
     * @returns {Object} Save result
     */
    saveTeam(team) {
        const serialized = this.serializer.serializeTeam(team);
        const key = `${this.storageKey}team`;
        
        try {
            localStorage.setItem(key, JSON.stringify(serialized));
            console.log('[SaveManager] Team saved');
            return { success: true };
        } catch (error) {
            console.error('[SaveManager] Failed to save team:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Load a team
     * @returns {Object|null} Loaded team
     */
    loadTeam() {
        const key = `${this.storageKey}team`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            return null;
        }
        
        try {
            const parsed = JSON.parse(data);
            return this.serializer.deserializeTeam(parsed);
        } catch (error) {
            console.error('[SaveManager] Failed to load team:', error);
            return null;
        }
    }

    /**
     * Save inventory
     * @param {Object} inventory - Inventory to save
     * @returns {Object} Save result
     */
    saveInventory(inventory) {
        const serialized = this.serializer.serializeInventory(inventory);
        const key = `${this.storageKey}inventory`;
        
        try {
            localStorage.setItem(key, JSON.stringify(serialized));
            console.log('[SaveManager] Inventory saved');
            return { success: true };
        } catch (error) {
            console.error('[SaveManager] Failed to save inventory:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Load inventory
     * @returns {Object|null} Loaded inventory
     */
    loadInventory() {
        const key = `${this.storageKey}inventory`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            return null;
        }
        
        try {
            const parsed = JSON.parse(data);
            return this.serializer.deserializeInventory(parsed);
        } catch (error) {
            console.error('[SaveManager] Failed to load inventory:', error);
            return null;
        }
    }

    /**
     * Save settings
     * @param {Object} settings - Settings to save
     * @returns {Object} Save result
     */
    saveSettings(settings) {
        const serialized = this.serializer.serializeSettings(settings);
        const key = `${this.storageKey}settings`;
        
        try {
            localStorage.setItem(key, JSON.stringify(serialized));
            console.log('[SaveManager] Settings saved');
            return { success: true };
        } catch (error) {
            console.error('[SaveManager] Failed to save settings:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Load settings
     * @returns {Object} Loaded settings
     */
    loadSettings() {
        const key = `${this.storageKey}settings`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            return {};
        }
        
        try {
            const parsed = JSON.parse(data);
            return this.serializer.deserializeSettings(parsed);
        } catch (error) {
            console.error('[SaveManager] Failed to load settings:', error);
            return {};
        }
    }

    /**
     * Get all save slots info
     * @returns {Array} Array of slot info
     */
    getSaveSlotsInfo() {
        return this.saveSlots.listSlots();
    }

    /**
     * Check if a slot has data
     * @param {string} slot - Slot ID
     * @returns {boolean} True if slot has data
     */
    hasSlotData(slot) {
        const key = `${this.storageKey}run_${slot}`;
        return localStorage.getItem(key) !== null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveManager };
}
