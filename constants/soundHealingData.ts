export interface SoundTrack {
  id: string;
  title: string;
  description: string;
  moodTag: string;
  icon: string;
  duration: string;
  category?: string;
  source?: number;
  loop?: boolean;
  coverImage?: string;
  artist?: string;
}

export interface SoundCategory {
  id: string;
  title: string;
  description: string;
  moodTag: string;
  icon: string;
  trackCount: number;
  colors: [string, string];
  coverImage?: number;
}

export interface SoundRecommendation {
  id: string;
  label: string;
  mood: string;
  duration: string;
  icon: string;
}

export interface WellnessPackage {
  id: string;
  title: string;
  purpose: string;
  duration: string;
  trackCount: number;
  icon: string;
  colors: [string, string];
  coverImage?: string;
}

export interface JourneySession extends SoundTrack {
  day: number;
}

// ─────────────────────────────────────────────
// Sound Healing Categories (3 categories)
// ─────────────────────────────────────────────

export const soundHealingCategories: SoundCategory[] = [
  {
    id: 'healing-vibes',
    title: 'Healing Vibes',
    description: 'Binaural beats and meditative frequencies for deep mental calm.',
    moodTag: 'Meditation & Focus',
    icon: '🧘',
    trackCount: 3,
    colors: ['#273A57', '#151A2D'],
    coverImage: require('../assets/images/sound-healing/healing-vibes.png'),
  },
  {
    id: 'ancient-music',
    title: 'Ancient Music',
    description: 'Sacred chants, classical ragas, and ancient flute melodies.',
    moodTag: 'Spiritual Heritage',
    icon: '🕉️',
    trackCount: 3,
    colors: ['#4A2E5D', '#201327'],
    coverImage: require('../assets/images/sound-healing/ancient-music.png'),
  },
  {
    id: 'nature-therapy',
    title: 'Nature Therapy',
    description: 'Ocean waves, flowing rivers, and gentle waterfalls for restoration.',
    moodTag: 'Deep Relaxation',
    icon: '🌿',
    trackCount: 3,
    colors: ['#1E4D43', '#102822'],
    coverImage: require('../assets/images/sound-healing/nature-therapy.png'),
  },
];

// ─────────────────────────────────────────────
// Tracks per category (3 tracks each - All set to loop: true)
// ─────────────────────────────────────────────

