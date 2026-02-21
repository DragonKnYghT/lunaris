/**
 * Lunaris Site Manager
 * Handles language switching, theme switching, and navbar behavior across all pages
 */

// Theme icons mapping
const themeIcons = {
    'sakura': '🌸', 'sakura-nocturne': '🌸🌙', 'ocean-mystique': '🌊',
    'brasier-royal': '🔥', 'void-eternel': '🌌', 'foudre-divine': '⚡',
    'hiver-glacial': '❄️', 'foret-spirituelle': '🌿', 'lune-ecarlate': '🩸',
    'empire-celeste': '👑', 'brume-fantome': '🌫️', 'cyber-city': '🌆',
    'lotus-imperial': '🌺', 'dragon-ancestral': '🐉', 'eclipse': '🌑',
    'cristal-polaire': '🧊', 'hanami-dore': '🌸', 'abyssal': '🌑',
    'neon-pulse': '🌈', 'mclaren': '🏎️'
};

// Get theme display name based on current language
function getThemeDisplayName(themeId, lang) {
    const themeNames = {
        'sakura': lang === 'fr' ? 'Sakura' : 'Sakura',
        'sakura-nocturne': lang === 'fr' ? 'Sakura Nocturne' : 'Sakura Nocturne',
        'ocean-mystique': lang === 'fr' ? 'Océan Mystique' : 'Ocean Mystique',
        'brasier-royal': lang === 'fr' ? 'Brasier Royal' : 'Brasier Royal',
        'void-eternel': lang === 'fr' ? 'Void Éternel' : 'Void Eternel',
        'foudre-divine': lang === 'fr' ? 'Foudre Divine' : 'Foudre Divine',
        'hiver-glacial': lang === 'fr' ? 'Hiver Glacial' : 'Hiver Glacial',
        'foret-spirituelle': lang === 'fr' ? 'Forêt Spirituelle' : 'Foret Spirituelle',
        'lune-ecarlate': lang === 'fr' ? 'Lune Écarlate' : 'Lune Ecarlate',
        'empire-celeste': lang === 'fr' ? 'Empire Céleste' : 'Empire Celeste',
        'brume-fantome': lang === 'fr' ? 'Brume Fantôme' : 'Brume Fantome',
        'cyber-city': lang === 'fr' ? 'Cyber City' : 'Cyber City',
        'lotus-imperial': lang === 'fr' ? 'Lotus Impérial' : 'Lotus Imperial',
        'dragon-ancestral': lang === 'fr' ? 'Dragon Ancestral' : 'Dragon Ancestral',
        'eclipse': lang === 'fr' ? 'Éclipse' : 'Eclipse',
        'cristal-polaire': lang === 'fr' ? 'Cristal Polaire' : 'Cristal Polaire',
        'hanami-dore': lang === 'fr' ? 'Hanami Doré' : 'Hanami Dore',
        'abyssal': lang === 'fr' ? 'Abyssal' : 'Abyssal',
        'neon-pulse': lang === 'fr' ? 'Néon Pulse' : 'Neon Pulse',
        'mclaren': 'McLaren'
    };
    return themeNames[themeId] || themeId;
}

// All available themes
const availableThemes = [
    { id: 'sakura', name: 'Sakura', subtitle: 'Rose pastel & Blanc', primaryColor: '#FFB7C5', secondaryColor: '#FFFFFF' },
    { id: 'sakura-nocturne', name: 'Sakura Nocturne', subtitle: 'Rose vif & Noir', primaryColor: '#FF1493', secondaryColor: '#0A0A0A' },
    { id: 'ocean-mystique', name: 'Océan Mystique', subtitle: 'Bleu profond & Turquoise', primaryColor: '#006994', secondaryColor: '#40E0D0' },
    { id: 'brasier-royal', name: 'Brasier Royal', subtitle: 'Rouge sombre & Or', primaryColor: '#8B0000', secondaryColor: '#FFD700' },
    { id: 'void-eternel', name: 'Void Éternel', subtitle: 'Noir & Violet néon', primaryColor: '#1A0A2E', secondaryColor: '#9400D3' },
    { id: 'foudre-divine', name: 'Foudre Divine', subtitle: 'Jaune électrique & Bleu nuit', primaryColor: '#FFD700', secondaryColor: '#191970' },
    { id: 'hiver-glacial', name: 'Hiver Glacial', subtitle: 'Bleu clair & Blanc givré', primaryColor: '#ADD8E6', secondaryColor: '#F0FFFF' },
    { id: 'foret-spirituelle', name: 'Forêt Spirituelle', subtitle: 'Vert émeraude & Brun foncé', primaryColor: '#50C878', secondaryColor: '#3E2723' },
    { id: 'lune-ecarlate', name: 'Lune Écarlate', subtitle: 'Rouge sang & Noir', primaryColor: '#DC143C', secondaryColor: '#0A0A0A' },
    { id: 'empire-celeste', name: 'Empire Céleste', subtitle: 'Blanc & Or lumineux', primaryColor: '#FFFFFF', secondaryColor: '#FFD700' },
    { id: 'brume-fantome', name: 'Brume Fantôme', subtitle: 'Gris clair & Bleu pâle', primaryColor: '#D3D3D3', secondaryColor: '#B0C4DE' },
    { id: 'cyber-city', name: 'Cyber City', subtitle: 'Noir & Cyan néon', primaryColor: '#00FFFF', secondaryColor: '#0A0A0A' },
    { id: 'lotus-imperial', name: 'Lotus Impérial', subtitle: 'Violet & Rose doux', primaryColor: '#9932CC', secondaryColor: '#FFB6C1' },
    { id: 'dragon-ancestral', name: 'Dragon Ancestral', subtitle: 'Rouge sombre & Noir charbon', primaryColor: '#8B0000', secondaryColor: '#1C1C1C' },
    { id: 'eclipse', name: 'Éclipse', subtitle: 'Noir & Argent', primaryColor: '#0A0A0A', secondaryColor: '#C0C0C0' },
    { id: 'cristal-polaire', name: 'Cristal Polaire', subtitle: 'Bleu glacier & Argent', primaryColor: '#00BFFF', secondaryColor: '#C0C0C0' },
    { id: 'hanami-dore', name: 'Hanami Doré', subtitle: 'Rose pâle & Or rosé', primaryColor: '#FFB6C1', secondaryColor: '#B76E79' },
    { id: 'abyssal', name: 'Abyssal', subtitle: 'Noir profond & Bleu pétrole', primaryColor: '#0A1A2A', secondaryColor: '#004953' },
    { id: 'neon-pulse', name: 'Néon Pulse', subtitle: 'Violet néon & Rose néon', primaryColor: '#FF00FF', secondaryColor: '#FF1493' },
    { id: 'mclaren', name: 'McLaren', subtitle: 'Black & Red', primaryColor: '#FF0000', secondaryColor: '#000000' }
];

