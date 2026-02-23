/**
 * Lunaris Site Manager
 * Handles language switching and site-wide initialization
 */

// Simple Day/Night theme system
const siteManager = {
    // Current language
    currentLanguage: 'fr',
    
    // Current theme mode: 'dark' or 'light'
    currentThemeMode: 'dark',
    
    // Initialize the site manager
    async init() {
        console.log('SiteManager: Initializing...');
        
        // Load saved preferences
        this.loadPreferences();
        
        // Initialize theme manager
        if (typeof initThemeManager === 'function') {
            initThemeManager();
        }
        
        // Apply theme
        this.applyTheme();
        
        // Initialize language
        await this.initLanguage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('SiteManager: Initialization complete');
    },
    
    // Load preferences from localStorage
    loadPreferences() {
        // Load language preference
        const savedLang = localStorage.getItem('lunaris_language');
        if (savedLang) {
            this.currentLanguage = savedLang;
        } else {
            // Check browser language
            const browserLang = navigator.language || navigator.userLanguage;
            this.currentLanguage = browserLang.startsWith('fr') ? 'fr' : 'en';
        }
        
        // Load theme preference (Day/Night mode)
        const savedMode = localStorage.getItem('lunaris_theme_mode');
        if (savedMode) {
            this.currentThemeMode = savedMode;
        }
    },
    
    // Initialize language/translation
    async initLanguage() {
        if (typeof translationManager !== 'undefined') {
            await translationManager.init();
            translationManager.setLanguage(this.currentLanguage);
        }
        
        // Update language switch UI
        this.updateLanguageSwitchUI();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Language switch button
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Theme toggle button
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            themeSwitch.addEventListener('click', () => this.toggleTheme());
        }
    },
    
    // Toggle language between EN and FR
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        
        // Save preference
        localStorage.setItem('lunaris_language', this.currentLanguage);
        
        // Update translations
        if (typeof translationManager !== 'undefined') {
            translationManager.setLanguage(this.currentLanguage);
        }
        
        // Update UI
        this.updateLanguageSwitchUI();
        
        console.log('SiteManager: Language changed to', this.currentLanguage);
    },
    
    // Toggle theme between Day and Night
    toggleTheme() {
        this.currentThemeMode = this.currentThemeMode === 'dark' ? 'light' : 'dark';
        
        // Save preference
        localStorage.setItem('lunaris_theme_mode', this.currentThemeMode);
        
        // Apply theme
        this.applyTheme();
        
        // Update UI
        this.updateThemeSwitchUI();
        
        console.log('SiteManager: Theme toggled to', this.currentThemeMode);
    },
    
    // Apply theme to document
    applyTheme() {
        // Remove both classes first
        document.body.classList.remove('light-mode', 'dark-mode');
        
        // Add the appropriate class
        if (this.currentThemeMode === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
    },
    
    // Update language switch UI
    updateLanguageSwitchUI() {
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            const langEn = langSwitch.querySelector('.lang-en');
            const langFr = langSwitch.querySelector('.lang-fr');
            
            if (langEn) {
                langEn.classList.toggle('active', this.currentLanguage === 'en');
            }
            if (langFr) {
                langFr.classList.toggle('active', this.currentLanguage === 'fr');
            }
        }
    },
    
    // Update theme switch UI
    updateThemeSwitchUI() {
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            const icon = themeSwitch.querySelector('.theme-icon');
            if (icon) {
                // Day (light) = Sun, Night (dark) = Moon
                icon.textContent = this.currentThemeMode === 'dark' ? '🌙' : '☀️';
            }
        }
    },
    
    // Setup navbar behavior for play page
    setupNavbarBehavior() {
        // Check if we're on the play page
        const isPlayPage = window.location.href.includes('play.html') || document.querySelector('#game-container');
        
        if (isPlayPage) {
            // Listen for game start
            this.setupGameStartDetection();
        }
    },
    
    // Setup detection for when game starts
    setupGameStartDetection() {
        // Check periodically if game has started
        const checkGameStart = setInterval(() => {
            const screenContainer = document.getElementById('screen-container');
            
            // If game is rendering content, hide navbar
            if (screenContainer && screenContainer.children.length > 0) {
                this.hideNavbar();
                clearInterval(checkGameStart);
            }
        }, 500);
        
        // Also listen for custom event when game starts
        window.addEventListener('gameStart', () => {
            this.hideNavbar();
        });
    },
    
    // Hide navbar and footer
    hideNavbar() {
        document.body.classList.add('game-active');
        console.log('SiteManager: Navbar hidden (game started)');
    },
    
    // Show navbar and footer
    showNavbar() {
        document.body.classList.remove('game-active');
        console.log('SiteManager: Navbar shown');
    },
    
    // Get current language
    getLanguage() {
        return this.currentLanguage;
    },
    
    // Get current theme mode
    getThemeMode() {
        return this.currentThemeMode;
    }
};

// Export for use in other scripts
window.siteManager = siteManager;
