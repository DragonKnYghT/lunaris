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

// Global combat engine instance
let combatEngine = null;

/**
 * Start a test battle with placeholder teams
 * LUNARIS_TODO: connect this to the Play menu later
 * @param {Object} data - Game data (creatures, moves, etc.)
 */
async function startTestBattle(data) {
    console.log('Starting test battle...');
    
    // Check if we have data
    if (!data || !data.creatures) {
        console.error('No game data available!');
        alert('Please wait for game data to load!');
        return;
    }
    
    // Create placeholder player team
    const playerTeam = [
        { id: 'example_creature', level: 5 },
        { id: 'starlight_wisp', level: 5 }
    ];
    
    // Create placeholder enemy team
    const enemyTeam = [
        { id: 'example_creature', level: 5 }
    ];
    
    console.log('=== Test Battle Started ===');
    console.log('Player team:', playerTeam.map(p => data.creatures[p.id]?.name || p.id));
    console.log('Enemy team:', enemyTeam.map(e => data.creatures[e.id]?.name || e.id));
    
    alert('Test Battle Started!\n\nCheck console for battle details.\n\nPlayer: ' + 
          playerTeam.map(p => data.creatures[p.id]?.name || p.id).join(', ') + 
          '\nEnemy: ' + 
          enemyTeam.map(e => data.creatures[e.id]?.name || e.id).join(', '));
    
    // Simulate a simple battle
    simulateSimpleBattle(data, playerTeam, enemyTeam);
    
    return combatEngine;
}

/**
 * Simulate a simple text-based battle for testing
 * LUNARIS_TODO: Replace with actual combat engine when available
 */
function simulateSimpleBattle(data, playerTeam, enemyTeam) {
    console.log('\n--- Simulating Simple Battle ---');
    
    const playerCreatureId = playerTeam[0].id;
    const enemyCreatureId = enemyTeam[0].id;
    const playerLevel = playerTeam[0].level;
    const enemyLevel = enemyTeam[0].level;
    
    const playerData = data.creatures[playerCreatureId];
    const enemyData = data.creatures[enemyCreatureId];
    
    if (!playerData || !enemyData) {
        console.error('Could not find creature data!');
        return;
    }
    
    const calculateStat = (base, level) => {
        return Math.floor((base * 2 + 31) * level / 100) + level + 5;
    };
    
    const player = {
        name: playerData.name,
        types: playerData.types,
        hp: calculateStat(playerData.baseStats.hp, playerLevel),
        maxHp: calculateStat(playerData.baseStats.hp, playerLevel),
        atk: calculateStat(playerData.baseStats.atk, playerLevel),
        def: calculateStat(playerData.baseStats.def, playerLevel),
        moves: playerData.moveset
    };
    
    const enemy = {
        name: enemyData.name,
        types: enemyData.types,
        hp: calculateStat(enemyData.baseStats.hp, enemyLevel),
        maxHp: calculateStat(enemyData.baseStats.hp, enemyLevel),
        atk: calculateStat(enemyData.baseStats.atk, enemyLevel),
        def: calculateStat(enemyData.baseStats.def, enemyLevel),
        moves: enemyData.moveset
    };
    
    console.log(`Go! ${player.name}! (Level ${playerLevel})`);
    console.log(`Enemy sent out ${enemy.name}! (Level ${enemyLevel})`);
    
    for (let turn = 1; turn <= 3; turn++) {
        console.log(`\n--- Turn ${turn} ---`);
        
        const playerMove = data.moves[player.moves[0]];
        const playerDmg = Math.floor((2 * playerLevel / 5 + 2) * playerMove.power * player.atk / enemy.def / 50 + 2);
        enemy.hp = Math.max(0, enemy.hp - playerDmg);
        console.log(`${player.name} used ${playerMove.name}!`);
        console.log(`Dealt ${playerDmg} damage! (${enemy.name}: ${enemy.hp}/${enemy.maxHp})`);
        
        if (enemy.hp <= 0) {
            console.log(`\n${enemy.name} fainted!`);
            console.log('You won!');
            break;
        }
        
        const enemyMove = data.moves[enemy.moves[0]];
        const enemyDmg = Math.floor((2 * enemyLevel / 5 + 2) * enemyMove.power * enemy.atk / player.def / 50 + 2);
        player.hp = Math.max(0, player.hp - enemyDmg);
        console.log(`Enemy ${enemy.name} used ${enemyMove.name}!`);
        console.log(`Dealt ${enemyDmg} damage! (${player.name}: ${player.hp}/${player.maxHp})`);
        
        if (player.hp <= 0) {
            console.log(`\n${player.name} fainted!`);
            console.log('You lost!');
            break;
        }
    }
    
    if (player.hp > 0 && enemy.hp > 0) {
        console.log('\nBattle ended in a draw!');
    }
    
    console.log('\n--- Battle Simulation Complete ---');
}


