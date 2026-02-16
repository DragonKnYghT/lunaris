/**
 * itemManager.js
 * Manages items in Lunaris
 */

// LUNARIS_TODO: integrate with combat and run systems later

/**
 * ItemManager class
 * Handles item operations and effects
 */
class ItemManager {
    /**
     * @param {Object} data - Game data (items, tickets)
     */
    constructor(data) {
        this.data = data;
        this.items = data.items || {};
        this.tickets = data.tickets || {};
    }

    /**
     * Load item data
     * @param {Object} data - Game data
     */
    loadItemData(data) {
        this.items = data.items || {};
        this.tickets = data.tickets || {};
        console.log('[ItemManager] Item data loaded');
    }

    /**
     * Get an item by ID
     * @param {string} itemId - Item ID
     * @returns {Object|null} Item data
     */
    getItem(itemId) {
        return this.items[itemId] || null;
    }

    /**
     * Get a ticket by ID
     * @param {string} ticketId - Ticket ID
     * @returns {Object|null} Ticket data
     */
    getTicket(ticketId) {
        return this.tickets[ticketId] || null;
    }

    /**
     * Use an item on a target
     * @param {string} itemId - Item ID
     * @param {Object} target - Target (creature, player, etc.)
     * @param {Object} context - Additional context
     * @returns {Object} Result
     */
    useItem(itemId, target, context = {}) {
        const item = this.getItem(itemId);
        
        if (!item) {
            return {
                success: false,
                message: 'Item not found!'
            };
        }
        
        console.log(`[ItemManager] Using ${item.name} on ${target.name || target.id}`);
        
        // LUNARIS_TODO: Implement actual item effects using itemEffects.js
        
        // Placeholder results based on item type
        switch (item.type) {
            case 'healing':
                return this.applyHealing(item, target, context);
            case 'evolution':
                return this.applyEvolution(item, target, context);
            case 'revival':
                return this.applyRevival(item, target, context);
            case 'status':
                return this.applyStatusCure(item, target, context);
            default:
                return {
                    success: true,
                    message: `Used ${item.name}!`
                };
        }
    }

    /**
     * Apply healing item effect
     * @param {Object} item - Item data
     * @param {Object} target - Target creature
     * @param {Object} context - Context
     * @returns {Object} Result
     */
    applyHealing(item, target, context) {
        const healAmount = item.heal === 'full' ? target.maxHp : item.heal;
        const actualHeal = Math.min(healAmount, target.maxHp - target.currentHp);
        
        target.currentHp += actualHeal;
        
        return {
            success: true,
            message: `Restored ${actualHeal} HP!`,
            effect: 'healing',
            amount: actualHeal
        };
    }

    /**
     * Apply evolution item effect
     * @param {Object} item - Item data
     * @param {Object} target - Target creature
     * @param {Object} context - Context
     * @returns {Object} Result
     */
    applyEvolution(item, target, context) {
        // LUNARIS_TODO: Check if creature can evolve
        
        return {
            success: true,
            message: `${target.name} is evolving!`,
            effect: 'evolution',
            evolved: true
        };
    }

    /**
     * Apply revival item effect
     * @param {Object} item - Item data
     * @param {Object} target - Target creature
     * @param {Object} context - Context
     * @returns {Object} Result
     */
    applyRevival(item, target, context) {
        const healAmount = item.heal === 'full' ? target.maxHp : Math.floor(target.maxHp / 2);
        
        target.currentHp = healAmount;
        target.isFainted = false;
        
        return {
            success: true,
            message: `${target.name} was revived!`,
            effect: 'revival',
            hp: healAmount
        };
    }

    /**
     * Apply status cure item effect
     * @param {Object} item - Item data
     * @param {Object} target - Target creature
     * @param {Object} context - Context
     * @returns {Object} Result
     */
    applyStatusCure(item, target, context) {
        if (!target.status) {
            return {
                success: false,
                message: `${target.name} has no status condition!`
            };
        }
        
        const curedStatus = item.statusCure;
        
        if (target.status === curedStatus) {
            target.status = null;
            return {
                success: true,
                message: `Cured ${curedStatus}!`,
                effect: 'status_cure',
                cured: curedStatus
            };
        }
        
        return {
            success: false,
            message: `Can't cure ${target.status} with this item!`
        };
    }

    /**
     * Get all available items
     * @returns {Array} Array of item info
     */
    getAllItems() {
        return Object.entries(this.items).map(([id, item]) => ({
            id: id,
            name: item.name,
            type: item.type,
            description: item.description
        }));
    }

    /**
     * Get all available tickets
     * @returns {Array} Array of ticket info
     */
    getAllTickets() {
        return Object.entries(this.tickets).map(([id, ticket]) => ({
            id: id,
            name: ticket.name,
            description: ticket.description,
            price: ticket.price
        }));
    }

    /**
     * Get items by type
     * @param {string} type - Item type
     * @returns {Array} Items of the specified type
     */
    getItemsByType(type) {
        return Object.entries(this.items)
            .filter(([id, item]) => item.type === type)
            .map(([id, item]) => ({
                id: id,
                name: item.name,
                description: item.description
            }));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ItemManager };
}
