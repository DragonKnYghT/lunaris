/**
 * languageSettings.js
 * Manages language/localization settings for the game
 */

// LUNARIS_TODO: integrate with localization system later

/**
 * LanguageSettings class
 * Manages all language and localization settings
 */
class LanguageSettings {
    constructor() {
        this.currentLanguage = 'en';
        this.availableLanguages = [
            { code: 'en', name: 'English' },
            { code: 'fr', name: 'Français' }
        ];
        
        console.log('[LanguageSettings] Initialized');
    }

    /**
     * Set the current language
     * @param {string} langCode - Language code (e.g., 'en', 'es', 'fr')
     */
    setLanguage(langCode) {
        const language = this.availableLanguages.find(l => l.code === langCode);
        
        if (language) {
            this.currentLanguage = langCode;
            console.log('[LanguageSettings] Language set to:', language.name);
        } else {
            console.warn('[LanguageSettings] Invalid language code:', langCode);
        }
        // LUNARIS_TODO: integrate with localization system later
    }

    /**
     * Get the current language code
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     * @returns {Array} Array of available language objects
     */
    getAvailableLanguages() {
        return [...this.availableLanguages];
    }

    /**
     * Get language name by code
     * @param {string} langCode - Language code
     * @returns {string} Language name
     */
    getLanguageName(langCode) {
        const language = this.availableLanguages.find(l => l.code === langCode);
        return language ? language.name : 'Unknown';
    }

    /**
     * Apply the current language setting to the game
     */
    applyLanguage() {
        console.log('[LanguageSettings] Applying language:', this.getLanguageName(this.currentLanguage));
        console.log('  Language code:', this.currentLanguage);
        
        // Update document language
        document.documentElement.lang = this.currentLanguage;
        
        // LUNARIS_TODO: integrate with localization system later
        // This should load the appropriate language files and update all UI text
    }

    /**
     * Get all language settings as an object
     * @returns {Object} Language settings
     */
    getSettings() {
        return {
            language: this.currentLanguage
        };
    }

    /**
     * Load language settings from an object
     * @param {Object} settings - Settings object
     */
    loadSettings(settings) {
        if (settings.language !== undefined) {
            this.setLanguage(settings.language);
        }
        console.log('[LanguageSettings] Settings loaded');
    }

    /**
     * Reset language settings to default
     */
    resetToDefault() {
        this.currentLanguage = 'en';
        console.log('[LanguageSettings] Reset to defaults');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageSettings };
}