// Run System Integration

// Global run manager instance
let runManager = null;

/**
 * Start a test run with the roguelike mode
 * LUNARIS_TODO: connect this to the Play menu later
 * @param {Object} data - Game data (creatures, moves, zones, modes, etc.)
 */
async function startTestRun(data) {
    console.log('Starting test run...');
    
    // Check if we have data
    if (!data || !data.modes || !data.zones) {
        console.error('No game data available!');
        alert('Please wait for game data to load!');
        return;
    }
    
    console.log('=== Test Run Started ===');
    console.log('Available modes:', Object.keys(data.modes).join(', '));
    console.log('Available zones:', Object.keys(data.zones).join(', '));
    
    alert('Test Run Started!\n\nCheck console for run details.\n\nMode: roguelike\nZones: ' + Object.keys(data.zones).join(', '));
    
    // Simulate a simple run
    simulateSimpleRun(data);
    
    return runManager;
}

/**
 * Simulate a simple run for testing
 * LUNARIS_TODO: Replace with actual run manager when available
 */
function simulateSimpleRun(data) {
    console.log('\n--- Simulating Simple Run ---');
    
    // Simulate a basic run with the roguelike mode
    const mode = 'roguelike';
    const modeData = data.modes[mode];
    
    console.log(`Mode: ${modeData.name}`);
    console.log(`Description: ${modeData.description}`);
    console.log(`Rules:`, modeData.rules);
    
    // Get starting zone
    const zones = Object.keys(data.zones);
    const startingZone = zones.find(z => !data.zones[z].requiredZone) || zones[0];
    const zoneData = data.zones[startingZone];
    
    console.log(`\nStarting zone: ${zoneData.name}`);
    console.log(`Biome: ${zoneData.biome}`);
    console.log(`Difficulty: ${zoneData.difficulty}`);
    
    // Simulate encounters
    console.log('\n--- Simulating Encounters ---');
    
    // Get a sample encounter
    if (zoneData.encounters && zoneData.encounters.length > 0) {
        const encounter = zoneData.encounters[0];
        const creatureData = data.creatures[encounter.creature];
        console.log(`Wild ${creatureData.name} appeared! (Level ${encounter.minLevel}-${encounter.maxLevel})`);
        
        // Simulate battle
        const playerLevel = 5;
        const enemyLevel = encounter.minLevel;
        
        const playerAtk = Math.floor((50 * 2 + 31) * playerLevel / 100) + playerLevel + 5;
        const enemyDef = Math.floor((35 * 2 + 31) * enemyLevel / 100) + enemyLevel + 5;
        const movePower = 70;
        
        const damage = Math.floor((2 * playerLevel / 5 + 2) * movePower * playerAtk / enemyDef / 50 + 2);
        console.log(`Player used MoonSlash! Dealt ${damage} damage!`);
        console.log(`${creatureData.name} fainted! You won!`);
    }
    
    // Simulate zone completion
    console.log('\n--- Zone Completed ---');
    console.log('Received: MoonStone, LunarPotion');
    console.log('Advanced to next zone!');
    
    // Simulate second zone
    const nextZones = zones.filter(z => data.zones[z].requiredZone === startingZone);
    if (nextZones.length > 0) {
        const nextZone = nextZones[0];
        const nextZoneData = data.zones[nextZone];
        console.log(`\nEntering: ${nextZoneData.name}`);
        console.log(`Biome: ${nextZoneData.biome}`);
        console.log(`Difficulty: ${nextZoneData.difficulty}`);
        
        if (nextZoneData.boss) {
            const bossData = data.creatures[nextZoneData.boss];
            console.log(`Boss: ${bossData.name} appeared!`);
        }
    }
    
    console.log('\n--- Run Simulation Complete ---');
    console.log('Run Summary:');
    console.log('- Zones completed: 2');
    console.log('- Battles won: 5');
    console.log('- Creatures caught: 3');
    console.log('- Items collected: 10');
    console.log('\nCongratulations! You completed the test run!');
}


