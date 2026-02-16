/**
 * bannerManager.js
 * Manages gacha banners
 */

// LUNARIS_TODO: add time-limited banners later

/**
 * BannerManager class
 * Manages all gacha banners
 */
class BannerManager {
    /**
     * @param {Object} data - Gacha data from JSON
     */
    constructor(data) {
        this.data = data;
        this.banners = this.loadBanners(data);
    }

    /**
     * Load banners from data
     * @param {Object} data - Gacha data
     * @returns {Object} Loaded banners
     */
    loadBanners(data) {
        const banners = {};
        
        for (const bannerId in data) {
            if (bannerId.startsWith('_')) continue; // Skip comments
            
            const banner = data[bannerId];
            banners[bannerId] = {
                id: bannerId,
                name: banner.name,
                description: banner.description,
                rates: banner.rates,
                pool: banner.pool,
                featured: banner.featured || [],
                expiration: banner.expiration
            };
        }
        
        console.log('[BannerManager] Loaded', Object.keys(banners).length, 'banners');
        return banners;
    }

    /**
     * Get a banner by name or ID
     * @param {string} name - Banner name or ID
     * @returns {Object|null} Banner object
     */
    getBanner(name) {
        return this.banners[name] || null;
    }

    /**
     * List all available banners
     * @returns {Array} Array of banner objects
     */
    listBanners() {
        return Object.values(this.banners);
    }

    /**
     * Get the pool for a specific banner
     * @param {string} name - Banner name or ID
     * @returns {Object|null} Pool object
     */
    getPoolForBanner(name) {
        const banner = this.getBanner(name);
        return banner ? banner.pool : null;
    }

    /**
     * Get a random creature from the pool for a specific rarity
     * @param {string} bannerName - Banner name or ID
     * @param {string} rarity - Rarity level
     * @returns {string|null} Creature ID
     */
    getCreatureFromPool(bannerName, rarity) {
        const banner = this.getBanner(bannerName);
        if (!banner || !banner.pool) return null;
        
        const pool = banner.pool[rarity];
        if (!pool || pool.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * pool.length);
        return pool[randomIndex];
    }

    /**
     * Check if a banner is expired
     * @param {string} name - Banner name or ID
     * @returns {boolean} True if expired
     */
    isExpired(name) {
        const banner = this.getBanner(name);
        if (!banner || !banner.expiration) return false;
        
        return new Date(banner.expiration) < new Date();
    }

    /**
     * Get featured creatures for a banner
     * @param {string} name - Banner name or ID
     * @returns {Array} Array of featured creature IDs
     */
    getFeatured(name) {
        const banner = this.getBanner(name);
        return banner ? banner.featured : [];
    }

    /**
     * Get active (non-expired) banners
     * @returns {Array} Array of active banner objects
     */
    getActiveBanners() {
        return this.listBanners().filter(b => !this.isExpired(b.id));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BannerManager };
}
