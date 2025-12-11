// Multiplayer Session Manager
// Handles game sessions, scoring, and competition

import StorageManager from './storage.js';
import SupabaseClient from './supabase-client.js';
import { GAMES } from './config.js';

class MultiplayerManager {
  /**
   * Create a new game session
   */
  static createSession(gameId, maxPlayers = 4) {
    const userProfile = StorageManager.getUserProfile();
    if (!userProfile) {
      console.error('User profile not found');
      return null;
    }

    const session = {
      id: StorageManager.generateId(),
      name: `${GAMES[gameId]?.name || 'Game'} Session`,
      game: gameId,
      host: userProfile.id,
      hostName: userProfile.name,
      players: [
        {
          id: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          joinedAt: new Date().toISOString(),
          score: 0,
          accuracy: 0
        }
      ],
      maxPlayers,
      inviteCode: StorageManager.generateInviteCode(),
      status: 'waiting', // waiting, active, completed
      scores: {},
      createdAt: new Date().toISOString(),
      settings: {
        timeLimit: 300, // 5 minutes
        difficulty: 'normal'
      }
    };

    // Save locally
    StorageManager.saveSession(session);

    // Try to save to Supabase
    if (SupabaseClient.isConfigured()) {
      SupabaseClient.createSession({
        name: session.name,
        gameId: session.game,
        hostId: session.host,
        inviteCode: session.inviteCode,
        maxPlayers: session.maxPlayers,
        settings: session.settings
      });
    }

    return session;
  }

  /**
   * Join an existing session with invite code
   */
  static joinSession(inviteCode) {
    const userProfile = StorageManager.getUserProfile();
    if (!userProfile) {
      console.error('User profile not found');
      return null;
    }

    // Get session from local storage
    let session = StorageManager.getSessionByInviteCode(inviteCode);
    if (!session) {
      console.error('Session not found');
      return null;
    }

    // Check if already in session
    if (session.players.some(p => p.id === userProfile.id)) {
      return session;
    }

    // Check if session is full
    if (session.players.length >= session.maxPlayers) {
      console.error('Session is full');
      return null;
    }

    // Add player to session
    session.players.push({
      id: userProfile.id,
      name: userProfile.name,
      avatar: userProfile.avatar,
      joinedAt: new Date().toISOString(),
      score: 0,
      accuracy: 0
    });

    // Initialize score tracker
    session.scores[userProfile.id] = {
      correct: 0,
      total: 0,
      accuracy: 0,
      startTime: new Date().toISOString()
    };

    // Save locally
    StorageManager.saveSession(session);

    // Try to save to Supabase
    if (SupabaseClient.isConfigured()) {
      SupabaseClient.joinSession(inviteCode, userProfile.id);
    }

    return session;
  }

  /**
   * Update player score during session
   */
  static updateScore(sessionId, userId, correct, total) {
    const sessions = StorageManager.getSessions();
    let session = sessions.find(s => s.id === sessionId);

    if (!session) {
      console.error('Session not found');
      return null;
    }

    if (!session.scores[userId]) {
      session.scores[userId] = {
        correct: 0,
        total: 0,
        accuracy: 0,
        startTime: new Date().toISOString()
      };
    }

    session.scores[userId].correct = correct;
    session.scores[userId].total = total;
    session.scores[userId].accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Save locally
    StorageManager.saveSession(session);

    // Try to save to Supabase
    if (SupabaseClient.isConfigured()) {
      SupabaseClient.updateSessionScores(sessionId, session.scores);
    }

    return session;
  }

  /**
   * End session and determine winner
   */
  static endSession(sessionId) {
    const sessions = StorageManager.getSessions();
    let session = sessions.find(s => s.id === sessionId);

    if (!session) {
      console.error('Session not found');
      return null;
    }

    // Calculate final scores
    const finalScores = Object.entries(session.scores).map(([userId, score]) => ({
      userId,
      correct: score.correct,
      total: score.total,
      accuracy: score.accuracy
    }));

    // Sort by accuracy then by speed
    finalScores.sort((a, b) => {
      if (b.accuracy !== a.accuracy) {
        return b.accuracy - a.accuracy;
      }
      return a.total - b.total; // Fewer attempts = faster
    });

    const winner = finalScores[0]?.userId;

    // Update session status
    session.status = 'completed';
    session.endedAt = new Date().toISOString();
    session.results = finalScores;
    session.winnerId = winner;

    // Save locally
    StorageManager.saveSession(session);

    // Try to save to Supabase
    if (SupabaseClient.isConfigured()) {
      SupabaseClient.endSession(sessionId, winner);

      // Record scores on leaderboard
      finalScores.forEach(result => {
        const game = session.game;
        const score = result.accuracy;
        SupabaseClient.recordScore(result.userId, game, score);
      });
    }

    return session;
  }