export const categoryTracks: Record<string, SoundTrack[]> = {
  'healing-vibes': [
    {
      id: 'natures-eye-meditation',
      title: "Nature's Eye Meditation",
      description: 'Peaceful binaural meditation for clarity and inner calm.',
      moodTag: 'Meditation',
      icon: '🧘',
      duration: '5:30',
      category: 'healing-vibes',
      artist: "Nature's Eye",
      loop: true,
      source: require('../assets/audio/natureseye-blue-sky-binaural-meditation-191542.mp3'),
    },
    {
      id: '30-sec-binaural-drift',
      title: '30-Second Binaural Drift',
      description: 'A quick binaural micro-session for instant grounding.',
      moodTag: 'Focus',
      icon: '🎧',
      duration: '0:30',
      category: 'healing-vibes',
      artist: 'Kaazoom',
      loop: true,
      source: require('../assets/audio/kaazoom-drifting-away-30-sec-edit-binaural-beats-409305.mp3'),
    },
    {
      id: 'pure-binaural-brain-waves',
      title: 'Pure Binaural Brain Waves',
      description: '13 Hz SMR binaural beats layered with gentle rain.',
      moodTag: 'Brain Sync',
      icon: '〰️',
      duration: '6:00',
      category: 'healing-vibes',
      artist: 'Pure Binaural',
      loop: true,
      source: require('../assets/audio/purebinaural-purebinaural-13-hz-smr-binaural-beats-with-rain-457285.mp3'),
    },
  ],
  'ancient-music': [
    {
      id: 'ancient-spirit-echoes',
      title: 'Ancient Spirit Echoes',
      description: 'Sacred Om chanting for deep grounding and spiritual balance.',
      moodTag: 'Chanting',
      icon: '🕉️',
      duration: '4:00',
      category: 'ancient-music',
      artist: 'Ribhav Agrawal',
      loop: true,
      source: require('../assets/audio/ribhavagrawal-ancient-spirit-echoes-om-chanting-234045.mp3'),
    },
    {
      id: 'healing-waters-flute',
      title: 'Healing Waters Flute',
      description: 'Ancient flute melodies blended with flowing water ambience.',
      moodTag: 'Calm',
      icon: '🪈',
      duration: '5:00',
      category: 'ancient-music',
      artist: 'Aniklo',
      loop: true,
      source: require('../assets/audio/aniklo-healing-waters-and-ancient-flute-555172.mp3'),
    },
    {
      id: 'indian-classical-raga',
      title: 'Indian Classical Raga',
      description: 'Traditional raga composition for contemplation and rest.',
      moodTag: 'Classical',
      icon: '🎵',
      duration: '6:30',
      category: 'ancient-music',
      artist: 'Alex Morgan',
      loop: true,
      source: require('../assets/audio/alex-morgan-indian-classical-raga-537491.mp3'),
    },
  ],
  'nature-therapy': [
    {
      id: 'ocean-waves',
      title: 'Ocean Waves',
      description: 'Rhythmic ocean waves for deep relaxation and sleep.',
      moodTag: 'Sleep',
      icon: '🌊',
      duration: '5:00',
      category: 'nature-therapy',
      artist: 'Chosic',
      loop: true,
      source: require('../assets/audio/ocean-waves-sounds(chosic.com).mp3'),
    },
    {
      id: 'whispering-waters',
      title: 'Whispering Waters',
      description: 'Gentle water echoes for unwinding and mental clarity.',
      moodTag: 'Calm',
      icon: '💧',
      duration: '4:30',
      category: 'nature-therapy',
      artist: 'StockTune',
      loop: true,
      source: require('../assets/audio/StockTune-Whispering Waters Echo_1785847730.mp3'),
    },
    {
      id: 'soft-waterfall',
      title: 'Soft Waterfall',
      description: 'Ambient chill music layered with natural waterfall sounds.',
      moodTag: 'Restoration',
      icon: '🏞️',
      duration: '5:30',
      category: 'nature-therapy',
      artist: 'Juliush',
      loop: true,
      source: require('../assets/audio/juliush-soft-waterfall-ambient-chill-music-and-nature-sounds-3627.mp3'),
    },
  ],
};

// ─────────────────────────────────────────────
// All tracks combined (flat list for the main screen & player)
// ─────────────────────────────────────────────

export const localSoundTracks: SoundTrack[] = [
  ...categoryTracks['healing-vibes'],
  ...categoryTracks['ancient-music'],
  ...categoryTracks['nature-therapy'],
];

// ─────────────────────────────────────────────
// Recommendations (kept for feature compatibility)
// ─────────────────────────────────────────────

export const recommendations: SoundRecommendation[] = [
  { id: 'calm-reset', label: 'Calm Reset', mood: 'Calm', duration: '5 min', icon: '🌿' },
  { id: 'deep-focus', label: 'Deep Focus', mood: 'Focused', duration: '6 min', icon: '🎧' },
  { id: 'sleep-ease', label: 'Sleep Ease', mood: 'Rest', duration: '5 min', icon: '🌙' },
];

// ─────────────────────────────────────────────
// Wellness Packages & Journey Sessions (kept for feature compatibility)
// ─────────────────────────────────────────────

export const wellnessPackages: WellnessPackage[] = [];

export const journeySessions: Record<string, JourneySession[]> = {};

// Legacy exports kept for backward compatibility
export const sampleTracks: SoundTrack[] = [];
