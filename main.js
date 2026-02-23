/**
 * Lunaris - A modular creature-battling roguelike game
 * Main entry point
 */

// Initialize audio settings globally
const audioSettings = new AudioSettings();

// Global game data store
let lunarisData = null;

/**
 * Loads all Lunaris game data from JSON files
 * @returns {Promise<Object>} Object containing all game data
 */
async function loadLunarisData() {
    const [creatures, moves, items, zones, modes, gacha, tickets] = await Promise.all([
        fetch("data/creatures.json").then(r => r.json()),
        fetch("data/moves.json").then(r => r.json()),
        fetch("data/items.json").then(r => r.json()),
        fetch("data/zones.json").then(r => r.json()),
        fetch("data/modes.json").then(r => r.json()),
        fetch("data/gacha.json").then(r => r.json()),
        fetch("data/tickets.json").then(r => r.json())
    ]);
    
    console.log('Lunaris data loaded:', {
        creaturesCount: Object.keys(creatures).filter(k => !k.startsWith('_')).length,
        movesCount: Object.keys(moves).filter(k => !k.startsWith('_')).length,
        itemsCount: Object.keys(items).filter(k => !k.startsWith('_')).length,
        zonesCount: Object.keys(zones).filter(k => !k.startsWith('_')).length,
        modesCount: Object.keys(modes).filter(k => !k.startsWith('_')).length,
        bannersCount: Object.keys(gacha).filter(k => !k.startsWith('_')).length,
        ticketsCount: Object.keys(tickets).filter(k => !k.startsWith('_')).length
    });
    
    return { creatures, moves, items, zones, modes, gacha, tickets };
}

/**
 * Initialize game data
 * @returns {Promise<void>}
 */
async function initGameData() {
    try {
        lunarisData = await loadLunarisData();
        console.log('Game data initialized successfully');
        return lunarisData;
    } catch (error) {
        console.error('Failed to load game data:', error);
        return {
            creatures: {},
            moves: {},
            items: {},
            zones: {},
            modes: {},
            gacha: {},
            tickets: {}
        };
    }
}

// ===========================================
// Screen Management Functions
// ===========================================

/**
 * Shows the main menu screen
 */
function showMainMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="main-menu-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Main Menu</h2>
            <div class="decoration-line"></div>
            <div class="submenu-buttons">
                <button class="menu-button" id="btn-play" data-action="showPlayMenu">Play</button>
                <button class="menu-button" id="btn-settings" data-action="showSettingsMenu">Settings</button>
                <button class="menu-button" id="btn-credits" data-action="showCreditsMenu">Credits</button>
            </div>
            <div class="version-info">v1.2.16</div>
        </div>
    `;
    
    setupMenuButtonHandlers();
    console.log('Main menu displayed');
}

/**
 * Sets up click event handlers for menu buttons
 */
function setupMenuButtonHandlers() {
    console.log('Setting up menu button handlers...');
    
    const playBtn = document.getElementById('btn-play');
    const settingsBtn = document.getElementById('btn-settings');
    const creditsBtn = document.getElementById('btn-credits');
    
    if (playBtn) {
        playBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Play button clicked!');
            showPlayMenu();
        };
    }
    
    if (settingsBtn) {
        settingsBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Settings button clicked!');
            showSettingsMenu();
        };
    }
    
    if (creditsBtn) {
        creditsBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Credits button clicked!');
            showCreditsMenu();
        };
    }
    
    console.log('Menu button handlers set up successfully');
}

/**
 * Shows the play menu screen
 */
function showPlayMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="play-menu-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Choose Your Adventure</h2>
            <div class="decoration-line"></div>
            <p>Select a game mode to begin your journey!</p>
            <div class="game-mode-grid">
                <div class="game-mode-card" onclick="showSoloMultiplayerMenu('roguelike')">
                    <h3>Roguelike</h3>
                    <p>Explore procedurally generated zones in this roguelike adventure.</p>
                </div>
                <div class="game-mode-card" onclick="showSoloMultiplayerMenu('versus')">
                    <h3>Versus</h3>
                    <p>Battle against other players in versus matches.</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
    console.log('Play menu displayed');
}

/**
 * Shows the Solo/Multiplayer selection menu
 * @param {string} mode - The selected game mode ('roguelike' or 'versus')
 */
function showSoloMultiplayerMenu(mode) {
    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="solo-multiplayer-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>${modeName}</h2>
            <div class="decoration-line"></div>
            <p>Choose your game type:</p>
            <div class="game-mode-grid">
                <div class="game-mode-card" onclick="startGame(1)">
                    <h3>Solo</h3>
                    <p>Play alone against AI opponents.</p>
                </div>
                <div class="game-mode-card" onclick="showPlayerCountMenu('${mode}')">
                    <h3>Multiplayer</h3>
                    <p>Play with friends online.</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showPlayMenu()">Back</button>
            </div>
        </div>
    `;
    console.log('Solo/Multiplayer menu displayed for mode:', mode);
}

