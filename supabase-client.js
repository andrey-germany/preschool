// Supabase Client Handler
// Manages all Supabase interactions for multiplayer, social, and backend features

import { SUPABASE_CONFIG } from './config.js';

class SupabaseClient {
  constructor() {
    this.enabled = SUPABASE_CONFIG.enabled;
    this.url = SUPABASE_CONFIG.url;
    this.anonKey = SUPABASE_CONFIG.anonKey;
    this.headers = {
      'Content-Type': 'application/json',
      'apikey': this.anonKey,
      'Authorization': `Bearer ${this.anonKey}`
    };
  }

  /**
   * Check if Supabase is configured
   */
  isConfigured() {
    return this.enabled && this.url && this.anonKey;
  }

  /**
   * Create a new multiplayer session
   * POST /rest/v1/sessions
   */
  async createSession(sessionData) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, session not created');
      return null;
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/sessions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          name: sessionData.name,
          game_id: sessionData.gameId,
          host_id: sessionData.hostId,
          status: 'waiting',
          invite_code: sessionData.inviteCode,
          max_players: sessionData.maxPlayers || 4,
          settings: sessionData.settings || {}
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  }

  /**
   * Join a multiplayer session
   * PATCH /rest/v1/sessions?invite_code=eq.{code}
   */
  async joinSession(inviteCode, userId) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, session join failed');
      return null;
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/sessions?invite_code=eq.${inviteCode}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            players: [{ userId, joinedAt: new Date().toISOString() }]
          })
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to join session:', error);
      return null;
    }
  }

  /**
   * Get session by invite code
   * GET /rest/v1/sessions?invite_code=eq.{code}
   */
  async getSessionByCode(inviteCode) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, session fetch failed');
      return null;
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/sessions?invite_code=eq.${inviteCode}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Failed to fetch session:', error);
      return null;
    }
  }

  /**
   * Update session scores
   * PATCH /rest/v1/sessions?id=eq.{id}
   */
  async updateSessionScores(sessionId, scores) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, scores not updated');
      return null;
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/sessions?id=eq.${sessionId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({ scores })
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to update session scores:', error);
      return null;
    }
  }

  /**
   * End session and record results
   * PATCH /rest/v1/sessions?id=eq.{id}
   */
  async endSession(sessionId, winnerId) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, session not ended');
      return null;
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/sessions?id=eq.${sessionId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({
            status: 'completed',
            winner_id: winnerId,
            ended_at: new Date().toISOString()
          })
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to end session:', error);
      return null;
    }
  }

  /**
   * Save a public story
   * POST /rest/v1/public_stories
   */
  async publishStory(storyData) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, story not published');
      return null;
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/public_stories`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          author_id: storyData.authorId,
          title: storyData.title,
          content: storyData.content,
          template: storyData.template,
          likes: 0,
          shares: 0
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to publish story:', error);
      return null;
    }
  }

  /**
   * Get trending/recent public stories
   * GET /rest/v1/public_stories?order=likes.desc&limit=20
   */
  async getTrendingStories(limit = 20) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, stories fetch failed');
      return [];
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/public_stories?order=likes.desc&limit=${limit}`,
        {
          method: 'GET',
          headers: this.headers
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      return [];
    }
  }

  /**
   * Like a story
   * PATCH /rest/v1/public_stories?id=eq.{id}
   */
  async likeStory(storyId) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, like not recorded');
      return null;
    }

    try {
      // First get current likes
      const getResponse = await fetch(
        `${this.url}/rest/v1/public_stories?id=eq.${storyId}`,
        { method: 'GET', headers: this.headers }
      );

      const stories = await getResponse.json();
      const currentLikes = stories[0]?.likes || 0;

      // Then increment
      const updateResponse = await fetch(
        `${this.url}/rest/v1/public_stories?id=eq.${storyId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify({ likes: currentLikes + 1 })
        }
      );

      if (!updateResponse.ok) throw new Error(`HTTP ${updateResponse.status}`);
      return await updateResponse.json();
    } catch (error) {
      console.error('Failed to like story:', error);
      return null;
    }
  }

  /**
   * Get user profile (from Supabase)
   * GET /rest/v1/profiles?id=eq.{userId}
   */
  async getUserProfile(userId) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, profile fetch failed');
      return null;
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/profiles?id=eq.${userId}`,
        { method: 'GET', headers: this.headers }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   * PATCH /rest/v1/profiles?id=eq.{userId}
   */
  async updateUserProfile(userId, profileData) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, profile not updated');
      return null;
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/profiles?id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: this.headers,
          body: JSON.stringify(profileData)
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to update profile:', error);
      return null;
    }
  }

  /**
   * Get leaderboard for a game
   * GET /rest/v1/leaderboard?game_id=eq.{gameId}&order=score.desc&limit=100
   */
  async getLeaderboard(gameId, limit = 100) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, leaderboard fetch failed');
      return [];
    }

    try {
      const response = await fetch(
        `${this.url}/rest/v1/leaderboard?game_id=eq.${gameId}&order=score.desc&limit=${limit}`,
        { method: 'GET', headers: this.headers }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }

  /**
   * Record a score for leaderboard
   * POST /rest/v1/leaderboard
   */
  async recordScore(userId, gameId, score) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, score not recorded');
      return null;
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/leaderboard`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          user_id: userId,
          game_id: gameId,
          score: score,
          recorded_at: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to record score:', error);
      return null;
    }
  }

  /**
   * Send friend invite
   * POST /rest/v1/friend_invites
   */
  async sendFriendInvite(fromUserId, toUserEmail) {
    if (!this.isConfigured()) {
      console.warn('Supabase not configured, invite not sent');
      return null;
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/friend_invites`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          from_user_id: fromUserId,
          to_user_email: toUserEmail,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to send invite:', error);
      return null;
    }
  }

  /**
   * Test connection to Supabase
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, message: 'Supabase not configured' };
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/`, {
        method: 'GET',
        headers: this.headers
      });

      return {
        success: response.ok,
        message: response.ok ? 'Connected to Supabase' : `HTTP ${response.status}`
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new SupabaseClient();
