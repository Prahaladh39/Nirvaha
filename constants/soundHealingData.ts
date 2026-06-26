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
}

export interface SoundCategory {
  id: string;
  title: string;
  description: string;
  moodTag: string;
  icon: string;
  trackCount: number;
  colors: [string, string];
  coverImage?: string;
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

export const recommendations: SoundRecommendation[] = [
  { id: 'calm-reset', label: 'Calm Reset', mood: 'Calm', duration: '8 min', icon: '🌿' },
  { id: 'deep-focus', label: 'Deep Focus', mood: 'Focused', duration: '15 min', icon: '🎧' },
  { id: 'sleep-ease', label: 'Sleep Ease', mood: 'Rest', duration: '22 min', icon: '🌙' },
  { id: 'soft-release', label: 'Soft Release', mood: 'Release', duration: '12 min', icon: '✨' },
];

export const localSoundTracks: SoundTrack[] = [
  {
    id: 'desert-glass-loop',
    title: 'Desert Glass',
    description: 'A one-minute shimmer built for continuous looping.',
    moodTag: 'Loop',
    icon: '🏜️',
    duration: '1:00',
    source: require('../assets/audio/desert-glass-loop.mp3'),
    loop: true,
    coverImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'desert-glass',
    title: 'Desert Glass Extended',
    description: 'Warm, reflective textures for longer stillness.',
    moodTag: 'Stillness',
    icon: '✨',
    duration: '2:00',
    source: require('../assets/audio/desert-glass.mp3'),
    coverImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'eternal-courtyard-of-dawn',
    title: 'Eternal Courtyard of Dawn',
    description: 'A soft sunrise soundscape for spacious mornings.',
    moodTag: 'Dawn',
    icon: '🌅',
    duration: '2:00',
    source: require('../assets/audio/eternal-courtyard-of-dawn.mp3'),
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'clouds-over-quiet-hills',
    title: 'Clouds Over Quiet Hills',
    description: 'A short ambient pause for easing the mind.',
    moodTag: 'Calm',
    icon: '☁️',
    duration: '1:00',
    source: require('../assets/audio/clouds-over-quiet-hills.mp3'),
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'conch-tides',
    title: 'Conch Tides',
    description: 'Tidal resonance with a meditative coastal pull.',
    moodTag: 'Breath',
    icon: '🐚',
    duration: '1:00',
    source: require('../assets/audio/conch-tides.mp3'),
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'spiral-tides',
    title: 'Spiral Tides',
    description: 'Circular wave patterns for steady inner movement.',
    moodTag: 'Flow',
    icon: '🌊',
    duration: '2:00',
    source: require('../assets/audio/spiral-tides.mp3'),
    coverImage: 'https://tse2.mm.bing.net/th/id/OIP.2OrheTrjo6uUmw3B31mpEQHaHa?r=0&cb=thfvnextfalcon&w=700&h=700&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: 'whispering-pines',
    title: 'Whispering Pines',
    description: 'Forest-toned ambience for grounding and restoration.',
    moodTag: 'Grounding',
    icon: '🌲',
    duration: '2:00',
    source: require('../assets/audio/whispering-pines.mp3'),
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'lotus-breath-at-dawn',
    title: 'Lotus Breath at Dawn',
    description: 'A gentle dawn practice for breath and presence.',
    moodTag: 'Breathwork',
    icon: '🪷',
    duration: '2:00',
    source: require('../assets/audio/lotus-breath-at-dawn.mp3'),
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
  },
];

export const soundHealingCategories: SoundCategory[] = [
  {
    id: 'binaural',
    title: 'Binaural Tones',
    description: 'Layered tones for focus, calm, and mental clarity.',
    moodTag: 'Focus & Clarity',
    icon: '🎧',
    trackCount: 12,
    colors: ['#273A57', '#151A2D'],
    coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'mantras',
    title: 'Mantras',
    description: 'Repetitive sacred sound for grounding and balance.',
    moodTag: 'Spiritual Balance',
    icon: '🕉️',
    trackCount: 18,
    colors: ['#4A2E5D', '#201327'],
    coverImage: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'nature',
    title: 'Nature Sounds',
    description: 'Rain, forest, ocean, and windscapes for deep rest.',
    moodTag: 'Deep Relaxation',
    icon: '🌧️',
    trackCount: 24,
    colors: ['#1E4D43', '#102822'],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'frequency',
    title: 'Healing Frequencies',
    description: 'Warm frequency beds for meditation and restoration.',
    moodTag: 'Cellular Healing',
    icon: '〰️',
    trackCount: 9,
    colors: ['#5A4422', '#241A0D'],
    coverImage: 'https://img.freepik.com/premium-photo/psychic-waves-resonating-with-frequencies-universe-into-energetic-resonance_942736-1256.jpg',
  },
  {
    id: 'breath',
    title: 'Breath Rhythms',
    description: 'Steady pulses to support slow breathing practices.',
    moodTag: 'Breathwork',
    icon: '🌬️',
    trackCount: 8,
    colors: ['#285065', '#12212B'],
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'grounding',
    title: 'Grounding Drones',
    description: 'Low, stable tones for moments that feel scattered.',
    moodTag: 'Grounding',
    icon: '🪨',
    trackCount: 10,
    colors: ['#3B3A2A', '#191915'],
    coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sleep',
    title: 'Sleep Recovery',
    description: 'Gentle sounds for winding down before sleep.',
    moodTag: 'Sleep',
    icon: '🌙',
    trackCount: 14,
    colors: ['#2B315F', '#111527'],
    coverImage: 'https://img.freepik.com/premium-vector/cartoon-illustration-kid-sleeping_29937-9370.jpg?w=2000',
  },
  {
    id: 'focus',
    title: 'Focus Fields',
    description: 'Minimal sound beds designed for quiet productivity.',
    moodTag: 'Productivity',
    icon: '🎯',
    trackCount: 11,
    colors: ['#2C4D3D', '#111F19'],
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
  },
];

export const sampleTracks: SoundTrack[] = [
  {
    id: 'morning-harmonics',
    title: 'Morning Harmonics',
    description: 'A gentle tonal field to begin with clarity.',
    category: 'binaural',
    duration: '10:00',
    moodTag: 'Clarity',
    icon: '🌅',
  },
  {
    id: 'golden-stillness',
    title: 'Golden Stillness',
    description: 'Soft resonance for emotional settling.',
    category: 'frequency',
    duration: '18:00',
    moodTag: 'Calm',
    icon: '✨',
  },
];

export const categoryTracks: Record<string, SoundTrack[]> = {
  binaural: [
    { id: 'alpha-clarity', title: 'Alpha Clarity', description: 'Balanced alpha tones for spacious focus.', moodTag: 'Focus', icon: '🎧', duration: '14:00', category: 'binaural' },
    { id: 'theta-drift', title: 'Theta Drift', description: 'A slower tone bed for reflective calm.', moodTag: 'Meditation', icon: '〰️', duration: '20:00', category: 'binaural' },
    { id: 'deep-work-pulse', title: 'Deep Work Pulse', description: 'Subtle pulses for sustained concentration.', moodTag: 'Productivity', icon: '🎯', duration: '25:00', category: 'binaural' },
  ],
  mantras: [
    { id: 'om-current', title: 'Om Current', description: 'A warm chant loop for grounding.', moodTag: 'Grounding', icon: '🕉️', duration: '12:00', category: 'mantras' },
    { id: 'heart-mantra', title: 'Heart Mantra', description: 'Soft vocal repetition for self-compassion.', moodTag: 'Balance', icon: '💛', duration: '16:00', category: 'mantras' },
  ],
  nature: [
    { id: 'forest-rain', title: 'Forest Rain', description: 'Layered rainfall with distant leaves.', moodTag: 'Rest', icon: '🌧️', duration: '30:00', category: 'nature' },
    { id: 'ocean-breath', title: 'Ocean Breath', description: 'Long wave cycles for slow breathing.', moodTag: 'Calm', icon: '🌊', duration: '22:00', category: 'nature' },
    { id: 'night-garden', title: 'Night Garden', description: 'A quiet nocturnal soundscape for sleep.', moodTag: 'Sleep', icon: '🌙', duration: '35:00', category: 'nature' },
  ],
  frequency: [
    { id: 'gold-528', title: 'Golden 528', description: 'A bright frequency bed for release.', moodTag: 'Healing', icon: '✨', duration: '18:00', category: 'frequency' },
    { id: 'root-396', title: 'Root 396', description: 'Low resonance for steadiness.', moodTag: 'Grounding', icon: '🪨', duration: '15:00', category: 'frequency' },
  ],
  breath: [
    { id: 'box-breath-tone', title: 'Box Breath Tone', description: 'Four-count tonal cues for breathing.', moodTag: 'Breathwork', icon: '🌬️', duration: '6:00', category: 'breath' },
    { id: 'long-exhale', title: 'Long Exhale', description: 'A descending tone pattern for unwinding.', moodTag: 'Relax', icon: '🍃', duration: '8:00', category: 'breath' },
  ],
  grounding: [
    { id: 'earth-hum', title: 'Earth Hum', description: 'Low drones for feeling settled.', moodTag: 'Grounding', icon: '🪨', duration: '17:00', category: 'grounding' },
    { id: 'steady-center', title: 'Steady Center', description: 'Minimal resonance for overwhelm.', moodTag: 'Balance', icon: '◎', duration: '13:00', category: 'grounding' },
  ],
  sleep: [
    { id: 'midnight-lake', title: 'Midnight Lake', description: 'Soft water and distant low tones.', moodTag: 'Sleep', icon: '🌙', duration: '40:00', category: 'sleep' },
    { id: 'dream-haze', title: 'Dream Haze', description: 'A warm ambient drift for bedtime.', moodTag: 'Rest', icon: '☁️', duration: '32:00', category: 'sleep' },
  ],
  focus: [
    { id: 'clear-field', title: 'Clear Field', description: 'Clean sound for focused work.', moodTag: 'Focus', icon: '🎯', duration: '28:00', category: 'focus' },
    { id: 'quiet-arc', title: 'Quiet Arc', description: 'A subtle arc of tone for flow state.', moodTag: 'Flow', icon: '〰️', duration: '24:00', category: 'focus' },
  ],
};

export const wellnessPackages: WellnessPackage[] = [
  { id: 'pregnancy', title: 'Gentle Motherhood', purpose: 'Soft grounding for pregnancy transitions', duration: '7 days', trackCount: 7, icon: '🤍', colors: ['#5D3F52', '#2A1A25'], coverImage: 'https://images.unsplash.com/photo-1516589174382-c68555f1480e?q=80&w=800&auto=format&fit=crop' },
  { id: 'exam', title: 'Exam Calm', purpose: 'Focus and steadiness before study or tests', duration: '5 days', trackCount: 5, icon: '📚', colors: ['#2F4969', '#142133'], coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop' },
  { id: 'employee', title: 'Workday Reset', purpose: 'Short sessions for busy professionals', duration: '6 days', trackCount: 6, icon: '💼', colors: ['#2D5A4C', '#172D27'], coverImage: 'https://images.unsplash.com/photo-1499209974431-9eaa37a11944?q=80&w=800&auto=format&fit=crop' },
  { id: 'emotional', title: 'Emotional Release', purpose: 'Sound rituals for heavy feelings', duration: '8 days', trackCount: 8, icon: '💛', colors: ['#684B25', '#2B1E0F'], coverImage: 'https://images.unsplash.com/photo-1506126279646-a6602b7d3466?q=80&w=800&auto=format&fit=crop' },
  { id: 'sleep-recovery', title: 'Sleep Recovery', purpose: 'Evening cues for consistent rest', duration: '10 days', trackCount: 10, icon: '🌙', colors: ['#2A3166', '#11162B'], coverImage: 'https://images.unsplash.com/photo-1511295742364-911243512971?q=80&w=800&auto=format&fit=crop' },
  { id: 'anxiety', title: 'Anxiety Ease', purpose: 'Breath-led sounds for nervous system care', duration: '7 days', trackCount: 7, icon: '🌬️', colors: ['#285C63', '#10262A'], coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' },
];

export const journeySessions: Record<string, JourneySession[]> = Object.fromEntries(
  wellnessPackages.map((pkg) => [
    pkg.id,
    Array.from({ length: Math.min(pkg.trackCount, 6) }, (_, index) => ({
      id: `${pkg.id}-day-${index + 1}`,
      day: index + 1,
      title: index === 0 ? 'Arrive Gently' : index === 1 ? 'Find Your Rhythm' : index === 2 ? 'Release Tension' : index === 3 ? 'Settle Deeper' : index === 4 ? 'Restore Balance' : 'Carry It Forward',
      description: `Day ${index + 1} of ${pkg.title.toLowerCase()}, designed to meet you where you are.`,
      moodTag: `Day ${index + 1}`,
      icon: pkg.icon,
      duration: index < 2 ? '8:00' : index < 4 ? '12:00' : '15:00',
      category: pkg.id,
    })),
  ])
);
