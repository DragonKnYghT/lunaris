/**
 * Lunaris Site Manager
 * Handles language switching, Theme selection with dropdown, and navbar behavior across all pages
 */

// Theme system with 20 themes
const siteManager = {
    // Current language
    currentLanguage: 'fr',
    
    // Current theme ID (from the themes array)
    currentThemeId: 'sakura',
    
    // Available themes (from themeManager.new.js)
    themes: [
        { id: 'sakura', name: 'Sakura', subtitle: 'Rose pastel & Blanc' },
        { id: 'sakura-nocturne', name: 'Sakura Nocturne', subtitle: 'Rose vif & Noir' },
        { id: 'ocean-mystique', name: 'Océan Mystique', subtitle: 'Bleu profond & Turquoise' },
        { id: 'brasier-royal', name: 'Brasier Royal', subtitle: 'Rouge sombre & Or' },
        { id: 'void-eternel', name: 'Void Éternel', subtitle: 'Noir & Violet néon' },
        { id: 'foudre-divine', name: 'Foudre Divine', subtitle: 'Jaune électrique & Bleu nuit' },
        { id: 'hiver-glacial', name: 'Hiver Glacial', subtitle: 'Bleu clair & Blanc givré' },
        { id: 'foret-spirituelle', name: 'Forêt Spirituelle', subtitle: 'Vert émeraude & Brun foncé' },
        { id: 'lune-ecarlate', name: 'Lune Écarlate', subtitle: 'Rouge sang & Noir' },
        { id: 'empire-celeste', name: 'Empire Céleste', subtitle: 'Blanc & Or lumineux' },
        { id: 'brume-fantome', name: 'Brume Fantôme', subtitle: 'Gris clair & Bleu pâle' },
        { id: 'cyber-city', name: 'Cyber City', subtitle: 'Noir & Cyan néon' },
        { id: 'lotus-imperial', name: 'Lotus Impérial', subtitle: 'Violet & Rose doux' },
        { id: 'dragon-ancestral', name: 'Dragon Ancestral', subtitle: 'Rouge sombre & Noir charbon' },
        { id: 'eclipse', name: 'Éclipse', subtitle: 'Noir & Argent' },
        { id: 'cristal-polaire', name: 'Cristal Polaire', subtitle: 'Bleu glacier & Argent' },
        { id: 'hanami-dore', name: 'Hanami Doré', subtitle: 'Rose pâle & Or rosé' },
        { id: 'abyssal', name: 'Abyssal', subtitle: 'Noir profond & Bleu pétrole' },
        { id: 'neon-pulse', name: 'Néon Pulse', subtitle: 'Violet néon & Rose néon' },
        { id: 'mclaren', name: 'McLaren', subtitle: 'Black & Red' }
    ],
    
    // Full theme colors (for applying CSS variables)
    themeColors: {
        'sakura': {
            primary: '#FFB7C5', primaryDark: '#FF8FA3', primaryLight: '#FFD1DC',
            secondary: '#FFFFFF', secondaryDark: '#E8E8E8',
            background: '#FFF0F5', surface: '#FFF5F8',
            text: '#4A3728', textSecondary: '#8B7355',
            border: '#FFCCD5'
        },
        'sakura-nocturne': {
            primary: '#FF1493', primaryDark: '#C71585', primaryLight: '#FF69B4',
            secondary: '#0A0A0A', secondaryDark: '#000000',
            background: '#1A0A1A', surface: '#2D1A2D',
            text: '#FFFFFF', textSecondary: '#D8BFD8',
            border: '#FF1493'
        },
        'ocean-mystique': {
            primary: '#006994', primaryDark: '#004C6D', primaryLight: '#40E0D0',
            secondary: '#40E0D0', secondaryDark: '#00CED1',
            background: '#001A2D', surface: '#002A4A',
            text: '#E0FFFF', textSecondary: '#87CEEB',
            border: '#006994'
        },
        'brasier-royal': {
            primary: '#8B0000', primaryDark: '#5C0000', primaryLight: '#CD5C5C',
            secondary: '#FFD700', secondaryDark: '#DAA520',
            background: '#1A0505', surface: '#2D0A0A',
            text: '#FFFACD', textSecondary: '#DEB887',
            border: '#8B0000'
        },
        'void-eternel': {
            primary: '#4B0082', primaryDark: '#2E0050', primaryLight: '#8A2BE2',
            secondary: '#9400D3', secondaryDark: '#7B00B4',
            background: '#0A0A0F', surface: '#15101F',
            text: '#E6E6FA', textSecondary: '#DDA0DD',
            border: '#4B0082'
        },
        'foudre-divine': {
            primary: '#FFD700', primaryDark: '#DAA520', primaryLight: '#FFEC8B',
            secondary: '#191970', secondaryDark: '#000080',
            background: '#0A0A1A', surface: '#151530',
            text: '#F0F8FF', textSecondary: '#B0C4DE',
            border: '#FFD700'
        },
        'hiver-glacial': {
            primary: '#ADD8E6', primaryDark: '#87CEEB', primaryLight: '#E0FFFF',
            secondary: '#F0FFFF', secondaryDark: '#E8E8E8',
            background: '#E8F4F8', surface: '#F5FFFF',
            text: '#2F4F4F', textSecondary: '#5F9EA0',
            border: '#B0E0E6'
        },
        'foret-spirituelle': {
            primary: '#50C878', primaryDark: '#228B22', primaryLight: '#90EE90',
            secondary: '#3E2723', secondaryDark: '#1B0F0A',
            background: '#0D1F0D', surface: '#1A2F1A',
            text: '#F0FFF0', textSecondary: '#98FB98',
            border: '#50C878'
        },
        'lune-ecarlate': {
            primary: '#DC143C', primaryDark: '#8B0000', primaryLight: '#FF6347',
            secondary: '#0A0A0A', secondaryDark: '#000000',
            background: '#0F0505', surface: '#1A0A0A',
            text: '#FFFFFF', textSecondary: '#FFB6C1',
            border: '#DC143C'
        },
        'empire-celeste': {
            primary: '#FFFFFF', primaryDark: '#E8E8E8', primaryLight: '#FFFFFF',
            secondary: '#FFD700', secondaryDark: '#DAA520',
            background: '#1A1A2E', surface: '#2D2D4A',
            text: '#1A1A2E', textSecondary: '#4A4A6A',
            border: '#FFD700'
        },
        'brume-fantome': {
            primary: '#D3D3D3', primaryDark: '#A9A9A9', primaryLight: '#E8E8E8',
            secondary: '#B0C4DE', secondaryDark: '#8FA8C8',
            background: '#E8E8F0', surface: '#F0F0F8',
            text: '#2F2F3F', textSecondary: '#5F5F6F',
            border: '#C0C0D0'
        },
        'cyber-city': {
            primary: '#00FFFF', primaryDark: '#00CED1', primaryLight: '#7FFFD4',
            secondary: '#0A0A0A', secondaryDark: '#000000',
            background: '#050510', surface: '#0A0A1A',
            text: '#E0FFFF', textSecondary: '#00CED1',
            border: '#00FFFF'
        },
        'lotus-imperial': {
            primary: '#9932CC', primaryDark: '#7B1FA2', primaryLight: '#BA68C8',
            secondary: '#FFB6C1', secondaryDark: '#FF91A4',
            background: '#1A0A1A', surface: '#2D1A2D',
            text: '#FFFFFF', textSecondary: '#E1BEE7',
            border: '#9932CC'
        },
        'dragon-ancestral': {
            primary: '#8B0000', primaryDark: '#5C0000', primaryLight: '#CD5C5C',
            secondary: '#1C1C1C', secondaryDark: '#0A0A0A',
            background: '#0A0505', surface: '#151010',
            text: '#F5F5F5', textSecondary: '#CD853F',
            border: '#8B0000'
        },
        'eclipse': {
            primary: '#2F2F2F', primaryDark: '#1A1A1A', primaryLight: '#4A4A4A',
            secondary: '#C0C0C0', secondaryDark: '#A8A8A8',
            background: '#050505', surface: '#0F0F0F',
            text: '#E8E8E8', textSecondary: '#A0A0A0',
            border: '#404040'
        },
        'cristal-polaire': {
            primary: '#00BFFF', primaryDark: '#009ACD', primaryLight: '#87CEEB',
            secondary: '#C0C0C0', secondaryDark: '#A8A8A8',
            background: '#E8F4F8', surface: '#F0F8FF',
            text: '#1A3A4A', textSecondary: '#4A6A7A',
            border: '#B0E0E6'
        },
        'hanami-dore': {
            primary: '#FFB6C1', primaryDark: '#FF91A4', primaryLight: '#FFD1DC',
            secondary: '#B76E79', secondaryDark: '#9A5560',
            background: '#FFF0F3', surface: '#FFF5F7',
            text: '#4A3035', textSecondary: '#8B6973',
            border: '#FFD1DC'
        },
        'abyssal': {
            primary: '#004953', primaryDark: '#002F3A', primaryLight: '#006B7A',
            secondary: '#0A1A2A', secondaryDark: '#050D15',
            background: '#020508', surface: '#0A1520',
            text: '#E0F0FF', textSecondary: '#7090A0',
            border: '#004953'
        },
        'neon-pulse': {
            primary: '#FF00FF', primaryDark: '#C71585', primaryLight: '#FF69B4',
            secondary: '#FF1493', secondaryDark: '#C71585',
            background: '#0A0510', surface: '#150A1A',
            text: '#FFFFFF', textSecondary: '#FFB6C1',
            border: '#FF00FF'
        },
        'mclaren': {
            primary: '#FF0000', primaryDark: '#CC0000', primaryLight: '#FF4444',
            secondary: '#000000', secondaryDark: '#000000',
            background: '#0A0A0A', surface: '#1A1A1A',
            text: '#FFFFFF', textSecondary: '#CCCCCC',
            border: '#FF0000'
        }
    },
    
    // Initialize the site manager
    async init() {
        console.log('SiteManager: Initializing...');
        
        // Load saved preferences
        this.loadPreferences();
        
        // Populate theme dropdown
        this.populateThemeDropdown();
        
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
        
        // Load theme preference (new: use theme ID instead of dark/light mode)
        const savedTheme = localStorage.getItem('lunaris_theme');
        if (savedTheme && this.themes.find(t => t.id === savedTheme)) {
            this.currentThemeId = savedTheme;
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
