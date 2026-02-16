/**
 * saveSlots.js
 * Manages save slots
 */

// LUNARIS_TODO: add UI integration later

/**
 * SaveSlots class
 * Manages save slots
 */
class SaveSlots {
    constructor() {
        this.storageKey = 'lunaris_slot_';
        this.maxSlots = 10;
        console.log('[SaveSlots] Initialized');
    }

    /**
     * List all save slots
     * @returns {Array} Array of slot info
     */
    listSlots() {
        const slots = [];
        
        for (let i = 1; i <= this.maxSlots; i++) {
            const slotData = this.getSlot(i);
            if (slotData) {
                slots.push({
                    id: i,
                    exists: true,
                    timestamp: slotData.timestamp,
                    mode: slotData.mode,
                    progress: slotData.progress
                });
            } else {
                slots.push({
                    id: i,
                    exists: false
                });
            }
        }
        
        return slots;
    }

    /**
     * Get a specific slot
     * @param {number} slotId - Slot ID
     * @returns {Object|null} Slot data
     */
    getSlot(slotId) {
        const key = `${this.storageKey}${slotId}`;
        const data = localStorage.getItem(key);
        
        if (!data) {
            return null;
        }
        
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('[SaveSlots] Failed to parse slot:', error);
            return null;
        }
    }

    /**
     * Create a new slot
     * @param {number} slotId - Slot ID
     * @param {Object} metadata - Slot metadata
     * @returns {Object} Result
     */
    createSlot(slotId, metadata = {}) {
        if (slotId < 1 || slotId > this.maxSlots) {
            return { success: false, message: 'Invalid slot ID' };
        }
        
        const slotData = {
            id: slotId,
            timestamp: Date.now(),
            mode: metadata.mode || 'roguelike',
            progress: metadata.progress || 0,
            created: true
        };
        
        const key = `${this.storageKey}${slotId}`;
        
        try {
            localStorage.setItem(key, JSON.stringify(slotData));
            console.log('[SaveSlots] Created slot:', slotId);
            return { success: true, slot: slotData };
        } catch (error) {
            console.error('[SaveSlots] Failed to create slot:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Delete a slot
     * @param {number} slotId - Slot ID
     * @returns {Object} Result
     */
    deleteSlot(slotId) {
        if (slotId < 1 || slotId > this.maxSlots) {
            return { success: false, message: 'Invalid slot ID' };
        }
        
        const key = `${this.storageKey}${slotId}`;
        
        try {
            localStorage.removeItem(key);
            console.log('[SaveSlots] Deleted slot:', slotId);
            return { success: true };
        } catch (error) {
            console.error('[SaveSlots] Failed to delete slot:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Update slot metadata
     * @param {number} slotId - Slot ID
     * @param {Object} metadata - Metadata to update
     * @returns {Object} Result
     */
    updateSlot(slotId, metadata) {
        const existing = this.getSlot(slotId);
        
        if (!existing) {
            return this.createSlot(slotId, metadata);
        }
        
        const updated = {
            ...existing,
            ...metadata,
            timestamp: Date.now()
        };
        
        const key = `${this.storageKey}${slotId}`;
        
        try {
            localStorage.setItem(key, JSON.stringify(updated));
            console.log('[SaveSlots] Updated slot:', slotId);
            return { success: true, slot: updated };
        } catch (error) {
            console.error('[SaveSlots] Failed to update slot:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Get the next available slot
     * @returns {number} Slot ID
     */
    getNextAvailableSlot() {
        for (let i = 1; i <= this.maxSlots; i++) {
            if (!this.getSlot(i)) {
                return i;
            }
        }
        return -1; // No available slots
    }

    /**
     * Get slot count
     * @returns {number} Number of used slots
     */
    getUsedSlotCount() {
        let count = 0;
        for (let i = 1; i <= this.maxSlots; i++) {
            if (this.getSlot(i)) {
                count++;
            }
        }
        return count;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveSlots };
}
