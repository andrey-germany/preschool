# ABC Lernspiele - Folder Structure

**Date**: 2025-12-11
**Status**: ✅ Reorganized and committed to GitHub

---

## Complete Project Structure

```
ABC/
├── index.html                          # Main dashboard (entry point)
├── .git/                               # Git repository
├── .claude/                            # Claude Code settings
│
├── 📁 games/                           # All 11 game files
│   ├── alphabet-game.html              # Game 1: Alphabet practice
│   ├── word-guess.html                 # Game 2: Word completion
│   ├── sound-recognition.html          # Game 3: Letter sounds
│   ├── pattern-recognition.html        # Game 4: Pattern matching
│   ├── story-builder.html              # Game 5: Story creation
│   ├── color-sorting.html              # Game 2.1: Color sorting
│   ├── rhyme-memory.html               # Game 2.2: Rhyming pairs
│   ├── sequence-builder.html           # Game 2.3: Seriation
│   ├── syllable-clapper.html           # Game 2.4: Syllable counting
│   ├── shape-explorer.html             # Game 2.5: Shape recognition
│   └── counting-adventure.html         # Game 2.6: Counting
│
├── 📁 lib/                             # Core JavaScript utilities
│   ├── config.js                       # Game definitions & achievements
│   ├── games.js                        # SessionTimer class + utilities
│   ├── storage.js                      # localStorage management
│   ├── multiplayer.js                  # Multiplayer session handling
│   └── supabase-client.js              # Supabase backend client
│
├── 📁 docs/                            # Documentation & guides
│   ├── README.md                       # Project overview
│   ├── START_HERE.md                   # Quick start guide
│   ├── QUICK_START.md                  # Setup instructions
│   ├── PROJECT_STATUS.md               # Complete project status
│   ├── SESSION_COMPLETE.md             # Latest session summary
│   ├── PEDAGOGY_RESEARCH.md            # Learning science research
│   ├── FEATURE_BUCKET.md               # Future features roadmap
│   ├── FEATURES.md                     # Feature specifications
│   ├── IMPLEMENTATION_COMPLETED.md     # Implementation details
│   ├── IMPLEMENTATION_SUMMARY.md       # Summary of changes
│   ├── GAME_PLANNING.md                # Game design documents
│   ├── CONVERSATION_SUMMARY.md         # Conversation history
│   ├── SUPABASE_SETUP.md               # Backend setup guide
│   ├── README_NEW_FILES.md             # New files summary
│   └── claude.md                       # Git workflow guidelines
│
├── 📁 assets/                          # Media & resource files
│   ├── 📁 icons/                       # Icon assets (prepared, empty)
│   │   └── (ready for .svg, .png files)
│   │
│   └── 📁 sounds/                      # Audio assets (prepared, empty)
│       └── (ready for .mp3, .wav files)
│
└── 📁 .claude/                         # Claude Code configuration
    └── (settings, hooks, commands)

```

---

## File Organization by Purpose

### 🎮 **Games** (`/games`)
All 11 interactive learning games (HTML + embedded JavaScript)

| File | Game | Icon | Focus |
|------|------|------|-------|
| alphabet-game.html | Alphabet Übung | 🔤 | Letter recognition |
| word-guess.html | Wortratespiel | 📝 | Word completion |
| sound-recognition.html | Laut-Gehör Spiel | 🎵 | Sound recognition |
| pattern-recognition.html | Muster Erkennungs | 🧩 | Pattern matching |
| story-builder.html | Geschichte Schreiben | 📖 | Story creation |
| color-sorting.html | Farb-Sortier Spiel | 🎨 | Color sorting |
| rhyme-memory.html | Reim-Memory Spiel | 🎵 | Rhyming pairs |
| sequence-builder.html | Sequenz-Builder | 📊 | Seriation |
| syllable-clapper.html | Silben-Klatscher | 👏 | Syllables |
| shape-explorer.html | Form-Explorer | 🔷 | Shapes |
| counting-adventure.html | Zähl-Abenteuer | 🔢 | Counting |

### 🔧 **Libraries** (`/lib`)
Core JavaScript modules for shared functionality

| File | Purpose | Exports |
|------|---------|---------|
| config.js | Game & achievement definitions | GAMES, ACHIEVEMENTS |
| games.js | SessionTimer, utilities | SessionTimer, triggerReward, shuffle, confetti |
| storage.js | localStorage management | StorageManager class |
| multiplayer.js | Multiplayer sessions | MultiplayerManager class |
| supabase-client.js | Backend client | Supabase initialization |

### 📚 **Documentation** (`/docs`)
15 markdown files documenting all aspects of the project

