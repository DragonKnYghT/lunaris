/**
 * gachaManager.js
 * Main gacha system manager
 */

// LUNARIS_TODO: integrate with rewardManager later

/**
 * GachaManager class
 * Main class for managing gacha system
 */
class GachaManager {
    /**
     * @param {Object} data - Game data (gacha, tickets, creatures)
     */
    constructor(data) {
        this.data = data;
        this.gachaData = data.gacha || {};
        this.ticketsData = data.tickets || {};
        this.creaturesData = data.creatures || {};
        
        // Import managers
        const { BannerManager } = require('./bannerManager.js');
        const { RarityTable } = require('./rarityTable.js');
        const { PullSimulator } = require('./pullSimulator.js');
        
        this.bannerManager = new BannerManager(this.gachaData);
        this.pullSimulator = null;
        
        console.log('[GachaManager] Initialized');
    }

    /**
     * Pull from a banner
     * @param {string} bannerName - Banner name or ID
     * @param {number} count - Number of pulls
     * @returns {Object} Pull result
     */
    pull(bannerName, count = 1) {
        // Get banner
        const banner = this.bannerManager.getBanner(bannerName);
        if (!banner) {
            return { success: false, message: `Banner not found: ${bannerName}` };
        }
        
        // Check if banner is expired
        if (this.bannerManager.isExpired(bannerName)) {
            return { success: false, message: 'Banner has expired' };
        }
        
        // Create rarity table and pull simulator
        const rarityTable = new RarityTable(banner.rates);
        this.pullSimulator = new PullSimulator(banner, rarityTable);
        
        // Perform pulls
        let results;
        if (count === 1) {
            results = this.pullSimulator.singlePull();
        } else {
            results = this.pullSimulator.multiPull(count);
        }
        
        console.log(`[GachaManager] Pulled from ${bannerName}:`, results);
        
        return {
            success: true,
            banner: bannerName,
            results: results,
            message: count === 1 ? 'Pull successful!' : `${count} pulls completed!`
        };
    }

    /**
     * Check if player has required tickets
     * @param {number} count - Number of tickets needed
     * @returns {boolean} True if has enough tickets
     */
    hasRequiredTickets(count) {
        // LUNARIS_TODO: integrate with inventory system
        // For now, just return true for testing
        return true;
    }

    /**
     * Consume tickets for pull
     * @param {number} count - Number of tickets to consume
     * @returns {Object} Result
     */
    consumeTickets(count) {
        // LUNARIS_TODO: integrate with inventory system
        // For now, just return success for testing
        console.log(`[GachaManager] Consumed ${count} tickets`);
        return { success: true, message: 'Tickets consumed' };
    }

    /**
     * Grant rewards from pull
     * @param {Object} results - Pull results
     * @returns {Object} Rewards
     */
    grantRewards(results) {
        const rewards = {
            creatures: [],
            items: []
        };
        
        // Process results
        const resultsArray = Array.isArray(results) ? results : [results];
        
        for (const result of resultsArray) {
            if (result.creatureId) {
                rewards.creatures.push({
                    id: result.creatureId,
                    rarity: result.rarity,
                    isFeatured: result.isFeatured
                });
            }
        }
        
        console.log('[GachaManager] Rewards granted:', rewards);
        return rewards;
    }

    /**
     * Get banner information
     * @param {string} name - Banner name
     * @returns {Object} Banner info
     */
    getBannerInfo(name) {
        const banner = this.bannerManager.getBanner(name);
        if (!banner) return null;
        
        return {
            id: banner.id,
            name: banner.name,
            description: banner.description,
            rates: banner.rates,
            featured: banner.featured,
            isExpired: this.bannerManager.isExpired(name)
        };
    }

    /**
     * List all available banners
     * @returns {Array} Array of banner info
     */
    listBanners() {
        return this.bannerManager.listBanners().map(b => ({
            id: b.id,
            name: b.name,
            description: b.description,
            isExpired: this.bannerManager.isExpired(b.id)
        }));
    }

    /**
     * Get pull rates for a banner
     * @param {string} name - Banner name
     * @returns {Object} Rates
     */
    getRates(name) {
        const banner = this.bannerManager.getBanner(name);
        return banner ? banner.rates : null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GachaManager };
}
