# Advanced Features Documentation

## Overview

The ABC Learning Games platform now includes Material Design UI, local data persistence, Supabase integration, and comprehensive multiplayer/social features.

---

## 1. Material Design Navigation

### What's New

The new `index-new.html` features:
- **Material Design Sidebar** - Navigation drawer with smooth animations
- **Responsive Hamburger Menu** - Mobile-friendly on small screens
- **Material Icons** - Professional icons from Google's Material Design
- **Tailwind CSS** - Modern utility-first CSS framework
- **Glassmorphism** - Frosted glass effect on cards and containers

### How It Works

```html
<!-- Material Design Icons -->
<span class="material-symbols-rounded">videogame_asset</span>

<!-- Navigation with Tailwind -->
<nav class="flex gap-4">
  <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600">Click me</button>
</nav>
```

### Mobile Responsiveness

```
Desktop: md: 768px and up
Tablet: sm: 640px - 767px
Mobile: Below 640px

Classes: hidden md:block, sm:flex lg:grid
```

### Navigation Menu Structure

```
├─ Games (Redirect to game cards)
├─ My Stories (View saved stories)
├─ Leaderboard (View rankings)
├─ Friends (Manage friend list)
├─ Sessions (View multiplayer games)
├─ Achievements (Unlock badges)
├─ Settings (Preferences)
└─ Help (FAQ)
```

---

## 2. Local Data Persistence (localStorage)

### What's Stored

All data is automatically saved to browser's localStorage:

```javascript
StorageManager.getUserProfile()        // User profile
StorageManager.getGameScores()         // All game scores
StorageManager.getStories()            // Created stories
StorageManager.getSessions()           // Multiplayer sessions
StorageManager.getFriends()            // Friends list
StorageManager.getAchievements()       // Unlocked achievements
```

### Storage Limits

- **5-10 MB per domain** (varies by browser)
- Auto-cleanup: Keeps last 100 scores, 500 stories, 50 sessions
- **Can export/backup** all data at once

### Usage Examples

```javascript
import StorageManager from './storage.js';

// Save user profile
StorageManager.saveUserProfile({
  name: 'Alex',
  avatar: '👦'
});

// Get profile
const profile = StorageManager.getUserProfile();

// Save a game score
StorageManager.saveGameScore('alphabet', 95);

// Get all scores
const allScores = StorageManager.getGameScores();

// Save a story
const story = StorageManager.saveStory({
  title: 'My Adventure',
  content: 'Once upon a time...',
  template: 'adventure'
});

// Get stories
const stories = StorageManager.getStories();

// Export all data
const backup = StorageManager.exportAllData();
console.log(JSON.stringify(backup)); // Copy to file

// Import from backup
StorageManager.importData(backup);
```

### Data Structure

```javascript
// User Profile
{
  id: "1234567890-abc123",
  name: "Player Name",
  avatar: "👤",
  createdAt: "2024-12-11T10:00:00Z",
  totalScore: 500,
  gamesPlayed: 25,
  achievements: ["first_story", "accuracy_master"],
  stats: {
    storiesCreated: 3,
    wordsLearned: 45,
    accuracy: 87.5,
    sessionsWon: 2
  }
}

// Game Score Entry
{
  score: 92,
  timestamp: "2024-12-11T15:30:00Z",
  date: "12/11/2024"
}

// Story
{
  id: "1234567890-xyz789",
  title: "My Adventure",
  template: "adventure",
  content: "The brave knight walked into...",
  createdAt: "2024-12-11T14:20:00Z",
  isPublic: false,
  likes: 0,
  shares: 0
}
```

### Storage Management

```javascript
// Check storage usage
const stats = StorageManager.getStorageStats();
console.log(stats);
// { userProfile: 1024, stories: 5120, ..., total: 15360, totalMB: 0.01 }

// Clear all data (careful!)
StorageManager.clearAllData();

// Automatic cleanup
const stories = StorageManager.getStories();
// Keeps only last 500, removes oldest if exceeds
```

---

## 3. Multiplayer Sessions & Competition

### Create a Session