| File | Purpose |
|------|---------|
| README.md | Main project overview |
| START_HERE.md | First-time setup guide |
| PROJECT_STATUS.md | Complete platform status |
| SESSION_COMPLETE.md | Latest session summary |
| PEDAGOGY_RESEARCH.md | Learning science foundations |
| FEATURE_BUCKET.md | Future features & roadmap |
| IMPLEMENTATION_COMPLETED.md | Feature specifications |
| claude.md | Git workflow & commit guidelines |

### 🎨 **Assets** (`/assets`)
Prepared directories for media files (currently empty)

- `/assets/icons/` - For icon files (.svg, .png)
- `/assets/sounds/` - For audio files (.mp3, .wav)

---

## Import Structure

### From index.html (Dashboard)
```javascript
import StorageManager from './lib/storage.js';
import MultiplayerManager from './lib/multiplayer.js';
import { GAMES, ACHIEVEMENTS } from './lib/config.js';
```

### From Game Files (e.g., games/alphabet-game.html)
```javascript
import { triggerReward, SessionTimer, addConfettiStyles } from '../lib/games.js';
import { GAMES } from '../lib/config.js';
```

### From JavaScript Modules
```javascript
// In config.js, games.js, storage.js
export const GAMES = { ... };
export class SessionTimer { ... };
export class StorageManager { ... };
```

---

## Key Benefits of This Structure

### ✅ **Organization**
- Games grouped together (easy to browse)
- Libraries separated from presentation (clean architecture)
- Documentation isolated but accessible
- Assets ready for future expansion

### ✅ **Scalability**
- Add new games: Drop `.html` file in `/games` + update config.js
- Add new utilities: Create file in `/lib`, export functions
- Add documentation: Create `.md` file in `/docs`
- Add media: Upload to `/assets/icons` or `/assets/sounds`

### ✅ **Maintainability**
- Easier to find files (organized by function)
- Import paths are clear and consistent
- No root clutter (only index.html at top level)
- Git history shows logical changes (refactored, not deleted)

### ✅ **Developer Experience**
- Intuitive structure for new developers
- Easy to extend with new features
- Documentation co-located with code (in `/docs`)
- Assets ready for immediate use

---

## Path Reference Guide

### When you're in...

**Root directory** (`index.html`):
```javascript
'./lib/config.js'        // Import from lib
'./games/alphabet-game.html'  // Link to game
```

**Game file** (`games/*.html`):
```javascript
'../lib/config.js'       // Up one level, then into lib
'../lib/games.js'        // SessionTimer from lib
```

**Config file** (`lib/config.js`):
```javascript
export const GAMES = {
  alphabet: {
    path: 'games/alphabet-game.html'  // From root perspective
  }
}
```

---

## File Statistics

| Category | Count | Notes |
|----------|-------|-------|
| Games | 11 | All implemented & working |
| Core Libraries | 5 | config, games, storage, multiplayer, supabase |
| Documentation | 15 | Comprehensive guides & specs |
| Asset Dirs | 2 | icons, sounds (empty, ready) |
| **Total** | **~35 files** | Organized & scalable |

---

## Recent Reorganization Commit

```
Commit: 55949bc
Type: refactor: reorganize project folder structure

Changes:
- Moved 11 games to /games
- Moved 5 libraries to /lib
- Moved 15 docs to /docs
- Created /assets/icons and /assets/sounds
- Updated all import paths in 12 files
- Updated config.js paths for new game locations

Impact:
- Cleaner root directory
- Better scalability
- Improved maintainability
- No functionality changed
```

---

## How to Navigate

### For Game Developers
1. Look in `/games/` for existing games
2. Reference `/lib/config.js` for game definitions
3. Check `/lib/games.js` for SessionTimer & utilities
4. Copy existing game template from `/games/`

### For Backend/Integration
1. See `/lib/supabase-client.js` for backend setup
2. Read `/docs/SUPABASE_SETUP.md` for backend guide
3. Check `/lib/storage.js` for data persistence

### For Learning Outcomes
1. Read `/docs/PEDAGOGY_RESEARCH.md` for learning science
2. Check `/docs/PROJECT_STATUS.md` for game descriptions
3. Review `/docs/FEATURE_BUCKET.md` for future plans

### For Documentation
1. Start with `/docs/START_HERE.md`
2. Browse `/docs/` for specific guides
3. Check `/docs/claude.md` for git workflow

---

## Next Steps

1. **Add Icon Assets**: Place `.svg` or `.png` files in `/assets/icons/`
2. **Add Sound Files**: Place `.mp3` or `.wav` files in `/assets/sounds/`
3. **Create New Games**: Add `.html` to `/games/`, update config.js
4. **Expand Documentation**: Add guides to `/docs/` as needed

---

**Generated**: 2025-12-11
**Status**: ✅ Structure implemented & committed
**Repository**: https://github.com/andrey-germany/preschool.git

