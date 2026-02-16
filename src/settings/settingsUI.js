/**
 * settingsUI.js
 * Manages the settings UI for the game
 */

// LUNARIS_TODO: add full UI design later

// Global settings instances
let audioSettings = null;
let videoSettings = null;
let languageSettings = null;
let accessibilitySettings = null;
let controlSettings = null;

/**
 * Initialize all settings
 */
function initSettings() {
    // Import settings classes
    const { AudioSettings } = require('./audioSettings.js');
    const { VideoSettings } = require('./videoSettings.js');
    const { LanguageSettings } = require('./languageSettings.js');
    const { AccessibilitySettings } = require('./accessibilitySettings.js');
    const { ControlSettings } = require('./controlSettings.js');
    
    // Create settings instances
    audioSettings = new AudioSettings();
    videoSettings = new VideoSettings();
    languageSettings = new LanguageSettings();
    accessibilitySettings = new AccessibilitySettings();
    controlSettings = new ControlSettings();
    
    console.log('[SettingsUI] All settings initialized');
}

/**
 * Show the main settings menu
 * LUNARIS_TODO: add full UI design later
 */
function showSettingsMenu() {
    const container = document.getElementById('screen-container');
    
    if (!container) {
        console.error('[SettingsUI] screen-container not found');
        return;
    }
    
    container.innerHTML = `
        <div class="screen" id="settings-menu-screen">
            <h2>Settings</h2>
            <div class="settings-menu">
                <div class="settings-section">
                    <button class="settings-button" onclick="showAudioSettings()">
                        <span class="settings-icon">🔊</span>
                        <span class="settings-label">Audio</span>
                    </button>
                    <button class="settings-button" onclick="showVideoSettings()">
                        <span class="settings-icon">🎮</span>
                        <span class="settings-label">Video</span>
                    </button>
                    <button class="settings-button" onclick="showLanguageSettings()">
                        <span class="settings-icon">🌐</span>
                        <span class="settings-label">Language</span>
                    </button>
                    <button class="settings-button" onclick="showAccessibilitySettings()">
                        <span class="settings-icon">♿</span>
                        <span class="settings-label">Accessibility</span>
                    </button>
                    <button class="settings-button" onclick="showControlSettings()">
                        <span class="settings-icon">⌨️</span>
                        <span class="settings-label">Controls</span>
                    </button>
                </div>
                <div class="settings-section">
                    <button class="menu-button back-button" onclick="showMainMenu()">
                        Back
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Initialize settings if not already done
    if (!audioSettings) {
        initSettings();
    }
    
    console.log('[SettingsUI] Settings menu displayed');
}

/**
 * Show audio settings
 * LUNARIS_TODO: add full UI design later
 */
function showAudioSettings() {
    const container = document.getElementById('screen-container');
    
    if (!container) {
        console.error('[SettingsUI] screen-container not found');
        return;
    }
    
    const settings = audioSettings ? audioSettings.getSettings() : { masterVolume: 1.0, musicVolume: 0.8, sfxVolume: 1.0 };
    
    container.innerHTML = `
        <div class="screen" id="audio-settings-screen">
            <h2>Audio Settings</h2>
            <div class="settings-form">
                <div class="setting-item">
                    <label for="master-volume">Master Volume: <span id="master-value">${Math.round(settings.masterVolume * 100)}%</span></label>
                    <input type="range" id="master-volume" min="0" max="100" value="${settings.masterVolume * 100}" 
                           oninput="updateAudioSetting('master', this.value)">
                </div>
                <div class="setting-item">
                    <label for="music-volume">Music Volume: <span id="music-value">${Math.round(settings.musicVolume * 100)}%</span></label>
                    <input type="range" id="music-volume" min="0" max="100" value="${settings.musicVolume * 100}" 
                           oninput="updateAudioSetting('music', this.value)">
                </div>
                <div class="setting-item">
                    <label for="sfx-volume">SFX Volume: <span id="sfx-value">${Math.round(settings.sfxVolume * 100)}%</span></label>
                    <input type="range" id="sfx-volume" min="0" max="100" value="${settings.sfxVolume * 100}" 
                           oninput="updateAudioSetting('sfx', this.value)">
                </div>
            </div>
            <div class="settings-buttons">
                <button class="menu-button" onclick="applyAudioSettings()">Apply</button>
                <button class="menu-button" onclick="showSettingsMenu()">Back</button>
            </div>
        </div>
    `;
    
    console.log('[SettingsUI] Audio settings displayed');
}

/**
 * Update audio setting from slider
 * @param {string} type - Setting type (master, music, sfx)
 * @param {number} value - Value (0-100)
 */
function updateAudioSetting(type, value) {
    const normalizedValue = value / 100;
    
    if (type === 'master') {
        audioSettings.setMasterVolume(normalizedValue);
    } else if (type === 'music') {
        audioSettings.setMusicVolume(normalizedValue);
    } else if (type === 'sfx') {
        audioSettings.setSfxVolume(normalizedValue);
    }
    
    // Update display
    const displayElement = document.getElementById(`${type}-value`);
    if (displayElement) {
        displayElement.textContent = `${value}%`;
    }
}

/**
 * Apply audio settings
 */
function applyAudioSettings() {
    if (audioSettings) {
        audioSettings.applyAudioSettings();
    }
    console.log('[SettingsUI] Audio settings applied');
}

/**
 * Show video settings
 * LUNARIS_TODO: add full UI design later
 */
function showVideoSettings() {
    const container = document.getElementById('screen-container');
    
    if (!container) {
        console.error('[SettingsUI] screen-container not found');
        return;
    }
    
    const settings = videoSettings ? videoSettings.getSettings() : { resolution: '1920x1080', fullscreen: false, animations: true };
    
    container.innerHTML = `
        <div class="screen" id="video-settings-screen">
            <h2>Video Settings</h2>
            <div class="settings-form">
                <div class="setting-item">
                    <label for="resolution">Resolution</label>
                    <select id="resolution" onchange="updateVideoSetting('resolution', this.value)">
                        <option value="1920x1080" ${settings.resolution === '1920x1080' ? 'selected' : ''}>1920x1080</option>
                        <option value="1280x720" ${settings.resolution === '1280x720' ? 'selected' : ''}>1280x720</option>
                        <option value="2560x1440" ${settings.resolution === '2560x1440' ? 'selected' : ''}>2560x1440</option>
                        <option value="windowed" ${settings.resolution === 'windowed' ? 'selected' : ''}>Windowed</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="fullscreen" ${settings.fullscreen ? 'checked' : ''} 
                               onchange="updateVideoSetting('fullscreen', this.checked)">
                        Fullscreen
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="animations" ${settings.animations ? 'checked' : ''} 
                               onchange="updateVideoSetting('animations', this.checked)">
                        Enable Animations
                    </label>
                </div>
            </div>
            <div class="settings-buttons">
                <button class="menu-button" onclick="applyVideoSettings()">Apply</button>
                <button class="menu-button" onclick="showSettingsMenu()">Back</button>
            </div>
        </div>
    `;
    
    console.log('[SettingsUI] Video settings displayed');
}

/**
 * Update video setting
 * @param {string} setting - Setting name
 * @param {*} value - Setting value
 */
function updateVideoSetting(setting, value) {
    if (!videoSettings) return;
    
    if (setting === 'resolution') {
        videoSettings.setResolution(value);
    } else if (setting === 'fullscreen') {
        videoSettings.setFullscreen(value);
    } else if (setting === 'animations') {
        videoSettings.setAnimations(value);
    }
}

/**
 * Apply video settings
 */
function applyVideoSettings() {
    if (videoSettings) {
        videoSettings.applyVideoSettings();
    }
    console.log('[SettingsUI] Video settings applied');
}

/**
 * Show language settings
 * LUNARIS_TODO: add full UI design later
 */
function showLanguageSettings() {
    const container = document.getElementById('screen-container');
    
    if (!container) {
        console.error('[SettingsUI] screen-container not found');
        return;
    }
    
    const languages = languageSettings ? languageSettings.getAvailableLanguages() : [{ code: 'en', name: 'English' }];
    const currentLang = languageSettings ? languageSettings.getLanguage() : 'en';
    
    let optionsHtml = languages.map(lang => 
        `<option value="${lang.code}" ${lang.code === currentLang ? 'selected' : ''}>${lang.name}</option>`
    ).join('');
    
    container.innerHTML = `
        <div class="screen" id="language-settings-screen">
            <h2>Language Settings</h2>
            <div class="settings-form">
                <div class="setting-item">
                    <label for="language">Language</label>
                    <select id="language" onchange="updateLanguageSetting(this.value)">
                        ${optionsHtml}
                    </select>
                </div>
            </div>
            <div class="settings-buttons">
                <button class="menu-button" onclick="applyLanguageSettings()">Apply</button>
                <button class="menu-button" onclick="showSettingsMenu()">Back</button>
            </div>
        </div>
    `;
    
    console.log('[SettingsUI] Language settings displayed');
}

/**
 * Update language setting
 * @param {string} langCode - Language code
 */
function updateLanguageSetting(langCode) {
    if (languageSettings) {
        languageSettings.setLanguage(langCode);
    }
}

/**
 * Apply language settings
 */
function applyLanguageSettings() {
    if (languageSettings) {
        languageSettings.applyLanguage();
    }
    console.log('[SettingsUI] Language settings applied');
}

/**
 * Show accessibility settings
 * LUNARIS_TODO: add full UI design later
 */
function showAccessibilitySettings() {
    const container = document.getElementById('screen-container');
    
    if (!container) {
        console.error('[SettingsUI] screen-container not found');
        return;
    }
    
    const settings = accessibilitySettings ? accessibilitySettings.getSettings() : {
        colorblindMode: false,
        textSize: 'medium',
        highContrast: false,
        reducedMotion: false
    };
    
    container.innerHTML = `
        <div class="screen" id="accessibility-settings-screen">
            <h2>Accessibility Settings</h2>
            <div class="settings-form">
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="colorblind-mode" ${settings.colorblindMode ? 'checked' : ''} 
                               onchange="updateAccessibilitySetting('colorblindMode', this.checked)">
                        Colorblind Mode
                    </label>
                </div>
                <div class="setting-item">
                    <label for="text-size">Text Size</label>
                    <select id="text-size" onchange="updateAccessibilitySetting('textSize', this.value)">
                        <option value="small" ${settings.textSize === 'small' ? 'selected' : ''}>Small</option>
                        <option value="medium" ${settings.textSize === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="large" ${settings.textSize === 'large' ? 'selected' : ''}>Large</option>
                        <option value="extra-large" ${settings.textSize === 'extra-large' ? 'selected' : ''}>Extra Large</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="high-contrast" ${settings.highContrast ? 'checked' : ''} 
                               onchange="updateAccessibilitySetting('highContrast', this.checked)">
                        High Contrast
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" id="reduced-motion" ${settings.reducedMotion ? 'checked' : ''} 
                               onchange="updateAccessibilitySetting('reducedMotion', this.checked)">
                        Reduced Motion
                    </label>
                </div>
            </div>
            <div class="settings-buttons">
                <button class="menu-button" onclick="applyAccessibilitySettings()">Apply</button>
                <button class="menu-button" onclick="showSettingsMenu()">Back</button>
            </div>
        </div>
    `;
    
    console.log('[SettingsUI] Accessibility settings displayed');
}

/**
 * Update accessibility setting
 * @param {string} setting - Setting name
 * @param {*} value - Setting value
 */
function updateAccessibilitySetting(setting, value) {
    if (!accessibilitySettings) return;
    
    if (setting === 'colorblindMode') {
        accessibilitySettings.setColorblindMode(value);
    } else if (setting === 'textSize') {
        accessibilitySettings.setTextSize(value);
    } else if (setting === 'highContrast') {
        accessibilitySettings.setHighContrast(value);
    } else if (setting === 'reducedMotion') {
        accessibilitySettings.setReducedMotion(value);
    }
}

/**
 * Apply accessibility settings
 */
function applyAccessibilitySettings() {
    if (accessibilitySettings) {
        accessibilitySettings.applyAccessibility();
    }
    console.log('[SettingsUI] Accessibility settings applied');
}

/**
 * Show control settings
 * LUNARIS_TODO: add full UI design later
 */
function showControlSettings() {
    const container = document.getElementById('screen-container');
    
    if (!container) {
        console.error('[SettingsUI] screen-container not found');
        return;
    }
    
    const keybinds = controlSettings ? controlSettings.getAllKeybinds() : {};
    
    let keybindHtml = Object.entries(keybinds).map(([action, key]) => `
        <div class="keybind-item">
            <span class="keybind-action">${action}</span>
            <span class="keybind-key">${key}</span>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div class="screen" id="control-settings-screen">
            <h2>Control Settings</h2>
            <div class="settings-form">
                <div class="keybinds-list">
                    ${keybindHtml}
                </div>
            </div>
            <div class="settings-buttons">
                <button class="menu-button" onclick="resetControlSettings()">Reset to Default</button>
                <button class="menu-button" onclick="applyControlSettings()">Apply</button>
                <button class="menu-button" onclick="showSettingsMenu()">Back</button>
            </div>
        </div>
    `;
    
    console.log('[SettingsUI] Control settings displayed');
}

/**
 * Update control setting
 * @param {string} action - Action name
 * @param {string} key - Key code
 */
function updateControlSetting(action, key) {
    if (controlSettings) {
        controlSettings.setKeybind(action, key);
    }
}

/**
 * Reset control settings to default
 */
function resetControlSettings() {
    if (controlSettings) {
        controlSettings.resetToDefault();
        showControlSettings(); // Refresh UI
    }
    console.log('[SettingsUI] Control settings reset to default');
}

/**
 * Apply control settings
 */
function applyControlSettings() {
    if (controlSettings) {
        controlSettings.applyControls();
    }
    console.log('[SettingsUI] Control settings applied');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initSettings,
        showSettingsMenu,
        showAudioSettings,
        showVideoSettings,
        showLanguageSettings,
        showAccessibilitySettings,
        showControlSettings
    };
}