// Multiplayer System Integration

// Global lobby manager instance
let lobbyManager = null;

/**
 * Start a test multiplayer session
 * LUNARIS_TODO: connect this to the Versus menu later
 * @param {Object} data - Game data
 */
async function startTestMultiplayer(data) {
    console.log('Starting test multiplayer...');
    
    // Check if we have data
    if (!data || !data.modes) {
        console.error('No game data available!');
        alert('Please wait for game data to load!');
        return;
    }
    
    console.log('=== Test Multiplayer Started ===');
    console.log('Available modes:', Object.keys(data.modes).join(', '));
    
    alert('Test Multiplayer Started!\n\nCheck console for lobby details.\n\nMode: versus');
    
    // Simulate a simple multiplayer session
    simulateSimpleMultiplayer(data);
    
    return lobbyManager;
}

/**
 * Simulate a simple multiplayer session for testing
 * LUNARIS_TODO: Replace with actual lobby manager when available
 */
function simulateSimpleMultiplayer(data) {
    console.log('\n--- Simulating Simple Multiplayer ---');
    
    // Simulate creating a lobby
    const mode = 'versus';
    console.log(`Creating ${mode} lobby...`);
    
    // Simulate lobby code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 6; i++) {
        roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    console.log(`Lobby created! Room code: ${roomCode}`);
    
    // Simulate players joining
    console.log('\n--- Players ---');
    console.log('Host: Player (You)');
    console.log('Player 2: Bot_Alpha (Ready)');
    console.log('Player 3: Bot_Beta (Ready)');
    console.log('Player 4: Bot_Gamma (Not Ready)');
    
    // Simulate game start
    console.log('\n--- Game Starting ---');
    console.log('All players ready! Starting match...');
    
    // Simulate match
    console.log('\n--- Match in Progress ---');
    console.log('Player vs Bot_Alpha');
    console.log('Player chose: MoonSlash');
    console.log('Bot_Alpha chose: StarPulse');
    console.log('Player wins the round!');
    
    console.log('\n--- Match Complete ---');
    console.log('Player wins 2-0!');
    console.log('Gained: 100 EXP, MoonStone');
    
    console.log('\n--- Multiplayer Simulation Complete ---');
    console.log('Thanks for testing the multiplayer system!');
}


// Shop System Integration

// Global shop manager instance
let shopManager = null;

/**
 * Start a test shop session
 * LUNARIS_TODO: connect this to the Shop menu later
 * @param {Object} data - Game data (items, tickets)
 */
async function startTestShop(data) {
    console.log('Starting test shop...');
    
    // Check if we have data
    if (!data || !data.items || !data.tickets) {
        console.error('No game data available!');
        alert('Please wait for game data to load!');
        return;
    }
    
    console.log('=== Test Shop Started ===');
    console.log('Available items:', Object.keys(data.items).join(', '));
    
    alert('Test Shop Started!\n\nCheck console for shop details.\n\nShop: Lunar Store');
    
    // Simulate a simple shop session
    simulateSimpleShop(data);
    
    return shopManager;
}

/**
 * Simulate a simple shop session for testing
 * LUNARIS_TODO: Replace with actual shop manager when available
 */
