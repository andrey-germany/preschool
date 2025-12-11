// Speicherverwaltungssystem für LocalStorage
// Verwaltet alle localStorage-Operationen mit automatischer Sicherung/Wiederherstellung

import { LOCAL_STORAGE_KEYS } from './config.js';

class StorageManager {
  /**
   * Speichere Benutzerprofil in localStorage
   */
  static saveUserProfile(profile) {
    try {
      const data = {
        ...profile,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(LOCAL_STORAGE_KEYS.userProfile, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save user profile:', e);
      return false;
    }
  }

  /**
   * Get user profile from localStorage
   */
  static getUserProfile() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.userProfile);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load user profile:', e);
      return null;
    }
  }

  /**
   * Create a new user profile with defaults
   */
  static createDefaultProfile(name) {
    return {
      id: this.generateId(),
      name: name || 'Player',
      avatar: this.getRandomAvatar(),
      createdAt: new Date().toISOString(),
      totalScore: 0,
      gamesPlayed: 0,
      achievements: [],
      stats: {
        storiesCreated: 0,
        wordsLearned: 0,
        accuracy: 0,
        sessionsWon: 0
      }
    };
  }

  /**
   * Save game score
   */
  static saveGameScore(gameId, score) {
    try {
      const scores = this.getGameScores();
      if (!scores[gameId]) {
        scores[gameId] = [];
      }

      scores[gameId].push({
        score: score,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      });

      // Keep only last 100 scores per game
      if (scores[gameId].length > 100) {
        scores[gameId] = scores[gameId].slice(-100);
      }

      localStorage.setItem(LOCAL_STORAGE_KEYS.gameScores, JSON.stringify(scores));
      return true;
    } catch (e) {
      console.error('Failed to save game score:', e);
      return false;
    }
  }

  /**
   * Get all game scores
   */
  static getGameScores() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.gameScores);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load game scores:', e);
      return {};
    }
  }

  /**
   * Get average score for a game
   */
  static getAverageScore(gameId) {
    try {
      const scores = this.getGameScores();
      const gameScores = scores[gameId] || [];
      if (gameScores.length === 0) return 0;

      const total = gameScores.reduce((sum, s) => sum + s.score, 0);
      return Math.round(total / gameScores.length);
    } catch (e) {
      console.error('Failed to calculate average score:', e);
      return 0;
    }
  }

  /**
   * Save a story to localStorage
   */
  static saveStory(story) {
    try {
      const stories = this.getStories();
      const storyData = {
        id: story.id || this.generateId(),
        title: story.title,
        template: story.template,
        content: story.content,
        createdAt: new Date().toISOString(),
        isPublic: story.isPublic || false,
        likes: 0,
        shares: 0
      };

      stories.push(storyData);

      // Keep only last 500 stories (per browser)
      if (stories.length > 500) {
        stories.shift(); // Remove oldest
      }

      localStorage.setItem(LOCAL_STORAGE_KEYS.stories, JSON.stringify(stories));
      return storyData;
    } catch (e) {
      console.error('Failed to save story:', e);
      return null;
    }
  }

  /**
   * Get all saved stories
   */
  static getStories() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.stories);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load stories:', e);
      return [];
    }
  }

  /**
   * Get story by ID
   */
  static getStoryById(storyId) {
    try {
      const stories = this.getStories();
      return stories.find(s => s.id === storyId);
    } catch (e) {
      console.error('Failed to get story:', e);
      return null;
    }
  }

  /**
   * Delete a story
   */
  static deleteStory(storyId) {
    try {
      let stories = this.getStories();
      stories = stories.filter(s => s.id !== storyId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.stories, JSON.stringify(stories));
      return true;
    } catch (e) {
      console.error('Failed to delete story:', e);
      return false;
    }
  }

  /**
   * Save a multiplayer session
   */
  static saveSession(session) {
    try {
      const sessions = this.getSessions();
      const sessionData = {
        id: session.id || this.generateId(),
        name: session.name,
        game: session.game,
        host: session.host,
        players: session.players || [],
        scores: session.scores || {},
        status: session.status || 'waiting', // waiting, active, completed
        createdAt: new Date().toISOString(),
        inviteCode: session.inviteCode || this.generateInviteCode(),
        settings: session.settings || {}
      };

      // Check if session exists and update, otherwise add
      const existingIndex = sessions.findIndex(s => s.id === sessionData.id);
      if (existingIndex >= 0) {
        sessions[existingIndex] = sessionData;
      } else {
        sessions.push(sessionData);
      }

      // Keep only last 50 sessions
      if (sessions.length > 50) {
        sessions = sessions.slice(-50);
      }

      localStorage.setItem(LOCAL_STORAGE_KEYS.sessions, JSON.stringify(sessions));
      return sessionData;
    } catch (e) {
      console.error('Failed to save session:', e);
      return null;
    }
  }

  /**
   * Get all sessions
   */
  static getSessions() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.sessions);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load sessions:', e);
      return [];
    }
  }

  /**
   * Get session by invite code
   */
  static getSessionByInviteCode(inviteCode) {
    try {
      const sessions = this.getSessions();
      return sessions.find(s => s.inviteCode === inviteCode);
    } catch (e) {
      console.error('Failed to get session:', e);
      return null;
    }
  }

  /**
   * Save friends list
   */
  static saveFriend(friend) {
    try {
      const friends = this.getFriends();
      const friendData = {
        id: friend.id || this.generateId(),
        name: friend.name,
        avatar: friend.avatar,
        addedAt: new Date().toISOString(),
        status: friend.status || 'offline' // online, offline, away
      };

      // Check if friend exists
      const existingIndex = friends.findIndex(f => f.id === friendData.id);
      if (existingIndex < 0) {
        friends.push(friendData);
      }

      localStorage.setItem(LOCAL_STORAGE_KEYS.friendsList, JSON.stringify(friends));
      return friendData;
    } catch (e) {
      console.error('Failed to save friend:', e);
      return null;
    }
  }

  /**
   * Get all friends
   */
  static getFriends() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.friendsList);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load friends:', e);
      return [];
    }
  }

  /**
   * Remove a friend
   */
  static removeFriend(friendId) {
    try {
      let friends = this.getFriends();
      friends = friends.filter(f => f.id !== friendId);
      localStorage.setItem(LOCAL_STORAGE_KEYS.friendsList, JSON.stringify(friends));
      return true;
    } catch (e) {
      console.error('Failed to remove friend:', e);
      return false;
    }
  }

  /**
   * Save achievements
   */
  static saveAchievement(achievement) {
    try {
      const achievements = this.getAchievements();
      if (!achievements.find(a => a.id === achievement.id)) {
        achievements.push({
          id: achievement.id,
          unlockedAt: new Date().toISOString()
        });
        localStorage.setItem(LOCAL_STORAGE_KEYS.achievements, JSON.stringify(achievements));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to save achievement:', e);
      return false;
    }
  }

  /**
   * Get all achievements
   */
  static getAchievements() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.achievements);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load achievements:', e);
      return [];
    }
  }

  /**
   * Clear all data (careful!)
   */
  static clearAllData() {
    try {
      Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.error('Failed to clear data:', e);
      return false;
    }
  }

  /**
   * Export all data as JSON
   */
  static exportAllData() {
    try {
      return {
        profile: this.getUserProfile(),
        scores: this.getGameScores(),
        stories: this.getStories(),
        sessions: this.getSessions(),
        friends: this.getFriends(),
        achievements: this.getAchievements(),
        exportedAt: new Date().toISOString()
      };
    } catch (e) {
      console.error('Failed to export data:', e);
      return null;
    }
  }

  /**
   * Import data from exported JSON
   */
  static importData(data) {
    try {
      if (data.profile) this.saveUserProfile(data.profile);
      if (data.scores) localStorage.setItem(LOCAL_STORAGE_KEYS.gameScores, JSON.stringify(data.scores));
      if (data.stories) localStorage.setItem(LOCAL_STORAGE_KEYS.stories, JSON.stringify(data.stories));
      if (data.sessions) localStorage.setItem(LOCAL_STORAGE_KEYS.sessions, JSON.stringify(data.sessions));
      if (data.friends) localStorage.setItem(LOCAL_STORAGE_KEYS.friendsList, JSON.stringify(data.friends));
      if (data.achievements) localStorage.setItem(LOCAL_STORAGE_KEYS.achievements, JSON.stringify(data.achievements));
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }

  /**
   * Utility: Generate random ID
   */
  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Utility: Generate invite code
   */
  static generateInviteCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  /**
   * Utility: Get random avatar emoji
   */
  static getRandomAvatar() {
    const avatars = ['🧒', '👦', '👧', '🧑', '👨', '👩', '🦁', '🐶', '🦊', '🐱', '🐮', '🐷'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  /**
   * Get storage usage statistics
   */
  static getStorageStats() {
    try {
      const stats = {};
      Object.entries(LOCAL_STORAGE_KEYS).forEach(([key, value]) => {
        const data = localStorage.getItem(value);
        stats[key] = data ? new Blob([data]).size : 0;
      });

      const total = Object.values(stats).reduce((a, b) => a + b, 0);
      return { ...stats, total, totalMB: (total / 1024 / 1024).toFixed(2) };
    } catch (e) {
      console.error('Failed to get storage stats:', e);
      return null;
    }
  }
}

export default StorageManager;
