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
