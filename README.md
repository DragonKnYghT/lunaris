# Lunaris

A modular creature-battling roguelike game.

## Description

Lunaris is a roguelike creature-battling game inspired by games like Pokerogue. It features multiple game modes, a modular combat system, creature collection, and more.

## Features

- Multiple game modes (roguelike, nuzlocke, multiplayer, versus)
- Modular combat system
- Modular creature system (types, stats, abilities, evolutions)
- Modular move system
- Modular item system
- Ticket system
- Gacha system
- Zone/biome system
- Clean UI and menu structure
- GitHub Pages compatible

## Project Structure

```
/lunaris
  index.html      - Main HTML entry point
  style.css      - Base stylesheet
  main.js        - Main JavaScript entry point
  /src           - Source code (game engine, systems, UI)
  /data          - Game data (creatures, moves, items, zones, modes)
  /assets        - Game assets (images, audio, fonts)
  README.md      - This file
```

## How to Run Locally

### Option 1: Simple HTTP Server

You can use Python's built-in HTTP server:

```
bash
# Python 3
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Option 2: VS Code Live Server

If you're using VS Code, install the "Live Server" extension and click "Go Live" at the bottom right.

### Option 3: Node.js http-server

```
bash
# Install http-server globally
npm install -g http-server

# Run from project directory
http-server .
```

## How to Deploy on GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the repository
3. Go to Settings > Pages
4. Select the "main" branch as the source
5. Save and wait for deployment

Your game will be available at `https://yourusername.github.io/repository-name/`

## Customization

### Adding Creatures

Edit `data/creatures.json` and add creature definitions:

```
json
{
  "id": "creature_001",
  "name": "Example Creature",
  "type": ["fire"],
  "stats": {
    "hp": 100,
    "attack": 80,
    "defense": 80,
    "spAtk": 100,
    "spDef": 80,
    "speed": 100
  },
  "abilities": ["ability_1"],
  "moves": ["move_1", "move_2"]
}
```

### Adding Moves

Edit `data/moves.json` and add move definitions:

```
json
{
  "id": "move_001",
  "name": "Flame Burst",
  "type": "fire",
  "power": 80,
  "accuracy": 100,
  "pp": 15,
  "effect": "May burn the target"
}
```

### Adding Zones

Edit `data/zones.json` and add zone definitions:

```
json
{
  "id": "zone_001",
  "name": "Fire Forest",
  "description": "A forest filled with fire-type creatures",
  "encounterRates": {
    "common": 60,
    "uncommon": 30,
    "rare": 10
  },
  "availableCreatures": ["creature_001", "creature_002"]
}
```

### Adding Game Modes

Edit `data/modes.json` and add game mode definitions:

```
json
{
  "id": "mode_001",
  "name": "Roguelike",
  "description": "Endless mode with stacking items",
  "rules": {
    "dailyRun": false,
    "endless": true,
    "stackItems": true
  },
  "isEnabled": true
}
```

## Development

### LUNARIS_TODO: Future Development

- [ ] Implement game engine
- [ ] Implement combat system
- [ ] Implement creature system
- [ ] Implement move system
- [ ] Implement item system
- [ ] Implement ticket system
- [ ] Implement gacha system
- [ ] Implement zone/biome system
- [ ] Add multiplayer support
- [ ] Add versus mode
- [ ] Optimize for mobile devices
- [ ] Add sound and music
- [ ] Add animations

## License

This project is for educational purposes. All game assets and content belong to their respective owners.

## Acknowledgments

Inspired by Pokerogue and the Pokémon franchise.
