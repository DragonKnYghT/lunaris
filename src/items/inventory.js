/**
 * inventory.js
 * Manages player inventory in Lunaris
 */

// LUNARIS_TODO: add sorting and filtering later

/**
 * Inventory class
 * Handles player inventory management
 */
class Inventory {
    /**
     * @param {Object} itemData - Item data from items.json
     */
    constructor(itemData = {}) {
        this.itemData = itemData;
        this.items = new Map(); // itemId -> amount
    }

    /**
     * Add an item to the inventory
     * @param {string} itemId - Item ID
     * @param {number} amount - Amount to add (default 1)
     * @returns {Object} Result
     */
    addItem(itemId, amount = 1) {
        const currentAmount = this.items.get(itemId) || 0;
        this.items.set(itemId, currentAmount + amount);
        
        const itemName = this.itemData[itemId]?.name || itemId;
        console.log(`[Inventory] Added ${amount}x ${itemName}`);
        
        return {
            success: true,
            itemId: itemId,
            amount: amount,
            total: this.items.get(itemId)
        };
    }

    /**
     * Remove an item from the inventory
     * @param {string} itemId - Item ID
     * @param {number} amount - Amount to remove (default 1)
     * @returns {Object} Result
     */
    removeItem(itemId, amount = 1) {
        const currentAmount = this.items.get(itemId) || 0;
        
        if (currentAmount < amount) {
            return {
                success: false,
                message: 'Not enough items!'
            };
        }
        
        const newAmount = currentAmount - amount;
        if (newAmount <= 0) {
            this.items.delete(itemId);
        } else {
            this.items.set(itemId, newAmount);
        }
        
        const itemName = this.itemData[itemId]?.name || itemId;
        console.log(`[Inventory] Removed ${amount}x ${itemName}`);
        
        return {
            success: true,
            itemId: itemId,
            amount: amount,
            remaining: newAmount
        };
    }

    /**
     * Check if the inventory has an item
     * @param {string} itemId - Item ID
     * @returns {boolean}
     */
    hasItem(itemId) {
        return this.items.has(itemId) && this.items.get(itemId) > 0;
    }

    /**
     * Get the count of a specific item
     * @param {string} itemId - Item ID
     * @returns {number}
     */
    getItemCount(itemId) {
        return this.items.get(itemId) || 0;
    }

    /**
     * List all items in the inventory
     * @returns {Array} Array of items with details
     */
    listItems() {
        const result = [];
        
        for (const [itemId, amount] of this.items.entries()) {
            const itemInfo = this.itemData[itemId];
            result.push({
                id: itemId,
                name: itemInfo?.name || itemId,
                type: itemInfo?.type || 'unknown',
                amount: amount,
                description: itemInfo?.description || ''
            });
        }
        
        return result;
    }

    /**
     * Get inventory summary
     * @returns {Object} Summary
     */
    getSummary() {
        let totalItems = 0;
        const typeCount = {};
        
        for (const [itemId, amount] of this.items.entries()) {
            totalItems += amount;
            const itemType = this.itemData[itemId]?.type || 'unknown';
            typeCount[itemType] = (typeCount[itemType] || 0) + amount;
        }
        
        return {
            totalItems: totalItems,
            uniqueItems: this.items.size,
            typeCount: typeCount
        };
    }

    /**
     * Clear the inventory
     */
    clear() {
        this.items.clear();
        console.log('[Inventory] Inventory cleared');
    }

    /**
     * Check if inventory is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.size === 0;
    }

    /**
     * Get items by type
     * @param {string} type - Item type
     * @returns {Array} Items of the specified type
     */
    getItemsByType(type) {
        const result = [];
        
        for (const [itemId, amount] of this.items.entries()) {
            const itemInfo = this.itemData[itemId];
            if (itemInfo?.type === type) {
                result.push({
                    id: itemId,
                    name: itemInfo.name,
                    amount: amount
                });
            }
        }
        
        return result;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Inventory };
}
