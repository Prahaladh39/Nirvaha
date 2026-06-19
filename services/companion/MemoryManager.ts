/**
 * Memory Manager
 * 
 * Maintains long-term user memory across conversations.
 * Stores concise summaries — not full conversation transcripts.
 * 
 * Remembers: recurring struggles, personal goals, life events,
 * preferred mentor, and emotional themes over time.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserMemory, EmotionalState, ConversationMessage, EmotionalHistoryEntry } from './types';

const MEMORY_KEY = 'NIRVAHA_USER_MEMORY';
const MAX_THEMES = 15;
const MAX_GOALS = 10;
const MAX_LIFE_EVENTS = 10;
const MAX_EMOTIONAL_HISTORY = 50;

// ─── Theme Extraction Keywords ──────────────────────────────────────

const THEME_KEYWORDS: Record<string, string[]> = {
  'work-life balance': ['balance', 'overworking', 'boundaries at work', 'too many hours'],
  'self-worth': ['not good enough', 'deserve', 'worthy', 'value myself', 'self-esteem'],
  'communication': ['can\'t express', 'say what i feel', 'communicate', 'speak up', 'voice'],
  'boundaries': ['boundaries', 'saying no', 'people pleasing', 'can\'t say no'],
  'trust': ['trust', 'betrayed', 'lied', 'honest', 'transparency'],
  'change': ['change', 'transition', 'new chapter', 'starting over', 'reinvent'],
  'comparison': ['compare', 'comparison', 'social media', 'everyone else', 'behind'],
  'identity': ['who am i', 'identity', 'lost myself', 'don\'t know myself'],
  'control': ['control', 'letting go', 'can\'t control', 'powerless'],
  'perfectionism': ['perfect', 'perfectionism', 'not enough', 'standards'],
};

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Load the user's memory from local storage.
 */
export async function loadMemory(): Promise<UserMemory> {
  try {
    const stored = await AsyncStorage.getItem(MEMORY_KEY);
    if (stored) {
      return JSON.parse(stored) as UserMemory;
    }
  } catch (error) {
    console.error('[MemoryManager] Error loading memory:', error);
  }

  // Return empty memory structure
  return createEmptyMemory();
}

/**
 * Save the user's memory to local storage.
 */
export async function saveMemory(memory: UserMemory): Promise<void> {
  try {
    memory.lastUpdated = Date.now();
    await AsyncStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (error) {
    console.error('[MemoryManager] Error saving memory:', error);
  }
}

/**
 * Update memory after a conversation.
 * Extracts themes, updates emotional history, and tracks mentor preference.
 */
export async function updateMemoryFromConversation(
  mentorId: string,
  messages: ConversationMessage[],
  emotionalState: EmotionalState,
): Promise<void> {
  const memory = await loadMemory();

  // Extract themes from user messages
  const userMessages = messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ')
    .toLowerCase();

  const newThemes = extractThemes(userMessages);
  for (const theme of newThemes) {
    if (!memory.recurringThemes.includes(theme)) {
      memory.recurringThemes.push(theme);
    }
  }
  // Keep only the most recent themes
  memory.recurringThemes = memory.recurringThemes.slice(-MAX_THEMES);

  // Extract goals (look for future-oriented statements)
  const goals = extractGoals(userMessages);
  for (const goal of goals) {
    if (!memory.personalGoals.some(g => g.toLowerCase() === goal.toLowerCase())) {
      memory.personalGoals.push(goal);
    }
  }
  memory.personalGoals = memory.personalGoals.slice(-MAX_GOALS);

  // Update emotional history
  const emotionalEntry: EmotionalHistoryEntry = {
    state: emotionalState,
    mentorId,
    timestamp: Date.now(),
  };
  memory.emotionalHistory.push(emotionalEntry);
  memory.emotionalHistory = memory.emotionalHistory.slice(-MAX_EMOTIONAL_HISTORY);

  // Update preferred mentor (most frequently used)
  const mentorCounts: Record<string, number> = {};
  for (const entry of memory.emotionalHistory) {
    if (entry.mentorId !== 'nirvaha') {
      mentorCounts[entry.mentorId] = (mentorCounts[entry.mentorId] || 0) + 1;
    }
  }
  const topMentor = Object.entries(mentorCounts).sort(([, a], [, b]) => b - a)[0];
  if (topMentor) {
    memory.preferredMentorId = topMentor[0];
  }

  await saveMemory(memory);
}

/**
 * Get a concise memory summary for prompt injection.
 * Returns empty string if no meaningful memory exists.
 */
export async function getMemorySummary(mentorId: string): Promise<string> {
  const memory = await loadMemory();
  const parts: string[] = [];

  if (memory.recurringThemes.length > 0) {
    parts.push(`Recurring themes in previous conversations: ${memory.recurringThemes.slice(-5).join(', ')}.`);
  }

  if (memory.personalGoals.length > 0) {
    parts.push(`Goals they've mentioned: ${memory.personalGoals.slice(-3).join('; ')}.`);
  }

  if (memory.lifeEvents.length > 0) {
    parts.push(`Important life events: ${memory.lifeEvents.slice(-3).join('; ')}.`);
  }

  // Recent emotional trend
  const recentEmotions = memory.emotionalHistory
    .filter(e => e.mentorId === mentorId)
    .slice(-5)
    .map(e => e.state);
  
  if (recentEmotions.length >= 2) {
    const uniqueEmotions = [...new Set(recentEmotions)];
    parts.push(`Recent emotional states with you: ${uniqueEmotions.join(', ')}.`);
  }

  if (parts.length === 0) {
    return '';
  }

  return `What you know about this person from past conversations:\n${parts.join('\n')}`;
}

// ─── Internal Helpers ───────────────────────────────────────────────

function createEmptyMemory(): UserMemory {
  return {
    recurringThemes: [],
    personalGoals: [],
    lifeEvents: [],
    emotionalHistory: [],
    lastUpdated: Date.now(),
  };
}

function extractThemes(text: string): string[] {
  const found: string[] = [];
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        found.push(theme);
        break; // Only add theme once
      }
    }
  }
  return found;
}

function extractGoals(text: string): string[] {
  const goals: string[] = [];
  const goalPatterns = [
    /i want to (.+?)(?:\.|,|$)/gi,
    /my goal is (.+?)(?:\.|,|$)/gi,
    /i'm trying to (.+?)(?:\.|,|$)/gi,
    /i need to (.+?)(?:\.|,|$)/gi,
    /i hope to (.+?)(?:\.|,|$)/gi,
  ];

  for (const pattern of goalPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const goal = match[1].trim();
      if (goal.length > 5 && goal.length < 100) {
        goals.push(goal);
      }
    }
  }

  return goals.slice(0, 3); // Max 3 goals per conversation
}
