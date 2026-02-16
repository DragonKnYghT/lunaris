/**
 * pullSimulator.js
 * Handles gacha pull simulation
 */

// LUNARIS_TODO: add animations and sound effects later

/**
 * PullSimulator class
 * Simulates gacha pulls
 */
class PullSimulator {
    /**
     * @param {Object} banner - Banner object
     * @param {RarityTable} rarityTable - Rarity table for determining rarity
     */
    constructor(banner, rarityTable) {
        this.banner = banner;
        this.rarityTable = rarityTable;
    }

    /**
     * Perform a single pull
     * @returns {Object} Pull result
     */
    singlePull() {
        // Determine rarity
        const rarity = this.rarityTable.getRarity();
        
        // Get creature from pool
        const creatureId = this.getCreatureFromPool(rarity);
        
        const result = {
            rarity: rarity,
            creatureId: creatureId,
            isFeatured: this.isFeatured(creatureId),
            timestamp: Date.now()
        };
        
        console.log(`[PullSimulator] Single pull: ${rarity} - ${creatureId}`);
        
        return result;
    }

    /**
     * Perform multiple pulls
     * @param {number} count - Number of pulls
     * @returns {Array} Array of pull results
     */
    multiPull(count) {
        const results = [];
        
        for (let i = 0; i < count; i++) {
            results.push(this.singlePull());
        }
        
        console.log(`[PullSimulator] Multi pull: ${count} pulls completed`);
        
        return results;
    }

    /**
     * Get a creature from the pool for the given rarity
     * @param {string} rarity - Rarity level
     * @returns {string|null} Creature ID
     */
    getCreatureFromPool(rarity) {
        const pool = this.banner.pool[rarity];
        
        if (!pool || pool.length === 0) {
            // Fallback to common if pool is empty
            const commonPool = this.banner.pool['common'];
            if (commonPool && commonPool.length > 0) {
                const randomIndex = Math.floor(Math.random() * commonPool.length);
                return commonPool[randomIndex];
            }
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * pool.length);
        return pool[randomIndex];
    }

    /**
     * Check if a creature is featured
     * @param {string} creatureId - Creature ID
     * @returns {boolean} True if featured
     */
    isFeatured(creatureId) {
        const featured = this.banner.featured;
        return featured && featured.includes(creatureId);
    }

    /**
     * Get pull details for display
     * @param {Object} result - Pull result
     * @returns {Object} Formatted result
     */
    formatPullResult(result) {
        return {
            rarity: result.rarity,
            creatureId: result.creatureId,
            isFeatured: result.isFeatured,
            timestamp: result.timestamp
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PullSimulator };
}
