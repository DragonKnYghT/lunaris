/**
 * Lunaris Site Manager
 * Handles language switching, Day/Night theme toggle, and navbar behavior across all pages
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
        
        // Update theme switch UI
        this.updateThemeSwitchUI();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Language switch button
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            langSwitch.addEventListener('click', () => this.toggleLanguage());
        }
        
        // Theme toggle button (handles both 'themeToggle' and 'themeSwitch' ids)
        const themeToggle = document.getElementById('themeToggle') || document.getElementById('themeSwitch');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },
    
    // Toggle language
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        localStorage.setItem('lunaris_language', this.currentLanguage);
        
        if (typeof translationManager !== 'undefined') {
            translationManager.setLanguage(this.currentLanguage);
        }
        
        this.updateLanguageSwitchUI();
    },
    
    // Update language switch UI
    updateLanguageSwitchUI() {
        // Update button in navbar
        const langSwitch = document.getElementById('languageSwitch');
        if (langSwitch) {
            const enSpan = langSwitch.querySelector('.lang-en');
            const frSpan = langSwitch.querySelector('.lang-fr');
            if (enSpan && frSpan) {
                enSpan.style.fontWeight = this.currentLanguage === 'en' ? 'bold' : 'normal';
                frSpan.style.fontWeight = this.currentLanguage === 'fr' ? 'bold' : 'normal';
            }
        }
    },
    
    // Toggle theme (Day/Night)
    toggleTheme() {
        this.currentThemeMode = this.currentThemeMode === 'dark' ? 'light' : 'dark';
        localStorage.setItem('lunaris_theme_mode', this.currentThemeMode);
        this.applyTheme();
        this.updateThemeSwitchUI();
    },
    
    // Apply theme to body
    applyTheme() {
        // Remove both classes first
        document.body.classList.remove('light-mode', 'dark-mode');
        
        // Add the appropriate class
        if (this.currentThemeMode === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.add('dark-mode');
        }
        
        // Update game theme if ThemeManager exists
        if (typeof themeManager !== 'undefined' && themeManager) {
            themeManager.setThemeMode(this.currentThemeMode);
        }
    },
    
    // Update theme switch UI
    updateThemeSwitchUI() {
        // Handle both 'themeToggle' and 'themeSwitch' ids
        const themeToggle = document.getElementById('themeToggle');
        const themeSwitch = document.getElementById('themeSwitch');
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                // Day (light) = Sun, Night (dark) = Moon
                icon.textContent = this.currentThemeMode === 'dark' ? '🌙' : '☀️';
            }
        }
        
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
            const gameContainer = document.getElementById('game-container');
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
        
        // Alternative: check when loading is hidden
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.getElementById('game-loading');
                if (loading && loading.classList.contains('hidden')) {
                    this.hideNavbar();
                }
            }, 2000);
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