const siteManager = {
    // Current language
    currentLanguage: 'fr',
    
    // Current theme
    currentTheme: 'sakura',
    
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
        
        // Build theme dropdown
        this.buildThemeDropdown();
        
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
        
        // Theme dropdown toggle
        const themeDropdown = document.getElementById('themeDropdown');
        if (themeDropdown) {
            themeDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleThemeDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeThemeDropdown();
        });
    },
    
    // Toggle language
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'fr' : 'en';
        localStorage.setItem('lunaris_language', this.currentLanguage);
        
        if (typeof translationManager !== 'undefined') {
            translationManager.setLanguage(this.currentLanguage);
        }
        
        this.updateLanguageSwitchUI();
        this.buildThemeDropdown(); // Rebuild dropdown with new language
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
    
    // Build theme dropdown
    buildThemeDropdown() {
        const dropdownList = document.getElementById('themeDropdownList');
        if (!dropdownList) return;
        
        dropdownList.innerHTML = '';
        
        availableThemes.forEach(theme => {
            const item = document.createElement('div');
            item.className = 'theme-dropdown-item';
            item.dataset.theme = theme.id;
            
            const icon = themeIcons[theme.id] || '🎨';
            const name = getThemeDisplayName(theme.id, this.currentLanguage);
            
            item.innerHTML = `
                <div class="theme-item-icon">${icon}</div>
                <div class="theme-item-info">
                    <div class="theme-item-name">${name}</div>
                    <div class="theme-item-colors">
                        <span class="color-dot" style="background-color: ${theme.primaryColor}"></span>
                        <span class="color-dot" style="background-color: ${theme.secondaryColor}"></span>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.selectTheme(theme.id);
            });
            
            dropdownList.appendChild(item);
        });
    },
    
    // Toggle theme dropdown
    toggleThemeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    },
    
    // Close theme dropdown
    closeThemeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    },
    
    // Select theme
    selectTheme(themeId) {
        this.currentTheme = themeId;
        localStorage.setItem('lunaris_theme', themeId);
        this.applyTheme();
        this.updateThemeSwitchUI();
        this.closeThemeDropdown();
    },
    
    // Apply theme to body
    applyTheme() {
        const theme = availableThemes.find(t => t.id === this.currentTheme);
        if (!theme) return;
        
        // Set CSS variables for the theme
        const root = document.documentElement;
        root.style.setProperty('--theme-primary', theme.primaryColor);
        root.style.setProperty('--theme-secondary', theme.secondaryColor);
        
        // Add theme class to body
        document.body.classList.remove(...availableThemes.map(t => 'theme-' + t.id));
        document.body.classList.add('theme-' + this.currentTheme);
        
        // Update game theme if ThemeManager exists
        if (typeof themeManager !== 'undefined' && themeManager) {
            themeManager.setTheme(this.currentTheme);
        }
    },
    
    // Update theme switch UI
    updateThemeSwitchUI() {
        // Update dropdown display
        const themeDropdown = document.getElementById('themeDropdown');
        if (themeDropdown) {
            const theme = availableThemes.find(t => t.id === this.currentTheme);
            if (theme) {
                const icon = themeIcons[theme.id] || '🎨';
                const name = getThemeDisplayName(theme.id, this.currentLanguage);
                
                const displayElement = themeDropdown.querySelector('.theme-dropdown-display');
                if (displayElement) {
                    displayElement.innerHTML = `<span class="theme-icon">${icon}</span><span class="theme-name">${name}</span>`;
                }
            }
        }
        
        // Update active state in dropdown list
        const items = document.querySelectorAll('.theme-dropdown-item');
        items.forEach(item => {
            if (item.dataset.theme === this.currentTheme) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
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
