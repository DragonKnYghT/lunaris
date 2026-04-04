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
    wave: 1
};

// ===========================================
// Account Management System
// ===========================================

let accountManager = null;
let accountUI = null;

function initializeAccountSystem() {
    if (!accountManager) {
        accountManager = new AccountManager();
        accountUI = new AccountUI(accountManager);
    }
    return accountManager;
}

// Wrapper functions for disc inventory (now uses accountManager)
const DISC_INVENTORY_STORAGE_KEY = 'lunaris_disc_inventory'; // Kept for backward compatibility

function loadDiscInventoryFromStorage() {
    if (accountManager && accountManager.getCurrentAccount()) {
        return accountManager.getDiscs();
    }
    // Fallback to old storage
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
    if (accountManager && accountManager.getCurrentAccount()) {
        accountManager.saveAllAccounts();
    } else {
        // Fallback
        console.warn('[DiscInventory] No account logged in, cannot save discs');
    }
}

let discInventory = [];

function addDiscToInventory(entry) {
    if (!accountManager || !accountManager.getCurrentAccount()) {
        console.error('[DiscInventory] No account logged in');
        return;
    }
    
    const result = accountManager.addDisc(entry);
    if (result.success) {
        discInventory = accountManager.getDiscs();
    }
}

// ===========================================
// Profile Management (Account-linked)
// ===========================================

const PROFILE_STORAGE_KEY = 'lunaris_profile'; // Legacy key
let currentProfile = null;

function loadProfileFromStorage() {
    if (accountManager && accountManager.getCurrentAccount()) {
        const account = accountManager.getCurrentAccount();
        currentProfile = account.profile;
        return currentProfile;
    }
    // Fallback to old storage
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
    if (accountManager && accountManager.getCurrentAccount()) {
        const account = accountManager.getCurrentAccount();
        account.profile = profile;
        accountManager.saveAllAccounts();
        currentProfile = profile;
    } else {
        // Fallback
        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
            currentProfile = profile;
        } catch (e) {
            console.warn('[Profile] Failed to save profile to storage', e);
        }
    }
}

