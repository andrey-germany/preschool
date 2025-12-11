# Claude Code - Commit Instructions

**Purpose**: Guidelines for when and how to commit changes to git.

---

## Commit Strategy

### When to Commit

Commit automatically when:
1. ✅ A **complete feature** is implemented and tested
2. ✅ All **game files** are created and working
3. ✅ A **major UI overhaul** is complete
4. ✅ **Documentation** is written/updated
5. ✅ **Bug fixes** are verified working
6. ✅ **Pedagogical improvements** are fully implemented (from FEATURE_BUCKET.md)

**Do NOT commit**:
- ❌ Incomplete features
- ❌ Code with known bugs
- ❌ Temporary test files
- ❌ API keys or secrets
- ❌ Partial implementations

---

## Commit Message Format

All commits should follow this format:

```
<type>: <description>

<optional detailed explanation>

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Type Categories

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature or game | `feat: add color-sorting game` |
| `improve` | Pedagogical improvement | `improve: add large touch targets to all games` |
| `fix` | Bug fix | `fix: sidebar menu not showing on mobile` |
| `docs` | Documentation only | `docs: update FEATURE_BUCKET.md` |
| `refactor` | Code restructuring | `refactor: consolidate game utilities` |
| `test` | Testing & verification | `test: verify keyboard input on all games` |

### Description Guidelines

- **Concise**: 50 characters or less
- **Imperative**: "Add feature" not "Added feature" or "Adds feature"
- **Specific**: "Add color-sorting game" not "Add game"
- **German context**: "Füge Farb-Sortier Spiel hinzu" (if applicable)

---

## Example Commits

### Example 1: New Game Implementation
```
feat: implement color-sorting game (Game 2.1)

- Drag-and-drop interface for color classification
- 3 difficulty levels (5, 8, shade variations)
- Audio feedback and confetti rewards
- Montessori-inspired sensorial learning
- LocalStorage integration for leaderboard
- Fully accessible: keyboard, voice, touch

Games: ABC/color-sorting.html
Config: Updated ABC/config.js with new game entry
Tested on: Desktop, tablet, mobile

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Example 2: Pedagogical Improvement
```
improve: implement large touch targets (Improvement 1.1)

- Increased button sizes from 40px to 50px minimum
- Added safe zones around interactive elements
- Font sizes increased to 18-24px for readability
- Applied to all game files for consistency

Files Modified:
- ABC/alphabet-game.html
- ABC/word-guess.html
- ABC/pattern-recognition.html
- ABC/sound-recognition.html
- ABC/story-builder.html

Rationale: Supports fine motor development (Piaget preoperational stage)

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Example 3: Feature Branch Completion
```
feat: add attention-span sessions (Improvement 1.2)

- Age-based session lengths: 3-4yo (5-8min), 4-5yo (8-12min), 5-6yo (12-15min)
- Visual timer in top-right corner with countdown animation
- Auto-save progress to localStorage
- Celebratory messaging when session ends
- Progress bar visualization
- Configuration added to ABC/config.js

Files Modified:
- ABC/config.js (added sessionLength parameter)
- ABC/games.js (added timer utilities)
- All game HTML files (integrated timer)

Implementation: Complete, tested across all games

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

### Example 4: Bug Fix
```
fix: sidebar menu not displaying on mobile devices

- Issue: CSS media query not hiding sidebar correctly
- Fix: Updated hidden md:block to sm:hidden
- Verified on: iPhone 12, iPad, Android Chrome
- Fallback: Hamburger menu still functional

Files Modified:
- ABC/index.html (navigation CSS)

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## Feature Implementation Commits

For each feature from **FEATURE_BUCKET.md**, create one commit per completed feature:

### Priority 1 Features (High Priority)
- [ ] **Feature 1.1 (Large Touch Targets)** → `improve: add large touch targets to all games`
- [ ] **Feature 1.2 (Attention-Span Sessions)** → `improve: implement attention-span sessions`
- [ ] **Feature 1.3 (Keyboard + Voice)** → `improve: add keyboard and voice control`

### Priority 2 Features (New Games)
- [ ] **Game 2.1 (Color Sorting)** → `feat: implement color-sorting game`
- [ ] **Game 2.2 (Rhyming Memory)** → `feat: implement rhyme-memory game`
- [ ] **Game 2.3 (Sequence Builder)** → `feat: implement sequence-builder game`
- [ ] **Game 2.4 (Syllable Clapper)** → `feat: implement syllable-clapper game`
- [ ] **Game 2.5 (Shape Explorer)** → `feat: implement shape-explorer game`
- [ ] **Game 2.6 (Counting Adventure)** → `feat: implement counting-adventure game`

### Documentation Commits
- [ ] `docs: add FEATURE_BUCKET.md with pedagogical roadmap`
- [ ] `docs: add claude.md with commit guidelines`
- [ ] `docs: update FEATURES.md with new games documentation`

---

## Pre-Commit Checklist

Before running `git commit`, verify:

- [ ] Code is complete and functional (no TODOs left)
- [ ] All files are saved
- [ ] No secrets/API keys in code (check config.js)
- [ ] German localization is applied where user-facing
- [ ] Games tested on mobile and desktop
- [ ] Documentation updated
- [ ] localStorage integration verified
- [ ] No console errors in browser
- [ ] Touch targets ≥44×44px
- [ ] Session lengths respect age guidelines

---

## Commit Workflow

```bash
# 1. Check status before committing
git status

# 2. Stage all changes
git add .

# 3. Verify what will be committed
git diff --cached

# 4. Create commit with message (following format above)
git commit -m "feat: implement new game

Detailed description here

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# 5. Verify commit created
git log -1

# 6. Push to remote (if applicable)
git push origin main
```

---

## Feature Completion Template

When a feature from FEATURE_BUCKET.md is complete, use this template:

```
[FEATURE TYPE]: [Feature Name] - Complete

## Feature
[Feature ID and title from FEATURE_BUCKET.md]

## What Was Implemented
- [Specific deliverable 1]
- [Specific deliverable 2]
- [Specific deliverable 3]

## Files Modified/Created
- [File 1]: [Changes]
- [File 2]: [Changes]

## Educational Rationale
[Why this feature matters pedagogically]

## Testing Status
- [x] Desktop testing
- [x] Tablet testing
- [x] Mobile testing
- [x] Accessibility verified
- [x] German localization confirmed

## Issue(s) Addressed
- Closes implementation for Feature [X.Y]

🤖 Generated with Claude Code
Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

---

## Emergency: Skip Commit

If changes should NOT be committed (sensitive data, incomplete work):

```bash
# Undo unstaged changes
git restore <filename>

# Undo all uncommitted changes
git restore .

# Discard last commit but keep changes
git reset --soft HEAD~1
```

---

## Important Notes

⚠️ **Before each commit session**:
1. Review FEATURE_BUCKET.md for what's being implemented
2. Verify feature is in "Ready for Implementation" status
3. Check pedagogical rationale documentation
4. Confirm German localization applied

✅ **After commit**:
1. Update FEATURE_BUCKET.md to mark feature as ✅ Implemented
2. Update checkbox in Phase timeline
3. Note any challenges encountered

---

**Last Updated**: 2025-12-11
**Version**: 1.0
**Status**: Active - Use for all commits going forward

