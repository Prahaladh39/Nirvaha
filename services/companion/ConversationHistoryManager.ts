/**
 * Conversation History Manager
 * 
 * Persists and retrieves conversation sessions locally using AsyncStorage.
 * Supports multiple conversations per mentor with auto-pruning.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConversationSession, ConversationMessage, ConversationListItem } from './types';

const CONV_PREFIX = 'NIRVAHA_CONV_';
const CONV_INDEX_KEY = 'NIRVAHA_CONV_INDEX';
const MAX_CONVERSATIONS_PER_MENTOR = 50;

interface ConversationIndex {
  sessions: ConversationListItem[];
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Create a new conversation session for a mentor.
 */
export function createConversation(mentorId: string): ConversationSession {
  const now = Date.now();
  return {
    id: `${mentorId}_${now}`,
    mentorId,
    messages: [],
    startedAt: now,
    lastActiveAt: now,
  };
}

/**
 * Save a conversation session to local storage.
 */
export async function saveConversation(session: ConversationSession): Promise<void> {
  try {
    session.lastActiveAt = Date.now();

    // Save the full conversation
    const key = `${CONV_PREFIX}${session.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(session));

    // Update the index
    await updateConversationIndex(session);
  } catch (error) {
    console.error('[ConversationHistory] Error saving conversation:', error);
  }
}

/**
 * Load a specific conversation by ID.
 */
export async function loadConversation(conversationId: string): Promise<ConversationSession | null> {
  try {
    const key = `${CONV_PREFIX}${conversationId}`;
    const stored = await AsyncStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as ConversationSession;
    }
  } catch (error) {
    console.error('[ConversationHistory] Error loading conversation:', error);
  }
  return null;
}

/**
 * Load the most recent conversation for a mentor.
 * Returns null if no conversations exist.
 */
export async function loadLatestConversation(mentorId: string): Promise<ConversationSession | null> {
  try {
    const index = await loadConversationIndex();
    const mentorSessions = index.sessions
      .filter(s => s.mentorId === mentorId)
      .sort((a, b) => b.lastActiveAt - a.lastActiveAt);

    if (mentorSessions.length === 0) return null;

    return await loadConversation(mentorSessions[0].id);
  } catch (error) {
    console.error('[ConversationHistory] Error loading latest:', error);
    return null;
  }
}

/**
 * List all conversations for a mentor (metadata only, not full messages).
 */
export async function listConversations(mentorId: string): Promise<ConversationListItem[]> {
  try {
    const index = await loadConversationIndex();
    return index.sessions
      .filter(s => s.mentorId === mentorId)
      .sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  } catch (error) {
    console.error('[ConversationHistory] Error listing conversations:', error);
    return [];
  }
}

/**
 * Delete a conversation by ID.
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    const key = `${CONV_PREFIX}${conversationId}`;
    await AsyncStorage.removeItem(key);

    // Update index
    const index = await loadConversationIndex();
    index.sessions = index.sessions.filter(s => s.id !== conversationId);
    await saveConversationIndex(index);
  } catch (error) {
    console.error('[ConversationHistory] Error deleting conversation:', error);
  }
}

/**
 * Add a message to a conversation and persist it.
 */
export async function addMessageToConversation(
  session: ConversationSession,
  message: ConversationMessage,
): Promise<ConversationSession> {
  session.messages.push(message);
  session.lastActiveAt = Date.now();
  await saveConversation(session);
  return session;
}

/**
 * Get the recent message history formatted for prompt context.
 * Returns the last N messages from the conversation.
 */
export function getRecentHistory(
  session: ConversationSession,
  maxMessages: number = 6,
): ConversationMessage[] {
  return session.messages.slice(-maxMessages);
}

// ─── Internal Helpers ───────────────────────────────────────────────

async function loadConversationIndex(): Promise<ConversationIndex> {
  try {
    const stored = await AsyncStorage.getItem(CONV_INDEX_KEY);
    if (stored) {
      return JSON.parse(stored) as ConversationIndex;
    }
  } catch (error) {
    console.error('[ConversationHistory] Error loading index:', error);
  }
  return { sessions: [] };
}

async function saveConversationIndex(index: ConversationIndex): Promise<void> {
  try {
    await AsyncStorage.setItem(CONV_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('[ConversationHistory] Error saving index:', error);
  }
}

async function updateConversationIndex(session: ConversationSession): Promise<void> {
  const index = await loadConversationIndex();

  // Create the list item
  const lastUserMsg = [...session.messages]
    .reverse()
    .find(m => m.role === 'user');
  
  const listItem: ConversationListItem = {
    id: session.id,
    mentorId: session.mentorId,
    preview: lastUserMsg?.content.slice(0, 80) || 'New conversation',
    messageCount: session.messages.length,
    startedAt: session.startedAt,
    lastActiveAt: session.lastActiveAt,
  };

  // Update or insert
  const existingIndex = index.sessions.findIndex(s => s.id === session.id);
  if (existingIndex >= 0) {
    index.sessions[existingIndex] = listItem;
  } else {
    index.sessions.push(listItem);
  }

  // Prune old conversations for this mentor
  const mentorSessions = index.sessions
    .filter(s => s.mentorId === session.mentorId)
    .sort((a, b) => b.lastActiveAt - a.lastActiveAt);

  if (mentorSessions.length > MAX_CONVERSATIONS_PER_MENTOR) {
    const toRemove = mentorSessions.slice(MAX_CONVERSATIONS_PER_MENTOR);
    for (const old of toRemove) {
      const key = `${CONV_PREFIX}${old.id}`;
      await AsyncStorage.removeItem(key);
      index.sessions = index.sessions.filter(s => s.id !== old.id);
    }
  }

  await saveConversationIndex(index);
}