function clearProfileFromStorage() {
    // Clear current profile but account remains
    currentProfile = null;
    // Don't remove from localStorage as it's account-linked now
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
// Gem Currency System (Account-linked)
// ===========================================

const GEMS_STORAGE_KEY = 'lunaris_gems'; // Legacy key
let playerGems = 0;

function loadGemsFromStorage() {
    if (accountManager && accountManager.getCurrentAccount()) {
        playerGems = accountManager.getGems();
    } else {
        // Fallback to old storage
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
    return playerGems;
}

function saveGemsToStorage(gems) {
    if (accountManager && accountManager.getCurrentAccount()) {
        const difference = gems - playerGems;
        if (difference > 0) {
            accountManager.addGems(difference);
        } else if (difference < 0) {
            accountManager.spendGems(-difference);
        }
        playerGems = gems;
    } else {
        // Fallback
        try {
            localStorage.setItem(GEMS_STORAGE_KEY, gems.toString());
            playerGems = gems;
        } catch (e) {
            console.warn('[Gems] Failed to save gems to storage', e);
        }
    }
    updateGemCounter();
}

function addGems(amount) {
    if (!accountManager || !accountManager.getCurrentAccount()) {
        console.error('[Gems] No account logged in');
        return 0;
    }
    
    const result = accountManager.addGems(amount);
    playerGems = result.gems;
    updateGemCounter();
    return playerGems;
}

function spendGems(amount) {
    if (!accountManager || !accountManager.getCurrentAccount()) {
        return { success: false, message: 'No account logged in!' };
    }
    
    const result = accountManager.spendGems(amount);
    if (result.success) {
        playerGems = result.gems;
        updateGemCounter();
    }
    return result;
}

function getGems() {
    if (accountManager && accountManager.getCurrentAccount()) {
        return accountManager.getGems();
    }
    return playerGems;
}

function updateGemCounter() {
    const counter = document.getElementById('gem-counter');
    if (counter) {
        const gems = getGems();
        counter.textContent = gems.toLocaleString();
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
    const [creatures, moves, items, zones, modes, gacha, tickets, types] = await Promise.all([
        fetch("data/creatures.json").then(r => r.json()),
        fetch("data/moves.json").then(r => r.json()),
        fetch("data/items.json").then(r => r.json()),
        fetch("data/zones.json").then(r => r.json()),
        fetch("data/modes.json").then(r => r.json()),
        fetch("data/gacha.json").then(r => r.json()),
        fetch("data/tickets.json").then(r => r.json()),
        fetch("data/types.json").then(r => r.json())
    ]);
    
    console.log('Lunaris data loaded:', {
        creaturesCount: Object.keys(creatures).filter(k => !k.startsWith('_')).length,
        movesCount: Object.keys(moves).filter(k => !k.startsWith('_')).length,
        itemsCount: Object.keys(items).filter(k => !k.startsWith('_')).length,
        zonesCount: Object.keys(zones).filter(k => !k.startsWith('_')).length,
        modesCount: Object.keys(modes).filter(k => !k.startsWith('_')).length,
        bannersCount: Object.keys(gacha).filter(k => !k.startsWith('_')).length,
        ticketsCount: Object.keys(tickets).filter(k => !k.startsWith('_')).length,
        typesCount: Object.keys(types).length
    });
    
    return { creatures, moves, items, zones, modes, gacha, tickets, types };
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
            tickets: {},
            types: {}
        };
    }
}

// LUNARIS_TODO: integrate data into the engine later


// Combat Engine Integration

// Global combat state
let combatState = null;
let currentEnemyHP = 20;

// ===========================================
// Screen Management Functions
// ===========================================

/**
 * Centralized function to render game screens with standard decorations
 * @param {string} id - The unique ID for the screen
 * @param {string} title - The title to display
 * @param {string} content - The HTML content for the screen body
 */
function renderScreen(id, title, content) {
    const container = document.getElementById('screen-container');
    if (!container) return;

    // Centralizing the UI structure to avoid repetition and errors
    container.innerHTML = `
        <div class="screen" id="${id}">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            ${title ? `<h2>${title}</h2><div class="decoration-line"></div>` : ''}
            <div class="screen-body">
                ${content}
            </div>
        </div>
    `;
    
    // Scroll to top of the container for new screens
    container.scrollTop = 0;
}

/**
 * Shows the account selection screen
 */
function showAccountSelectionScreen() {
    const container = document.getElementById('screen-container');
    initializeAccountSystem();
    accountUI.showAccountSelection(container, (accountId) => {
        loadProfileFromStorage();
        loadGemsFromStorage();
        discInventory = loadDiscInventoryFromStorage();
        updateGemCounter();
        showMainMenu();
    });
}

/**
 * Shows the main menu screen
 */
function showMainMenu() {
    const content = `
            <div class="submenu-buttons">
                <button class="menu-button" id="btn-play" data-action="showPlayMenu">Play</button>
                <button class="menu-button" id="btn-settings" data-action="showSettingsMenu">Settings</button>
                <button class="menu-button" id="btn-credits" data-action="showCreditsMenu">Credits</button>
            </div>
            <div class="version-info">v1.2.16</div>
    `;

    renderScreen('main-menu-screen', 'Main Menu', content);
    setupMenuButtonHandlers();
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
    const content = `
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
    `;

    renderScreen('play-menu-screen', 'Choose Your Adventure', content);
}

/**
 * Shows the Solo/Multiplayer selection menu
 * @param {string} mode - The selected game mode ('roguelike' or 'versus')
 */
function showSoloMultiplayerMenu(mode) {
    // Remember chosen base mode in game state
    gameState.mode = mode;
    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const content = `
            <p>Choose your game type:</p>
            <div class="game-mode-grid">
                <div class="game-mode-card" onclick="startGame('${mode}', 1, false)">
                    <h3>Solo</h3>
                    <p>Play alone against AI opponents.</p>
                </div>
                <div class="game-mode-card" onclick="showMultiplayerLobbyChoice('${mode}')">
                    <h3>Multiplayer</h3>
                    <p>Play with friends online.</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showPlayMenu()">Back</button>
            </div>
    `;
    renderScreen('solo-multiplayer-screen', modeName, content);
}

/**
 * Shows the choice between creating a new lobby or joining an existing one
 * @param {string} mode - Selected game mode ('roguelike' or 'versus')
 */
function showMultiplayerLobbyChoice(mode) {
    gameState.mode = mode;
    
    // Vérifier que l'utilisateur a un compte actif
    if (!accountManager || !accountManager.getCurrentAccount()) {
        alert('Connecte-toi à un profil avant de jouer en multijoueur.');
        showAccountSelectionScreen();
        return;
    }

    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const content = `
            <p>Que voulez-vous faire?</p>
            <div class="game-mode-grid">
                <div class="game-mode-card" onclick="showPlayerCountMenu('${mode}', 'create')">
                    <h3>Créer</h3>
                    <p>Créer un nouveau salon.</p>
                </div>
                <div class="game-mode-card" onclick="showJoinLobbyMenu('${mode}')">
                    <h3>Rejoindre</h3>
                    <p>Rejoindre un salon existant.</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showSoloMultiplayerMenu('${mode}')">Back</button>
            </div>
    `;
    renderScreen('lobby-choice-screen', `${modeName} - Multiplayer`, content);
}

/**
 * Shows the player count selection menu for multiplayer (for creating a lobby)
 * @param {string} mode - The selected game mode ('roguelike' or 'versus')
 * @param {string} action - The action ('create' or 'join')
 */
function showPlayerCountMenu(mode, action = 'create') {
    // Multiplayer variant of current mode
    gameState.mode = mode;
    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const content = `
            <p>Select number of players:</p>
            <div class="game-mode-grid">
                <div class="game-mode-card" onclick="showCreateLobbyMenu('${mode}', 2)">
                    <h3>2 Players</h3>
                    <p>Battle with a friend.</p>
                </div>
                <div class="game-mode-card" onclick="showCreateLobbyMenu('${mode}', 3)">
                    <h3>3 Players</h3>
                    <p>Three-way battle!</p>
                </div>
                <div class="game-mode-card" onclick="showCreateLobbyMenu('${mode}', 4)">
                    <h3>4 Players</h3>
                    <p>Four-player chaos!</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMultiplayerLobbyChoice('${mode}')">Back</button>
            </div>
    `;
    renderScreen('player-count-screen', `${modeName} - Multiplayer`, content);
}

/**
 * Shows the join lobby menu where player enters a code
 * @param {string} mode - Selected game mode
 */
function showJoinLobbyMenu(mode) {
    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const content = `
            <p>Entrez le code du salon:</p>
            
            <div class="lobby-actions">
                <div class="settings-option">
                    <label for="join-code-input">Code Salon</label>
                    <input id="join-code-input" type="text" maxlength="6" placeholder="ABCD12" style="text-transform:uppercase;">
                </div>
                <button class="menu-button" id="join-confirm-btn">Rejoindre</button>
            </div>

            <div id="join-state-container"></div>

            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMultiplayerLobbyChoice('${mode}')">Back</button>
            </div>
    `;

    renderScreen('join-lobby-screen', `${modeName} - Rejoindre`, content);

    const joinBtn = document.getElementById('join-confirm-btn');
    const codeInput = document.getElementById('join-code-input');

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
    
    console.log('Join lobby menu displayed for mode:', mode);
}

/**
 * Shows the create lobby menu with player profile and starter pokemon
 * @param {string} mode - Selected game mode
 * @param {number} playerCount - Number of players
 */
function showCreateLobbyMenu(mode, playerCount) {
    const modeName = mode === 'roguelike' ? 'Roguelike' : 'Versus';
    const container = document.getElementById('screen-container');
    
    // Generate lobby code
    const lobbyCode = generateLocalRoomCode();
    
    // Get starter pokemon (using a default if not available)
    const starterName = currentProfile?.starter || 'Bulbasaur';
    const starterEmoji = currentProfile?.starterEmoji || '🌱';
    
    container.innerHTML = `
        <div class="screen" id="create-lobby-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>${modeName} - Créer Salon</h2>
            <div class="decoration-line"></div>
            
            <div class="lobby-info-grid">
                <div class="lobby-info-card">
                    <h3>Ton Profil</h3>
                    <div class="profile-info">
                        <p><strong>Pseudo:</strong> ${currentProfile?.name || 'Joueur'}</p>
                        <p><strong>Avatar:</strong> ${currentProfile?.avatar || '👤'}</p>
                    </div>
                </div>
                
                <div class="lobby-info-card">
                    <h3>Ton Starter</h3>
                    <div class="starter-info">
                        <p class="starter-emoji">${starterEmoji}</p>
                        <p><strong>${starterName}</strong></p>
                    </div>
                </div>
                
                <div class="lobby-info-card">
                    <h3>Code du Salon</h3>
                    <div class="code-display">
                        <p class="lobby-code">${lobbyCode}</p>
                        <p class="code-note">Partage ce code avec tes amis</p>
                    </div>
                </div>
            </div>
            
            <div class="lobby-actions">
                <button class="menu-button" id="create-confirm-btn">Démarrer le Jeu</button>
            </div>

            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showPlayerCountMenu('${mode}', 'create')">Back</button>
            </div>
        </div>
    `;

    const createBtn = document.getElementById('create-confirm-btn');
    if (createBtn) {
        createBtn.onclick = () => {
            ensureWebSocketConnected(() => {
                wsClient.send({
                    type: 'LOBBY_CREATE',
                    payload: { roomCode: lobbyCode },
                    timestamp: Date.now()
                });
                // Once confirmed, start the game
                setTimeout(() => {
                    startGame(mode, playerCount, true);
                }, 500);
            });
        };
    }
    
    console.log('Create lobby menu displayed for mode:', mode, 'players:', playerCount, 'code:', lobbyCode);
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

        console.log(`Starting ${typeLabel} ${modeLabel} game...`);

        const isBoss = gameState.wave % 10 === 0;

        // Persistance : On garde le joueur si on est en plein run, sinon on l'initialise
        if (!combatState || gameState.wave === 1) {
            combatState = {
                player: {
                    name: 'Lunaris 1',
                    level: 5,
                    hp: 40,
                    maxHp: 40,
                    xp: 0,
                    maxXp: 100,
                    stats: { attack: 15, defense: 10 },
                    moves: [
                        { name: 'Griffe', power: 10, pp: 35, maxPp: 35, type: 'Normal' },
                        { name: 'Rugissement', power: 0, pp: 40, maxPp: 40, type: 'Normal' }
                    ],
                    inventory: {},
                    sprite: 'sprite/Lunaris/Starteur/Starteur 1.png'
                }
            };
        }

        // Nouvel ennemi pour cette vague
        const enemyLevel = isBoss ? gameState.wave + 2 : Math.max(1, gameState.wave + Math.floor(Math.random() * 3) - 1);
        const baseEnemyHp = 20 + (enemyLevel * 2);
        
        combatState.enemy = {
            name: isBoss ? 'BOSS LUNARIS' : `Sauvage Lv.${enemyLevel}`,
            level: enemyLevel,
            hp: isBoss ? baseEnemyHp * 3 : baseEnemyHp,
            maxHp: isBoss ? baseEnemyHp * 3 : baseEnemyHp,
            stats: { attack: 10 + enemyLevel, defense: 5 + enemyLevel },
            moves: [{ name: 'Charge', power: 8, pp: 35, maxPp: 35 }],
            sprite: isBoss ? 'sprite/Lunaris/Starteur/Starteur 2.png' : 'sprite/Lunaris/Starteur/Starteur 2.png', // LUNARIS_TODO: Varier les sprites
            isBoss: isBoss,
            status: null, // Pour les calculs de capture
            types: ['Normal'], // Placeholder
            rarity: isBoss ? 'legendary' : (Math.random() > 0.9 ? 'rare' : 'common')
        };
        combatState.isPlayerTurn = true;

        showCombatScreen(combatState.player, combatState.enemy);
    }
}

