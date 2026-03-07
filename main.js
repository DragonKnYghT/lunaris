/**
 * Lunaris - A modular creature-battling roguelike game
 * Main entry point - MODIFIED
 */

// Initialize audio settings globally
const audioSettings = new AudioSettings();

// Simple global game state
const gameState = {
    mode: null,            // 'roguelike' | 'versus' | etc.
    playerCount: 1,
    isMultiplayer: false,
};

// Simple disc inventory for gacha results (stored in localStorage)
const DISC_INVENTORY_STORAGE_KEY = 'lunaris_disc_inventory';

let discInventory = loadDiscInventoryFromStorage();

function loadDiscInventoryFromStorage() {
    try {
        const raw = localStorage.getItem(DISC_INVENTORY_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('[DiscInventory] Failed to load from storage', e);
        return [];
    }
}

function saveDiscInventoryToStorage() {
    try {
        localStorage.setItem(DISC_INVENTORY_STORAGE_KEY, JSON.stringify(discInventory));
    } catch (e) {
        console.warn('[DiscInventory] Failed to save to storage', e);
    }
}

function addDiscToInventory(entry) {
    const now = Date.now();
    discInventory.push({
        id: `${entry.bannerId || 'banner'}_${entry.creatureId || 'unknown'}_${now}`,
        rarity: entry.rarity,
        visualRarity: entry.visualRarity || entry.rarity,
        creatureId: entry.creatureId || 'unknown',
        bannerId: entry.bannerId || null,
        timestamp: now,
    });
    saveDiscInventoryToStorage();
}

// ===========================================
// Profil local (pseudo / avatar)
// ===========================================

const PROFILE_STORAGE_KEY = 'lunaris_profile';
let currentProfile = loadProfileFromStorage();

function loadProfileFromStorage() {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
    } catch (e) {
        console.warn('[Profile] Failed to load profile from storage', e);
        return null;
    }
}

function saveProfileToStorage(profile) {
    try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        currentProfile = profile;
    } catch (e) {
        console.warn('[Profile] Failed to save profile to storage', e);
    }
}

function clearProfileFromStorage() {
    try {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
        console.warn('[Profile] Failed to clear profile from storage', e);
    }
    currentProfile = null;
}

// Simple password hashing for local storage (not secure, but prevents plain text)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

// ===========================================
// Gem Currency System
// ===========================================

const GEMS_STORAGE_KEY = 'lunaris_gems';
let playerGems = loadGemsFromStorage();

function loadGemsFromStorage() {
    try {
        const raw = localStorage.getItem(GEMS_STORAGE_KEY);
        if (!raw) return 0;
        const parsed = parseInt(raw, 10);
        return isNaN(parsed) ? 0 : parsed;
    } catch (e) {
        console.warn('[Gems] Failed to load gems from storage', e);
        return 0;
    }
}

function saveGemsToStorage(gems) {
    try {
        localStorage.setItem(GEMS_STORAGE_KEY, gems.toString());
        playerGems = gems;
        updateGemCounter();
    } catch (e) {
        console.warn('[Gems] Failed to save gems to storage', e);
    }
}

function addGems(amount) {
    const newAmount = playerGems + amount;
    saveGemsToStorage(newAmount);
    return newAmount;
}

function spendGems(amount) {
    if (playerGems < amount) {
        return { success: false, message: 'Not enough gems!' };
    }
    const newAmount = playerGems - amount;
    saveGemsToStorage(newAmount);
    return { success: true, newAmount: newAmount };
}

function getGems() {
    return playerGems;
}

function updateGemCounter() {
    const counter = document.getElementById('gem-counter');
    if (counter) {
        counter.textContent = playerGems.toLocaleString();
    }
}

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
    // Remember chosen base mode in game state
    gameState.mode = mode;
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
                <div class="game-mode-card" onclick="startGame('${mode}', 1, false)">
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
    // Multiplayer variant of current mode
    gameState.mode = mode;
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
                <div class="game-mode-card" onclick="startGame('${mode}', 2, true)">
                    <h3>2 Players</h3>
                    <p>Battle with a friend.</p>
                </div>
                <div class="game-mode-card" onclick="startGame('${mode}', 3, true)">
                    <h3>3 Players</h3>
                    <p>Three-way battle!</p>
                </div>
                <div class="game-mode-card" onclick="startGame('${mode}', 4, true)">
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
 * @param {string} mode - Selected game mode
 * @param {number} playerCount - Number of players (1-4)
 * @param {boolean} isMultiplayer - Whether this is a multiplayer game
 */