/**
 * Shows the player count selection menu for multiplayer
 * @param {string} mode - The selected game mode ('roguelike' or 'versus')
 */
function showPlayerCountMenu(mode) {
    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="player-count-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>${modeName} - Multiplayer</h2>
            <div class="decoration-line"></div>
            <p>Select number of players:</p>
            <div class="game-mode-grid">
                <div class="game-mode-card" onclick="startGame(2)">
                    <h3>2 Players</h3>
                    <p>Battle with a friend.</p>
                </div>
                <div class="game-mode-card" onclick="startGame(3)">
                    <h3>3 Players</h3>
                    <p>Three-way battle!</p>
                </div>
                <div class="game-mode-card" onclick="startGame(4)">
                    <h3>4 Players</h3>
                    <p>Four-player chaos!</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showSoloMultiplayerMenu('${mode}')">Back</button>
            </div>
        </div>
    `;
    console.log('Player count menu displayed for mode:', mode);
}

/**
 * Starts the game with the specified number of players
 * @param {number} playerCount - Number of players (1-4)
 */
function startGame(playerCount) {
    console.log('Starting game with', playerCount, 'player(s)');
    
    if (playerCount === 1) {
        console.log('Starting Solo game...');
        alert(`Starting Solo Game!\n\nPlayer count: ${playerCount}\n\nCheck console for game details.`);
    } else {
        console.log('Starting Multiplayer game with', playerCount, 'players...');
        alert(`Starting Multiplayer Game!\n\nPlayer count: ${playerCount}\n\nCheck console for game details.`);
    }
}

/**
 * Shows the settings menu screen
 */
function showSettingsMenu() {
    // Get current theme from siteManager or localStorage
    const themeMode = (typeof siteManager !== 'undefined') 
        ? siteManager.getThemeMode() 
        : (localStorage.getItem('lunaris_theme_mode') || 'dark');
    const themeLabel = themeMode === 'light' ? 'Day' : 'Night';
    
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="settings-menu-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>

            <h2>Settings</h2>
            <div class="decoration-line"></div>

            <div class="settings-options">

                <!-- Master Volume Slider -->
                <div class="settings-option">
                    <label>Master Volume</label>
                    <input type="range" id="master-volume" min="0" max="100" value="${audioSettings.masterVolume * 100}">
                </div>

                <!-- SFX Toggle -->
                <div class="settings-option">
                    <label>Sound Effects</label>
                    <button id="toggle-sfx-btn" class="value">
                        ${audioSettings.sfxEnabled ? "ON" : "OFF"}
                    </button>
                </div>

                <!-- Music Volume Slider -->
                <div class="settings-option">
                    <label>Music Volume</label>
                    <input type="range" id="music-volume" min="0" max="100" value="${audioSettings.musicVolume * 100}">
                </div>

                <!-- Fullscreen -->
                <div class="settings-option">
                    <label>Fullscreen</label>
                    <button id="fullscreen-btn" class="value">OFF</button>
                </div>

                <!-- Day/Night Theme Toggle -->
                <div class="settings-option">
                    <label>Theme</label>
                    <button id="theme-toggle-btn" class="value">${themeLabel}</button>
                </div>
            </div>

            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;

    // Master Volume Slider
    const masterVolumeSlider = document.getElementById("master-volume");
    if (masterVolumeSlider) {
        masterVolumeSlider.oninput = (e) => {
            const value = e.target.value / 100;
            audioSettings.setMasterVolume(value);
        };
    }

    // SFX Toggle
    const sfxBtn = document.getElementById("toggle-sfx-btn");
    if (sfxBtn) {
        sfxBtn.onclick = () => {
            audioSettings.toggleSfx();
            sfxBtn.innerText = audioSettings.sfxEnabled ? "ON" : "OFF";
        };
    }

    // Music Volume Slider
    const musicVolumeSlider = document.getElementById("music-volume");
    if (musicVolumeSlider) {
        musicVolumeSlider.oninput = (e) => {
            const value = e.target.value / 100;
            audioSettings.setMusicVolume(value);
        };
    }

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    if (fullscreenBtn) {
        fullscreenBtn.innerText = document.fullscreenElement ? "ON" : "OFF";
        
        fullscreenBtn.onclick = () => {
            const gameContainer = document.getElementById('game-container');
            
            if (!gameContainer) {
                console.error('Game container (#game-container) not found!');
                return;
            }
            
            if (!document.fullscreenElement) {
                gameContainer.requestFullscreen().catch(err => {
                    console.error('Error attempting to enable fullscreen:', err);
                });
            } else {
                document.exitFullscreen();
            }
        };
    }

    // Listen for fullscreen changes to update the UI
    document.addEventListener('fullscreenchange', () => {
        const fsBtn = document.getElementById('fullscreen-btn');
        if (fsBtn) {
            fsBtn.innerText = document.fullscreenElement ? "ON" : "OFF";
        }
    });

    // Day/Night Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.onclick = () => {
            // Use siteManager for theme toggle if available
            if (typeof siteManager !== 'undefined') {
                siteManager.toggleTheme();
                // Update button text
                const newMode = localStorage.getItem('lunaris_theme_mode') || 'dark';
                themeToggleBtn.innerText = newMode === 'light' ? 'Day' : 'Night';
            } else if (typeof themeManager !== 'undefined' && themeManager) {
                themeManager.toggleTheme();
                themeToggleBtn.innerText = themeManager.getCurrentThemeName();
            }
        };
    }

    console.log('Settings menu displayed');
}

/**
 * Shows the credits screen
 */
function showCreditsMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="credits-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Credits</h2>
            <div class="decoration-line"></div>
            <p><strong>Lunaris</strong></p>
            <p>A Modular Creature-Battling Roguelike</p>
            <p style="margin-top: 20px;"><strong>Version 0.1.0</strong></p>
            <p style="margin-top: 30px; color: var(--text-muted);">
                Created with passion for gaming!
            </p>
            <p style="margin-top: 20px; color: var(--text-muted);">
                © 2024 Lunaris. All rights reserved.
            </p>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;

    console.log('Credits screen displayed');
}

// ===========================================
// Quick Access Menu (I key)
// ===========================================

// Global state for quick access menu
let quickMenuOpen = false;

/**
 * Gets translation using fallback values if translationManager is not available
 * @param {string} key - Translation key path
 * @returns {string} Translated text
 */
function getTranslation(key) {
    if (typeof translationManager !== 'undefined') {
        return translationManager.t(key);
    }
    
    const htmlLang = document.documentElement.lang || 'fr';
    
    const fallbacks = {
        'game.gacha.title': 'Gacha',
        'game.inventory.title': htmlLang === 'en' ? 'Inventory' : 'Inventaire',
        'game.achievements.title': htmlLang === 'en' ? 'Achievements' : 'Succès',
        'game.lunadex.title': 'Lunadex',
        'game.logout.title': htmlLang === 'en' ? 'Log Out' : 'Se déconnecter'
    };
    
    return fallbacks[key] || key;
}

/**
 * Shows the quick access menu overlay
 */
function showQuickMenu() {
    const screenContainer = document.getElementById('screen-container');
    if (!screenContainer) return;
    
    const existingOverlay = document.getElementById('quick-menu-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const quickMenuHTML = `
        <div id="quick-menu-overlay" class="quick-menu-overlay">
            <div class="quick-menu">
                <div class="quick-menu-header">
                    <span class="quick-menu-title">☰</span>
                </div>
                <ul class="quick-menu-list">
                    <li class="quick-menu-item" onclick="openGacha()">
                        <span class="quick-menu-icon">🎰</span>
                        <span class="quick-menu-text">${getTranslation('game.gacha.title')}</span>
                    </li>
                    <li class="quick-menu-item" onclick="openInventory()">
                        <span class="quick-menu-icon">🎒</span>
                        <span class="quick-menu-text">${getTranslation('game.inventory.title')}</span>
                    </li>
                    <li class="quick-menu-item" onclick="openAchievements()">
                        <span class="quick-menu-icon">🏆</span>
                        <span class="quick-menu-text">${getTranslation('game.achievements.title')}</span>
                    </li>
                    <li class="quick-menu-item" onclick="openLunadex()">
                        <span class="quick-menu-icon">📖</span>
                        <span class="quick-menu-text">${getTranslation('game.lunadex.title')}</span>
                    </li>
                    <li class="quick-menu-item quick-menu-logout" onclick="logout()">
                        <span class="quick-menu-icon">🚪</span>
                        <span class="quick-menu-text">${getTranslation('game.logout.title')}</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    
    screenContainer.insertAdjacentHTML('beforeend', quickMenuHTML);
    addQuickMenuStyles();
    
    quickMenuOpen = true;
    console.log('[Quick Menu] Opened');
}

