# TODO - FR/EN Language Support Implementation

## Task 1 — Add FR/EN Language Support

### Step 1: Create Translation Files
- [x] Create `data/translations/` directory
- [x] Create `data/translations/en.json` with all English translations
- [x] Create `data/translations/fr.json` with all French translations

### Step 2: Create Translation Manager
- [ ] Create `src/settings/translationManager.js` to handle loading and applying translations

### Step 3: Update LanguageSettings
- [ ] Modify `src/settings/languageSettings.js` to integrate with TranslationManager
- [ ] Change default language from 'en' to 'fr'
- [ ] Add methods to apply translations to website and game UI

### Step 4: Add Language Switch Button
- [ ] Add language switch button to all HTML pages in the navigation (next to Credits)
- [ ] Add CSS styling for the language switch button

### Step 5: Update main.js
- [ ] Update game UI text to use translation system

### Step 6: Update navigation.js
- [ ] Add language switch functionality for the website
