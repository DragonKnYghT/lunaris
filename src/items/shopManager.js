/**
 * shopManager.js
 * Manages shops in Lunaris
 */

// LUNARIS_TODO: add rarity weighting and dynamic shops later

/**
 * ShopManager class
 * Handles shop operations
 */
class ShopManager {
    /**
     * @param {Object} data - Game data (items, tickets)
     */
    constructor(data) {
        this.data = data;
        this.items = data.items || {};
        this.tickets = data.tickets || {};
        this.currentShopInventory = [];
    }

    /**
     * Generate shop inventory based on zone or run state
     * @param {Object} zoneData - Zone data (optional)
     * @returns {Array} Shop inventory
     */
    generateShopInventory(zoneData = null) {
        const inventory = [];
        
        // Add basic healing items
        inventory.push({
            id: 'LunarPotion',
            name: this.items['LunarPotion']?.name || 'Lunar Potion',
            type: 'healing',
            price: this.items['LunarPotion']?.price || 50,
            stock: -1, // -1 = unlimited
            description: this.items['LunarPotion']?.description || 'Restores 20 HP.'
        });
        
        inventory.push({
            id: 'SuperLunarPotion',
            name: this.items['SuperLunarPotion']?.name || 'Super Lunar Potion',
            type: 'healing',
            price: this.items['SuperLunarPotion']?.price || 150,
            stock: -1,
            description: this.items['SuperLunarPotion']?.description || 'Restores 50 HP.'
        });
        
        inventory.push({
            id: 'HyperLunarPotion',
            name: this.items['HyperLunarPotion']?.name || 'Hyper Lunar Potion',
            type: 'healing',
            price: this.items['HyperLunarPotion']?.price || 300,
            stock: -1,
            description: this.items['HyperLunarPotion']?.description || 'Restores 100 HP.'
        });
        
        inventory.push({
            id: 'FullRestore',
            name: this.items['FullRestore']?.name || 'Full Restore',
            type: 'healing',
            price: this.items['FullRestore']?.price || 500,
            stock: 5,
            description: this.items['FullRestore']?.description || 'Fully restores HP and cures status.'
        });
        
        // Add status cure items
        inventory.push({
            id: 'Antidote',
            name: this.items['Antidote']?.name || 'Antidote',
            type: 'status',
            price: this.items['Antidote']?.price || 100,
            stock: 10,
            description: this.items['Antidote']?.description || 'Cures poison.'
        });
        
        inventory.push({
            id: 'ParalyzeHeal',
            name: this.items['ParalyzeHeal']?.name || 'Paralyze Heal',
            type: 'status',
            price: this.items['ParalyzeHeal']?.price || 100,
            stock: 10,
            description: this.items['ParalyzeHeal']?.description || 'Cures paralysis.'
        });
        
        inventory.push({
            id: 'BurnHeal',
            name: this.items['BurnHeal']?.name || 'Burn Heal',
            type: 'status',
            price: this.items['BurnHeal']?.price || 100,
            stock: 10,
            description: this.items['BurnHeal']?.description || 'Cures burn.'
        });
        
        // Add revival items
        inventory.push({
            id: 'Revive',
            name: this.items['Revive']?.name || 'Revive',
            type: 'revival',
            price: this.items['Revive']?.price || 400,
            stock: 5,
            description: this.items['Revive']?.description || 'Revives with half HP.'
        });
        
        inventory.push({
            id: 'MaxRevive',
            name: this.items['MaxRevive']?.name || 'Max Revive',
            type: 'revival',
            price: this.items['MaxRevive']?.price || 800,
            stock: 3,
            description: this.items['MaxRevive']?.description || 'Revives with full HP.'
        });
        
        // Add evolution stones (if zone allows)
        if (!zoneData || zoneData.difficulty >= 2) {
            inventory.push({
                id: 'MoonStone',
                name: this.items['MoonStone']?.name || 'Moon Stone',
                type: 'evolution',
                price: this.items['MoonStone']?.price || 1000,
                stock: 3,
                description: this.items['MoonStone']?.description || 'Evolves certain creatures.'
            });
            
            inventory.push({
                id: 'SunStone',
                name: this.items['SunStone']?.name || 'Sun Stone',
                type: 'evolution',
                price: this.items['SunStone']?.price || 1000,
                stock: 3,
                description: this.items['SunStone']?.description || 'Evolves certain creatures.'
            });
        }
        
        // Add run modifiers
        inventory.push({
            id: 'RareCandy',
            name: this.items['RareCandy']?.name || 'Rare Candy',
            type: 'boost',
            price: this.items['RareCandy']?.price || 150,
            stock: 10,
            description: this.items['RareCandy']?.description || 'Levels up a creature.'
        });
        
        this.currentShopInventory = inventory;
        
        console.log('[ShopManager] Generated shop inventory with', inventory.length, 'items');
        
        return inventory;
    }

