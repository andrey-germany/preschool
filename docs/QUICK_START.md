# Quick Start Guide

## Launch the Platform

Open **`index.html`** in any web browser.

## The 5 Games at a Glance

| Game | File | Skills | Features |
|------|------|--------|----------|
| 🔤 Alphabet | `alphabet-game.html` | Letter recognition, motor control | Case toggle, order toggle, confetti rewards |
| 📝 Word Guess | `word-guess.html` | Word formation, patterns | Blanks, word list, order toggle |
| 🎵 Sound Recognition | `sound-recognition.html` | Phonetic awareness, listening | Text-to-speech, speed control, accuracy % |
| 🧩 Pattern Recognition | `pattern-recognition.html` | Logic, morphology, patterns | Rhymes & morphology, hints, difficulty ★★★ |
| 📖 Story Builder | `story-builder.html` | Creative writing, context | Mad Libs, 3 templates, story narration |

## Game Mechanics

### Alphabet Game
1. See a letter
2. Type the matching letter
3. Get confetti reward
4. Next letter appears (after 1 second)

### Word Guess Game
1. See a word with blanks (e.g., `M_MA`)
2. Type the missing letter
3. Fill all blanks to complete word
4. Get reward and proceed to next word

### Sound Recognition Game
1. Click "Play" button to hear a sound
2. Type the letter or word you heard
3. Get immediate feedback (correct/incorrect)
4. Toggle between **Letters** (A-Z) and **Words** (Mama, Papa, etc.)
5. Adjust **Speed** (slow/fast)

### Pattern Recognition Game
1. See a pattern of words (e.g., cat, bat, hat, mat, rat, ?)
2. Type the missing word that completes the pattern
3. Pattern types:
   - **Rhyming Families**: Words that rhyme
   - **Morphology**: Word variations (walk, walks, walked, walking)
4. Get hints by clicking the **Hint** button
5. Difficulty increases as you progress (★★★)

### Story Builder Game
1. **Select a template**:
   - 🏰 Adventure (princesses, quests, treasures)
   - 🔍 Mystery (detectives, clues, secrets)
   - 😄 Silly (funny animals, ridiculous actions)
2. **Fill blanks**: Type words for each requested type (Adjective, Noun, etc.)
3. **Generate story**: Click "Generate Story" to see your creation
4. **Listen & celebrate**: Click "Read Aloud" to hear your story
5. **Create again**: Choose another template to start over

## Controls Guide

### All Games
- **Back to Menu**: Returns to game hub
- **Type answers**: Use keyboard to input answers
- **Navigation**: Click buttons or press Enter to submit

### Game-Specific Controls

**Alphabet**:
- Button 1: Toggle uppercase (A) / lowercase (a)
- Button 2: Toggle alphabetical order (📜) / random (🎲)

**Word Guess**:
- Button: Toggle word order (📜 alphabetical / 🎲 random)

**Sound Recognition**:
- Play Button: Hear the sound
- Button 1: Toggle letters (🔤) / words (📝)
- Button 2: Toggle speed (🐢 slow / fast)

**Pattern Recognition**:
- Button 1: Toggle rhymes (🔤) / morphology (🔄)
- Button 2: Get a hint (💡)

**Story Builder**:
- Select a story template
- Fill all blanks with your words
- Generate to create the story
- Listen to it read aloud

## Browser Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- For Sound Recognition Game: speakers/headphones

## Tips for Best Results

### For Young Learners (3-5)
- Start with **Alphabet Game** (easiest)
- Use **Sound Recognition** with slow speed
- Progress to **Word Guess** for word recognition
- Rotate games to maintain engagement

### For Early Readers (5-7)
- Try **Pattern Recognition** to develop decoding skills
- Use **Story Builder** for creative confidence
- Mix all games for well-rounded literacy development
- Challenge them with **Sound Recognition** fast mode

