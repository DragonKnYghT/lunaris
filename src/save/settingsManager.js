/**
 * settingsManager.js
 * Manages game settings
 */

// LUNARIS_TODO: integrate with UI later

/**
 * SettingsManager class
 * Manages game settings
 */
class SettingsManager {
    constructor() {
        this.settings = this.defaultSettings();
        console.log('[SettingsManager] Initialized');
    }

    /**
     * Get default settings
     * @returns {Object} Default settings
     */
    defaultSettings() {
        return {
            audio: {
                masterVolume: 1.0,
                musicVolume: 0.8,
                sfxVolume: 1.0,
                ambientVolume: 0.5
            },
            language: 'en',
            theme: 'dark',
            accessibility: {
                highContrast: false,
                reducedMotion: false,
                screenReader: false
            },
            graphics: {
                quality: 'high',
                vsync: true,
                fullscreen: false,
                resolution: '1920x1080'
            },
            gameplay: {
                showTutorial: true,
                autoSave: true,
                showDamageNumbers: true,
                showCaptureChance: true
            },
            controls: {
                touchControls: false,
                vibration: true
            }
        };
    }

    /**
     * Apply settings
     * @param {Object} settings - Settings to apply
     */
    applySettings(settings) {
        // Merge with defaults
        this.settings = {
            ...this.defaultSettings(),
            ...settings,
            audio: {
                ...this.defaultSettings().audio,
                ...(settings.audio || {})
            },
            accessibility: {
                ...this.defaultSettings().accessibility,
                ...(settings.accessibility || {})
            },
            graphics: {
                ...this.defaultSettings().graphics,
                ...(settings.graphics || {})
            },
            gameplay: {
                ...this.defaultSettings().gameplay,
                ...(settings.gameplay || {})
            },
            controls: {
                ...this.defaultSettings().controls,
                ...(settings.controls || {})
            }
        };
        
        console.log('[SettingsManager] Settings applied');
    }

    /**
     * Update a single setting
     * @param {string} key - Setting key (dot notation supported)
     * @param {*} value - New value
     */
    updateSetting(key, value) {
        const keys = key.split('.');
        let current = this.settings;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        console.log('[SettingsManager] Updated setting:', key, '=', value);
    }

    /**
     * Get a single setting
     * @param {string} key - Setting key (dot notation supported)
     * @returns {*} Setting value
     */
    getSetting(key) {
        const keys = key.split('.');
        let current = this.settings;
        
        for (const k of keys) {
            if (current === undefined || current[k] === undefined) {
                return undefined;
            }
            current = current[k];
        }
        
        return current;
    }

    /**
     * Get all settings
     * @returns {Object} All settings
     */
    getAllSettings() {
        return { ...this.settings };
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.settings = this.defaultSettings();
        console.log('[SettingsManager] Settings reset to defaults');
    }

    /**
     * Validate settings
     * @returns {boolean} True if valid
     */
    validateSettings() {
        const required = ['audio', 'language', 'theme', 'accessibility', 'graphics', 'gameplay', 'controls'];
        
        for (const key of required) {
            if (!this.settings[key]) {
                console.warn('[SettingsManager] Missing setting:', key);
                return false;
            }
        }
        
        if (this.settings.audio.masterVolume < 0 || this.settings.audio.masterVolume > 1) {
            console.warn('[SettingsManager] Invalid master volume');
            return false;
        }
        
        return true;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SettingsManager };
}