/**
 * Helper pour obtenir les infos d'un objet
 */
function getItemInfo(id) {
    // Recherche dans les données chargées dynamiquement
    if (lunarisData && lunarisData.items && lunarisData.items[id]) {
        const item = lunarisData.items[id];
        return { 
            icon: `<img src="${generateItemSprite(id)}" class="item-icon-img" alt="${item.name}">`, 
            name: item.name, 
            desc: item.description 
        };
    }
    return { icon: '❓', name: id, desc: 'Objet mystérieux' };
}

/**
 * Affiche l'écran de combat
 */
function showCombatScreen(player, enemy) {
    // Filtrer les objets bonus uniquement pour la barre du bas
    const bonusItemsHtml = Object.entries(player.inventory || {})
        .filter(([id, qty]) => qty > 0 && !['potion', 'super_potion', 'revive'].includes(id))
        .map(([id, qty]) => {
            const info = getItemInfo(id);
            return `<div class="item-slot" data-description="${info.desc}">${info.icon} <span>x${qty}</span></div>`;
        }).join('');

    const content = `
        <div class="combat-wrapper">
            <div class="combat-arena">
                <div class="wave-badge">VAGUE ${gameState.wave}</div>

                <!-- Ennemi Status -->
                <div class="status-card enemy-status">
                    <div class="status-header">
                        <span class="creature-name">${enemy.name}</span>
                        <span class="creature-level">Lv.${enemy.level}</span>
                    </div>
                    <div class="stat-bars">
                        ${enemy.isBoss ? `
                        <div class="boss-hp-wrapper">
                            <div class="boss-hp-bar"><div class="boss-hp-fill" id="enemy-hp-bar-1" style="width: ${Math.max(0, (enemy.hp - enemy.maxHp/2) / (enemy.maxHp/2) * 100)}%"></div></div>
                            <div class="boss-hp-bar"><div class="boss-hp-fill" id="enemy-hp-bar-2" style="width: ${Math.min(100, (enemy.hp) / (enemy.maxHp/2) * 100)}%"></div></div>
                        </div>
                        ` : `
                            <div class="hp-bar-container">
                                <div class="hp-bar-fill" id="enemy-hp-bar" style="width: ${(enemy.hp/enemy.maxHp)*100}%"></div>
                            </div>
                        `}
                    </div>
                    <div class="hp-text-container">
                        <span class="hp-text" id="enemy-hp-text">${enemy.hp} / ${enemy.maxHp}</span>
                    </div>
                </div>

                <!-- Entités -->
                <div class="combat-entity entity-enemy" id="enemy-entity">
                    <div class="sprite-container">
                        <img src="${enemy.sprite}" class="creature-sprite sprite-enemy" alt="Enemy">
                    </div>
                </div>

                <div class="combat-entity entity-player" id="player-entity">
                    <div class="sprite-container">
                        <img src="${player.sprite}" class="creature-sprite sprite-player" alt="Player">
                    </div>
                </div>

                <!-- Player Status -->
                <div class="status-card player-status" id="player-status-card">
                    <div class="status-header">
                        <span class="creature-name">${player.name}</span>
                        <span class="creature-level">Lv.${player.level}</span>
                    </div>
                    <div class="stat-bars">
                        <div class="hp-bar-container">
                            <div class="hp-bar-fill" id="player-hp-bar" style="width: ${(player.hp/player.maxHp)*100}%"></div>
                        </div>
                        <div class="exp-bar-container">
                            <div class="exp-bar-fill" id="player-exp-bar" style="width: ${(player.xp/player.maxXp)*100}%"></div>
                        </div>
                    </div>
                    <div class="hp-text-container">
                        <span class="hp-text" id="player-hp-text">${player.hp} / ${player.maxHp}</span>
                    </div>
                </div>
            </div>

            <div class="combat-ui-footer">
                <div class="combat-message-box" id="combat-log">
                    Que doit faire ${player.name} ?
                </div>
                <div class="combat-actions-grid" id="combat-menu">
                    <button class="menu-button" onclick="showAttackMenu()">Attaque</button>
                    <button class="menu-button secondary" onclick="handleCombatAction('bag')">Sac</button>
                    <button class="menu-button secondary" onclick="handleCombatAction('team')">Équipe</button>
                    <button class="menu-button" onclick="handleCombatAction('run')">Fuite</button>
                </div>
            </div>
            <div class="combat-item-bar" id="combat-item-bar">
                ${bonusItemsHtml || '<span style="color:rgba(255,255,255,0.3); font-size:12px;">Aucun bonus possédé</span>'}
            </div>
        </div>
    `;
    renderScreen('combat-screen', '', content);
}

