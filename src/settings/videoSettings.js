/**
 * videoSettings.js
 * Manages video/graphics settings for the game
 */

// LUNARIS_TODO: integrate with rendering engine later

/**
 * VideoSettings class
 * Manages all video and graphics-related settings
 */
class VideoSettings {
    constructor() {
        this.resolution = '1920x1080';
        this.fullscreen = false;
        this.animations = true;
        this.vsync = true;
        this.quality = 'high';
        
        console.log('[VideoSettings] Initialized');
    }

    /**
     * Set screen resolution
     * @param {string} option - Resolution option (e.g., '1920x1080', '1280x720', '2560x1440')
     */
    setResolution(option) {
        const validResolutions = ['1920x1080', '1280x720', '2560x1440', '3840x2160', 'windowed'];
        
        if (validResolutions.includes(option) || option === 'windowed') {
            this.resolution = option;
            console.log('[VideoSettings] Resolution set to:', this.resolution);
        } else {
            console.warn('[VideoSettings] Invalid resolution:', option);
        }
        // LUNARIS_TODO: integrate with rendering engine later
    }

    /**
     * Set fullscreen mode
     * @param {boolean} enabled - Whether fullscreen is enabled
     */
    setFullscreen(enabled) {
        this.fullscreen = !!enabled;
        console.log('[VideoSettings] Fullscreen set to:', this.fullscreen);
        
        // Apply fullscreen change
        if (this.fullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn('[VideoSettings] Could not enter fullscreen:', err);
            });
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => {
                    console.warn('[VideoSettings] Could not exit fullscreen:', err);
                });
            }
        }
        // LUNARIS_TODO: integrate with rendering engine later
    }

    /**
     * Set animations enabled
     * @param {boolean} enabled - Whether animations are enabled
     */
    setAnimations(enabled) {
        this.animations = !!enabled;
        console.log('[VideoSettings] Animations set to:', this.animations);
        
        // Apply animations setting
        if (this.animations) {
            document.documentElement.style.setProperty('--animation-enabled', '1');
        } else {
            document.documentElement.style.setProperty('--animation-enabled', '0');
        }
        // LUNARIS_TODO: integrate with rendering engine later
    }

    /**
     * Set VSync
     * @param {boolean} enabled - Whether VSync is enabled
     */
    setVsync(enabled) {
        this.vsync = !!enabled;
        console.log('[VideoSettings] VSync set to:', this.vsync);
        // LUNARIS_TODO: integrate with rendering engine later
    }

    /**
     * Set graphics quality
     * @param {string} quality - Quality level ('low', 'medium', 'high', 'ultra')
     */
    setQuality(quality) {
        const validQualities = ['low', 'medium', 'high', 'ultra'];
        
        if (validQualities.includes(quality)) {
            this.quality = quality;
            console.log('[VideoSettings] Quality set to:', this.quality);
        } else {
            console.warn('[VideoSettings] Invalid quality:', quality);
        }
        // LUNARIS_TODO: integrate with rendering engine later
    }

    /**
     * Apply all video settings to the game
     */
    applyVideoSettings() {
        console.log('[VideoSettings] Applying video settings...');
        console.log('  Resolution:', this.resolution);
        console.log('  Fullscreen:', this.fullscreen);
        console.log('  Animations:', this.animations);
        console.log('  VSync:', this.vsync);
        console.log('  Quality:', this.quality);
        // LUNARIS_TODO: integrate with rendering engine later
    }

    /**
     * Get all video settings as an object
     * @returns {Object} Video settings
     */
    getSettings() {
        return {
            resolution: this.resolution,
            fullscreen: this.fullscreen,
            animations: this.animations,
            vsync: this.vsync,
            quality: this.quality
        };
    }

    /**
     * Load video settings from an object
     * @param {Object} settings - Settings object
     */
    loadSettings(settings) {
        if (settings.resolution !== undefined) this.resolution = settings.resolution;
        if (settings.fullscreen !== undefined) this.fullscreen = settings.fullscreen;
        if (settings.animations !== undefined) this.animations = settings.animations;
        if (settings.vsync !== undefined) this.vsync = settings.vsync;
        if (settings.quality !== undefined) this.quality = settings.quality;
        console.log('[VideoSettings] Settings loaded');
    }

    /**
     * Reset all video settings to default
     */
    resetToDefault() {
        this.resolution = '1920x1080';
        this.fullscreen = false;
        this.animations = true;
        this.vsync = true;
        this.quality = 'high';
        console.log('[VideoSettings] Reset to defaults');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VideoSettings };
}
