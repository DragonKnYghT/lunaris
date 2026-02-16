/**
 * controlSettings.js
 * Manages control/keybind settings for the game
 */

// LUNARIS_TODO: integrate with input manager later

/**
 * ControlSettings class
 * Manages all control and keybind settings
 */
class ControlSettings {
    constructor() {
        this.keybinds = this.getDefaultKeybinds();
        this.invertedControls = false;
        this.vibration = true;
        
        console.log('[ControlSettings] Initialized');
    }

    /**
     * Get default keybinds
     * @returns {Object} Default keybinds
     */
    getDefaultKeybinds() {
        return {
            // Movement
            moveUp: 'ArrowUp',
            moveDown: 'ArrowDown',
            moveLeft: 'ArrowLeft',
            moveRight: 'ArrowRight',
            
            // Actions
            confirm: 'Enter',
            cancel: 'Escape',
            menu: 'Tab',
            
            // Combat
            attack: 'KeyA',
            defend: 'KeyS',
            special: 'KeyD',
            item: 'KeyF',
            capture: 'Space',
            
            // UI
            pause: 'Escape',
            inventory: 'KeyI',
            team: 'KeyT',
            map: 'KeyM'
        };
    }

    /**
     * Set a keybind for an action
     * @param {string} action - Action name
     * @param {string} key - Key code
     */
    setKeybind(action, key) {
        if (this.keybinds.hasOwnProperty(action)) {
            this.keybinds[action] = key;
            console.log('[ControlSettings] Keybind set:', action, '=', key);
        } else {
            console.warn('[ControlSettings] Unknown action:', action);
        }
        // LUNARIS_TODO: integrate with input manager later
    }

    /**
     * Get a keybind for an action
     * @param {string} action - Action name
     * @returns {string} Key code
     */
    getKeybind(action) {
        return this.keybinds[action] || null;
    }

    /**
     * Get all keybinds
     * @returns {Object} All keybinds
     */
    getAllKeybinds() {
        return { ...this.keybinds };
    }

    /**
     * Set multiple keybinds at once
     * @param {Object} keybinds - Object of action: key pairs
     */
    setMultipleKeybinds(keybinds) {
        for (const [action, key] of Object.entries(keybinds)) {
            this.setKeybind(action, key);
        }
    }

    /**
     * Reset all keybinds to default
     */
    resetToDefault() {
        this.keybinds = this.getDefaultKeybinds();
        console.log('[ControlSettings] Keybinds reset to defaults');
    }

    /**
     * Set inverted controls
     * @param {boolean} inverted - Whether controls are inverted
     */
    setInvertedControls(inverted) {
        this.invertedControls = !!inverted;
        console.log('[ControlSettings] Inverted controls set to:', this.invertedControls);
        // LUNARIS_TODO: integrate with input manager later
    }

    /**
     * Set vibration
     * @param {boolean} enabled - Whether vibration is enabled
     */
    setVibration(enabled) {
        this.vibration = !!enabled;
        console.log('[ControlSettings] Vibration set to:', this.vibration);
        // LUNARIS_TODO: integrate with input manager later
    }

    /**
     * Apply all control settings to the game
     */
    applyControls() {
        console.log('[ControlSettings] Applying control settings...');
        console.log('  Keybinds:', this.keybinds);
        console.log('  Inverted controls:', this.invertedControls);
        console.log('  Vibration:', this.vibration);
        // LUNARIS_TODO: integrate with input manager later
    }

    /**
     * Get all control settings as an object
     * @returns {Object} Control settings
     */
    getSettings() {
        return {
            keybinds: { ...this.keybinds },
            invertedControls: this.invertedControls,
            vibration: this.vibration
        };
    }

    /**
     * Load control settings from an object
     * @param {Object} settings - Settings object
     */
    loadSettings(settings) {
        if (settings.keybinds) {
            this.keybinds = { ...this.getDefaultKeybinds(), ...settings.keybinds };
        }
        if (settings.invertedControls !== undefined) this.invertedControls = settings.invertedControls;
        if (settings.vibration !== undefined) this.vibration = settings.vibration;
        console.log('[ControlSettings] Settings loaded');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ControlSettings };
}