function showAttackMenu() {
    const menu = document.getElementById('combat-menu');
    
    const movesHtml = combatState.player.moves.map((move, index) => {
        const isDisabled = move.pp <= 0 ? 'disabled' : '';
        return `
            <button class="menu-button move-btn" 
                    ${isDisabled} 
                    onclick="executeAttack(${index})">
                <span class="move-name">${move.name}</span>
                <span class="move-pp">${move.pp}/${move.maxPp}</span>
            </button>
        `;
    }).join('');

    menu.innerHTML = `
        ${movesHtml}
        <button class="menu-button secondary" onclick="resetCombatMenu()">Retour</button>
    `;
}

function resetCombatMenu() {
    const menu = document.getElementById('combat-menu');
    if (!menu) return; // Ensure menu exists before trying to update its innerHTML
    menu.innerHTML = `
        <button class="menu-button" onclick="showAttackMenu()">Attaque</button>
        <button class="menu-button secondary" onclick="handleCombatAction('bag')">Sac</button>
        <button class="menu-button secondary" onclick="handleCombatAction('team')">Équipe</button>
        <button class="menu-button" onclick="handleCombatAction('run')">Fuite</button>
    `;
}

async function executeAttack(moveIndex) {
    if (!combatState.isPlayerTurn) return;
    
    const move = combatState.player.moves[moveIndex];
    if (move.pp <= 0) return;

    combatState.isPlayerTurn = false;
    move.pp--;

    const log = document.getElementById('combat-log');
    const playerEnt = document.getElementById('player-entity');
    const enemyEnt = document.getElementById('enemy-entity');
    const playerPpBar = document.getElementById('player-pp-bar');

    // Mise à jour visuelle immédiate des PP
    if (playerPpBar) {
        playerPpBar.style.width = (move.pp / move.maxPp * 100) + '%';
    }

    // 1. Tour du Joueur
    log.textContent = `${combatState.player.name} utilise ${move.name} !`;
    playerEnt.classList.add('anim-attack-player');
    
    await new Promise(r => setTimeout(r, 300));
    playerEnt.classList.remove('anim-attack-player');
    enemyEnt.classList.add('anim-hit');

    // 2. Calcul Dégâts
    const damage = Math.floor((move.power * (combatState.player.stats.attack / combatState.enemy.stats.defense)) / 2) + 2;
    combatState.enemy.hp -= damage;
    if (combatState.enemy.hp < 0) combatState.enemy.hp = 0;
    
    // Update UI Ennemi
    const enemyText = document.getElementById('enemy-hp-text');
    if (combatState.enemy.isBoss) {
        const half = combatState.enemy.maxHp / 2;
        const bar1 = document.getElementById('enemy-hp-bar-1');
        const bar2 = document.getElementById('enemy-hp-bar-2');
        
        if (bar1) updateBarColor(bar1, Math.max(0, (combatState.enemy.hp - half) / half));
        if (bar2) updateBarColor(bar2, Math.min(1, combatState.enemy.hp / half));
    } else {
        const enemyBar = document.getElementById('enemy-hp-bar');
        if (enemyBar) updateBarColor(enemyBar, combatState.enemy.hp / combatState.enemy.maxHp);
    }

    if (enemyText) enemyText.textContent = `${combatState.enemy.hp} / ${combatState.enemy.maxHp}`;

    await new Promise(r => setTimeout(r, 1000));
    enemyEnt.classList.remove('anim-hit');

    if (combatState.enemy.hp <= 0) {
        const xpGained = combatState.enemy.level * 25;
        log.textContent = `${combatState.enemy.name} est K.O ! +${xpGained} XP`;
        
        // Mise à jour visuelle de la barre d'EXP avant le changement d'écran
        const expBar = document.getElementById('player-exp-bar');
        if (expBar) {
            expBar.style.width = Math.min(100, ((combatState.player.xp + xpGained) / combatState.player.maxXp) * 100) + '%';
        }
        
        // Gestion XP et Level Up
        combatState.player.xp += xpGained;
        if (combatState.player.xp >= combatState.player.maxXp) {
            combatState.player.level++;
            combatState.player.xp -= combatState.player.maxXp;
            combatState.player.maxXp = Math.floor(combatState.player.maxXp * 1.2);
            combatState.player.maxHp += 5;
            combatState.player.hp = combatState.player.maxHp; // Soin léger au level up
            log.textContent = `LEVEL UP ! ${combatState.player.name} passe niveau ${combatState.player.level} !`;
        }

        // Soin complet si c'était un Boss
        if (combatState.enemy.isBoss) {
            combatState.player.hp = combatState.player.maxHp;
            combatState.player.moves.forEach(m => m.pp = m.maxPp);
            log.textContent += " Victoire contre le Boss ! Équipe soignée.";
        }

        setTimeout(() => {
            gameState.wave++;
            showRewardScreen();
        }, 2000);
        return;
    }

    // 3. Tour de l'ennemi
    log.textContent = `${combatState.enemy.name} riposte !`;
    await new Promise(r => setTimeout(r, 800));
    
    enemyEnt.classList.add('anim-attack-enemy');
    await new Promise(r => setTimeout(r, 300));
    enemyEnt.classList.remove('anim-attack-enemy');
    playerEnt.classList.add('anim-hit');

    // Dégâts ennemis simples
    const enemyDamage = 5; 
    combatState.player.hp -= enemyDamage;
    if (combatState.player.hp < 0) combatState.player.hp = 0;

    // Update UI Joueur
    const playerBar = document.getElementById('player-hp-bar');
    const playerText = document.getElementById('player-hp-text');
    if (playerBar) updateBarColor(playerBar, combatState.player.hp / combatState.player.maxHp);
    if (playerText) playerText.textContent = `${combatState.player.hp} / ${combatState.player.maxHp}`;

    await new Promise(r => setTimeout(r, 1000));
    playerEnt.classList.remove('anim-hit');
    
    log.textContent = `Que doit faire ${combatState.player.name} ?`;
    combatState.isPlayerTurn = true;
    resetCombatMenu();
}

