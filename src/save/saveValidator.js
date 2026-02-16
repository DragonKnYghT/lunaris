/**
 * saveValidator.js
 * Validates save data
 */

// LUNARIS_TODO: add checksum or anti-corruption later

/**
 * SaveValidator class
 * Validates save data for integrity
 */
class SaveValidator {
    constructor() {
        console.log('[SaveValidator] Initialized');
    }

    /**
     * Validate run data
     * @param {Object} json - Run data to validate
     * @returns {boolean} True if valid
     */
    validateRunData(json) {
        if (!json) {
            console.warn('[SaveValidator] Run data is null');
            return false;
        }

        // Check required fields
        const requiredFields = ['mode', 'team'];
        for (const field of requiredFields) {
            if (!json.data || json.data[field] === undefined) {
                console.warn(`[SaveValidator] Missing field: ${field}`);
                return false;
            }
        }

        // Validate team is an array
        if (!Array.isArray(json.data.team)) {
            console.warn('[SaveValidator] Team must be an array');
            return false;
        }

        console.log('[SaveValidator] Run data is valid');
        return true;
    }

    /**
     * Validate team data
     * @param {Object} json - Team data to validate
     * @returns {boolean} True if valid
     */
    validateTeamData(json) {
        if (!json) {
            console.warn('[SaveValidator] Team data is null');
            return false;
        }

        // Check required fields
        if (!json.data || !json.data.creatures) {
            console.warn('[SaveValidator] Missing creatures data');
            return false;
        }

        // Validate creatures is an array
        if (!Array.isArray(json.data.creatures)) {
            console.warn('[SaveValidator] Creatures must be an array');
            return false;
        }

        console.log('[SaveValidator] Team data is valid');
        return true;
    }

    /**
     * Validate inventory data
     * @param {Object} json - Inventory data to validate
     * @returns {boolean} True if valid
     */
    validateInventoryData(json) {
        if (!json) {
            console.warn('[SaveValidator] Inventory data is null');
            return false;
        }

        // Check required fields
        if (!json.data) {
            console.warn('[SaveValidator] Missing inventory data');
            return false;
        }

        // Inventory should be an object
        if (typeof json.data !== 'object') {
            console.warn('[SaveValidator] Inventory must be an object');
            return false;
        }

        console.log('[SaveValidator] Inventory data is valid');
        return true;
    }

    /**
     * Validate settings data
     * @param {Object} json - Settings data to validate
     * @returns {boolean} True if valid
     */
    validateSettingsData(json) {
        if (!json) {
            console.warn('[SaveValidator] Settings data is null');
            return false;
        }

        // Check required fields
        if (!json.data) {
            console.warn('[SaveValidator] Missing settings data');
            return false;
        }

        // Settings should be an object
        if (typeof json.data !== 'object') {
            console.warn('[SaveValidator] Settings must be an object');
            return false;
        }

        console.log('[SaveValidator] Settings data is valid');
        return true;
    }

    /**
     * Validate version compatibility
     * @param {string} version - Save version
     * @returns {boolean} True if compatible
     */
    validateVersion(version) {
        // For now, accept all versions
        // In the future, implement migration logic
        console.log('[SaveValidator] Version:', version);
        return true;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveValidator };
}
