# Supabase Setup Guide

This guide explains how to set up Supabase for the ABC Learning Games platform to enable multiplayer sessions, social features, and cloud storage.

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **PostgreSQL Database** - Store sessions, scores, and public stories
- **Real-time Subscriptions** - Live leaderboards and session updates
- **Authentication** - User accounts and profiles
- **REST API** - Easy HTTP access to your data
- **Free Tier** - Generous free tier for development

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with email/GitHub/Google
4. Create a new project:
   - Organization name: Your choice
   - Project name: `abc-learning-games`
   - Database password: Create a strong password
   - Region: Select closest to your location
   - Pricing plan: Start with Free

## Step 2: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxx.supabase.co`)
   - **Anon Key** (public key for frontend)
   - **Service Role Key** (keep secret for backend)

3. In your `config.js`, replace:
```javascript
export const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',  // Paste Project URL here
  anonKey: 'YOUR_SUPABASE_ANON_KEY',  // Paste Anon Key here
  enabled: true  // Set to true when configured
};
```

## Step 3: Create Database Tables

Run these SQL commands in Supabase **SQL Editor**:

### 1. User Profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  email TEXT UNIQUE,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
```

### 2. Multiplayer Sessions
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  game_id TEXT NOT NULL,
  host_id UUID NOT NULL,
  status TEXT DEFAULT 'waiting',
  invite_code TEXT UNIQUE NOT NULL,
  max_players INTEGER DEFAULT 4,
  winner_id UUID,
  players JSONB DEFAULT '[]',
  scores JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (host_id) REFERENCES profiles(id)
);

CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_invite_code ON sessions(invite_code);
CREATE INDEX idx_sessions_game ON sessions(game_id);
```

### 3. Leaderboard
```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES profiles(id)
);

CREATE INDEX idx_leaderboard_game ON leaderboard(game_id, score DESC);
CREATE INDEX idx_leaderboard_user ON leaderboard(user_id);
```

### 4. Public Stories
```sql
CREATE TABLE public_stories (
  id TEXT PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (author_id) REFERENCES profiles(id)
);

CREATE INDEX idx_stories_likes ON public_stories(likes DESC);
CREATE INDEX idx_stories_author ON public_stories(author_id);
```

### 5. Friend Invites
```sql
CREATE TABLE friend_invites (
  id SERIAL PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (from_user_id) REFERENCES profiles(id)
);

CREATE INDEX idx_invites_status ON friend_invites(status);
CREATE INDEX idx_invites_email ON friend_invites(to_user_email);
```

## Step 4: Enable Row Level Security (RLS)

This secures your database by allowing users to see only their own data:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_invites ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, write only own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Sessions: Users can read all, but only join if they're a player
CREATE POLICY "Sessions are viewable by everyone" ON sessions
  FOR SELECT USING (true);

CREATE POLICY "Host can update own session" ON sessions
  FOR UPDATE USING (auth.uid() = host_id);

-- Leaderboard: Anyone can read, only system can write
CREATE POLICY "Leaderboard is public" ON leaderboard
  FOR SELECT USING (true);

-- Public Stories: Anyone can read and like
CREATE POLICY "Public stories are readable" ON public_stories
  FOR SELECT USING (true);

CREATE POLICY "Authors can update own stories" ON public_stories
  FOR UPDATE USING (auth.uid() = author_id);

-- Friend Invites: Users can see their own invites
CREATE POLICY "Users can view own invites" ON friend_invites
  FOR SELECT USING (
    auth.uid()::text = from_user_id::text OR
    auth.email() = to_user_email
  );
```

## Step 5: Set Up Real-time Updates (Optional)

To enable live leaderboards and session updates:

1. Go to **Settings** → **Realtime**
2. Enable Realtime for these tables:
   - `sessions`
   - `leaderboard`
   - `public_stories`

3. In your code, subscribe to changes:
```javascript
// Example real-time subscription
const channel = supabase
  .channel('leaderboard:game_id=eq.alphabet')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'leaderboard' },
    (payload) => {
      console.log('Leaderboard updated:', payload);
      // Update UI
    }
  )
  .subscribe();
```

## Step 6: Test Your Configuration

Run this in browser console:
```javascript
import SupabaseClient from './supabase-client.js';

// Test connection
const result = await SupabaseClient.testConnection();
console.log(result);
// Should show: { success: true, message: 'Connected to Supabase' }
```

## How It Works

### Local-First + Cloud Sync

The app works in **two modes**:

**Mode 1: Local-Only (Offline)**
- Games save data to localStorage
- Multiplayer sessions work locally via localStorage
- Leaderboards show only local data
- Stories sync manually

**Mode 2: Cloud-Sync (Online)**
- Data syncs to Supabase automatically
- Real-time multiplayer with friends
- Global leaderboards
- Shared stories community
- Cross-device sync

### Architecture

```
User Device
├─ Browser Local Storage (localStorage)
│  ├─ User Profile
│  ├─ Game Scores
│  ├─ Stories
│  ├─ Sessions
│  └─ Friends List
│
└─ Supabase Cloud (Optional)
   ├─ User Profiles
   ├─ Multiplayer Sessions
   ├─ Leaderboards
   ├─ Public Stories
   └─ Friend Network
```

## Multiplayer Flow

### Creating a Session
1. User creates session locally (stored in localStorage)
2. If Supabase enabled, syncs to cloud
3. Generate invite code
4. Friend joins with code
5. Scores update in real-time

### Joining a Session
1. User enters invite code
2. Check local storage first
3. If not found, check Supabase
4. Add user to session players list
5. Sync scores during game

### Session Completion
1. Game ends
2. Calculate final scores
3. Determine winner
4. Save to Supabase leaderboard
5. Unlock achievements

## Environment Variables (Optional)

For production, use environment variables instead of hardcoding:

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then in code:
```javascript
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enabled: true
};
```

## Troubleshooting

### "Connection Failed"
- Check Project URL and Anon Key are correct
- Verify CORS is enabled (should be default)
- Check browser console for error messages

### "Permission Denied"
- RLS policies might be blocking access
- Verify policies are created correctly
- Check user is authenticated

### "Real-time not working"
- Real-time feature must be enabled
- Check table is added to real-time
- Verify subscription is to correct table

### "Data not syncing"
- Check `SUPABASE_CONFIG.enabled` is `true`
- Look for errors in browser console
- Verify API keys are correct

## Security Best Practices

1. **Never expose Service Role Key** - Only use Anon Key in frontend
2. **Use RLS Policies** - Restrict data access at database level
3. **Validate on Backend** - Never trust client-side validation alone
4. **Rotate Keys** - Periodically refresh API keys
5. **Monitor Usage** - Watch for unusual activity in Supabase dashboard

## Next Steps

1. ✅ Create Supabase account
2. ✅ Get API keys
3. ✅ Create tables with SQL
4. ✅ Enable RLS policies
5. ✅ Add keys to config.js
6. ✅ Test connection
7. 🎮 Play games and create multiplayer sessions!

## Documentation Links

- [Supabase Official Docs](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [REST API Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Real-time Docs](https://supabase.com/docs/guides/realtime)

## Support

- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues
- Stack Overflow: Tag with `supabase`

---

**Remember**: You can start with localStorage-only and add Supabase later. The app works great without cloud features!