/**
 * Sélectionne 3 objets aléatoires pour la boutique basés sur la rareté
 */
function getRandomShopItems(count = 3) {
    if (!lunarisData || !lunarisData.items) return [];

    const weights = {
        "Commun": 100,
        "Rare": 40,
        "Épique": 15,
        "Légendaire": 4,
        "Mythique": 1
    };

    // Filtrer les objets interdits (Boss, Unique/Paradox)
    const pool = Object.entries(lunarisData.items)
        .filter(([id, item]) => 
            item.category !== "Boss" && 
            item.rarity !== "Unique" && 
            id !== "paradoxdisque"
        );

    const selected = [];
    const poolCopy = [...pool];

    for (let i = 0; i < count; i++) {
        if (poolCopy.length === 0) break;

        let totalWeight = poolCopy.reduce((sum, [id, item]) => sum + (weights[item.rarity] || 0), 0);
        let random = Math.random() * totalWeight;
        let currentSum = 0;

        for (let j = 0; j < poolCopy.length; j++) {
            currentSum += weights[poolCopy[j][1].rarity] || 0;
            if (random <= currentSum) {
                selected.push({ id: poolCopy[j][0], ...poolCopy[j][1] });
                poolCopy.splice(j, 1); // Éviter les doublons dans le même tirage
                break;
            }
        }
    }
    return selected;
}

/**
 * Affiche l'écran de récompense et de magasin entre les vagues
 */
function showRewardScreen() {
    const shopItems = getRandomShopItems(3);

    const content = `
        <div class="reward-screen">
            <h3>Fin de la vague ${gameState.wave - 1} !</h3>
            <p>Le marchand itinérant vous propose 3 objets (1 gratuit au choix) :</p>
            <div class="game-mode-grid">
                ${shopItems.map(item => `
                    <div class="game-mode-card" onclick="pickReward('${item.id}', true)">
                        <div style="font-size: 24px;">${item.icon}</div>
                        <h3>${item.name}</h3>
                        <p style="font-size: 12px; color: var(--text-muted);">${item.rarity}</p>
                        <p>${item.description}</p>
                        <strong style="color: var(--color-secondary);">GRATUIT</strong>
                    </div>
                `).join('')}
            </div>
            <div class="decoration-line"></div>
            <p>Magasin de voyage :</p>
            <div class="game-mode-card" style="max-width: 300px; margin: 0 auto;" onclick="pickReward('potion', false, 50)">
                <h3>🧪 Acheter Potion</h3>
                <p>Prix : 50 Devises</p>
            </div>
            <div class="submenu-buttons" style="margin-top: 20px;">
                <button class="menu-button secondary" onclick="startGame(gameState.mode, gameState.playerCount, gameState.isMultiplayer)">Passer</button>
            </div>
        </div>
    `;
    renderScreen('reward-screen', 'Récompenses & Magasin', content);
}

function pickReward(itemId, isFree, price = 0) {
    if (!isFree) {
        console.log(`Achat de ${itemId} pour ${price}`);
    }

    const item = lunarisData.items[itemId];
    
    if (item && item.category === 'Soin') {
        // Usage unique immédiat : on soigne le joueur directement
        applyItemEffect(itemId, combatState.player);
        console.log(`Soin appliqué immédiatement : ${item.name}`);
    } else {
        if (!combatState.player.inventory) combatState.player.inventory = {};
        
        // Les disques sont donnés par pack de 5
        const quantity = (item && item.category === 'Disque') ? 5 : 1;
        combatState.player.inventory[itemId] = (combatState.player.inventory[itemId] || 0) + quantity;
    }

    startGame(gameState.mode, gameState.playerCount, gameState.isMultiplayer);
}

function updateBarColor(barElement, ratio) {
    barElement.style.width = (ratio * 100) + '%';
    if (ratio < 0.2) barElement.style.background = '#ff4d4d';
    else if (ratio < 0.5) barElement.style.background = '#ffbd4d';
    else barElement.style.background = '#4ade80';
}

