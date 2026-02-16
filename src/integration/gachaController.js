/**
 * gachaController.js
 * Controller for managing gacha pulls
 */

// LUNARIS_TODO: add animations and rarity effects later

/**
 * GachaController class
 * Manages gacha system and pulls
 */
class GachaController {
    constructor(gameData) {
        this.gameData = gameData;
        this.gachaManager = null;
        
        // Initialize GachaManager if available
        if (typeof GachaManager !== 'undefined') {
            this.gachaManager = new GachaManager(gameData);
        }
        
        console.log('[GachaController] Initialized');
    }

    /**
     * Open the gacha menu
     */
    openGachaMenu() {
        console.log('[GachaController] Opening gacha menu');
        
        // Show gacha menu UI
        if (typeof showGachaMenu === 'function') {
            // showGachaMenu();
        }
        
        console.log('[GachaController] Gacha menu opened');
    }

    /**
     * Pull from a banner
     * @param {string} bannerName - Banner name
     * @param {number} count - Number of pulls (1 or 10)
     * @returns {Object} Pull results
     */
    pullFromBanner(bannerName, count = 1) {
        if (!this.gachaManager) {
            console.error('[GachaController] GachaManager not available');
            return null;
        }
        
        console.log('[GachaController] Pulling from banner:', bannerName, 'count:', count);
        
        // Perform pull
        const results = this.gachaManager.pull(bannerName, count);
        
        // Process results
        const processedResults = this.processPullResults(results);
        
        console.log('[GachaController] Pull results:', processedResults);
        
        return processedResults;
    }

    /**
     * Process pull results
     * @param {Object} results - Raw results
     * @returns {Object} Processed results
     */
    processPullResults(results) {
        if (!results || !results.pulls) {
            return null;
        }
        
        const processed = {
            pulls: results.pulls.map(pull => {
                const creature = this.gameData.creatures[pull.creatureId];
                return {
                    creatureId: pull.creatureId,
                    creature: creature,
                    rarity: pull.rarity,
                    isNew: true // Assume new for now
                };
            }),
            totalPulls: results.pulls.length,
            rarityBreakdown: this.getRarityBreakdown(results.pulls)
        };
        
        return processed;
    }

    /**
     * Get rarity breakdown of pulls
     * @param {Array} pulls - Array of pulls
     * @returns {Object} Rarity counts
     */
    getRarityBreakdown(pulls) {
        const breakdown = {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0
        };
        
        pulls.forEach(pull => {
            const rarity = pull.rarity || 'common';
            if (breakdown.hasOwnProperty(rarity)) {
                breakdown[rarity]++;
            } else {
                breakdown.common++;
            }
        });
        
        return breakdown;
    }

    /**
     * Show pull results to player
     * @param {Object} results - Processed results
     */
    showPullResults(results) {
        console.log('[GachaController] Showing pull results');
        
        // Display results to player
        // This would show animations and the pulled creatures
        
        results.pulls.forEach(pull => {
            console.log(`  ${pull.rarity.toUpperCase()}: ${pull.creature.name}`);
        });
    }

    /**
     * Get available banners
     * @returns {Array} Array of banner info
     */
    getBanners() {
        if (!this.gachaManager) {
            return [];
        }
        
        return this.gachaManager.listBanners();
    }

    /**
     * Get banner details
     * @param {string} bannerName - Banner name
     * @returns {Object} Banner details
     */
    getBannerDetails(bannerName) {
        if (!this.gachaManager || !this.gameData.gacha) {
            return null;
        }
        
        return this.gameData.gacha[bannerName] || null;
    }

    /**
     * Check if player has enough tickets/currency for pull
     * @param {string} bannerName - Banner name
     * @param {number} count - Number of pulls
     * @returns {boolean} True if can afford
     */
    canAffordPull(bannerName, count = 1) {
        // Simplified check - would normally check player's inventory
        return true;
    }

    /**
     * Deduct cost for pull
     * @param {string} bannerName - Banner name
     * @param {number} count - Number of pulls
     */
    deductPullCost(bannerName, count = 1) {
        console.log('[GachaController] Deducting cost for', count, 'pull(s)');
        // Would deduct from player's inventory
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GachaController };
}
