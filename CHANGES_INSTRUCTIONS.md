# Audio Settings - Exact Line Numbers and Code

## File: src/settings/audioSettings.js

### 1. Variables Controlling Volume:
- **SFX Volume**: Line 15 - `this.sfxVolume = 1.0;`
- **Music Volume**: Line 14 - `this.musicVolume = 0.8;`
- **Master Volume**: Line 13 - `this.masterVolume = 1.0;`
- **Ambient Volume**: Line 16 - `this.ambientVolume = 0.5;`

### 2. Methods to Set Volumes:
- **setSfxVolume(value)**: Lines 37-41 - Controls SFX volume
- **setMusicVolume(value)**: Lines 30-34 - Controls music volume
- **setMasterVolume(value)**: Lines 23-27 - Controls master volume

### 3. Where Audio Settings Are Applied:
- **applyAudioSettings()**: Lines 51-59 - This is where you connect to the actual audio engine

### 4. Mute/Unmute:
**NOTE: There is NO mute/unmute functionality currently implemented** in audioSettings.js. You would need to add it.

### 5. Where to Connect Toggle and Slider in main.js:
In the showSettingsMenu() function in main.js (around line 620), you would need to:
- Connect the "Toggle Sound" button to call audioSettings.setSfxVolume()
- Add a volume slider that calls audioSettings.setMusicVolume()

---

# Changes Applied to main.js

## Summary of Changes

### 1. In-Game Menu Buttons - Show "Coming Sun"

The following functions have been modified to call `showComingSoonMessage()` instead of showing alerts:

#### Function: openGacha()
- Lines around 1070-1075
- Replace the alert with showComingSoonMessage()

#### Function: openInventory()
- Lines around 1077-1082
- Replace the alert with showComingSoonMessage()

#### Function: openAchievements()
- Lines around 1084-1089
- Replace the alert with showComingSoonMessage()

#### Function: openLunadex()
- Lines around 1091-1096
- Replace the alert with showComingSoonMessage()

### 2. New showComingSoonMessage() Function

Add this new function after openLunadex() that displays "Coming Sun" with clean, centered, consistent styling.

### 3. Play Menu - Remove Gacha and Battle Test

In showPlayMenu() function (around line 570), ensure the game-mode-grid only contains Roguelike and Versus. Delete any Battle Test and Gacha cards.