/**
 * Hides the quick access menu overlay
 */
function hideQuickMenu() {
    const overlay = document.getElementById('quick-menu-overlay');
    if (overlay) {
        overlay.remove();
    }
    quickMenuOpen = false;
    console.log('[Quick Menu] Closed');
}

/**
 * Adds CSS styles for the quick access menu dynamically
 */
function addQuickMenuStyles() {
    if (document.getElementById('quick-menu-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'quick-menu-styles';
    style.textContent = `
        .quick-menu-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.15s ease-out;
        }
        
        .quick-menu {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00d9ff;
            border-radius: 12px;
            padding: 20px;
            min-width: 280px;
            box-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
            animation: slideIn 0.2s ease-out;
        }
        
        .quick-menu-header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(0, 217, 255, 0.3);
        }
        
        .quick-menu-title {
            font-size: 24px;
            color: #00d9ff;
        }
        
        .quick-menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .quick-menu-item {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            margin: 5px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: rgba(0, 217, 255, 0.1);
            border: 1px solid transparent;
        }
        
        .quick-menu-item:hover {
            background: rgba(0, 217, 255, 0.25);
            border-color: #00d9ff;
            transform: translateX(5px);
        }
        
        .quick-menu-item:active {
            transform: scale(0.98);
        }
        
        .quick-menu-icon {
            font-size: 20px;
            margin-right: 12px;
            width: 28px;
            text-align: center;
        }
        
        .quick-menu-text {
            font-size: 16px;
            color: #ffffff;
            font-weight: 500;
        }
        
        .quick-menu-logout {
            margin-top: 15px;
            background: rgba(255, 77, 77, 0.15);
            border-color: rgba(255, 77, 77, 0.3);
        }
        
        .quick-menu-logout:hover {
            background: rgba(255, 77, 77, 0.3);
            border-color: #ff4d4d;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { 
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Quick Access Menu Action Handlers

function openGacha() {
    console.log('[Quick Menu] Opening Gacha...');
    hideQuickMenu();
    showComingSoonMessage();
}

function openInventory() {
    console.log('[Quick Menu] Opening Inventory...');
    hideQuickMenu();
    showComingSoonMessage();
}

function openAchievements() {
    console.log('[Quick Menu] Opening Achievements...');
    hideQuickMenu();
    showComingSoonMessage();
}

function openLunadex() {
    console.log('[Quick Menu] Opening Lunadex...');
    hideQuickMenu();
    showComingSoonMessage();
}

/**
 * Shows the Coming Soon message
 */
function showComingSoonMessage() {
    const screenContainer = document.getElementById('screen-container');
    if (!screenContainer) return;
    
    const existingMessage = document.getElementById('coming-soon-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageHTML = `
        <div id="coming-soon-message" class="coming-soon-overlay">
            <div class="coming-soon-content">
                <h2 class="coming-soon-text">Coming Soon</h2>
            </div>
        </div>
    `;
    
    screenContainer.insertAdjacentHTML('beforeend', messageHTML);
    addComingSoonStyles();
    
    console.log('[Coming Soon] Message displayed');
}

/**
 * Adds CSS styles for the Coming Soon message
 */
function addComingSoonStyles() {
    if (document.getElementById('coming-soon-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'coming-soon-styles';
    style.textContent = `
        .coming-soon-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .coming-soon-content {
            text-align: center;
            padding: 40px 60px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00d9ff;
            border-radius: 16px;
            box-shadow: 0 0 40px rgba(0, 217, 255, 0.4);
        }
        
        .coming-soon-text {
            font-size: 36px;
            color: #00d9ff;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 4px;
            text-shadow: 0 0 20px rgba(0, 217, 255, 0.6);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Logs out the player
 */
function logout() {
    console.log('[Quick Menu] Logging out...');
    hideQuickMenu();
    const confirmMessage = document.documentElement.lang === 'en' 
        ? 'Are you sure you want to log out?' 
        : 'Êtes-vous sûr de vouloir vous déconnecter?';
    if (confirm(confirmMessage)) {
        window.location.href = 'index.html';
    }
}

/**
 * Initialize quick access menu (I key)
 */
function initQuickMenu() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            event.preventDefault();
            if (!quickMenuOpen) {
                showQuickMenu();
            }
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            if (quickMenuOpen) {
                hideQuickMenu();
            }
        }
    });
    
    document.addEventListener('click', function(event) {
        const overlay = document.getElementById('quick-menu-overlay');
        const menu = document.querySelector('.quick-menu');
        if (quickMenuOpen && overlay && menu && !menu.contains(event.target)) {
            hideQuickMenu();
        }
    });
    
    console.log('[Quick Menu] I key listeners initialized');
}

/**
 * Initialize navigation and menu handlers
 */
function initNavigation() {
    const playBtn = document.getElementById('btn-play');
    const settingsBtn = document.getElementById('btn-settings');
    const creditsBtn = document.getElementById('btn-credits');
    
    if (playBtn) {
        playBtn.addEventListener('click', showPlayMenu);
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettingsMenu);
    }
    
    if (creditsBtn) {
        creditsBtn.addEventListener('click', showCreditsMenu);
    }
    
    initQuickMenu();
}

/**
 * Main initialization function for Lunaris
 */
function init() {
    console.log('Lunaris is initializing...');
    
    initNavigation();
    showMainMenu();
    
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.textContent = 'Lunaris is ready!';
    }
    
    console.log('Lunaris initialized successfully!');
}

/**
 * Start the Lunaris game
 */
async function startLunaris() {
    console.log("Starting Lunaris...");
    await initGameData();
    showMainMenu();
    
    window.dispatchEvent(new Event('gameStart'));
    console.log('Game start event dispatched');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        init, 
        showMainMenu, 
        showPlayMenu, 
        showSettingsMenu, 
        showCreditsMenu 
    };
}