function startGame(mode, playerCount, isMultiplayer) {
    gameState.mode = mode;
    gameState.playerCount = playerCount;
    gameState.isMultiplayer = !!isMultiplayer;
    gameState.inRun = true;

    console.log('Starting game with state:', gameState);

    // Notify the rest of the site (navbar hiding, etc.)
    try {
        window.dispatchEvent(new Event('gameStart'));
    } catch (e) {
        console.warn('Unable to dispatch gameStart event', e);
    }

    // Show a basic "game starting" screen instead of alerts
    const container = document.getElementById('screen-container');
    if (container) {
        const modeLabel = mode === 'roguelike' ? 'Roguelike' : (mode === 'versus' ? 'Versus' : mode);
        const typeLabel = isMultiplayer ? 'Multiplayer' : 'Solo';

        container.innerHTML = `
            <div class="screen" id="game-start-screen">
                <div class="decoration-stars">
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                </div>
                <h2>${modeLabel} - ${typeLabel}</h2>
                <div class="decoration-line"></div>
                <p>Your adventure is about to begin.</p>
                <p><strong>Players:</strong> ${playerCount}</p>
                <p class="text-muted">Game engine coming next: creatures, zones, combat...</p>
                <div class="submenu-buttons">
                    <button class="menu-button secondary" onclick="showPlayMenu()">Back to Mode Selection</button>
                </div>
            </div>
        `;
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
        // Initial label en fonction du mode actuel du site si dispo
        let currentMode = 'dark';
        if (typeof siteManager !== 'undefined' && siteManager && typeof siteManager.getThemeMode === 'function') {
            currentMode = siteManager.getThemeMode();
        } else {
            currentMode = localStorage.getItem('lunaris_theme_mode') || 'dark';
        }
        themeToggleBtn.innerText = currentMode === 'light' ? 'Day' : 'Night';

        themeToggleBtn.onclick = () => {
            // Toujours passer par le systeme global du site
            if (typeof siteManager !== 'undefined' && siteManager && typeof siteManager.toggleTheme === 'function') {
                siteManager.toggleTheme();
                const newMode = siteManager.getThemeMode();
                themeToggleBtn.innerText = newMode === 'light' ? 'Day' : 'Night';
            } else if (typeof themeManager !== 'undefined' && themeManager) {
                // Fallback sur l'ancien ThemeManager si jamais
                toggleTheme();
                const newMode = (typeof getThemeMode === 'function') ? getThemeMode() : (localStorage.getItem('lunaris_theme_mode') || 'dark');
                themeToggleBtn.innerText = newMode === 'light' ? 'Day' : 'Night';
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
    
    // Bouton Team uniquement si une partie est en cours
    const isInRun = typeof gameState !== 'undefined' && gameState && gameState.inRun;
    const teamButtonHtml = isInRun ? `
                    <button class="tab-menu-item" onclick="showTeamMenu()">
                        <span class="tab-menu-icon">⚔️</span>
                        <span class="tab-menu-text">Team</span>
                    </button>
    ` : '';

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
                    <button class="tab-menu-item" onclick="showQuestsMenu()">
                        <span class="tab-menu-icon">📜</span>
                        <span class="tab-menu-text">Quests</span>
                    </button>
                    <button class="tab-menu-item" onclick="showAchievementsMenu()">
                        <span class="tab-menu-icon">🏆</span>
                        <span class="tab-menu-text">Achievements</span>
                    </button>
                    ${teamButtonHtml}
                    <button class="tab-menu-item" onclick="showLobbyMenu()">
                        <span class="tab-menu-icon">🌐</span>
                        <span class="tab-menu-text">Lobby</span>
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
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: flex-end;
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
            margin-right: 32px;
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
                transform: translateX(40px);
            }
            to { 
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Gacha & Inventory UI =====

function getBannerConfig(bannerId) {
    if (!lunarisData || !lunarisData.gacha) return null;
    return lunarisData.gacha[bannerId] || null;
}

function rollRarityFromRates(rates) {
    if (!rates) return 'common';
    let total = 0;
    for (const key in rates) total += rates[key];
    const roll = Math.random() * total;
    let acc = 0;
    for (const rarity in rates) {
        acc += rates[rarity];
        if (roll < acc) return rarity;
    }
    return 'common';
}

function computeVisualRarity(baseRarity, bannerId) {
    // Legendaires sur bannière limitée -> Limited
    if (bannerId === 'limited_banner' && baseRarity === 'legendary') {
        return 'limited';
    }
    // Petite chance qu'un légendaire devienne Ultime
    if (baseRarity === 'legendary' && Math.random() < 0.05) {
        return 'ultimate';
    }
    return baseRarity;
}

function pullOnceFromBanner(bannerId) {
    const banner = getBannerConfig(bannerId);
    if (!banner) {
        console.warn('[Gacha] Unknown banner:', bannerId);
        return null;
    }
    const rarity = rollRarityFromRates(banner.rates);
    const pool = banner.pool[rarity] || [];
    const creatureId = pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'unknown_creature';
    const visualRarity = computeVisualRarity(rarity, bannerId);

    const result = { rarity, visualRarity, creatureId, bannerId };
    addDiscToInventory(result);
    return result;
}

function performGachaPull(bannerId, count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        const res = pullOnceFromBanner(bannerId);
        if (res) results.push(res);
    }
    return results;
}

function showGachaMenu() {
    console.log('[TAB Menu] Opening Gacha...');
    hideTabMenu();

    const container = document.getElementById('screen-container');
    if (!container) return;

    // Banner data with rarities and rates
    const bannerData = {
        'common_draw': {
            name: 'Tirage Commun',
            description: 'Tirage standard avec des taux équilibrés',
            rates: {
                common: 70,
                rare: 25,
                epic: 4,
                legendary: 1,
                ultimate: 0,
                limited: 0
            },
            prices: {
                single: 100,
                multi: 1000
            }
        },
        'lucky_draw': {
            name: 'Tirage Chanceux',
            description: 'Tirage avec plus de chances d\'obtenir des créatures rares',
            rates: {
                common: 40,
                rare: 35,
                epic: 20,
                legendary: 4.5,
                ultimate: 0.5,
                limited: 0
            },
            prices: {
                single: 200,
                multi: 2000
            }
        },
        'ultimate_draw': {
            name: 'Tirage Ultime',
            description: 'Tirage premium avec chances élevées pour créatures puissantes',
            rates: {
                common: 10,
                rare: 30,
                epic: 45,
                legendary: 10,
                ultimate: 5,
                limited: 0
            },
            prices: {
                single: 400,
                multi: 4000
            }
        },
        'limited_draw': {
            name: 'Tirage Limité',
            description: 'Bannière exclusive avec créatures uniques',
            rates: {
                common: 0,
                rare: 20,
                epic: 30,
                legendary: 35,
                ultimate: 14,
                limited: 1
            },
            prices: {
                single: 500,
                multi: 5000
            }
        }
    };

    // Colors for rarity display
    const rarityColors = {
        common: '#808080',      // Gray
        rare: '#4169E1',        // Royal Blue
        epic: '#9932CC',        // Dark Orchid
        legendary: '#FFD700',   // Gold
        ultimate: '#FF1493',    // Deep Pink
        limited: '#00CED1'      // Dark Turquoise
    };

    // Create banner cards HTML
    const bannerCards = Object.entries(bannerData).map(([bannerId, banner]) => {
        const ratesList = Object.entries(banner.rates)
            .filter(([_, rate]) => rate > 0)
            .map(([rarity, rate]) => `
                <div class="rate-item">
                    <span class="rate-label" style="color: ${rarityColors[rarity]}">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
                    <span class="rate-bar-container">
                        <span class="rate-bar" style="width: ${Math.min(rate, 100)}%; background-color: ${rarityColors[rarity]}"></span>
                    </span>
                    <span class="rate-value">${rate}%</span>
                </div>
            `).join('');
        
        const allRates = Object.entries(banner.rates)
            .map(([rarity, rate]) => `
                <div class="stat-item">
                    <span class="stat-label" style="color: ${rarityColors[rarity]}">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}</span>
                    <span class="stat-value">${rate}%</span>
                </div>
            `).join('');
        
        return `
            <div class="banner-card">
                <div class="banner-header">
                    <h3>${banner.name}</h3>
                    <p class="banner-description">${banner.description}</p>
                </div>
                <div class="banner-rates">
                    <div class="rates-visual">
                        ${ratesList}
                    </div>
                    <div class="rates-stats">
                        <h4>Pourcentages détaillés:</h4>
                        <div class="stats-grid">
                            ${allRates}
                        </div>
                    </div>
                </div>
                <div class="banner-actions">
                    <button class="menu-button" onclick="executeGachaPull('${bannerId}', 1)">
                        <span class="pull-single">Single Pull</span>
                        <span class="pull-cost">${banner.prices.single} gems</span>
                    </button>
                    <button class="menu-button" onclick="executeGachaPull('${bannerId}', 10)">
                        <span class="pull-multi">Multi Pull x10</span>
                        <span class="pull-cost">${banner.prices.multi} gems</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="screen" id="gacha-menu-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Système de Gacha</h2>
            <div class="decoration-line"></div>
            <p class="gacha-intro">Sélectionnez une bannière pour faire un tirage</p>
            <div class="banners-grid">
                ${bannerCards}
            </div>
            <div class="submenu-buttons" style="margin-top: var(--spacing-lg)">
                <button class="menu-button secondary" onclick="showMainMenu()">Retour</button>
            </div>
        </div>
    `;
}

function showBannerDetails(bannerId) {
    const container = document.getElementById('screen-container');
    if (!container) return;
    const banner = getBannerConfig(bannerId);
    const name = banner?.name || bannerId;
    const desc = banner?.description || 'Special Lunaris banner';

    // Tableau d’exemple avec les 6 raretés visuelles
    const ratesExample = `
        <tr><td>Commun</td><td>50%</td></tr>
        <tr><td>Rare</td><td>30%</td></tr>
        <tr><td>Épique</td><td>15%</td></tr>
        <tr><td>Légendaire</td><td>4%</td></tr>
        <tr><td>Ultime</td><td>0.5%</td></tr>
        <tr><td>Limited</td><td>0.5%</td></tr>
    `;

    container.innerHTML = `
        <div class="screen" id="banner-details-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>${name}</h2>
            <div class="decoration-line"></div>
            <p>${desc}</p>

            <div class="gacha-discs-preview">
                <div class="gacha-disc disc-common">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">Commun</span>
                </div>
                <div class="gacha-disc disc-rare">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">Rare</span>
                </div>
                <div class="gacha-disc disc-epic">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">Épique</span>
                </div>
                <div class="gacha-disc disc-legendary">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">Légendaire</span>
                </div>
                <div class="gacha-disc disc-ultimate">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">Ultime</span>
                </div>
                <div class="gacha-disc disc-limited">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">Limited</span>
                </div>
            </div>

            <table class="gacha-rates-table">
                <thead>
                    <tr><th>Rareté</th><th>Chance</th></tr>
                </thead>
                <tbody>
                    ${ratesExample}
                </tbody>
            </table>

            <div class="submenu-buttons">
                <button class="menu-button" onclick="executeGachaPull('${bannerId}', 1)">Single Pull</button>
                <button class="menu-button" onclick="executeGachaPull('${bannerId}', 10)">Multi Pull x10</button>
                <button class="menu-button secondary" onclick="showGachaMenu()">Back</button>
            </div>
        </div>
    `;
}

function executeGachaPull(bannerId, count) {
    if (!lunarisData || !lunarisData.gacha) {
        alert('Les données de gacha ne sont pas encore chargées.');
        return;
    }
    const results = performGachaPull(bannerId, count);
    showPullResults(results, bannerId);
}

function showPullResults(results, bannerId) {
    const container = document.getElementById('screen-container');
    if (!container) return;

    const discsHtml = results.map((res, index) => {
        const label = res.visualRarity.toUpperCase();
        const rarityClass = `disc-${res.visualRarity}`;
        return `
            <div class="gacha-result-card">
                <div class="gacha-disc ${rarityClass} gacha-disc-animated">
                    <div class="gacha-disc-moon"></div>
                    <span class="gacha-disc-label">${label}</span>
                </div>
                <div class="gacha-result-info">
                    <div>#${index + 1}</div>
                    <div>Creature: ${res.creatureId}</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="screen" id="pull-results-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Résultats du tirage</h2>
            <div class="decoration-line"></div>
            <div class="gacha-results-grid">
                ${discsHtml}
            </div>
            <p class="gacha-note">Tous les disques obtenus ont été ajoutés à ton inventaire.</p>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="executeGachaPull('${bannerId}', 1)">Re-tirer (Single)</button>
                <button class="menu-button" onclick="executeGachaPull('${bannerId}', 10)">Re-tirer (Multi x10)</button>
                <button class="menu-button" onclick="showInventoryMenu()">Voir l'inventaire</button>
                <button class="menu-button secondary" onclick="showGachaMenu()">Retour aux bannières</button>
            </div>
        </div>
    `;
}

// Track current inventory filter
let currentInventoryFilter = 'all';

function renderInventoryContent(filterRarity = 'all') {
    const container = document.getElementById('screen-container');
    if (!container) return;

    const byRarity = {};
    discInventory.forEach(d => {
        const key = d.visualRarity || d.rarity;
        if (!byRarity[key]) byRarity[key] = [];
        byRarity[key].push(d);
    });

    const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'ultimate', 'limited'];
    
    let contentHtml = '';
    if (discInventory.length === 0) {
        contentHtml = `<p class="inventory-empty">Aucun disque pour l'instant. Va dans le Gacha pour en obtenir !</p>`;
    } else if (filterRarity === 'all') {
        contentHtml = rarityOrder.map(r => {
            const list = byRarity[r] || [];
            if (!list.length) return '';
            const cards = list.map(d => `
                <div class="inventory-disc-card">
                    <div class="gacha-disc disc-${d.visualRarity || d.rarity}">
                        <div class="gacha-disc-moon"></div>
                        <span class="gacha-disc-label">${(d.visualRarity || d.rarity).toUpperCase()}</span>
                    </div>
                    <div class="inventory-disc-info">
                        <div>${d.creatureId}</div>
                        <div class="inventory-disc-meta">${d.bannerId || 'Banner inconnue'}</div>
                    </div>
                </div>
            `).join('');
            const title = r.charAt(0).toUpperCase() + r.slice(1);
            return `
                <h3 class="inventory-section-title">${title}</h3>
                <div class="inventory-grid">
                    ${cards}
                </div>
            `;
        }).join('');
    } else {
        const list = byRarity[filterRarity] || [];
        if (list.length === 0) {
            contentHtml = `<p class="inventory-empty">Aucun disque de cette rareté.</p>`;
        } else {
            const cards = list.map(d => `
                <div class="inventory-disc-card">
                    <div class="gacha-disc disc-${d.visualRarity || d.rarity}">
                        <div class="gacha-disc-moon"></div>
                        <span class="gacha-disc-label">${(d.visualRarity || d.rarity).toUpperCase()}</span>
                    </div>
                    <div class="inventory-disc-info">
                        <div>${d.creatureId}</div>
                        <div class="inventory-disc-meta">${d.bannerId || 'Banner inconnue'}</div>
                    </div>
                </div>
            `).join('');
            contentHtml = `<div class="inventory-grid">${cards}</div>`;
        }
    }

    // Generate navbar buttons
    const navbarHtml = `
        <div class="inventory-navbar">
            <button class="inventory-filter-btn ${currentInventoryFilter === 'all' ? 'active' : ''}" 
                    onclick="filterInventoryByRarity('all')">Tous</button>
            ${['common', 'rare', 'epic', 'legendary', 'ultimate', 'limited'].map(r => {
                const count = (byRarity[r] || []).length;
                const isActive = currentInventoryFilter === r ? 'active' : '';
                return `<button class="inventory-filter-btn ${isActive}" 
                                onclick="filterInventoryByRarity('${r}')">${r.toUpperCase()} (${count})</button>`;
            }).join('')}
        </div>
    `;

    container.innerHTML = `
        <div class="screen" id="inventory-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Inventaire des Disques</h2>
            <div class="decoration-line"></div>
            ${navbarHtml}
            <div class="inventory-content">
                ${contentHtml}
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
}

function filterInventoryByRarity(rarity) {
    currentInventoryFilter = rarity;
    renderInventoryContent(rarity);
}

function showInventoryMenu() {
    console.log('[TAB Menu] Opening Inventory...');
    hideTabMenu();

    const container = document.getElementById('screen-container');
    if (!container) return;

    currentInventoryFilter = 'all';
    renderInventoryContent('all');
}

// ===== Simple Lobby UI (multijoueur) =====

let wsClient = null;
let currentLobby = null;

function ensureWebSocketConnected(onReady) {
    if (wsClient && wsClient.getIsConnected()) {
        onReady && onReady();
        return;
    }
    if (!window.ClientSocket) {
        alert('ClientSocket non disponible. Vérifie que src/multiplayer/clientSocket.js est chargé.');
        return;
    }
    wsClient = new ClientSocket('ws://localhost:8080');

    wsClient.onConnect(() => {
        console.log('[Lobby] WebSocket connected');
        // Envoyer HELLO avec le pseudo du profil si dispo
        const name = currentProfile?.name || 'Player';
        wsClient.send({
            type: 'HELLO',
            payload: { clientId: null, playerName: name },
            timestamp: Date.now()
        });
        onReady && onReady();
    });

    wsClient.onMessage('LOBBY_STATE', (payload) => {
        currentLobby = payload;
        renderLobbyScreen();
    });

    wsClient.onMessage('LOBBY_ERROR', (payload) => {
        alert(`Lobby error: ${payload.code}\n${payload.message}`);
    });

    wsClient.connect();
}

function generateLocalRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showLobbyMenu() {
    console.log('[TAB Menu] Opening Lobby...');
    hideTabMenu();

    // Forcer création de profil avant le multi
    if (!currentProfile) {
        alert('Crée d\'abord un profil joueur.');
        showProfileMenu();
        return;
    }

    const container = document.getElementById('screen-container');
    if (!container) return;

    container.innerHTML = `
        <div class="screen" id="lobby-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Salons multijoueur</h2>
            <div class="decoration-line"></div>
            <p>Crée un code de salon et partage-le à tes amis, ou rejoins un code existant.</p>

            <div class="lobby-actions">
                <button class="menu-button" id="lobby-create-btn">Créer un salon</button>
                <div class="settings-option">
                    <label for="lobby-code-input">Code salon</label>
                    <input id="lobby-code-input" type="text" maxlength="6" placeholder="ABC123" style="text-transform:uppercase;">
                </div>
                <button class="menu-button" id="lobby-join-btn">Rejoindre</button>
            </div>

            <div id="lobby-state-container"></div>

            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;

    const createBtn = document.getElementById('lobby-create-btn');
    const joinBtn = document.getElementById('lobby-join-btn');
    const codeInput = document.getElementById('lobby-code-input');

    if (createBtn) {
        createBtn.onclick = () => {
            ensureWebSocketConnected(() => {
                const code = generateLocalRoomCode();
                wsClient.send({
                    type: 'LOBBY_CREATE',
                    payload: { roomCode: code },
                    timestamp: Date.now()
                });
                if (codeInput) codeInput.value = code;
            });
        };
    }

    if (joinBtn && codeInput) {
        joinBtn.onclick = () => {
            const raw = codeInput.value.trim().toUpperCase();
            if (!raw || raw.length < 3) {
                alert('Entre un code de salon valide.');
                return;
            }
            ensureWebSocketConnected(() => {
                wsClient.send({
                    type: 'LOBBY_JOIN',
                    payload: { roomCode: raw },
                    timestamp: Date.now()
                });
            });
        };
    }

    renderLobbyScreen();
}

function renderLobbyScreen() {
    const container = document.getElementById('lobby-state-container');
    if (!container) return;

    if (!currentLobby) {
        container.innerHTML = `<p class="inventory-empty">Pas encore dans un salon. Crée-en un ou rejoins un code.</p>`;
        return;
    }

    const players = currentLobby.players || [];
    const listHtml = players.map(p => {
        const isHost = p.id === currentLobby.hostId;
        return `
            <li>
                ${isHost ? '👑 ' : ''}${p.name || p.id}
            </li>
        `;
    }).join('');

    container.innerHTML = `
        <div class="lobby-state-card">
            <p><strong>Code salon :</strong> ${currentLobby.roomCode}</p>
            <p><strong>Joueurs (${players.length}):</strong></p>
            <ul class="lobby-player-list">
                ${listHtml}
            </ul>
            <button class="menu-button secondary" id="lobby-leave-btn">Quitter le salon</button>
        </div>
    `;

    const leaveBtn = document.getElementById('lobby-leave-btn');
    if (leaveBtn && wsClient && wsClient.getIsConnected()) {
        leaveBtn.onclick = () => {
            wsClient.send({
                type: 'LOBBY_LEAVE',
                payload: { roomCode: currentLobby.roomCode },
                timestamp: Date.now()
            });
            currentLobby = null;
            renderLobbyScreen();
        };
    }
}

function showTeamMenu() {
    console.log('[TAB Menu] Opening Team...');
    hideTabMenu();
    alert('Team menu coming soon!');
}

// ===== Quests Menu =====
// Quest data
let currentQuestFilter = 'all';

const questsData = {
    normal: [
        { id: 'normal_1', title: 'Gagner 3 combats', description: 'Remportez la victoire dans 3 combats', progress: 1, target: 3, reward: '50 Gold' },
        { id: 'normal_2', title: 'Utiliser 5 attaques', description: 'Utilisez 5 attaques au total', progress: 2, target: 5, reward: '100 Gold' },
        { id: 'normal_3', title: 'Capturer 2 créatures', description: 'Capturez 2 créatures sauvages', progress: 0, target: 2, reward: '200 Gold' }
    ],
    special: [
        { id: 'special_1', title: 'Battre un champion', description: 'Battez un champion dans l\'arène', progress: 0, target: 1, reward: '500 Gold' },
        { id: 'special_2', title: 'Obtenir 10 créatures rares', description: 'Collectionnez 10 créatures rares', progress: 3, target: 10, reward: '1000 Gold' },
        { id: 'special_3', title: 'Gagner une série de 5', description: 'Remportez 5 combats d\'affilée', progress: 2, target: 5, reward: '750 Gold' }
    ],
    daily: [
        { id: 'daily_1', title: 'Ouvrir 1 Gacha', description: 'Effectuez au minimum 1 tirage Gacha', progress: 0, target: 1, reward: '10 Tickets' },
        { id: 'daily_2', title: 'Terminer 2 combats', description: 'Participez à 2 combats', progress: 1, target: 2, reward: '50 Gold' },
        { id: 'daily_3', title: 'Vérifier le shop', description: 'Consultez le shop du jeu', progress: 1, target: 1, reward: '25 Gold', completed: true }
    ],
    event: [
        { id: 'event_1', title: 'Battre un boss spécial', description: 'Affrontez et battez le boss lunaire', progress: 0, target: 1, reward: '1000 Gold + Skin exclusif' },
        { id: 'event_2', title: 'Événement: Raid collectif', description: 'Participez au raid collectif et contribuez 100 dégâts', progress: 45, target: 100, reward: '500 Gold' },
        { id: 'event_3', title: 'Célébration: Récupérer le badge', description: 'Complétez les 5 quêtes de l\'événement', progress: 3, target: 5, reward: 'Badge événement' }
    ]
};

function renderQuestsContent(filterCategory = 'all') {
    const container = document.getElementById('screen-container');
    if (!container) return;

    let contentHtml = '';
    const categories = ['normal', 'special', 'daily', 'event'];
    
    if (filterCategory === 'all') {
        contentHtml = categories.map(category => {
            const quests = questsData[category] || [];
            if (quests.length === 0) return '';
            
            const questsHtml = quests.map(quest => `
                <div class="quest-card ${quest.completed ? 'quest-completed' : ''}">
                    <div class="quest-header">
                        <h4 class="quest-title">${quest.title}</h4>
                        <span class="quest-reward">${quest.reward}</span>
                    </div>
                    <p class="quest-description">${quest.description}</p>
                    <div class="quest-progress">
                        <div class="quest-progress-bar">
                            <div class="quest-progress-fill" style="width: ${(quest.progress / quest.target) * 100}%"></div>
                        </div>
                        <span class="quest-progress-text">${quest.progress}/${quest.target}</span>
                    </div>
                </div>
            `).join('');

            const categoryTitle = category === 'normal' ? 'Normal' : 
                                 category === 'special' ? 'Spéciale' :
                                 category === 'daily' ? 'Quotidienne' : 'Événement';
            
            return `
                <h3 class="quest-category-title">${categoryTitle}</h3>
                <div class="quests-grid">
                    ${questsHtml}
                </div>
            `;
        }).join('');
    } else {
        const quests = questsData[filterCategory] || [];
        if (quests.length === 0) {
            contentHtml = `<p class="quests-empty">Aucune quête dans cette catégorie.</p>`;
        } else {
            contentHtml = `
                <div class="quests-grid">
                    ${quests.map(quest => `
                        <div class="quest-card ${quest.completed ? 'quest-completed' : ''}">
                            <div class="quest-header">
                                <h4 class="quest-title">${quest.title}</h4>
                                <span class="quest-reward">${quest.reward}</span>
                            </div>
                            <p class="quest-description">${quest.description}</p>
                            <div class="quest-progress">
                                <div class="quest-progress-bar">
                                    <div class="quest-progress-fill" style="width: ${(quest.progress / quest.target) * 100}%"></div>
                                </div>
                                <span class="quest-progress-text">${quest.progress}/${quest.target}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Générer la navbar
    const categoryNames = { normal: 'Normal', special: 'Spéciale', daily: 'Quotidienne', event: 'Événement' };
    const totalQuests = {
        normal: questsData.normal.length,
        special: questsData.special.length,
        daily: questsData.daily.length,
        event: questsData.event.length
    };

    const navbarHtml = `
        <div class="quests-navbar">
            <button class="quests-filter-btn ${currentQuestFilter === 'all' ? 'active' : ''}" 
                    onclick="filterQuestsByCategory('all')">Tous</button>
            ${['normal', 'special', 'daily', 'event'].map(cat => {
                const isActive = currentQuestFilter === cat ? 'active' : '';
                return `<button class="quests-filter-btn ${isActive}" 
                                onclick="filterQuestsByCategory('${cat}')">${categoryNames[cat]} (${totalQuests[cat]})</button>`;
            }).join('')}
        </div>
    `;

    container.innerHTML = `
        <div class="screen" id="quests-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Quêtes</h2>
            <div class="decoration-line"></div>
            ${navbarHtml}
            <div class="quests-content">
                ${contentHtml}
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
}

function filterQuestsByCategory(category) {
    currentQuestFilter = category;
    renderQuestsContent(category);
}

function showQuestsMenu() {
    console.log('[TAB Menu] Opening Quests...');
    hideTabMenu();

    const container = document.getElementById('screen-container');
    if (!container) return;

    currentQuestFilter = 'all';
    renderQuestsContent('all');
}

// ===== Achievements Menu =====
function showAchievementsMenu() {
    console.log('[TAB Menu] Opening Achievements...');
    hideTabMenu();

    const container = document.getElementById('screen-container');
    if (!container) return;

    container.innerHTML = `
        <div class="screen" id="achievements-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Achievements</h2>
            <div class="decoration-line"></div>
            
            <div class="achievement-category">
                <h3 class="category-title">Versus</h3>
                <p class="category-empty">No versus achievements unlocked yet.</p>
            </div>
            
            <div class="achievement-category">
                <h3 class="category-title">Roguelike</h3>
                <p class="category-empty">No roguelike achievements unlocked yet.</p>
            </div>
            
            <div class="achievement-category">
                <h3 class="category-title">General</h3>
                <p class="category-empty">No general achievements unlocked yet.</p>
            </div>
            
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
}

function showProfileMenu() {
    console.log('[TAB Menu] Opening Profile...');
    hideTabMenu();

    const container = document.getElementById('screen-container');
    if (!container) return;

    // Si aucun profil, on affiche le formulaire de création
    if (!currentProfile) {
        container.innerHTML = `
            <div class="screen" id="profile-screen">
                <div class="decoration-stars">
                    <span>✦</span>
                    <span>✦</span>
                    <span>✦</span>
                </div>
                <h2>Create Your Profile</h2>
                <div class="decoration-line"></div>
                <p>This profile stores all your progression (gacha unlocks, etc.).</p>
                <div class="profile-form">
                    <div class="settings-option">
                        <label for="profile-name">Username</label>
                        <input id="profile-name" type="text" maxlength="16" placeholder="Your username">
                    </div>
                    <div class="settings-option">
                        <label for="profile-password">Password (required)</label>
                        <input id="profile-password" type="password" maxlength="32" placeholder="Set a password">
                    </div>
                    <div class="settings-option">
                        <label for="profile-avatar">Choose Avatar</label>
                        <select id="profile-avatar">
                            <option value="🌙">🌙 Moon</option>
                            <option value="⭐">⭐ Star</option>
                            <option value="🔥">🔥 Fire</option>
                            <option value="❄️">❄️ Ice</option>
                            <option value="⚡">⚡ Lightning</option>
                            <option value="🌊">🌊 Water</option>
                            <option value="🌿">🌿 Nature</option>
                            <option value="👻">👻 Ghost</option>
                            <option value="🐉">🐉 Dragon</option>
                            <option value="🦁">🦁 Lion</option>
                            <option value="🐺">🐺 Wolf</option>
                            <option value="🦅">🦅 Eagle</option>
                        </select>
                    </div>
                </div>
                <div class="submenu-buttons">
                    <button class="menu-button" id="profile-save-btn">Create Profile</button>
                    <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
                </div>
            </div>
        `;

        const nameInput = document.getElementById('profile-name');
        const passwordInput = document.getElementById('profile-password');
        const avatarSelect = document.getElementById('profile-avatar');
        const saveBtn = document.getElementById('profile-save-btn');

        if (saveBtn && nameInput && passwordInput && avatarSelect) {
            saveBtn.onclick = () => {
                const name = nameInput.value.trim();
                const password = passwordInput.value.trim();
                
                if (!name || name.length < 3) {
                    alert('Please choose a username with at least 3 characters.');
                    return;
                }
                if (!password || password.length < 4) {
                    alert('Please set a password with at least 4 characters.');
                    return;
                }
                
                const avatar = avatarSelect.value || '🌙';
                const profile = {
                    id: 'profile_' + Date.now(),
                    name,
                    passwordHash: simpleHash(password),
                    avatar,
                    createdAt: Date.now()
                };
                saveProfileToStorage(profile);
                showProfileMenu();
            };
        }
        return;
    }

    // Affichage d'un profil existant
    container.innerHTML = `
        <div class="screen" id="profile-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Player Profile</h2>
            <div class="decoration-line"></div>
            <div class="profile-card">
                <div class="profile-avatar">${currentProfile.avatar || '🌙'}</div>
                <div class="profile-info">
                    <div class="profile-name">${currentProfile.name}</div>
                    <div class="profile-meta">Created: ${new Date(currentProfile.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="profile-stats">
                <p><strong>Gems:</strong> 💎 ${playerGems.toLocaleString()}</p>
                <p><strong>Discs:</strong> ${discInventory.length}</p>
            </div>
            <p class="profile-note">This profile is local to this browser. Your progression is saved here.</p>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="clearProfileFromStorage(); showProfileMenu();">Change Profile</button>
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
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
    // On ne ferme plus au clic en dehors, uniquement via la croix ou la touche
    
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
    
    // Loading message removed
    
    console.log('Lunaris initialized successfully!');
}

/**
 * Preferred async entry point used by play.html
 * Loads game data, then initializes UI/navigation.
 * @returns {Promise<void>}
 */
async function startLunaris() {
    console.log('startLunaris: booting Lunaris...');
    await initGameData();
    init();
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
        showCreditsMenu,
        startLunaris
    };
}