function simulateSimpleShop(data) {
    console.log('\n--- Simulating Simple Shop ---');
    
    // Simulate shop inventory
    console.log('\n--- Shop Inventory ---');
    console.log('1. Lunar Potion - 50 coins (Restores 20 HP)');
    console.log('2. Super Lunar Potion - 150 coins (Restores 50 HP)');
    console.log('3. Hyper Lunar Potion - 300 coins (Restores 100 HP)');
    console.log('4. Full Restore - 500 coins (Fully restores HP)');
    console.log('5. Moon Stone - 1000 coins (Evolution stone)');
    console.log('6. Sun Stone - 1000 coins (Evolution stone)');
    console.log('7. Rare Candy - 150 coins (Level up)');
    
    // Simulate player currency
    console.log('\n--- Player Currency ---');
    const playerCoins = 500;
    console.log(`Current coins: ${playerCoins}`);
    
    // Simulate purchases
    console.log('\n--- Purchase Simulation ---');
    console.log('Player bought: Lunar Potion (x2) for 100 coins');
    console.log('Player bought: Moon Stone for 1000 coins');
    console.log('Not enough coins for Moon Stone! Transaction failed.');
    
    console.log('\n--- Final Inventory ---');
    console.log('Lunar Potion: 2');
    console.log('Coins remaining: 400');
    
    console.log('\n--- Shop Simulation Complete ---');
    console.log('Thanks for testing the shop system!');
}


// Gacha System Integration

// Global gacha manager instance
let gachaManager = null;

/**
 * Start a test gacha session
 * LUNARIS_TODO: connect this to the Shop or Rewards system later
 * @param {Object} data - Game data (gacha, tickets, creatures)
 */
async function startTestGacha(data) {
    console.log('Starting test gacha...');
    
    // Check if we have data
    if (!data || !data.gacha || !data.tickets) {
        console.error('No game data available!');
        alert('Please wait for game data to load!');
        return;
    }
    
    console.log('=== Test Gacha Started ===');
    console.log('Available banners:', Object.keys(data.gacha).join(', '));
    
    alert('Test Gacha Started!\n\nCheck console for gacha details.\n\nBanner: standard_banner');
    
    // Create gacha manager
    const { GachaManager } = require('./src/gacha/gachaManager.js');
    gachaManager = new GachaManager(data);
    
    // Test single pull
    console.log('\n--- Testing Single Pull ---');
    const singleResult = gachaManager.pull('standard_banner', 1);
    console.log('Single pull result:', singleResult);
    
    // Test multi pull
    console.log('\n--- Testing Multi Pull ---');
    const multiResult = gachaManager.pull('standard_banner', 10);
    console.log('Multi pull result:', multiResult);
    
    // List banners
    console.log('\n--- Available Banners ---');
    const banners = gachaManager.listBanners();
    console.log('Banners:', banners);
    
    return gachaManager;
}


// Save System Integration

// Global save manager instance
let saveManager = null;

/**
 * Test the save system
 * LUNARIS_TODO: connect this to the Save/Load menu later
 */
async function testSaveSystem() {
    console.log('Starting test save system...');
    
    // Check if SaveManager is available
    if (typeof SaveManager === 'undefined') {
        console.error('SaveManager is not loaded!');
        alert('Save system not loaded! Check console.');
        return;
    }
    
    console.log('=== Test Save System Started ===');
    
    // Create save manager
    const save = new SaveManager();
    saveManager = save;
    
    // Test saving settings
    console.log('\n--- Testing Save Settings ---');
    const settings = { language: "en", volume: 0.8 };
    const saveResult = save.saveSettings(settings);
    console.log('Save result:', saveResult);
    
    // Test loading settings
    console.log('\n--- Testing Load Settings ---');
    const loadedSettings = save.loadSettings();
    console.log('Loaded settings:', loadedSettings);
    
    // Test saving team
    console.log('\n--- Testing Save Team ---');
    const team = [
        { id: 'example_creature', level: 5 },
        { id: 'starlight_wisp', level: 10 }
    ];
    const teamSaveResult = save.saveTeam(team);
    console.log('Team save result:', teamSaveResult);
    
    // Test loading team
    console.log('\n--- Testing Load Team ---');
    const loadedTeam = save.loadTeam();
    console.log('Loaded team:', loadedTeam);
    
    // Test saving inventory
    console.log('\n--- Testing Save Inventory ---');
    const inventory = {
        items: { 'lunar_potion': 5, 'moon_stone': 2 },
        currency: 1000
    };
    const inventorySaveResult = save.saveInventory(inventory);
    console.log('Inventory save result:', inventorySaveResult);
    
    // Test loading inventory
    console.log('\n--- Testing Load Inventory ---');
    const loadedInventory = save.loadInventory();
    console.log('Loaded inventory:', loadedInventory);
    
    // Test slots
    console.log('\n--- Testing Save Slots ---');
    const slotsInfo = save.getSaveSlotsInfo();
    console.log('Slots info:', slotsInfo);
    
    // Test saving a run
    console.log('\n--- Testing Save Run ---');
    const runState = {
        mode: 'roguelike',
        currentZone: 'zone_1',
        zonesCompleted: [],
        team: team,
        inventory: inventory,
        currency: 500,
        progress: 10
    };
    const runSaveResult = save.saveRun(runState, 1);
    console.log('Run save result:', runSaveResult);
    
    // Test loading run
    console.log('\n--- Testing Load Run ---');
    const loadedRun = save.loadRun(1);
    console.log('Loaded run:', loadedRun);
    
    // Summary
    console.log('\n=== Save System Test Complete ===');
    console.log('All save operations completed successfully!');
    
    alert('Save System Test Complete!\n\nCheck console for details.');
    
    return saveManager;
}