function handleCombatAction(action) {
    const log = document.getElementById('combat-log');
    if (!log) return;
    
    switch(action) {
        case 'bag':
            const items = Object.entries(combatState.player.inventory || {})
                .filter(([id, qty]) => qty > 0)
                .map(([id, qty]) => {
                    const info = lunarisData.items[id] || { name: id, icon: '📦' };
                    return `
                        <button class="menu-button move-btn" style="width:100%; text-transform:none;" onclick="useItemInBattle('${id}')">
                            <span class="move-name">${info.icon} ${info.name}</span>
                            <span class="move-pp">Qté: ${qty}</span>
                        </button>
                    `;
                }).join('');
            
            log.innerHTML = `<div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; width:100%;">
                ${items || '<p style="grid-column: span 2;">Le sac est vide.</p>'}
                <button class="menu-button secondary" style="grid-column: span 2;" onclick="resetCombatMenu()">Retour</button>
            </div>`;
            break;
            
        case 'team':
            const teamContent = `
                <div style="display: flex; justify-content: space-around; width: 100%; color: #333;">
                    <div><strong>En combat:</strong><br> ${combatState.player.name}</div>
                    <div style="border-left: 2px solid #333; padding-left: 20px;">
                        <strong>Équipe:</strong><br>
                        (Emplacement vide)<br>
                        (Vide)
                    </div>
                </div>
            `;
            log.innerHTML = teamContent;
            break;
            
        case 'run':
            log.textContent = "Vous prenez la fuite...";
            setTimeout(() => {
                gameState.wave++;
                startGame(gameState.mode, gameState.playerCount, gameState.isMultiplayer);
            }, 1000);
            break;
    }
}

/**
 * Applique l'effet d'un objet immédiatement (pour les soins en boutique)
 */
function applyItemEffect(itemId, target) {
    const item = lunarisData.items[itemId];
    if (!item) return;
    
    switch(item.effect) {
        case 'heal_30_percent':
            target.hp = Math.min(target.maxHp, target.hp + Math.floor(target.maxHp * 0.3));
            break;
        case 'heal_60_percent':
            target.hp = Math.min(target.maxHp, target.hp + Math.floor(target.maxHp * 0.6));
            break;
        case 'heal_max':
            target.hp = target.maxHp;
            break;
        case 'cure_status':
            // LUNARIS_TODO: implémenter retrait altérations
            break;
    }
}

/**
 * Utilise un objet depuis le sac pendant le combat (Capture)
 */
async function useItemInBattle(itemId) {
    const item = lunarisData.items[itemId];
    const log = document.getElementById('combat-log');
    
    if (item.category === 'Disque') {
        combatState.player.inventory[itemId]--;
        log.textContent = `${combatState.player.name} lance un ${item.name} !`;
        
        // Animation et calcul de capture
        await new Promise(r => setTimeout(r, 1000));
        const success = Math.random() > 0.5; // TODO: utiliser les taux réels
        
        if (success) {
            log.textContent = "Capture réussie !";
            setTimeout(() => {
                gameState.wave++;
                showRewardScreen();
            }, 1000);
        } else {
            log.textContent = "Le Lunaris sauvage s'est libéré !";
            setTimeout(resetCombatMenu, 1000);
        }
    } else {
        log.textContent = "Cet objet ne peut pas être utilisé ici.";
        setTimeout(resetCombatMenu, 1000);
    }
}

/**
 * Génère une image d'item via Canvas (pixel-art procédural)
 */
function generateItemSprite(itemId) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const item = lunarisData.items[itemId];
    
    // Fond transparent / ombre
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(16, 26, 8, 4, 0, 0, Math.PI*2);
    ctx.fill();

    if (item && item.category === 'Disque') {
        // Dessin d'un disque futuriste
        ctx.fillStyle = itemId.includes('stelladisque') ? '#4169e1' : (itemId.includes('novadisque') ? '#e74c3c' : '#bdc3c7');
        ctx.beginPath();
        ctx.arc(16, 16, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Noyau lumineux
        ctx.fillStyle = '#00d9ff';
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, Math.PI * 2);
        ctx.fill();
    } else if (item && item.category === 'Soin') {
        // Dessin d'une fiole/potion
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(12, 6, 8, 4); // Goulot
        ctx.fillStyle = '#ff4d4d'; // Couleur liquide
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(22, 10);
        ctx.lineTo(24, 24);
        ctx.lineTo(8, 24);
        ctx.fill();
    } else {
        // Fallback générique (cristal)
        ctx.fillStyle = '#9b59b6';
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(26, 16);
        ctx.lineTo(16, 28);
        ctx.lineTo(6, 16);
        ctx.fill();
    }
    
    return canvas.toDataURL();
}

/**
 * Shows the settings menu screen
 */
function showSettingsMenu() {
    const content = `
        <div> <!-- Wrapper div added -->
            <div class="settings-options">
                <div class="settings-option">
                    <label>Master Volume</label>
                    <input type="range" id="master-volume" min="0" max="100" value="${audioSettings.masterVolume * 100}">
                </div>

                <!-- SFX Toggle -->
                <div class="settings-option">
                    <label>Sound Effects</label>
                    <button id="toggle-sfx-btn" class="value">${audioSettings.sfxEnabled ? "ON" : "OFF"}</button>
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
        </div> <!-- Closing wrapper div -->
    `;

    renderScreen('settings-screen', 'Settings', content);

    const masterVolumeSlider = document.getElementById("master-volume");
    if (masterVolumeSlider) {
        masterVolumeSlider.oninput = (e) => audioSettings.setMasterVolume(e.target.value / 100);
    }

    const sfxBtn = document.getElementById("toggle-sfx-btn");
    if (sfxBtn) {
        sfxBtn.onclick = () => {
            audioSettings.toggleSfx();
            sfxBtn.innerText = audioSettings.sfxEnabled ? "ON" : "OFF";
        };
    }

    const musicVolumeSlider = document.getElementById("music-volume");
    if (musicVolumeSlider) {
        musicVolumeSlider.oninput = (e) => audioSettings.setMusicVolume(e.target.value / 100);
    }

    const fullscreenBtn = document.getElementById("fullscreen-btn");
    if (fullscreenBtn) {
        fullscreenBtn.innerText = document.fullscreenElement ? "ON" : "OFF";
        fullscreenBtn.onclick = () => {
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) return;
            if (!document.fullscreenElement) {
                gameContainer.requestFullscreen().catch(err => console.error(err));
            } else {
                document.exitFullscreen();
            }
        };
    }

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        let currentMode = (typeof siteManager !== 'undefined' && siteManager.getThemeMode) ? 
            siteManager.getThemeMode() : (localStorage.getItem('lunaris_theme_mode') || 'dark');
        themeToggleBtn.innerText = currentMode === 'light' ? 'Day' : 'Night';

        themeToggleBtn.onclick = () => {
            if (typeof siteManager !== 'undefined' && siteManager.toggleTheme) {
                siteManager.toggleTheme();
                themeToggleBtn.innerText = siteManager.getThemeMode() === 'light' ? 'Day' : 'Night';
            }
        };
    }
}

