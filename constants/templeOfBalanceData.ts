export type Family = 'work' | 'rest' | 'relationships' | 'growth';

export interface TileEffect {
  work?: number;
  rest?: number;
  relationships?: number;
  growth?: number;
  stability?: number;
}

export interface TileData {
  id: string;
  name: string;
  family: Family;
  desc: string;
  effects: TileEffect;
}

export interface EventData {
  name: string;
  effects: TileEffect;
  text: string;
}

export const THEME_COLORS = {
  work: '#d97706', // amber/gold
  rest: '#3b82f6', // blue/cool
  relationships: '#ec4899', // rose/pink
  growth: '#14b8a6', // teal/green
  stability: '#8b5cf6', // purple (for stability indicator)
  balanceCore: '#facc15', // bright yellow/gold for the center
};

export const INITIAL_STATS = {
  work: 50,
  rest: 50,
  relationships: 50,
  growth: 50,
  stability: 100
};

export const ZONE_MULTIPLIER = {
  inner_ring: 1.25,   // stronger impact
  edge: 0.85,         // softened
  corner: 1.15,       // stronger risk + reward
  normal: 1.0         // all other cells
};

export const TILES: TileData[] = [
  // WORK
  { id: 'deep_focus', name: 'Deep Focus', family: 'work', desc: 'Enter a flow state', effects: { work: 12, growth: 4, rest: -6 } },
  { id: 'deadline_push', name: 'Deadline Push', family: 'work', desc: 'Push through pressure', effects: { work: 10, rest: -10, relationships: -3 } },
  { id: 'finish_project', name: 'Finish Project', family: 'work', desc: 'Complete what you started', effects: { work: 8, growth: 6, rest: -5 } },
  { id: 'admin_tasks', name: 'Admin Tasks', family: 'work', desc: 'Clear the backlog', effects: { work: 6, rest: -3 } },

  // REST
  { id: 'sleep_early', name: 'Sleep Early', family: 'rest', desc: 'Recover deeply', effects: { rest: 14, work: -4 } },
  { id: 'quiet_evening', name: 'Quiet Evening', family: 'rest', desc: 'Decompress at home', effects: { rest: 10, relationships: 3 } },
  { id: 'take_a_walk', name: 'Take a Walk', family: 'rest', desc: 'Reset with movement', effects: { rest: 8, growth: 4, work: -2 } },
  { id: 'digital_detox', name: 'Digital Detox', family: 'rest', desc: 'Disconnect to recharge', effects: { rest: 12, relationships: 4, work: -6 } },

  // RELATIONSHIPS
  { id: 'family_dinner', name: 'Family Dinner', family: 'relationships', desc: 'Reconnect with loved ones', effects: { relationships: 14, rest: 4, work: -5 } },
  { id: 'call_a_friend', name: 'Call a Friend', family: 'relationships', desc: 'Maintain a connection', effects: { relationships: 10, growth: 3 } },
  { id: 'help_someone', name: 'Help Someone', family: 'relationships', desc: 'Give your time freely', effects: { relationships: 12, growth: 4, rest: -4 } },
  { id: 'shared_time', name: 'Shared Time', family: 'relationships', desc: 'Be present together', effects: { relationships: 10, rest: 5, work: -4 } },

  // GROWTH
  { id: 'read_reflect', name: 'Read & Reflect', family: 'growth', desc: 'Expand your perspective', effects: { growth: 12, rest: 4, work: -3 } },
  { id: 'learn_skill', name: 'Learn Skill', family: 'growth', desc: 'Build new capability', effects: { growth: 14, work: 4, rest: -4 } },
  { id: 'creative_practice', name: 'Creative Practice', family: 'growth', desc: 'Make something original', effects: { growth: 10, rest: 3, work: -2 } },
  { id: 'mentor_conversation', name: 'Mentor Conversation', family: 'growth', desc: 'Learn from experience', effects: { growth: 10, relationships: 6, work: -3 } },
];

export const EVENTS: EventData[] = [
  { name: 'Deadline Pressure', effects: { work: 6, rest: -8 }, text: 'An urgent deadline arrived.' },
  { name: 'Quiet Weekend', effects: { rest: 8, growth: 3 }, text: 'You found unexpected downtime.' },
  { name: 'Unexpected Expense', effects: { work: 4, stability: -6 }, text: 'An unplanned cost appeared.' },
  { name: 'Family Obligation', effects: { relationships: 6, work: -5, rest: -3 }, text: 'Family needed your presence.' },
  { name: 'Positive Feedback', effects: { work: 5, growth: 4 }, text: 'Your effort was recognised.' },
  { name: 'New Inspiration', effects: { growth: 8, rest: -3 }, text: 'A new idea lit you up.' },
  { name: 'Poor Sleep', effects: { rest: -10, work: -4 }, text: 'You couldn\'t rest properly.' },
  { name: 'Social Conflict', effects: { relationships: -8, stability: -4 }, text: 'Tension arose with someone close.' },
  { name: 'Friend Needs Help', effects: { relationships: 8, rest: -5, work: -3 }, text: 'A friend reached out in need.' },
  { name: 'Burnout Warning', effects: { work: -6, rest: -6, stability: -5 }, text: 'Your system is showing strain.' },
];