```javascript
import MultiplayerManager from './multiplayer.js';

// Create new game session
const session = MultiplayerManager.createSession('alphabet', 4);
// Returns: {
//   id, name, game, host, players, maxPlayers,
//   inviteCode, status, scores, settings
// }

console.log(`Share this code: ${session.inviteCode}`);
```

### Join a Session

```javascript
// Friend joins with invite code
const session = MultiplayerManager.joinSession('ABC12345');

// Check if successful
if (session) {
  console.log(`Joined ${session.name}!`);
  console.log(`Players: ${session.players.map(p => p.name).join(', ')}`);
}
```

### During Game

```javascript
// Update score as player plays
const updatedSession = MultiplayerManager.updateScore(
  sessionId,
  userId,
  correctAnswers,  // 12
  totalQuestions   // 15
);

// Session tracks real-time progress
console.log(updatedSession.scores[userId]);
// { correct: 12, total: 15, accuracy: 80 }
```

### End Game & Get Results

```javascript
// When game time expires or player finishes
const completedSession = MultiplayerManager.endSession(sessionId);

// Shows final results with rankings
console.log(completedSession.results);
// [
//   { userId, correct: 12, total: 15, accuracy: 80 },
//   { userId, correct: 11, total: 15, accuracy: 73 },
//   ...
// ]

console.log(`Winner: ${completedSession.results[0].userId}`);
```

### Session Data Flow

```
┌─ Host creates session
│  ├─ Generate invite code
│  └─ Save to localStorage
│
├─ Friend joins with code
│  ├─ Add to players list
│  └─ Sync locally
│
├─ Game plays
│  ├─ Real-time score updates
│  └─ Save progress locally
│
└─ Game ends
   ├─ Calculate final scores
   ├─ Determine winner
   ├─ Save to leaderboard
   └─ Unlock achievements
```

### Session Features

| Feature | Description |
|---------|-------------|
| **Invite Codes** | 8-character codes (e.g., ABC12345) |
| **Max Players** | Configurable (default 4) |
| **Time Limit** | Configurable (default 5 minutes) |
| **Difficulty** | Easy, Normal, Hard |
| **Real-time Scores** | Live updates during game |
| **Leaderboard** | Auto-generated at game end |
| **Achievements** | Unlock badges by winning |

---

## 4. Leaderboards & Rankings

### Get Game Leaderboard

```javascript
// Get top 100 scores for a game
const leaderboard = MultiplayerManager.getLeaderboard('alphabet', 100);
// Returns: [
//   { userId, name, avatar, score: 95, attempts: 3 },
//   { userId, name, avatar, score: 92, attempts: 4 },
//   ...
// ]
```

### Display Leaderboard

```javascript
// Create HTML for display
const html = MultiplayerManager.createLeaderboardHTML(leaderboard);
document.getElementById('leaderboard-container').innerHTML = html;
```

### Leaderboard Scoring

- **Primary**: Accuracy % (higher is better)
- **Secondary**: Attempts (fewer attempts = faster = tiebreaker)
- **Ranking**: 🥇 1st, 🥈 2nd, 🥉 3rd, 📍 4th+

### Integration with Supabase

When Supabase is enabled:
- Scores auto-sync to cloud
- Global leaderboards across all players
- Real-time ranking updates
- Cross-device leaderboard access

---

## 5. Social Features

### Friend Management

```javascript
import StorageManager from './storage.js';

// Add a friend
const friend = StorageManager.saveFriend({
  name: 'Alex',
  avatar: '👦'
});

// Get all friends
const friends = StorageManager.getFriends();

// Remove friend
StorageManager.removeFriend(friendId);
```

### Send Invites

```javascript
// Invite friend to session
MultiplayerManager.sendSessionInvite(sessionId, 'friend@example.com');

// Share invite code manually
const inviteCode = session.inviteCode;
// Friend uses code: MultiplayerManager.joinSession(inviteCode)
```

### Share Stories