/**
 * Shows the credits screen
 */
function showCreditsMenu() {
    const content = `
        <div> <!-- Wrapper div added -->
            <p><strong>Lunaris</strong></p>
            <p>A Modular Creature-Battling Roguelike</p>
            <p style="margin-top: 20px;"><strong>Version 0.1.0</strong></p>
            <p style="margin-top: 30px; color: var(--text-muted);">Created with passion for gaming!</p>
            <p style="margin-top: 20px; color: var(--text-muted);">© 2024 Lunaris. All rights reserved.</p>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div> <!-- Closing wrapper div -->
    `;
    renderScreen('credits-screen', 'Credits', content);
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
let currentAchievementFilter = 'all';

const achievementsData = {
    versus: [
        { id: 'versus_1', title: 'Novice du Combat', description: 'Gagner 10 combats multijoueur', icon: '⚔️', progress: 3, target: 10, reward: '100 Gold', unlocked: false },
        { id: 'versus_2', title: 'Guerrier Éprouvé', description: 'Gagner 50 combats multijoueur', icon: '🛡️', progress: 15, target: 50, reward: '500 Gold', unlocked: false },
        { id: 'versus_3', title: 'Champion de l\'Arène', description: 'Gagner 100 combats multijoueur', icon: '👑', progress: 0, target: 100, reward: '1000 Gold', unlocked: false },
        { id: 'versus_4', title: 'Série de Victoires', description: 'Remporter 10 combats d\'affilée', icon: '🔥', progress: 2, target: 10, reward: '250 Gold', unlocked: false },
        { id: 'versus_5', title: 'Maître de la Tactique', description: 'Gagner 5 combats avec tous les types différents', icon: '🧠', progress: 1, target: 5, reward: '300 Gold', unlocked: false },
        { id: 'versus_6', title: 'Destructeur de Records', description: 'Inflige 500 dégâts dans un seul combat', icon: '💥', progress: 145, target: 500, reward: '400 Gold', unlocked: false }
    ],
    roguelike: [
        { id: 'roguelike_1', title: 'Premier Pas', description: 'Atteindre l\'étage 5', icon: '🐾', progress: 3, target: 5, reward: '100 Gold', unlocked: false },
        { id: 'roguelike_2', title: 'Explorateur Chevronné', description: 'Atteindre l\'étage 20', icon: '🗻', progress: 8, target: 20, reward: '500 Gold', unlocked: false },
        { id: 'roguelike_3', title: 'Légendaire', description: 'Atteindre l\'étage 50', icon: '⚡', progress: 0, target: 50, reward: '2000 Gold', unlocked: false },
        { id: 'roguelike_4', title: 'Collecteur de Trésors', description: 'Trouver 30 objets rares', icon: '💎', progress: 12, target: 30, reward: '300 Gold', unlocked: false },
        { id: 'roguelike_5', title: 'Survivant', description: 'Survivre 3 runs sans utiliser de soins', icon: '🛡️', progress: 0, target: 3, reward: '400 Gold', unlocked: false },
        { id: 'roguelike_6', title: 'Vainqueur du Boss Final', description: 'Battre le boss final 5 fois', icon: '👹', progress: 1, target: 5, reward: '1000 Gold', unlocked: false }
    ],
    general: [
        { id: 'general_1', title: 'Collectionneur Novice', description: 'Obtenir 25 monstres différents', icon: '🧬', progress: 18, target: 25, reward: '100 Gold', unlocked: false },
        { id: 'general_2', title: 'Grand Collectionneur', description: 'Obtenir 50 monstres différents', icon: '📚', progress: 42, target: 50, reward: '500 Gold', unlocked: false },
        { id: 'general_3', title: 'Maître Collectionneur', description: 'Obtenir 100 monstres différents', icon: '🏛️', progress: 65, target: 100, reward: '1500 Gold', unlocked: false },
        { id: 'general_4', title: 'Accumulateur de Richesses', description: 'Accumuler 100 000 Gold', icon: '💰', progress: 45600, target: 100000, reward: '1000 Gold', unlocked: false },
        { id: 'general_5', title: 'Premier Tirage', description: 'Effectuer 1 tirage Gacha', icon: '🎰', progress: 1, target: 1, reward: '50 Gold', unlocked: true },
        { id: 'general_6', title: 'Dénicheur de Rarités', description: 'Obtenir 3 créatures Légendaires', icon: '🌟', progress: 1, target: 3, reward: '500 Gold', unlocked: false }
    ]
};

function renderAchievementsContent(filterCategory = 'all') {
    const container = document.getElementById('screen-container');
    if (!container) return;

    let contentHtml = '';
    const categories = ['versus', 'roguelike', 'general'];
    
    if (filterCategory === 'all') {
        contentHtml = categories.map(category => {
            const achievements = achievementsData[category] || [];
            if (achievements.length === 0) return '';
            
            const achievementsHtml = achievements.map(achievement => `
                <div class="achievement-card ${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}">
                    <div class="achievement-header">
                        <div class="achievement-title-section">
                            <span class="achievement-icon">${achievement.icon}</span>
                            <h4 class="achievement-title">${achievement.title}</h4>
                        </div>
                        <span class="achievement-reward">${achievement.reward}</span>
                    </div>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress-fill" style="width: ${(achievement.progress / achievement.target) * 100}%"></div>
                        </div>
                        <span class="achievement-progress-text">${achievement.progress}/${achievement.target}</span>
                    </div>
                    ${achievement.unlocked ? '<span class="achievement-badge">✓</span>' : ''}
                </div>
            `).join('');

            const categoryTitle = category === 'versus' ? 'Versus' : 
                                 category === 'roguelike' ? 'Roguelike' : 'Général';
            
            return `
                <h3 class="achievement-category-title">${categoryTitle}</h3>
                <div class="achievements-grid">
                    ${achievementsHtml}
                </div>
            `;
        }).join('');
    } else {
        const achievements = achievementsData[filterCategory] || [];
        if (achievements.length === 0) {
            contentHtml = `<p class="achievements-empty">Aucun achievement dans cette catégorie.</p>`;
        } else {
            contentHtml = `
                <div class="achievements-grid">
                    ${achievements.map(achievement => `
                        <div class="achievement-card ${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}">
                            <div class="achievement-header">
                                <div class="achievement-title-section">
                                    <span class="achievement-icon">${achievement.icon}</span>
                                    <h4 class="achievement-title">${achievement.title}</h4>
                                </div>
                                <span class="achievement-reward">${achievement.reward}</span>
                            </div>
                            <p class="achievement-description">${achievement.description}</p>
                            <div class="achievement-progress">
                                <div class="achievement-progress-bar">
                                    <div class="achievement-progress-fill" style="width: ${(achievement.progress / achievement.target) * 100}%"></div>
                                </div>
                                <span class="achievement-progress-text">${achievement.progress}/${achievement.target}</span>
                            </div>
                            ${achievement.unlocked ? '<span class="achievement-badge">✓</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    // Générer la navbar
    const categoryNames = { versus: 'Versus', roguelike: 'Roguelike', general: 'Général' };
    const totalAchievements = {
        versus: achievementsData.versus.length,
        roguelike: achievementsData.roguelike.length,
        general: achievementsData.general.length
    };
    const unlockedAchievements = {
        versus: achievementsData.versus.filter(a => a.unlocked).length,
        roguelike: achievementsData.roguelike.filter(a => a.unlocked).length,
        general: achievementsData.general.filter(a => a.unlocked).length
    };

    const navbarHtml = `
        <div class="achievements-navbar">
            <button class="achievements-filter-btn ${currentAchievementFilter === 'all' ? 'active' : ''}" 
                    onclick="filterAchievementsByCategory('all')">Tous</button>
            ${['versus', 'roguelike', 'general'].map(cat => {
                const isActive = currentAchievementFilter === cat ? 'active' : '';
                const unlockedCnt = unlockedAchievements[cat];
                const totalCnt = totalAchievements[cat];
                return `<button class="achievements-filter-btn ${isActive}" 
                                onclick="filterAchievementsByCategory('${cat}')">${categoryNames[cat]} (${unlockedCnt}/${totalCnt})</button>`;
            }).join('')}
        </div>
    `;

    container.innerHTML = `
        <div class="screen" id="achievements-screen">
            <div class="decoration-stars">
                <span>✦</span>
                <span>✦</span>
                <span>✦</span>
            </div>
            <h2>Achievements</h2>
            <div class="decoration-line"></div>
            ${navbarHtml}
            <div class="achievements-content">
                ${contentHtml}
            </div>
            <div class="submenu-buttons">
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;
}

function filterAchievementsByCategory(category) {
    currentAchievementFilter = category;
    renderAchievementsContent(category);
}

function showAchievementsMenu() {
    console.log('[TAB Menu] Opening Achievements...');
    hideTabMenu();

    const container = document.getElementById('screen-container');
    if (!container) return;

    currentAchievementFilter = 'all';
    renderAchievementsContent('all');
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
    const currentAccount = accountManager?.getCurrentAccount();
    const isLoggedIn = !!currentAccount;
    const displayName = currentAccount?.username || currentProfile.name;

    const logoutButtonHtml = isLoggedIn ? `<button class="menu-button danger" id="logout-btn">Se déconnecter</button>` : '';
    const changeProfileButtonHtml = isLoggedIn ? `<button class="menu-button" id="change-profile-btn">Changer de profil</button>` : `<button class="menu-button" onclick="clearProfileFromStorage(); showProfileMenu();">Change Profile</button>`;

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
                    <div class="profile-name">${displayName}</div>
                    <div class="profile-meta">Created: ${new Date(currentProfile.createdAt).toLocaleDateString()}</div>
                    ${isLoggedIn ? `<div class="profile-meta">Connected as: ${currentAccount.username}</div>` : ''}
                </div>
            </div>
            <div class="profile-stats">
                <p><strong>Gems:</strong> 💎 ${playerGems.toLocaleString()}</p>
                <p><strong>Discs:</strong> ${discInventory.length}</p>
            </div>
            <p class="profile-note">This profile is local to this browser. Your progression is saved here.</p>
            <div class="submenu-buttons">
                ${logoutButtonHtml}
                ${changeProfileButtonHtml}
                <button class="menu-button secondary" onclick="showMainMenu()">Back</button>
            </div>
        </div>
    `;

    if (isLoggedIn) {
        const logoutBtn = document.getElementById('logout-btn');
        const changeProfileBtn = document.getElementById('change-profile-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                accountManager.logout();
                showAccountSelectionScreen();
            });
        }

        if (changeProfileBtn) {
            changeProfileBtn.addEventListener('click', () => {
                // Force log out before choosing a new account so password is required
                if (accountManager) {
                    accountManager.logout();
                }
                currentProfile = null;
                showAccountSelectionScreen();
            });
        }
    }
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
    
    // Initialize account system
    initializeAccountSystem();
    
    // Check if user is logged in
    if (accountManager && accountManager.getCurrentAccount()) {
        // User is already logged in, load profile data
        loadProfileFromStorage();
        loadGemsFromStorage();
        discInventory = loadDiscInventoryFromStorage();
        updateGemCounter();
        
        // Show main menu
        showMainMenu();
    } else {
        // Show account selection screen
        showAccountSelectionScreen();
    }
    
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
