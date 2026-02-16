/**
 * versusUI.js
 * Manages versus mode UI in Lunaris
 */

// LUNARIS_TODO: add full UI design later

/**
 * Show the versus menu
 */
function showVersusMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="versus-menu-screen">
            <h2>Versus Mode</h2>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showRulesetSelection()">Battle</button>
                <button class="menu-button" onclick="showTeamBuilder()">Team Builder</button>
                <button class="menu-button" onclick="showMainMenu()">Back</button>
            </div>
            <p>Challenge other players in head-to-head battles!</p>
            <!-- LUNARIS_TODO: Add lobby browser and ranked options -->
        </div>
    `;
    console.log('Versus menu displayed');
}

/**
 * Show team builder for versus mode
 */
function showTeamBuilder() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="team-builder-screen">
            <h2>Team Builder</h2>
            <div class="team-slots" id="team-slots">
                <div class="team-slot">Slot 1: Empty</div>
                <div class="team-slot">Slot 2: Empty</div>
                <div class="team-slot">Slot 3: Empty</div>
                <div class="team-slot">Slot 4: Empty</div>
                <div class="team-slot">Slot 5: Empty</div>
                <div class="team-slot">Slot 6: Empty</div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showCreatureSelection()">Add Creature</button>
                <button class="menu-button" onclick="clearTeam()">Clear Team</button>
                <button class="menu-button" onclick="showVersusMenu()">Back</button>
            </div>
            <!-- LUNARIS_TODO: Add creature selection UI -->
        </div>
    `;
    console.log('Team builder displayed');
}

/**
 * Show ruleset selection
 */
function showRulesetSelection() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="ruleset-selection-screen">
            <h2>Select Ruleset</h2>
            <div class="ruleset-list" id="ruleset-list">
                <div class="ruleset-option" onclick="selectRuleset('standard')">
                    <h3>Standard</h3>
                    <p>Standard versus rules</p>
                </div>
                <div class="ruleset-option" onclick="selectRuleset('no_legendaries')">
                    <h3>No Legendaries</h3>
                    <p>No legendary creatures allowed</p>
                </div>
                <div class="ruleset-option" onclick="selectRuleset('balanced_level_50')">
                    <h3>Balanced Level 50</h3>
                    <p>Level 50 balanced format</p>
                </div>
                <div class="ruleset-option" onclick="selectRuleset('monotype')">
                    <h3>Monotype</h3>
                    <p>All creatures must share a type</p>
                </div>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showVersusMenu()">Back</button>
            </div>
            <!-- LUNARIS_TODO: Add more rulesets -->
        </div>
    `;
    console.log('Ruleset selection displayed');
}

/**
 * Show match screen
 */
function showMatchScreen() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="match-screen">
            <h2>Versus Match</h2>
            <div class="match-arena">
                <div class="player-area" id="player-area">
                    <h3>Your Team</h3>
                    <div class="active-creature">
                        <p>Creature: Example Creature</p>
                        <p>HP: 100/100</p>
                        <p>Level: 50</p>
                    </div>
                </div>
                <div class="vs-indicator">VS</div>
                <div class="enemy-area" id="enemy-area">
                    <h3>Opponent</h3>
                    <div class="active-creature">
                        <p>Creature: Example Creature</p>
                        <p>HP: 100/100</p>
                        <p>Level: 50</p>
                    </div>
                </div>
            </div>
            <div class="battle-controls">
                <button class="menu-button" onclick="showMoveSelection()">Fight</button>
                <button class="menu-button" onclick="showSwitchMenu()">Switch</button>
                <button class="menu-button" onclick="showItemMenu()">Item</button>
                <button class="menu-button" onclick="showRunOption()">Run</button>
            </div>
            <div class="battle-log" id="battle-log">
                <p>A wild battle begins!</p>
            </div>
            <!-- LUNARIS_TODO: Add full battle UI -->
        </div>
    `;
    console.log('Match screen displayed');
}

/**
 * Show move selection
 */
function showMoveSelection() {
    console.log('Move selection displayed');
    // LUNARIS_TODO: Implement move selection UI
    alert('Move selection - Coming soon!');
}

/**
 * Show switch menu
 */
function showSwitchMenu() {
    console.log('Switch menu displayed');
    // LUNARIS_TODO: Implement switch menu UI
    alert('Switch menu - Coming soon!');
}

/**
 * Show item menu
 */
function showItemMenu() {
    console.log('Item menu displayed');
    // LUNARIS_TODO: Implement item menu UI
    alert('Item menu - Coming soon!');
}

/**
 * Show run option
 */
function showRunOption() {
    console.log('Run option displayed');
    // LUNARIS_TODO: Implement run option
    alert('Cannot run from versus battles!');
}

/**
 * Show creature selection for team builder
 */
function showCreatureSelection() {
    console.log('Creature selection displayed');
    // LUNARIS_TODO: Implement creature selection UI
    alert('Creature selection - Coming soon!');
}

/**
 * Clear team in team builder
 */
function clearTeam() {
    console.log('Team cleared');
    // LUNARIS_TODO: Implement team clearing
    showTeamBuilder();
}

/**
 * Select a ruleset
 * @param {string} ruleset - Ruleset name
 */
function selectRuleset(ruleset) {
    console.log('Ruleset selected:', ruleset);
    // LUNARIS_TODO: Implement ruleset selection
    alert(`Ruleset: ${ruleset} - Coming soon!`);
}

/**
 * Show match result
 * @param {Object} result - Match result
 */
function showMatchResult(result) {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="match-result-screen">
            <h2>${result.winner ? 'Victory!' : 'Defeat!'}</h2>
            <p>${result.winner ? 'You won the match!' : 'You lost the match!'}</p>
            <div class="match-stats">
                <p>Rounds: ${result.rounds || 1}</p>
                <p>Time: ${result.time || '0:00'}</p>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showVersusMenu()">Continue</button>
                <button class="menu-button" onclick="showMatchScreen()">Rematch</button>
            </div>
        </div>
    `;
    console.log('Match result displayed');
}

/**
 * Show loading screen for matchmaking
 */
function showMatchmaking() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="matchmaking-screen">
            <h2>Searching for Opponent...</h2>
            <div class="loading-animation">
                <div class="spinner"></div>
            </div>
            <p>Please wait while we find an opponent for you.</p>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="cancelMatchmaking()">Cancel</button>
            </div>
        </div>
    `;
    console.log('Matchmaking displayed');
}

/**
 * Cancel matchmaking
 */
function cancelMatchmaking() {
    console.log('Matchmaking cancelled');
    showVersusMenu();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showVersusMenu,
        showTeamBuilder,
        showRulesetSelection,
        showMatchScreen,
        showMatchResult
    };
}
