/**
 * Lunaris - A modular creature-battling roguelike game
 * Main entry point - MODIFIED
 */

// Initialize audio settings globally
const audioSettings = new AudioSettings();


// LUNARIS_TODO: Game initialization logic will go here
// LUNARIS_TODO: Add game state management
// LUNARIS_TODO: Add game loop
// LUNARIS_TODO: Add scene management

// Data Loader Functions

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

// Global game data store
let lunarisData = null;

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
        // Return empty data structure if loading fails
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

// LUNARIS_TODO: integrate data into the engine later


// Combat Engine Integration

// Global combat state
let combatState = null;

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
                    <button id="theme-toggle-btn" class="value">Night</button>
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
// TAB Menu System (Quick Access)
// ===========================================

let tabMenuOpen = false;

/**
 * Shows the TAB menu overlay
 */
function showTabMenu() {
    const screenContainer = document.getElementById('screen-container');
    if (!screenContainer) return;
    
    // Check if menu already exists
    const existingMenu = document.getElementById('tab-menu-overlay');
    if (existingMenu) {
        hideTabMenu();
        return;
    }
    
    const tabMenuHTML = `
        <div id="tab-menu-overlay" class="tab-menu-overlay">
            <div class="tab-menu">
                <div class="tab-menu-header">
                    <span class="tab-menu-title">Quick Menu</span>
                    <button class="tab-menu-close" onclick="hideTabMenu()">✕</button>
                </div>
                <div class="tab-menu-content">
                    <button class="tab-menu-item" onclick="showGachaMenu()">
                        <span class="tab-menu-icon">🎰</span>
                        <span class="tab-menu-text">Gacha</span>
                    </button>
                    <button class="tab-menu-item" onclick="showInventoryMenu()">
                        <span class="tab-menu-icon">🎒</span>
                        <span class="tab-menu-text">Inventory</span>
                    </button>
                    <button class="tab-menu-item" onclick="showTeamMenu()">
                        <span class="tab-menu-icon">⚔️</span>
                        <span class="tab-menu-text">Team</span>
                    </button>
                    <button class="tab-menu-item" onclick="showProfileMenu()">
                        <span class="tab-menu-icon">👤</span>
                        <span class="tab-menu-text">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    screenContainer.insertAdjacentHTML('beforeend', tabMenuHTML);
    addTabMenuStyles();
    
    tabMenuOpen = true;
    console.log('[TAB Menu] Opened');
}

/**
 * Hides the TAB menu overlay
 */
function hideTabMenu() {
    const overlay = document.getElementById('tab-menu-overlay');
    if (overlay) {
        overlay.remove();
    }
    tabMenuOpen = false;
    console.log('[TAB Menu] Closed');
}

/**
 * Adds CSS styles for the TAB menu
 */
function addTabMenuStyles() {
    if (document.getElementById('tab-menu-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'tab-menu-styles';
    style.textContent = `
        .tab-menu-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.15s ease-out;
        }
        
        .tab-menu {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00d9ff;
            border-radius: 16px;
            padding: 24px;
            min-width: 320px;
            box-shadow: 0 0 40px rgba(0, 217, 255, 0.3);
            animation: slideIn 0.2s ease-out;
        }
        
        .tab-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(0, 217, 255, 0.3);
        }
        
        .tab-menu-title {
            font-size: 20px;
            font-weight: 600;
            color: #00d9ff;
        }
        
        .tab-menu-close {
            background: none;
            border: none;
            color: #b8b8d1;
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .tab-menu-close:hover {
            background: rgba(255, 77, 77, 0.2);
            color: #ff4d4d;
        }
        
        .tab-menu-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .tab-menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            background: rgba(0, 217, 255, 0.08);
            border: 1px solid rgba(0, 217, 255, 0.15);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            text-align: left;
        }
        
        .tab-menu-item:hover {
            background: rgba(0, 217, 255, 0.2);
            border-color: #00d9ff;
            transform: translateX(6px);
        }
        
        .tab-menu-item:active {
            transform: scale(0.98) translateX(6px);
        }
        
        .tab-menu-icon {
            font-size: 22px;
        }
        
        .tab-menu-text {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
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

// Placeholder functions for TAB menu items
function showGachaMenu() {
    console.log('[TAB Menu] Opening Gacha...');
    hideTabMenu();
    alert('Gacha menu coming soon!');
}

function showInventoryMenu() {
    console.log('[TAB Menu] Opening Inventory...');
    hideTabMenu();
    alert('Inventory menu coming soon!');
}

function showTeamMenu() {
    console.log('[TAB Menu] Opening Team...');
    hideTabMenu();
    alert('Team menu coming soon!');
}

function showProfileMenu() {
    console.log('[TAB Menu] Opening Profile...');
    hideTabMenu();
    alert('Profile menu coming soon!');
}

/**
 * Initialize TAB menu key listeners
 */
function initTabMenu() {
    // Listen for TAB key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            if (!tabMenuOpen) {
                showTabMenu();
            } else {
                hideTabMenu();
            }
        }
        
        // Close menu with Escape
        if (event.key === 'Escape' && tabMenuOpen) {
            hideTabMenu();
        }
    });
    
    // Also close menu when clicking outside
    document.addEventListener('click', function(event) {
        const overlay = document.getElementById('tab-menu-overlay');
        const menu = document.querySelector('.tab-menu');
        if (tabMenuOpen && overlay && menu && !menu.contains(event.target)) {
            hideTabMenu();
        }
    });
    
    console.log('[TAB Menu] TAB key listeners initialized');
}

// ===========================================
// End of TAB Menu System
// ===========================================

// Initialize navigation when DOM is ready
function initNavigation() {
    // Set up button event listeners
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
    
    // Initialize TAB menu
    initTabMenu();
}

/**
 * Main initialization function for Lunaris
 * This is called when the page loads
 */
function init() {
    console.log('Lunaris is initializing...');
    
    // Initialize navigation
    initNavigation();
    
    // Show main menu by default
    showMainMenu();
    
    // LUNARIS_TODO: Initialize game state
    // LUNARIS_TODO: Load game data (creatures, moves, items, etc.)
    // LUNARIS_TODO: Initialize game systems (combat, inventory, etc.)
    
    // Update loading message
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.textContent = 'Lunaris is ready!';
    }
    
    console.log('Lunaris initialized successfully!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Simple Day/Night Theme System
// The broken 20-theme selector has been removed
// Use the Day/Night toggle in Settings instead

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
