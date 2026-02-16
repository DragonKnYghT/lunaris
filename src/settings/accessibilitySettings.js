/**
 * accessibilitySettings.js
 * Manages accessibility settings for the game
 */

// LUNARIS_TODO: add more accessibility features later

/**
 * AccessibilitySettings class
 * Manages all accessibility-related settings
 */
class AccessibilitySettings {
    constructor() {
        this.colorblindMode = false;
        this.colorblindType = 'none'; // none, protanopia, deuteranopia, tritanopia
        this.textSize = 'medium'; // small, medium, large, extra-large
        this.highContrast = false;
        this.reducedMotion = false;
        this.screenReaderSupport = false;
        
        console.log('[AccessibilitySettings] Initialized');
    }

    /**
     * Set colorblind mode
     * @param {boolean} enabled - Whether colorblind mode is enabled
     */
    setColorblindMode(enabled) {
        this.colorblindMode = !!enabled;
        console.log('[AccessibilitySettings] Colorblind mode set to:', this.colorblindMode);
        
        if (!enabled) {
            this.colorblindType = 'none';
        }
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Set colorblind type
     * @param {string} type - Colorblind type ('none', 'protanopia', 'deuteranopia', 'tritanopia')
     */
    setColorblindType(type) {
        const validTypes = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];
        
        if (validTypes.includes(type)) {
            this.colorblindType = type;
            this.colorblindMode = type !== 'none';
            console.log('[AccessibilitySettings] Colorblind type set to:', this.colorblindType);
        } else {
            console.warn('[AccessibilitySettings] Invalid colorblind type:', type);
        }
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Set text size
     * @param {string} size - Text size ('small', 'medium', 'large', 'extra-large')
     */
    setTextSize(size) {
        const validSizes = ['small', 'medium', 'large', 'extra-large'];
        
        if (validSizes.includes(size)) {
            this.textSize = size;
            console.log('[AccessibilitySettings] Text size set to:', this.textSize);
            
            // Apply text size to document
            document.documentElement.style.setProperty('--text-size', size);
        } else {
            console.warn('[AccessibilitySettings] Invalid text size:', size);
        }
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Set high contrast mode
     * @param {boolean} enabled - Whether high contrast is enabled
     */
    setHighContrast(enabled) {
        this.highContrast = !!enabled;
        console.log('[AccessibilitySettings] High contrast set to:', this.highContrast);
        
        // Apply high contrast to document
        if (this.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Set reduced motion
     * @param {boolean} enabled - Whether reduced motion is enabled
     */
    setReducedMotion(enabled) {
        this.reducedMotion = !!enabled;
        console.log('[AccessibilitySettings] Reduced motion set to:', this.reducedMotion);
        
        // Apply reduced motion preference
        if (this.reducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        } else {
            document.documentElement.style.removeProperty('--animation-duration');
        }
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Set screen reader support
     * @param {boolean} enabled - Whether screen reader support is enabled
     */
    setScreenReaderSupport(enabled) {
        this.screenReaderSupport = !!enabled;
        console.log('[AccessibilitySettings] Screen reader support set to:', this.screenReaderSupport);
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Apply all accessibility settings to the game
     */
    applyAccessibility() {
        console.log('[AccessibilitySettings] Applying accessibility settings...');
        console.log('  Colorblind mode:', this.colorblindMode);
        console.log('  Colorblind type:', this.colorblindType);
        console.log('  Text size:', this.textSize);
        console.log('  High contrast:', this.highContrast);
        console.log('  Reduced motion:', this.reducedMotion);
        console.log('  Screen reader:', this.screenReaderSupport);
        // LUNARIS_TODO: add more accessibility features later
    }

    /**
     * Get all accessibility settings as an object
     * @returns {Object} Accessibility settings
     */
    getSettings() {
        return {
            colorblindMode: this.colorblindMode,
            colorblindType: this.colorblindType,
            textSize: this.textSize,
            highContrast: this.highContrast,
            reducedMotion: this.reducedMotion,
            screenReaderSupport: this.screenReaderSupport
        };
    }

    /**
     * Load accessibility settings from an object
     * @param {Object} settings - Settings object
     */
    loadSettings(settings) {
        if (settings.colorblindMode !== undefined) this.colorblindMode = settings.colorblindMode;
        if (settings.colorblindType !== undefined) this.colorblindType = settings.colorblindType;
        if (settings.textSize !== undefined) this.textSize = settings.textSize;
        if (settings.highContrast !== undefined) this.highContrast = settings.highContrast;
        if (settings.reducedMotion !== undefined) this.reducedMotion = settings.reducedMotion;
        if (settings.screenReaderSupport !== undefined) this.screenReaderSupport = settings.screenReaderSupport;
        console.log('[AccessibilitySettings] Settings loaded');
    }

    /**
     * Reset all accessibility settings to default
     */
    resetToDefault() {
        this.colorblindMode = false;
        this.colorblindType = 'none';
        this.textSize = 'medium';
        this.highContrast = false;
        this.reducedMotion = false;
        this.screenReaderSupport = false;
        console.log('[AccessibilitySettings] Reset to defaults');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AccessibilitySettings };
}