```javascript
// Publish story to community
const published = StorageManager.saveStory({
  ...story,
  isPublic: true
});

// Get trending stories
const trending = await SupabaseClient.getTrendingStories(20);

// Like a story
await SupabaseClient.likeStory(storyId);
```

### Friend Status

```javascript
// Online status (manual for now, real-time with Supabase)
friend.status = 'online';  // 'online', 'offline', 'away'

StorageManager.saveFriend(friend);
```

---

## 6. Achievements System

### Achievement Types

```javascript
{
  'first_story': {
    name: 'Storyteller',
    description: 'Created your first story',
    icon: '📖',
    requirement: { type: 'stories_created', value: 1 }
  },
  'accuracy_master': {
    name: 'Accuracy Master',
    description: 'Achieved 95% accuracy',
    icon: '🎯',
    requirement: { type: 'accuracy', value: 95 }
  },
  'speed_demon': {
    name: 'Speed Demon',
    description: 'Completed 50 challenges',
    icon: '⚡',
    requirement: { type: 'challenges_completed', value: 50 }
  },
  'social_butterfly': {
    name: 'Social Butterfly',
    description: 'Invited 5 friends',
    icon: '🦋',
    requirement: { type: 'friends_invited', value: 5 }
  },
  'game_champion': {
    name: 'Game Champion',
    description: 'Won a multiplayer session',
    icon: '🏆',
    requirement: { type: 'sessions_won', value: 1 }
  }
}
```

### Unlock Achievement

```javascript
// Check if achievement earned
if (score >= 95) {
  StorageManager.saveAchievement({
    id: 'accuracy_master'
  });
  // Triggers: Show badge, animation, notification
}
```

### Display Achievements

```javascript
const achievements = StorageManager.getAchievements();
// Returns: [
//   { id: 'first_story', unlockedAt: '2024-12-11T...' },
//   { id: 'accuracy_master', unlockedAt: '2024-12-11T...' }
// ]
```

---

## 7. Supabase Integration (Optional)

### Enable Supabase

1. Create Supabase account (see SUPABASE_SETUP.md)
2. Get API keys
3. Update `config.js`:

```javascript
export const SUPABASE_CONFIG = {
  url: 'https://your-project.supabase.co',
  anonKey: 'your-anon-key',
  enabled: true  // Enable cloud features
};
```

### What Works Without Supabase

✅ All games
✅ Local scores and stats
✅ Local multiplayer sessions (via localStorage)
✅ Story creation and storage
✅ Local leaderboards
✅ Achievements
✅ Friend management (local)

### What Works With Supabase

✅ All above features, PLUS:
✅ Real-time multiplayer with remote players
✅ Global leaderboards
✅ Cloud profile sync
✅ Public story community
✅ Friend network
✅ Real-time notifications

### Cloud Features Usage

```javascript
import SupabaseClient from './supabase-client.js';

// Test connection
const result = await SupabaseClient.testConnection();
console.log(result.success); // true if connected

// Get cloud leaderboard
const cloudLeaderboard = await SupabaseClient.getLeaderboard('alphabet');

// Publish story to community
await SupabaseClient.publishStory({
  authorId: userId,
  title: 'My Story',
  content: 'Story text...',
  template: 'adventure'
});

// Send friend invite via email
await SupabaseClient.sendFriendInvite(userId, 'friend@example.com');
```

---

## 8. Configuration & Customization

### config.js

```javascript
import { GAMES, ACHIEVEMENTS } from './config.js';

// Add a new game
GAMES.newGame = {
  id: 'new-game',
  name: 'New Game',
  icon: '🎮',
  description: 'Description',
  color: '#ff0000',
  path: 'new-game.html'
};

// Add a new achievement
ACHIEVEMENTS.newBadge = {
  id: 'new_badge',
  name: 'New Badge',
  description: 'Unlock this badge',
  icon: '⭐',
  requirement: { type: 'custom', value: 10 }
};
```

### Localization

Add new language in `games.js` and `index-new.html`:

```javascript
localizedStrings['fr'] = {
  instruction: 'Instruction en français...',
  pageTitle: 'Titre en français...',
  // ... more strings
};
```

### Styling

