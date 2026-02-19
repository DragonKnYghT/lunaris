/**
 * audioSettings.js
 * Manages audio settings for the game
 */

// LUNARIS_TODO: integrate with actual audio engine later

/**
 * AudioSettings class
 * Manages all audio-related settings
 */
class AudioSettings {
    constructor() {
        this.masterVolume = 1.0;
        this.musicVolume = 0.8;
        this.sfxVolume = 1.0;
        this.ambientVolume = 0.5;
        this.sfxEnabled = true;
        
        console.log('[AudioSettings] Initialized');
    }

    /**
     * Set master volume
     * @param {number} value - Volume level (0.0 to 1.0)
     */
    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        console.log('[AudioSettings] Master volume set to:', this.masterVolume);
        // LUNARIS_TODO: integrate with actual audio engine later
    }

    /**
     * Set music volume
     * @param {number} value - Volume level (0.0 to 1.0)
     */
    setMusicVolume(value) {
        this.musicVolume = Math.max(0, Math.min(1, value));
        console.log('[AudioSettings] Music volume set to:', this.musicVolume);
        // LUNARIS_TODO: integrate with actual audio engine later
    }

    /**
     * Set SFX volume
     * @param {number} value - Volume level (0.0 to 1.0)
     */
    setSfxVolume(value) {
        this.sfxVolume = Math.max(0, Math.min(1, value));
        console.log('[AudioSettings] SFX volume set to:', this.sfxVolume);
        // LUNARIS_TODO: integrate with actual audio engine later
    }

    /**
    * Toggle SFX ON/OFF
     */
    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        this.setSfxVolume(this.sfxEnabled ? 1.0 : 0.0);
        console.log('[AudioSettings] SFX toggled:', this.sfxEnabled ? 'ON' : 'OFF');
    }

    /**
     * Set ambient volume
     * @param {number} value - Volume level (0.0 to 1.0)
     */
    setAmbientVolume(value) {
        this.ambientVolume = Math.max(0, Math.min(1, value));
        console.log('[AudioSettings] Ambient volume set to:', this.ambientVolume);
        // LUNARIS_TODO: integrate with actual audio engine later
    }

    /**
     * Apply all audio settings to the game
     */
    applyAudioSettings() {
        console.log('[AudioSettings] Applying audio settings...');
        console.log('  Master:', this.masterVolume);
        console.log('  Music:', this.musicVolume);
        console.log('  SFX:', this.sfxVolume);
        console.log('  Ambient:', this.ambientVolume);
        // LUNARIS_TODO: integrate with actual audio engine later
    }

    /**
     * Get all audio settings as an object
     * @returns {Object} Audio settings
     */
    getSettings() {
        return {
            masterVolume: this.masterVolume,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            ambientVolume: this.ambientVolume
        };
    }

    /**
     * Load audio settings from an object
     * @param {Object} settings - Settings object
     */
    loadSettings(settings) {
        if (settings.masterVolume !== undefined) this.masterVolume = settings.masterVolume;
        if (settings.musicVolume !== undefined) this.musicVolume = settings.musicVolume;
        if (settings.sfxVolume !== undefined) this.sfxVolume = settings.sfxVolume;
        if (settings.ambientVolume !== undefined) this.ambientVolume = settings.ambientVolume;
        console.log('[AudioSettings] Settings loaded');
    }

    /**
     * Reset all audio settings to default
     */
    resetToDefault() {
        this.masterVolume = 1.0;
        this.musicVolume = 0.8;
        this.sfxVolume = 1.0;
        this.ambientVolume = 0.5;
        console.log('[AudioSettings] Reset to defaults');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioSettings };
}
