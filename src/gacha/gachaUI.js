/**
 * gachaUI.js
 * Gacha system UI with banner details and statistics
 */

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
        }
    },
    'ultimate_draw': {
        name: 'Tirage Ultime',
        description: 'Tirage premium avec chances élevées pour créatures puissantes',
        rates: {
            common: 0,
            rare: 20,
            epic: 30,
            legendary: 35,
            ultimate: 14,
            limited: 1
        }
    },
    'limited_draw': {
        name: 'Tirage Limité',
        description: 'Bannière exclusive avec créatures uniques',
        rates: {
            common: 0,
            rare: 20,
            epic: 25,
            legendary: 35,
            ultimate: 19.9,
            limited: 0.1
        }
    }
};

/**
 * Colors for rarity display
 */
const rarityColors = {
    common: '#808080',      // Gray
    rare: '#4169E1',        // Royal Blue
    epic: '#9932CC',        // Dark Orchid
    legendary: '#FFD700',   // Gold
    ultimate: '#FF1493',    // Deep Pink
    limited: '#00CED1'      // Dark Turquoise
};

/**
 * Show the gacha menu screen with all 4 banners
 */
function showGachaMenu() {
    const container = document.getElementById('screen-container');
    
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
                    <button class="menu-button" onclick="testSinglePull('${bannerId}')">
                        <span class="pull-single">Single Pull</span>
                        <span class="pull-cost">(100)</span>
                    </button>
                    <button class="menu-button" onclick="testMultiPull('${bannerId}')">
                        <span class="pull-multi">Multi Pull x10</span>
                        <span class="pull-cost">(1000)</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="screen" id="gacha-menu-screen">
            <h2>Système de Gacha</h2>
            <p class="gacha-intro">Sélectionnez une bannière pour faire un tirage</p>
            <div class="banners-grid">
                ${bannerCards}
            </div>
            <div class="submenu-buttons" style="margin-top: var(--spacing-lg)">
                <button class="menu-button" onclick="showMainMenu()">Retour</button>
            </div>
        </div>
    `;
    console.log('Gacha menu displayed with all banners');
}

/**
 * Show banner details (legacy - now merged into main menu)
 * @param {string} bannerName - Banner ID
 */
function showBannerDetails(bannerName) {
    // Now just go to gacha menu as all details are shown there
    showGachaMenu();
}

/**
 * Show pull results
 * @param {Object} results - Pull results
 */
function showPullResults(results) {
    const container = document.getElementById('screen-container');
    
    // Format results for display
    const resultsArray = Array.isArray(results) ? results : [results];
    const resultsHtml = resultsArray.map((r, i) => `
        <div class="pull-result" style="border-left: 4px solid ${rarityColors[r.rarity] || '#808080'}">
            <p><strong>Tirage ${i + 1}:</strong> <span style="color: ${rarityColors[r.rarity]}">${r.rarity.toUpperCase()}</span> - ${r.creatureId}</p>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="screen" id="pull-results-screen">
            <h2>Résultats du Tirage</h2>
            <div class="results-container">
                ${resultsHtml}
            </div>
            <div class="submenu-buttons">
                <button class="menu-button" onclick="showGachaMenu()">Retour au Gacha</button>
                <button class="menu-button" onclick="showMainMenu()">Menu Principal</button>
            </div>
        </div>
    `;
    console.log('Pull results displayed:', results);
}

/**
 * Test single pull
 * @param {string} bannerName - Banner ID
 */
function testSinglePull(bannerName) {
    console.log('Testing single pull from:', bannerName);
    const banner = bannerData[bannerName];
    alert(`Single Pull - ${banner.name}\n\nComing soon!`);
}

/**
 * Test multi pull
 * @param {string} bannerName - Banner ID
 */
function testMultiPull(bannerName) {
    console.log('Testing multi pull from:', bannerName);
    const banner = bannerData[bannerName];
    alert(`Multi Pull x10 - ${banner.name}\n\nComing soon!`);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        showGachaMenu, 
        showBannerDetails, 
        showPullResults,
        testSinglePull,
        testMultiPull,
        bannerData,
        rarityColors
    };
}