    /**
     * Buy an item from the shop
     * @param {string} itemId - Item ID
     * @param {CurrencyManager} currencyManager - Currency manager
     * @param {Inventory} inventory - Player inventory
     * @returns {Object} Result
     */
    buyItem(itemId, currencyManager, inventory) {
        const item = this.currentShopInventory.find(i => i.id === itemId);
        
        if (!item) {
            return {
                success: false,
                message: 'Item not available in shop!'
            };
        }
        
        // Check stock
        if (item.stock !== -1 && item.stock <= 0) {
            return {
                success: false,
                message: 'Item is out of stock!'
            };
        }
        
        // Check currency
        if (!currencyManager.canAfford('standard', item.price)) {
            return {
                success: false,
                message: 'Not enough currency!'
            };
        }
        
        // Deduct currency
        const currencyResult = currencyManager.removeStandard(item.price);
        if (!currencyResult.success) {
            return currencyResult;
        }
        
        // Add to inventory
        inventory.addItem(itemId, 1);
        
        // Decrease stock
        if (item.stock !== -1) {
            item.stock--;
        }
        
        console.log(`[ShopManager] Bought ${item.name} for ${item.price}`);
        
        return {
            success: true,
            message: `Bought ${item.name} for ${item.price}!`,
            item: item,
            newBalance: currencyManager.getStandardBalance()
        };
    }

    /**
     * Sell an item to the shop
     * @param {string} itemId - Item ID
     * @param {CurrencyManager} currencyManager - Currency manager
     * @param {Inventory} inventory - Player inventory
     * @returns {Object} Result
     */
    sellItem(itemId, currencyManager, inventory) {
        // Check if player has the item
        if (!inventory.hasItem(itemId)) {
            return {
                success: false,
                message: "You don't have this item!"
            };
        }
        
        const itemData = this.items[itemId];
        if (!itemData) {
            return {
                success: false,
                message: 'Item not found!'
            };
        }
        
        // Calculate sell price (half of buy price)
        const sellPrice = Math.floor(itemData.price / 2);
        
        // Remove from inventory
        const removeResult = inventory.removeItem(itemId, 1);
        if (!removeResult.success) {
            return removeResult;
        }
        
        // Add currency
        currencyManager.addStandard(sellPrice);
        
        console.log(`[ShopManager] Sold ${itemData.name} for ${sellPrice}`);
        
        return {
            success: true,
            message: `Sold ${itemData.name} for ${sellPrice}!`,
            item: itemData,
            sellPrice: sellPrice,
            newBalance: currencyManager.getStandardBalance()
        };
    }

    /**
     * Get current shop inventory
     * @returns {Array} Current inventory
     */
    getShopInventory() {
        return [...this.currentShopInventory];
    }

    /**
     * Refresh shop inventory
     * @param {Object} zoneData - Zone data (optional)
     * @returns {Array} New inventory
     */
    refreshShop(zoneData = null) {
        this.currentShopInventory = [];
        return this.generateShopInventory(zoneData);
    }

    /**
     * Get shop items by type
     * @param {string} type - Item type
     * @returns {Array} Filtered items
     */
    getItemsByType(type) {
        return this.currentShopInventory.filter(item => item.type === type);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShopManager };
}
