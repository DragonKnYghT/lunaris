/**
 * rarityTable.js
 * Handles rarity determination with weighted probability
 */

// LUNARIS_TODO: add pity system or bonus rates later

/**
 * RarityTable class
 * Determines rarity based on weighted probability
 */
class RarityTable {
    /**
     * @param {Object} rates - Rarity rates (e.g., { common: 70, rare: 20, epic: 8, legendary: 2 })
     */
    constructor(rates) {
        this.rates = rates;
        this.totalWeight = this.calculateTotalWeight();
    }

    /**
     * Calculate total weight from rates
     * @returns {number} Total weight
     */
    calculateTotalWeight() {
        let total = 0;
        for (const key in this.rates) {
            total += this.rates[key];
        }
        return total;
    }

    /**
     * Get a random rarity based on weighted probability
     * @returns {string} The selected rarity
     */
    getRarity() {
        const roll = Math.random() * this.totalWeight;
        let cumulativeWeight = 0;

        for (const rarity in this.rates) {
            cumulativeWeight += this.rates[rarity];
            if (roll < cumulativeWeight) {
                return rarity;
            }
        }

        // Fallback to common if something goes wrong
        return 'common';
    }

    /**
     * Get the rate for a specific rarity
     * @param {string} rarity - The rarity to get rate for
     * @returns {number} The rate percentage
     */
    getRate(rarity) {
        return this.rates[rarity] || 0;
    }

    /**
     * Get all available rarities
     * @returns {Array} Array of rarity names
     */
    getRarities() {
        return Object.keys(this.rates);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RarityTable };
}