  /**
   * Get leaderboard for a game
   */
  static getLeaderboard(gameId, limit = 100) {
    // Try to get from Supabase first
    if (SupabaseClient.isConfigured()) {
      return SupabaseClient.getLeaderboard(gameId, limit);
    }

    // Fall back to local sessions
    const sessions = StorageManager.getSessions();
    const leaderboard = {};

    sessions
      .filter(s => s.game === gameId && s.status === 'completed')
      .forEach(session => {
        Object.entries(session.scores).forEach(([userId, score]) => {
          if (!leaderboard[userId]) {
            const player = session.players.find(p => p.id === userId);
            leaderboard[userId] = {
              userId,
              name: player?.name || 'Unknown',
              avatar: player?.avatar || '👤',
              score: score.accuracy,
              attempts: 1
            };
          } else {
            leaderboard[userId].score = (leaderboard[userId].score + score.accuracy) / 2;
            leaderboard[userId].attempts += 1;
          }
        });
      });

    return Object.values(leaderboard)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get sessions for current user
   */
  static getUserSessions(userId) {
    const sessions = StorageManager.getSessions();
    return sessions.filter(s =>
      s.host === userId || s.players.some(p => p.id === userId)
    );
  }

  /**
   * Get active sessions (waiting or active)
   */
  static getActiveSessions() {
    const sessions = StorageManager.getSessions();
    return sessions.filter(s => s.status === 'waiting' || s.status === 'active');
  }

  /**
   * Send invite to friend
   */
  static sendSessionInvite(sessionId, friendEmail) {
    const userProfile = StorageManager.getUserProfile();
    const session = StorageManager.getSessions().find(s => s.id === sessionId);

    if (!userProfile || !session) {
      console.error('User profile or session not found');
      return false;
    }

    // Send via Supabase if available
    if (SupabaseClient.isConfigured()) {
      SupabaseClient.sendFriendInvite(userProfile.id, friendEmail);
    }

    // Could also send via email or notification system
    // For now, store invite code for manual sharing
    console.log(`Share invite code: ${session.inviteCode}`);

    return true;
  }

  /**
   * Format session for display
   */
  static formatSession(session) {
    return {
      id: session.id,
      name: session.name,
      game: session.game,
      gameName: GAMES[session.game]?.name || 'Unknown Game',
      host: session.hostName,
      playersCount: session.players.length,
      maxPlayers: session.maxPlayers,
      status: session.status,
      inviteCode: session.inviteCode,
      createdAt: new Date(session.createdAt).toLocaleDateString(),
      players: session.players.map(p => ({
        name: p.name,
        avatar: p.avatar
      }))
    };
  }

  /**
   * Get session progress (for active session)
   */
  static getSessionProgress(sessionId) {
    const session = StorageManager.getSessions().find(s => s.id === sessionId);
    if (!session) return null;

    const progress = session.players.map(player => {
      const score = session.scores[player.id] || { correct: 0, total: 0, accuracy: 0 };
      return {
        name: player.name,
        avatar: player.avatar,
        correct: score.correct,
        total: score.total,
        accuracy: score.accuracy,
        position: 0
      };
    });

    // Sort by accuracy
    progress.sort((a, b) => b.accuracy - a.accuracy);
    progress.forEach((p, i) => p.position = i + 1);

    return {
      sessionId,
      game: session.game,
      status: session.status,
      progress
    };
  }

  /**
   * Create HTML leaderboard for display
   */
  static createLeaderboardHTML(leaderboard) {
    if (leaderboard.length === 0) {
      return '<p class="text-white/70">No scores yet</p>';
    }

    const medals = ['🥇', '🥈', '🥉'];

    return leaderboard
      .map((entry, index) => {
        const medal = medals[index] || '📍';
        return `
            <div class="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
                <span class="text-2xl">${medal}</span>
                <span class="text-3xl">${entry.avatar}</span>
                <div class="flex-1">
                    <p class="text-white font-semibold">${entry.name}</p>
                    <p class="text-white/70 text-sm">#${index + 1}</p>
                </div>
                <div class="text-right">
                    <p class="text-white font-bold text-lg">${entry.score || 0}%</p>
                    <p class="text-white/70 text-xs">${entry.attempts || 1} attempt(s)</p>
                </div>
            </div>
        `;
      })
      .join('');
  }

  /**
   * Create HTML for session card
   */
  static createSessionCardHTML(session) {
    const formatted = this.formatSession(session);
    const filled = `${formatted.playersCount}/${formatted.maxPlayers}`;

    const statusBadge = {
      waiting: '<span class="px-3 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full">Waiting</span>',
      active: '<span class="px-3 py-1 bg-green-500/20 text-green-200 text-xs rounded-full">Active</span>',
      completed: '<span class="px-3 py-1 bg-blue-500/20 text-blue-200 text-xs rounded-full">Completed</span>'
    };

    const playerAvatars = formatted.players
      .map(p => `<span class="text-lg">${p.avatar}</span>`)
      .join('');

    return `
        <div class="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-white">${formatted.name}</h3>
                    <p class="text-white/70 text-sm">🎮 ${formatted.gameName}</p>
                </div>
                ${statusBadge[formatted.status]}
            </div>

            <div class="space-y-3">
                <div class="flex justify-between items-center text-sm">
                    <span class="text-white/70">Host</span>
                    <span class="text-white font-semibold">${formatted.host}</span>
                </div>

                <div class="flex justify-between items-center text-sm">
                    <span class="text-white/70">Players</span>
                    <span class="text-white font-semibold">${filled}</span>
                </div>

                <div class="flex gap-1">
                    ${playerAvatars}
                </div>

                <div class="pt-3 border-t border-white/20 flex gap-2">
                    <button class="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition">
                        Join
                    </button>
                    <button class="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition">
                        Code: ${formatted.inviteCode}
                    </button>
                </div>
            </div>
        </div>
    `;
  }
}

export default MultiplayerManager;
