/**
 * Lunaris Site Manager
 * Handles language switching, theme switching, and navbar behavior across all pages
 */

const siteManager = {
    // Current language
    currentLanguage: 'fr',
    
    // Current theme
    currentTheme: 'dark',
    
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
        
        // Setup navbar behavior for play page
        this.setupNavbarBehavior();
        
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
        
        // Load theme preference
        const savedTheme = localStorage.getItem('lunaris_theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
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
        
        // Theme switch button
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            themeSwitch.addEventListener('click', () => this.toggleTheme());
        }
        
        // Also listen for clicks on theme toggle if it exists
        const themeToggle = document.querySelector('.theme-toggle-switch');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Also listen for clicks on language toggle if it exists
        const langToggle = document.querySelector('.language-toggle-switch');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
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
        
        // Update language toggle switch
        const langToggle = document.querySelector('.language-toggle-switch');
        if (langToggle) {
            langToggle.classList.remove('en', 'fr');
            langToggle.classList.add(this.currentLanguage);
            
            // Update slider text
            const slider = langToggle.querySelector('.language-toggle-slider');
            if (slider) {
                slider.textContent = this.currentLanguage.toUpperCase();
            }
        }
    },
    
    // Toggle theme
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('lunaris_theme', this.currentTheme);
        this.applyTheme();
        this.updateThemeSwitchUI();
    },
    
    // Apply theme to body
    applyTheme() {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(this.currentTheme === 'light' ? 'light-mode' : 'dark-mode');
    },
    
    // Update theme switch UI
    updateThemeSwitchUI() {
        // Update button in navbar
        const themeSwitch = document.getElementById('themeSwitch');
        if (themeSwitch) {
            const darkSpan = themeSwitch.querySelector('.theme-dark');
            const lightSpan = themeSwitch.querySelector('.theme-light');
            if (darkSpan && lightSpan) {
                darkSpan.style.fontWeight = this.currentTheme === 'dark' ? 'bold' : 'normal';
                lightSpan.style.fontWeight = this.currentTheme === 'light' ? 'bold' : 'normal';
            }
        }
        
        // Update theme toggle switch
        const themeToggle = document.querySelector('.theme-toggle-switch');
        if (themeToggle) {
            themeToggle.classList.remove('dark', 'light');
            themeToggle.classList.add(this.currentTheme);
            
            // Update slider icon
            const slider = themeToggle.querySelector('.theme-toggle-slider');
            if (slider) {
                slider.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
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
    
    // Get current theme
    getTheme() {
        return this.currentTheme;
    }
};

// Export for use in other scripts
window.siteManager = siteManager;