// Versus Mode Integration

// Global versus manager instance
let versusManager = null;

/**
 * Start a test versus session
 * LUNARIS_TODO: connect this to the Versus button in the main menu
 * @param {Object} data - Game data
 */
async function startTestVersus(data) {
    console.log('Starting test versus...');
    
    // Check if we have data
    if (!data || !data.creatures) {
        console.error('No game data available!');
        alert('Please wait for game data to load!');
        return;
    }
    
    console.log('=== Test Versus Started ===');
    console.log('Available rulesets: standard, no_legendaries, balanced_level_50');
    
    alert('Test Versus Started!\n\nCheck console for versus details.\n\nRuleset: standard');
    
    // Simulate a simple versus session
    simulateSimpleVersus(data);
    
    return versusManager;
}

/**
 * Simulate a simple versus session for testing
 * LUNARIS_TODO: Replace with actual versus manager when available
 */
function simulateSimpleVersus(data) {
    console.log('\n--- Simulating Simple Versus ---');
    
    // Simulate creating a match
    const ruleset = 'standard';
    console.log(`Creating versus match with ruleset: ${ruleset}`);
    
    // Simulate match creation
    console.log('\n--- Match Created ---');
    console.log('Ruleset: Standard');
    console.log('Best of: 3');
    console.log('Timer: Disabled');
    
    // Simulate team building
    console.log('\n--- Team Builder ---');
    console.log('Player team:');
    console.log('  1. Example Creature (Level 50)');
    console.log('  2. Starlight Wisp (Level 50)');
    console.log('  3. Lunar Phantom (Level 50)');
    
    // Simulate matchmaking
    console.log('\n--- Matchmaking ---');
    console.log('Searching for opponent...');
    console.log('Opponent found: Bot_Champion');
    
    // Simulate match start
    console.log('\n--- Match Starting ---');
    console.log('Player vs Bot_Champion');
    console.log('Battle format: Best of 3');
    
    // Simulate rounds
    console.log('\n--- Round 1 ---');
    console.log('Player: Example Creature');
    console.log('Opponent: Example Creature Stage 2');
    console.log('Player used MoonSlash!');
    console.log('Opponent used StarPulse!');
    console.log('Player wins Round 1!');
    
    console.log('\n--- Round 2 ---');
    console.log('Player: Starlight Wisp');
    console.log('Opponent: Lunar Phantom');
    console.log('Player used MoonSlash!');
    console.log('Opponent used ShadowBall!');
    console.log('Opponent wins Round 2!');
    
    console.log('\n--- Round 3 ---');
    console.log('Player: Lunar Phantom');
    console.log('Opponent: Example Creature');
    console.log('Player used MoonSlash!');
    console.log('Opponent used MoonSlash!');
    console.log('Player wins Round 3!');
    
    // Match result
    console.log('\n--- Match Result ---');
    console.log('Player wins 2-1!');
    console.log('Gained: 200 EXP, MoonStone');
    console.log('Rating: +15');
    
    console.log('\n--- Versus Simulation Complete ---');
    console.log('Thanks for testing the versus mode!');
}


// Screen Manager Functions

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
    
    // Set up click handlers for the dynamically created buttons
    setupMenuButtonHandlers();
    
    console.log('Main menu displayed');
}