### For Parents/Teachers
- Observe accuracy percentages to track progress
- Rotate between games (5-10 min per game)
- Customize word lists in the code
- Use as supplement to formal instruction
- Celebrate milestones and achievements

## Customization

### Change Word Lists
Edit `wordList` in `word-guess.html`:
```javascript
const wordList = ['YOUR', 'CUSTOM', 'WORDS'];
```

### Add Story Templates
Edit `storyTemplates` in `story-builder.html` to add new themes.

### Change Colors
Edit gradient colors in any game file:
```css
background: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
```

### Add Localization
Extend `localizedStrings` in `games.js` for new languages:
```javascript
'fr': {
  instruction: 'Français...',
  // more strings
}
```

## Troubleshooting

### Sound Recognition Game
- **No sound?** Check browser speakers/volume, allow microphone permissions
- **Wrong language?** Browser language affects pronunciation, adjust in browser settings

### Pattern Recognition Game
- **Hint shows wrong answer?** The first letter is revealed; complete the word
- **Too hard?** Difficulty resets if you switch pattern types

### Story Builder Game
- **Can't generate story?** Make sure ALL blanks are filled in
- **Text-to-speech not working?** Check browser permissions and language settings

### All Games
- **Game not loading?** Clear browser cache and refresh
- **Mobile freezing?** Try smaller viewport or close other tabs
- **Translations wrong?** Check browser language settings

## Performance Tips

- Close unnecessary browser tabs
- Use latest browser version
- Clear browser cache occasionally
- On mobile, use landscape mode for better view

## Learning Tips

### Phonetic Focus
Use **Sound Recognition** first to build sound awareness before letter identification.

### Pattern Power
**Pattern Recognition** helps kids decode unfamiliar words—use it to bridge isolated letter learning to real reading.

### Contextual Learning
**Story Builder** provides real context—kids remember words learned in stories better than isolated lists.

### Spaced Repetition
Rotate between games. Each game re-exposes words/letters in different contexts, supporting long-term retention.

### Progressive Challenge
Games increase difficulty as performance improves—learning happens in the sweet spot between boredom and frustration.

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Type answer | Just start typing |
| Submit | Type the answer (auto-submits) |
| Go back | Click Back button |
| Navigate games | Click game cards |

## File Structure Reference

```
/ABC/
├── index.html           ← START HERE (Game Hub)
├── games.js            ← Shared utilities
│
├── alphabet-game.html
├── word-guess.html
├── sound-recognition.html
├── pattern-recognition.html
├── story-builder.html
│
├── GAME_PLANNING.md     ← Development roadmap
├── README.md            ← Full documentation
└── QUICK_START.md       ← This file
```

## What Kids Learn

| Game | Literacy Skill | Cognitive Skill |
|------|---|---|
| 🔤 Alphabet | Letter recognition | Symbol understanding |
| 📝 Word Guess | Word structure | Pattern completion |
| 🎵 Sound | Phonetic awareness | Sound discrimination |
| 🧩 Pattern | Decoding strategy | Logical reasoning |
| 📖 Story | Contextual meaning | Creative expression |

## Success Metrics

Track progress by watching:
- **Accuracy %** (displayed in most games)
- **Completion speed** (faster = more fluent)
- **Difficulty level** (patterns use ★ rating)
- **Word count** (stories created)
- **Retention** (same words appear in multiple games)

## Next Steps

1. **Try each game** - 5 minutes per game
2. **Find favorites** - different kids like different games
3. **Mix and match** - rotate for variety
4. **Track progress** - note improving accuracy
5. **Extend learning** - use games as supplement to reading
6. **Read planning doc** - understand the pedagogy (GAME_PLANNING.md)

## Support Resources

- **README.md** - Complete feature documentation
- **GAME_PLANNING.md** - Pedagogical framework & roadmap
- **HTML files** - Code comments explain mechanics
- **Developer notes** - Instructions for customization

---

**Happy learning! 🎉**

*Platform v1.0 - December 2025*
