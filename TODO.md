# TODO - Restore Theme System to Previous Working State - COMPLETED

## Task: Remove new theme dropdown and restore old Day/Night toggle button

### Files Edited:

1. **index.html** ✅
   - [x] Remove the new theme dropdown (`<div class="theme-selector">` with `<select id="theme-select">`)
   - [x] Add back the old theme button (`<button class="theme-switch" id="themeSwitch">`)

2. **assets/js/siteManager.js** ✅
   - [x] Remove the 20 themes array (themes list)
   - [x] Remove the themeColors object
   - [x] Remove the `populateThemeDropdown()` function reference
   - [x] Remove the theme selector dropdown event listener code
   - [x] Keep the Day/Night toggle functionality (`toggleTheme`, `applyTheme` with dark/light mode)
   - [x] Initialize `currentThemeMode` to 'dark' for default

### Summary:
- ✅ Removed the buggy theme dropdown from index.html
- ✅ Restored the theme switch button (Day/Night toggle) in index.html
- ✅ Simplified siteManager.js to only handle Day/Night toggle (no dropdown)
- ✅ Kept the simple dark/light mode system that was working before
- ✅ Other HTML pages (play.html, howto.html, about.html, etc.) already use the old theme button - no changes needed

### Files Kept As Backup:
- **src/ui/themeManager.new.js** - The 20-theme backup code is kept for future use but not active

### Codebase Status:
- Clean and stable - only active features remain
- No old/unused code fragments causing conflicts
- Day/Night toggle works in both website header and in-game settings
