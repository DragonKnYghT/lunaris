/**
 * translationManager.js
 * Manages loading and applying translations for the game and website
 */

class TranslationManager {
    constructor() {
        this.currentLanguage = 'fr'; // French as default
        this.translations = {};
        this.loaded = false;
        this.listeners = [];
        
        console.log('[TranslationManager] Initialized with French as default');
    }

    /**
     * Initialize the translation manager and load translations
     * @returns {Promise<void>}
     */
    async init() {
        try {
            // Load both languages
            await this.loadLanguage('en');
            await this.loadLanguage('fr');
            this.loaded = true;
            console.log('[TranslationManager] Translations loaded successfully');
            
            // Apply the default language
            this.applyTranslations();
        } catch (error) {
            console.error('[TranslationManager] Failed to load translations:', error);
        }
    }

    /**
     * Load a specific language file
     * @param {string} langCode - Language code (e.g., 'en', 'fr')
     * @returns {Promise<void>}
     */
    async loadLanguage(langCode) {
        try {
            const response = await fetch(`data/translations/${langCode}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${langCode} translations`);
            }
            this.translations[langCode] = await response.json();
            console.log(`[TranslationManager] Loaded language: ${langCode}`);
        } catch (error) {
            console.error(`[TranslationManager] Error loading ${langCode}:`, error);
            // Create empty translations if loading fails
            this.translations[langCode] = {};
        }
    }

    /**
     * Set the current language
     * @param {string} langCode - Language code (e.g., 'en', 'fr')
     */
    setLanguage(langCode) {
        if (this.translations[langCode]) {
            this.currentLanguage = langCode;
            document.documentElement.lang = langCode;
            this.applyTranslations();
            this.notifyListeners();
            console.log(`[TranslationManager] Language set to: ${langCode}`);
        } else {
            console.warn(`[TranslationManager] Language not found: ${langCode}`);
        }
    }

    /**
     * Get the current language code
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get a translation by key path
     * @param {string} keyPath - Dot-separated key path (e.g., 'common.play')
     * @param {string} fallback - Fallback text if key not found
     * @returns {string} Translated text or fallback
     */
    t(keyPath, fallback = '') {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                // Try English as fallback
                value = this.translations['en'];
                for (const k of keys) {
                    if (value && typeof value === 'object' && k in value) {
                        value = value[k];
                    } else {
                        return fallback || keyPath;
                    }
                }
                break;
            }
        }
        
        return value || fallback || keyPath;
    }

    /**
     * Apply translations to the website (DOM elements with data-i18n attribute)
     */
    applyWebsiteTranslations() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Translate elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Translate elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation) {
                element.title = translation;
            }
        });

        console.log('[TranslationManager] Website translations applied');
    }

    /**
     * Apply translations to the game UI
     */
    applyGameTranslations() {
        // This will be called by the game when rendering menus
        // The game menus will use this.t() function to get translations
        console.log('[TranslationManager] Game translations ready');
    }

    /**
     * Apply all translations (website and game)
     */
    applyTranslations() {
        this.applyWebsiteTranslations();
        this.applyGameTranslations();
        
        // Dispatch custom event for game UI updates
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLanguage } 
        }));
    }

    /**
     * Add a listener for language changes
     * @param {Function} callback - Callback function to execute on language change
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove a language change listener
     * @param {Function} callback - Callback function to remove
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    /**
     * Notify all listeners of language change
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                console.error('[TranslationManager] Listener error:', error);
            }
        });
    }

    /**
     * Get all available languages
     * @returns {Array} Array of available language objects
     */
    getAvailableLanguages() {
        return [
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'fr', name: 'French', nativeName: 'Français' }
        ];
    }

    /**
     * Get translation function bound to current language
     * @returns {Function} Bound translation function
     */
    getTranslateFunction() {
        return (keyPath, fallback) => this.t(keyPath, fallback);
    }
}

// Create global instance
const translationManager = new TranslationManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TranslationManager, translationManager };
}
