// Supabase Konfiguration
// Ersetze mit deinen Supabase-Zugangsdaten von https://supabase.com

export const SUPABASE_CONFIG = {
  url: 'DEINE_SUPABASE_URL',
  anonKey: 'DEIN_SUPABASE_ANONKEY',
  // Für Entwicklung/Test auf null setzen und nur localStorage verwenden
  enabled: false // Auf true setzen wenn Supabase konfiguriert ist
};

// LocalStorage Schlüssel
export const LOCAL_STORAGE_KEYS = {
  userProfile: 'abc_benutzerprofil',
  gameScores: 'abc_spielpunkte',
  stories: 'abc_geschichten',
  sessions: 'abc_sitzungen',
  friendsList: 'abc_freundesliste',
  achievements: 'abc_erfolge'
};

// Spielkonfiguration
export const GAMES = {
  alphabet: {
    id: 'alphabet',
    name: 'Alphabet Übung',
    icon: '🔤',
    description: 'Lerne und übe Buchstaben',
    color: '#fbc2eb',
    path: 'alphabet-game.html',
    sessionLengthMinutes: 10  // 3-6 jährige
  },
  wordGuess: {
    id: 'word-guess',
    name: 'Wortratespiel',
    icon: '📝',
    description: 'Vervollständige Wörter',
    color: '#a6c1ee',
    path: 'word-guess.html',
    sessionLengthMinutes: 10
  },
  soundRecognition: {
    id: 'sound-recognition',
    name: 'Laut-Gehör Spiel',
    icon: '🎵',
    description: 'Höre und erkenne Laute',
    color: '#f093fb',
    path: 'sound-recognition.html',
    sessionLengthMinutes: 8
  },
  patternRecognition: {
    id: 'pattern-recognition',
    name: 'Muster Erkennungs Spiel',
    icon: '🧩',
    description: 'Erkenne Muster',
    color: '#667eea',
    path: 'pattern-recognition.html',
    sessionLengthMinutes: 12
  },
  storyBuilder: {
    id: 'story-builder',
    name: 'Geschichte Schreiben',
    icon: '📖',
    description: 'Erstelle deine Geschichten',
    color: '#f5576c',
    path: 'story-builder.html',
    sessionLengthMinutes: 15
  },
  colorSorting: {
    id: 'color-sorting',
    name: 'Farb-Sortier Spiel',
    icon: '🎨',
    description: 'Sortiere Objekte nach Farben',
    color: '#667eea',
    path: 'color-sorting.html',
    sessionLengthMinutes: 10
  },
  rhymeMemory: {
    id: 'rhyme-memory',
    name: 'Reim-Memory Spiel',
    icon: '🎵',
    description: 'Finde Wörter die sich reimen',
    color: '#FF6B9D',
    path: 'rhyme-memory.html',
    sessionLengthMinutes: 12
  }
};

// Erfolge Definitionen
export const ACHIEVEMENTS = {
  firstStory: {
    id: 'erste_geschichte',
    name: 'Geschichtenerzähler',
    description: 'Deine erste Geschichte erstellt',
    icon: '📖',
    requirement: { type: 'stories_created', value: 1 }
  },
  accuracyMaster: {
    id: 'genauigkeit_meister',
    name: 'Genauigkeits-Meister',
    description: '95% Genauigkeit erreicht',
    icon: '🎯',
    requirement: { type: 'accuracy', value: 95 }
  },
  speedDemon: {
    id: 'schnelligkeit_daemon',
    name: 'Schnelligkeit-Daemon',
    description: '50 Aufgaben abgeschlossen',
    icon: '⚡',
    requirement: { type: 'challenges_completed', value: 50 }
  },
  socialButterfly: {
    id: 'soziale_schmetteling',
    name: 'Sozialer Schmetterling',
    description: '5 Freunde eingeladen',
    icon: '🦋',
    requirement: { type: 'friends_invited', value: 5 }
  },
  gameChampion: {
    id: 'spiel_meister',
    name: 'Spiel-Meister',
    description: 'Eine Multiplayer-Sitzung gewonnen',
    icon: '🏆',
    requirement: { type: 'sessions_won', value: 1 }
  }
};
