/**
 * Nirvaha AI Companion Platform — Shared Types & Interfaces
 * 
 * Central type definitions for the entire companion system.
 * All services import from this file to maintain consistency.
 */

// ─── Emotional States ──────────────────────────────────────────────

export type EmotionalState =
  | 'anxiety'
  | 'stress'
  | 'burnout'
  | 'self_doubt'
  | 'grief'
  | 'loneliness'
  | 'relationship_struggles'
  | 'career_confusion'
  | 'family_conflict'
  | 'purpose_crisis'
  | 'motivation'
  | 'happiness'
  | 'reflection';

export interface EmotionAnalysisResult {
  primary: EmotionalState;
  confidence: number; // 0-1
  secondary?: EmotionalState;
}

// ─── Domain Scope ───────────────────────────────────────────────────

export interface DomainScope {
  /** Topics this companion is an expert in */
  inScope: string[];
  /** Topics explicitly outside this companion's expertise */
  outOfScope: string[];
  /** Personality-consistent sentence for redirecting off-domain queries */
  deflectionStyle: string;
}

// ─── Mentor Personality ─────────────────────────────────────────────

export interface MentorPersonality {
  /** Matches the companion ID from companionsData */
  id: string;
  /** Display name */
  name: string;
  /** Areas of focus */
  focusAreas: string[];
  /** Clearly defined domain boundaries for this companion */
  domainScope: DomainScope;
  /** Communication style descriptors */
  speakingStyle: string[];
  /** Words and phrases this mentor naturally uses */
  vocabularyHints: string[];
  /** Things this mentor intentionally avoids */
  avoidances: string[];
  /** Greeting templates — randomly selected for conversation start */
  greetingTemplates: string[];
  /** Which emotional states this mentor handles best */
  emotionalStrengths: EmotionalState[];
  /** Example responses showing the mentor's voice */
  responseExamples: ResponseExample[];
  /** Base system instruction unique to this mentor */
  systemPersonality: string;
}

export interface ResponseExample {
  userMessage: string;
  mentorResponse: string;
}

// ─── Wisdom Patterns ────────────────────────────────────────────────

export interface WisdomPattern {
  id: string;
  name: string;
  description: string;
  reflectionPrompt: string;
  /** Emotional states where this pattern is most relevant */
  relevantEmotions: EmotionalState[];
  /** Mentor IDs that particularly align with this pattern (empty = all) */
  alignedMentors?: string[];
}

// ─── Conversation ───────────────────────────────────────────────────

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  emotionalState?: EmotionalState;
}

export interface ConversationSession {
  id: string;
  mentorId: string;
  messages: ConversationMessage[];
  startedAt: number;
  lastActiveAt: number;
  emotionalSummary?: string;
}

export interface ConversationListItem {
  id: string;
  mentorId: string;
  preview: string;
  messageCount: number;
  startedAt: number;
  lastActiveAt: number;
}

// ─── User Memory ────────────────────────────────────────────────────

export interface UserMemory {
  /** Recurring emotional themes across conversations */
  recurringThemes: string[];
  /** Personal goals the user has mentioned */
  personalGoals: string[];
  /** Important life events shared */
  lifeEvents: string[];
  /** ID of the user's most-used mentor */
  preferredMentorId?: string;
  /** Recent emotional states tracked over time */
  emotionalHistory: EmotionalHistoryEntry[];
  /** Last updated timestamp */
  lastUpdated: number;
}

export interface EmotionalHistoryEntry {
  state: EmotionalState;
  mentorId: string;
  timestamp: number;
}

// ─── AI Provider ────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelConfig {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  model?: string;
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

// ─── Companion Manager ──────────────────────────────────────────────

export interface SendMessageOptions {
  lengthPreference?: 'short' | 'normal';
  conversationId?: string;
}

export interface CompanionResponse {
  message: string;
  emotionalState: EmotionAnalysisResult;
  conversationId: string;
  mentorId: string;
}
