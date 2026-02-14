# Lunaris

A roguelike creature-battling game inspired by PokéRogue.

## Description

Lunaris is a roguelike creature-battling game where you battle endlessly while gathering stacking items, exploring many different biomes, and reaching creature stats you never thought possible.

## Features

- Endless waves of battles
- Daily challenge mode
- Custom creatures, moves, and zones
- Multiple game modes
- Customizable rules (legendaries, hidden abilities, level caps)

## How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev
```

The game will be available at `http://localhost:8080` (or another port if 8080 is in use).

### Build for Production

```
bash
# Build the project
pnpm run build
```

The built files will be in the `dist` directory.

## Deployment

### GitHub Pages

1. Build the project: `pnpm run build`
2. Go to your repository settings on GitHub
3. Navigate to "Pages" section
4. Set source to "Deploy from a branch"
5. Select `gh-pages` branch and `/ (root)` folder
6. Click Save

Your game will be available at `https://yourusername.github.io/repository-name/`

## Customization

Lunaris is designed to be easily customizable. You can modify the following:

### Creatures

- File: `data/creatures.json`
- Documentation: `data/creatures_README.md`
- Source: `src/data/pokemon-species.ts`

### Moves

- File: `data/moves.json`
- Documentation: `data/moves_README.md`
- Source: `src/data/moves/`

### Zones/Biomes

- File: `data/zones.json`
- Documentation: `data/zones_README.md`
- Source: `src/data/`

### Game Modes

- File: `data/modes.json`
- Documentation: `data/modes_README.md`
- Source: `src/game-mode.ts`

## Development

### Project Structure

```
lunaris/
├── src/               # Source code
│   ├── data/         # Game data (creatures, moves, etc.)
│   ├── plugins/      # Plugins (i18n, API, etc.)
│   ├── ui/           # UI components
│   └── ...
├── data/              # Customization JSON files
├── assets/           # Game assets (submodule)
├── locales/          # Translation files (submodule)
└── ...
```

### Adding Custom Content

1. Edit the appropriate JSON file in `data/`
2. Follow the documentation in the corresponding `data/*_README.md` file
3. Look for `LUNARIS_TODO` comments in the source code for integration points

### LUNARIS_TODO: Add new features

- Implement versus mode (PVP)
- Add multiplayer support
- Create custom evolution rules
- Add new biomes

## Credits

This project is based on [PokéRogue](https://github.com/pagefaultgames/pokerogue).

## License

See LICENSE file for details.