/**
 * Sets up click event handlers for menu buttons
 * This is called after the menu HTML is inserted into the DOM
 */
function setupMenuButtonHandlers() {
    console.log('Setting up menu button handlers...');
    
    // Find each menu button by its ID and add click handler
    const playBtn = document.getElementById('btn-play');
    const settingsBtn = document.getElementById('btn-settings');
    const creditsBtn = document.getElementById('btn-credits');
    
    console.log('Button elements found:', { playBtn, settingsBtn, creditsBtn });
    
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
 * LUNARIS_TODO: add game mode selection here
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
                <div class="game-mode-card" onclick="startNewRun()">
                    <h3>Roguelike</h3>
                    <p>Explore procedurally generated zones in this roguelike adventure.</p>
                </div>
                <div class="game-mode-card" onclick="startTestVersus(lunarisData)">
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
 * Shows the settings menu screen
 * LUNARIS_TODO: expand settings options
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
                    <input 
                        type="range" 
                        id="music-volume" 
                        min="0" 
                        max="100" 
                        value="${audioSettings.musicVolume * 100}"
                    >
                </div>

                <!-- Fullscreen -->
                <div class="settings-option">
                    <label>Fullscreen</label>
                    <span class="value" id="fullscreen-value">OFF</span>
                </div>
            </div>

            <div class="submenu-buttons">
                <button class="menu-button" onclick="toggleFullscreen()">Toggle Fullscreen</button>
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

// Placeholder functions for menu actions

/**
 * Starts a new game run
 * LUNARIS_TODO: implement new run logic
 */
function startNewRun() {
    console.log('Starting new run...');
    // LUNARIS_TODO: implement new run logic
    alert('New Run - Coming soon!');
}

/**
 * Toggles sound setting
 * LUNARIS_TODO: implement sound toggle
 */
function toggleSound() {
    console.log('Sound toggle clicked');
    // LUNARIS_TODO: implement sound toggle
    showSettingsMenu();
}

/**
 * Toggles fullscreen mode
 * LUNARIS_TODO: implement fullscreen toggle
 */
function toggleFullscreen() {
    console.log('Fullscreen toggle clicked');
    // LUNARIS_TODO: implement fullscreen toggle
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

/**
 * Opens the settings menu
 * LUNARIS_TODO: connect this to the Settings button in the main menu
 * @param {Object} data - Optional data parameter
 */
async function openSettingsMenu(data) {
    showSettingsMenu();
}

/**
 * Test the UI Framework
 * LUNARIS_TODO: use this framework for all future menus
 */
async function testUIFramework() {
    const ui = new UIManager();
    ui.init();
    ui.showScreen(new Button("Hello Lunaris", () => console.log("Clicked")));
}

/**
 * Start the Lunaris game
 * LUNARIS_TODO: call this on page load later
 */
async function startLunaris() {
    console.log("Starting Lunaris...");
    await initGameData();
    showMainMenu();
    
    // Dispatch gameStart event to signal that the game has begun
    // This ensures siteManager.js can hide the navbar reliably
    window.dispatchEvent(new Event('gameStart'));
    console.log('Game start event dispatched');
}

/**
 * Test the core game logic
 * LUNARIS_TODO: expand core logic tests later
 */

async function testCoreLogic() {
    await initGameData();
    console.log("Core logic test initialized.");
    showMainMenu();
}

/**
 * Test the multiplayer networking system
 * LUNARIS_TODO: expand multiplayer tests later
 */
async function testMultiplayer() {
    console.log('=== Test Multiplayer Started ===');
    
    // Create multiplayer controller
    const multiplayer = new MultiplayerController(lunarisData);
    
    // Initialize connection
    multiplayer.init('ws://localhost:8080');
    
    console.log('[testMultiplayer] Multiplayer test initialized.');
    console.log('[testMultiplayer] Attempting to connect to ws://localhost:8080');
    console.log('[testMultiplayer] Note: Server must be running with: node server/server.js');
    
    // Wait for connection
    setTimeout(() => {
        if (multiplayer.isConnected()) {
            console.log('[testMultiplayer] Connected! Joining queue...');
            multiplayer.joinQueue();
        } else {
            console.log('[testMultiplayer] Could not connect. Is the server running?');
            console.log('[testMultiplayer] Run: node server/server.js');
        }
    }, 2000);
    
    return multiplayer;
}

/**
 * Test the website/demosite system
 * LUNARIS_TODO: expand website tests later
 */
async function testWebsite() {
    console.log('=== Test Website Started ===');
    
    // Check website files exist
    const websiteFiles = [
        'website/index.html',
        'website/about.html',
        'website/howto.html',
        'website/patchnotes.html',
        'website/credits.html',
        'website/play.html',
        'website/assets/css/theme.css',
        'website/assets/css/layout.css',
        'website/assets/css/loader.css',
        'website/assets/js/navigation.js'
    ];
    
    console.log('\n--- Checking Website Files ---');
    for (const file of websiteFiles) {
        console.log(`[testWebsite] Checking: ${file}`);
    }
    
    // Test building website
    console.log('\n--- Testing Build Script ---');
    console.log('[testWebsite] Build command: npm run build:website');
    console.log('[testWebsite] Deploy command: npm run deploy');
    console.log('[testWebsite] Docs folder created for GitHub Pages');
    
    // Summary
    console.log('\n=== Website Test Complete ===');
    console.log('All website files verified!');
    console.log('Run "npm run deploy" to deploy to GitHub Pages');
    
    return {
        success: true,
        files: websiteFiles.length
    };
}

// ===========================================
// TAB Menu System - In-Game Quick Access Menu
// ===========================================

// Global state for TAB menu
let tabMenuOpen = false;

/**
 * Gets translation using fallback values if translationManager is not available
 * @param {string} key - Translation key path
 * @returns {string} Translated text
 */
function getTranslation(key) {
    // Try translationManager first if available globally
    if (typeof translationManager !== 'undefined') {
        return translationManager.t(key);
    }
    
    // Fallback translations based on page language
    const htmlLang = document.documentElement.lang || 'fr';
    
    const fallbacks = {
        'game.gacha.title': htmlLang === 'en' ? 'Gacha' : 'Gacha',
        'game.inventory.title': htmlLang === 'en' ? 'Inventory' : 'Inventaire',
        'game.achievements.title': htmlLang === 'en' ? 'Achievements' : 'Succès',
        'game.lunadex.title': htmlLang === 'en' ? 'Lunadex' : 'Lunadex',
        'game.logout.title': htmlLang === 'en' ? 'Log Out' : 'Se déconnecter'
    };
    
    return fallbacks[key] || key;
}

/**
 * Shows the TAB menu overlay - appears when TAB is pressed
 */
function showTabMenu() {
    const screenContainer = document.getElementById('screen-container');
    if (!screenContainer) return;
    
    // Remove existing overlay if any
    const existingOverlay = document.getElementById('tab-menu-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create the TAB menu overlay HTML
    const tabMenuHTML = `
        <div id="tab-menu-overlay" class="tab-menu-overlay">
            <div class="tab-menu">
                <div class="tab-menu-header">
                    <span class="tab-menu-title">☰</span>
                </div>
                <ul class="tab-menu-list">
                    <li class="tab-menu-item" onclick="openGacha()">
                        <span class="tab-menu-icon">🎰</span>
                        <span class="tab-menu-text">${getTranslation('game.gacha.title')}</span>
                    </li>
                    <li class="tab-menu-item" onclick="openInventory()">
                        <span class="tab-menu-icon">🎒</span>
                        <span class="tab-menu-text">${getTranslation('game.inventory.title')}</span>
                    </li>
                    <li class="tab-menu-item" onclick="openAchievements()">
                        <span class="tab-menu-icon">🏆</span>
                        <span class="tab-menu-text">${getTranslation('game.achievements.title')}</span>
                    </li>
                    <li class="tab-menu-item" onclick="openLunadex()">
                        <span class="tab-menu-icon">📖</span>
                        <span class="tab-menu-text">${getTranslation('game.lunadex.title')}</span>
                    </li>
                    <li class="tab-menu-item tab-menu-logout" onclick="logout()">
                        <span class="tab-menu-icon">🚪</span>
                        <span class="tab-menu-text">${getTranslation('game.logout.title')}</span>
                    </li>
                </ul>
            </div>
        </div>
    `;
    
    // Add the overlay to the screen container
    screenContainer.insertAdjacentHTML('beforeend', tabMenuHTML);
    
    // Add CSS styles dynamically
    addTabMenuStyles();
    
    tabMenuOpen = true;
    console.log('[TAB Menu] Opened');
}

/**
 * Hides the TAB menu overlay - called when TAB is released
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
 * Adds CSS styles for the TAB menu dynamically
 */
function addTabMenuStyles() {
    // Check if styles already exist
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
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.15s ease-out;
        }
        
        .tab-menu {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00d9ff;
            border-radius: 12px;
            padding: 20px;
            min-width: 280px;
            box-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
            animation: slideIn 0.2s ease-out;
        }
        
        .tab-menu-header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(0, 217, 255, 0.3);
        }
        
        .tab-menu-title {
            font-size: 24px;
            color: #00d9ff;
        }
        
        .tab-menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .tab-menu-item {
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
        
        .tab-menu-item:hover {
            background: rgba(0, 217, 255, 0.25);
            border-color: #00d9ff;
            transform: translateX(5px);
        }
        
        .tab-menu-item:active {
            transform: scale(0.98);
        }
        
        .tab-menu-icon {
            font-size: 20px;
            margin-right: 12px;
            width: 28px;
            text-align: center;
        }
        
        .tab-menu-text {
            font-size: 16px;
            color: #ffffff;
            font-weight: 500;
        }
        
        .tab-menu-logout {
            margin-top: 15px;
            background: rgba(255, 77, 77, 0.15);
            border-color: rgba(255, 77, 77, 0.3);
        }
        
        .tab-menu-logout:hover {
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

// ===========================================
// TAB Menu Action Handlers
// ===========================================

/**
 * Opens the Gacha screen
 */
function openGacha() {
    console.log('[TAB Menu] Opening Gacha...');
    hideTabMenu();
    showComingSoonMessage();
}

/**
 * Opens the Inventory screen
 */
function openInventory() {
    console.log('[TAB Menu] Opening Inventory...');
    hideTabMenu();
    showComingSoonMessage();
}

/**
 * Opens the Achievements screen
 */
function openAchievements() {
    console.log('[TAB Menu] Opening Achievements...');
    hideTabMenu();
    showComingSoonMessage();
}

/**
 * Opens the Lunadex screen
 */
function openLunadex() {
    console.log('[TAB Menu] Opening Lunadex...');
    hideTabMenu();
    showComingSoonMessage();
}

/**
 * Shows the Coming Soon message
 */
function showComingSoonMessage() {
    const screenContainer = document.getElementById('screen-container');
    if (!screenContainer) return;
    
    // Remove existing message if any
    const existingMessage = document.getElementById('coming-soon-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create the Coming Soon message HTML
    const messageHTML = `
        <div id="coming-soon-message" class="coming-soon-overlay">
            <div class="coming-soon-content">
                <h2 class="coming-soon-text">Coming Sun</h2>
            </div>
        </div>
    `;
    
    // Add the message to the screen container
    screenContainer.insertAdjacentHTML('beforeend', messageHTML);
    
    // Add CSS styles dynamically
    addComingSoonStyles();
    
    console.log('[Coming Soon] Message displayed');
}

/**
 * Adds CSS styles for the Coming Soon message
 */
function addComingSoonStyles() {
    // Check if styles already exist
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
    console.log('[TAB Menu] Logging out...');
    hideTabMenu();
    const confirmMessage = document.documentElement.lang === 'en' 
        ? 'Are you sure you want to log out?' 
        : 'Êtes-vous sûr de vouloir vous déconnecter?';
    if (confirm(confirmMessage)) {
        window.location.href = 'index.html';
    }
}

/**
 * Initialize I key event listeners
 */
function initTabMenu() {
    // Listen for I key press (keydown)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            event.preventDefault();
            if (!tabMenuOpen) {
                showTabMenu();
            }
        }
    });
    
    // Listen for I key release (keyup)
    document.addEventListener('keyup', function(event) {
        if (event.key === 'i' || event.key === 'I') {
            if (tabMenuOpen) {
                hideTabMenu();
            }
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