**Tailwind CSS Classes**
- Colors: `bg-blue-500`, `text-white`, `hover:bg-blue-600`
- Spacing: `p-4` (padding), `m-2` (margin), `gap-3` (gap)
- Layout: `flex`, `grid`, `absolute`, `fixed`
- Responsive: `md:`, `lg:`, `sm:` prefixes

Example:
```html
<!-- Blue on large screens, red on mobile -->
<button class="bg-blue-500 md:bg-red-500">Click me</button>
```

**Material Design Icons**
```html
<span class="material-symbols-rounded">home</span>
<span class="material-symbols-rounded">favorite</span>
<span class="material-symbols-rounded">settings</span>

<!-- All icons: https://fonts.google.com/icons -->
```

---

## 9. Workflow Examples

### Scenario 1: Friend Game Night

```
Alice:
1. Creates session for "Alphabet Game"
2. Gets invite code: ABC12345
3. Shares with friends via chat

Bob:
1. Enters invite code ABC12345
2. Joins Alice's session
3. Game starts with both players

Game Flow:
- Real-time scores update
- Alice ahead with 15/15 (100%)
- Bob trying with 12/15 (80%)

Game Ends:
- Alice wins
- Unlock "Game Champion" achievement
- Scores saved to leaderboard
- Rematch available

Carol:
- Sees Alice's high score on leaderboard
- Challenges Alice to a session
- New game session created
```

### Scenario 2: Story Creation & Community

```
Alex:
1. Plays Story Builder game
2. Creates 3 stories locally
3. Likes one story best

Export & Share:
1. Goes to Settings
2. Exports data as backup
3. Publishes favorite story to community

Community:
1. Story appears on "Trending Stories"
2. Other players like it (gets 5 likes)
3. Alex sees likes in "My Stories" section
4. Gets "Social Butterfly" achievement

Friends:
1. Friend sees Alex's story
2. Leaves comment (future feature)
3. Shares story with others
```

### Scenario 3: Achievement Hunt

```
Player progresses:
- Game 1: Get 95% accuracy → "Accuracy Master" ✓
- Game 2: Create first story → "Storyteller" ✓
- Game 3: Complete 50 challenges → "Speed Demon" (5/50)
- Game 4: Win vs friend → "Game Champion" ✓
- Game 5: Invite 3 friends → "Social Butterfly" (3/5)

Achievements unlock:
- Badge appears in UI
- Animation plays
- Notification sent
- Achievement added to profile

Total: 3/5 achievements unlocked
```

---

## 10. Troubleshooting

### Data Not Saving

```javascript
// Check if localStorage is enabled
if (localStorage.length > 0) {
  console.log('localStorage is working');
} else {
  console.warn('localStorage might be disabled or full');
}

// Force save
StorageManager.saveUserProfile(profile);

// Verify saved
const saved = StorageManager.getUserProfile();
console.log(saved);
```

### Multiplayer Not Working Locally

```javascript
// Ensure both players on same device?
const sessions = StorageManager.getSessions();
console.log('Active sessions:', sessions.length);

// Try localStorage directly
console.log(localStorage.getItem('abc_sessions'));
```

### Supabase Connection Failed

```javascript
// Check configuration
console.log(SUPABASE_CONFIG);
// Should show your URL and key

// Test connection
const test = await SupabaseClient.testConnection();
console.log(test);
// If failed, check credentials
```

### Stories Not Loading

```javascript
// Check storage
const stories = StorageManager.getStories();
console.log('Stories found:', stories.length);

// Check file size
const stats = StorageManager.getStorageStats();
console.log('Storage used:', stats.totalMB, 'MB');

// If full, clear old data
// Or export before clearing
const backup = StorageManager.exportAllData();
```

---

## Next Steps

1. ✅ Material Design UI active
2. ✅ Local storage working
3. ✅ Multiplayer sessions ready
4. ✅ Leaderboards tracking
5. ⬜ (Optional) Set up Supabase
6. ⬜ Real-time multiplayer
7. ⬜ Global community features

See `SUPABASE_SETUP.md` for cloud setup!
