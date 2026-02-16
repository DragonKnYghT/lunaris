/**
 * gachaUI.js
 * Gacha system UI placeholders
 */

// LUNARIS_TODO: add full UI design and animations later

/**
 * Show the gacha menu screen
 * LUNARIS_TODO: implement full UI later
 */
function showGachaMenu() {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="gacha-menu-screen">
            <h2>Gacha</h2>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showBannerDetails('standard_banner')">Standard Banner</button>
                <button class="menu-button" onclick="showBannerDetails('starter_banner')">Starter Banner</button>
                <button class="menu-button" onclick="showBannerDetails('limited_banner')">Limited Banner</button>
                <button class="menu-button" onclick="showMainMenu()">Back</button>
            </div>
            <p>Select a banner to pull from!</p>
        </div>
    `;
    console.log('Gacha menu displayed');
}

/**
 * Show banner details
 * LUNARIS_TODO: implement full UI later
 * @param {string} bannerName - Banner name or ID
 */
function showBannerDetails(bannerName) {
    const container = document.getElementById('screen-container');
    container.innerHTML = `
        <div class="screen" id="banner-details-screen">
            <h2>${bannerName}</h2>
            <div class="banner-info">
                <p>Banner: ${bannerName}</p>
                <p>Rates: Common 70%, Rare 20%, Epic 8%, Legendary 2%</p>
            </div>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="testSinglePull('${bannerName}')">Single Pull (1 Ticket)</button>
                <button class="menu-button" onclick="testMultiPull('${bannerName}')">Multi Pull (10 Tickets)</button>
                <button class="menu-button" onclick="showGachaMenu()">Back</button>
            </div>
        </div>
    `;
    console.log('Banner details displayed:', bannerName);
}

/**
 * Show pull results
 * LUNARIS_TODO: add animations and visual effects later
 * @param {Object} results - Pull results
 */
function showPullResults(results) {
    const container = document.getElementById('screen-container');
    
    // Format results for display
    const resultsArray = Array.isArray(results) ? results : [results];
    const resultsHtml = resultsArray.map((r, i) => `
        <div class="pull-result">
            <p>Pull ${i + 1}: ${r.rarity} - ${r.creatureId}</p>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="screen" id="pull-results-screen">
            <h2>Pull Results</h2>
            <div class="results-container">
                ${resultsHtml}
            </div>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showGachaMenu()">Back to Gacha</button>
            </div>
        </div>
    `;
    console.log('Pull results displayed:', results);
}

/**
 * Test single pull (placeholder)
 * LUNARIS_TODO: implement actual pull logic
 * @param {string} bannerName - Banner name
 */
function testSinglePull(bannerName) {
    console.log('Testing single pull from:', bannerName);
    // LUNARIS_TODO: implement actual single pull
    alert('Single Pull - Coming soon!\nBanner: ' + bannerName);
}

/**
 * Test multi pull (placeholder)
 * LUNARIS_TODO: implement actual pull logic
 * @param {string} bannerName - Banner name
 */
function testMultiPull(bannerName) {
    console.log('Testing multi pull from:', bannerName);
    // LUNARIS_TODO: implement actual multi pull
    alert('Multi Pull - Coming soon!\nBanner: ' + bannerName);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        showGachaMenu, 
        showBannerDetails, 
        showPullResults,
        testSinglePull,
        testMultiPull
    };
}
