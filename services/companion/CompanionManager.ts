/**
 * Companion Manager
 * 
 * The single public API for the AI companion system.
 * The UI should ONLY interact with this class — never directly
 * with the LLM, personality engine, or any other service.
 * 
 * Orchestration flow for sendMessage:
 * 1. SafetyLayer → redirect if off-topic
 * 2. EmotionAnalyzer → detect emotional state
 * 3. WisdomEngine → select 2-3 relevant patterns
 * 4. MemoryManager → get long-term memory context
 * 5. PromptBuilder → construct dynamic prompt
 * 6. AIProvider → generate AI response
 * 7. ConversationHistory → persist conversation
 * 8. MemoryManager → update long-term memory
 */

import {
  CompanionResponse,
  ConversationMessage,
  ConversationSession,
  ConversationListItem,
  SendMessageOptions,
  MentorPersonality,
} from './types';
import { getAIProvider } from './providers';
import { getMentorPersonality, getMentorGreeting } from './PersonalityEngine';
import { analyzeEmotion } from './EmotionAnalyzer';
import { selectRelevantWisdom } from './WisdomEngine';
import { getMemorySummary, updateMemoryFromConversation } from './MemoryManager';
import {
  createConversation,
  saveConversation,
  loadConversation,
  loadLatestConversation,
  listConversations as listConvos,
  addMessageToConversation,
  getRecentHistory,
} from './ConversationHistoryManager';
import { checkSafety } from './SafetyLayer';
import { buildPrompt } from './PromptBuilder';

// ─── Fallback Response ──────────────────────────────────────────────

const FALLBACK_RESPONSE = "Something flickered for a moment there. Could you say that again? I want to make sure I hear you properly.";

// ─── CompanionManager Class ─────────────────────────────────────────

class CompanionManagerClass {
  private activeSessions: Map<string, ConversationSession> = new Map();

  /**
   * Send a message to a mentor and get an AI-powered response.
   * This is the primary method the UI calls.
   */
  async sendMessage(
    mentorId: string,
    message: string,
    options: SendMessageOptions = {},
  ): Promise<CompanionResponse> {
    const { lengthPreference = 'long', conversationId } = options;

    // Get or create active session
    let session = await this.getOrCreateSession(mentorId, conversationId);

    // 1. Safety check — redirect off-topic messages
    const safetyRedirect = checkSafety(message, mentorId);
    if (safetyRedirect) {
      // Still save the user message and redirect as part of conversation
      const userMsg = this.createMessage('user', message);
      session = await addMessageToConversation(session, userMsg);

      const redirectMsg = this.createMessage('assistant', safetyRedirect);
      session = await addMessageToConversation(session, redirectMsg);
      this.activeSessions.set(mentorId, session);

      return {
        message: safetyRedirect,
        emotionalState: { primary: 'reflection', confidence: 0.3 },
        conversationId: session.id,
        mentorId,
      };
    }

    // 2. Add user message to conversation
    const userMsg = this.createMessage('user', message);
    session = await addMessageToConversation(session, userMsg);

    // 3. Analyze emotion from current message + recent history
    const recentHistory = getRecentHistory(session);
    const emotionAnalysis = analyzeEmotion(message, recentHistory);

    // 4. Select relevant wisdom patterns
    const wisdomPatterns = selectRelevantWisdom(
      emotionAnalysis.primary,
      mentorId,
      emotionAnalysis.secondary,
    );

    // 5. Get memory context
    const memorySummary = await getMemorySummary(mentorId);

    // 6. Get mentor personality
    const mentorPersonality = getMentorPersonality(mentorId);

    // 7. Build the prompt
    const promptMessages = buildPrompt({
      mentorPersonality,
      userMessage: message,
      emotionAnalysis,
      wisdomPatterns,
      memorySummary,
      recentHistory: recentHistory.slice(0, -1), // Exclude current message (already in prompt)
      lengthPreference,
    });

    // 8. Generate AI response
    let responseText: string;
    try {
      const provider = getAIProvider();
      responseText = await provider.generateResponse(promptMessages, {
        temperature: 0.72,
        maxTokens: lengthPreference === 'short' ? 200 : 600,
      });
    } catch (error) {
      console.error('[CompanionManager] AI generation error:', error);
      responseText = FALLBACK_RESPONSE;
    }

    // 9. Save assistant response to conversation
    const assistantMsg = this.createMessage('assistant', responseText, emotionAnalysis.primary);
    session = await addMessageToConversation(session, assistantMsg);
    this.activeSessions.set(mentorId, session);

    // 10. Update long-term memory (fire-and-forget)
    updateMemoryFromConversation(mentorId, session.messages, emotionAnalysis.primary).catch(
      err => console.error('[CompanionManager] Memory update error:', err)
    );

    return {
      message: responseText,
      emotionalState: emotionAnalysis,
      conversationId: session.id,
      mentorId,
    };
  }

  /**
   * Start a new conversation with a mentor.
   * Returns the session with a mentor-specific greeting as the first message.
   */
  async startConversation(mentorId: string): Promise<ConversationSession> {
    const session = createConversation(mentorId);
    const greeting = getMentorGreeting(mentorId);
    
    const greetingMsg = this.createMessage('assistant', greeting);
    session.messages.push(greetingMsg);
    
    await saveConversation(session);
    this.activeSessions.set(mentorId, session);
    
    return session;
  }

  /**
   * Load an existing conversation or start a new one.
   */
  async getOrCreateSession(
    mentorId: string,
    conversationId?: string,
  ): Promise<ConversationSession> {
    // Check in-memory cache first
    if (!conversationId && this.activeSessions.has(mentorId)) {
      return this.activeSessions.get(mentorId)!;
    }

    // Try to load specific conversation
    if (conversationId) {
      const session = await loadConversation(conversationId);
      if (session) {
        this.activeSessions.set(mentorId, session);
        return session;
      }
    }

    // Try to load the latest conversation for this mentor
    const latest = await loadLatestConversation(mentorId);
    if (latest && latest.messages.length > 0) {
      // Only reuse if the last activity was within the last 30 minutes
      const thirtyMinutes = 30 * 60 * 1000;
      if (Date.now() - latest.lastActiveAt < thirtyMinutes) {
        this.activeSessions.set(mentorId, latest);
        return latest;
      }
    }

    // Start fresh
    return this.startConversation(mentorId);
  }

  /**
   * Get a mentor-specific greeting message.
   */
  getGreeting(mentorId: string): string {
    return getMentorGreeting(mentorId);
  }

  /**
   * Get a mentor's personality configuration.
   */
  getMentorPersonality(mentorId: string): MentorPersonality {
    return getMentorPersonality(mentorId);
  }

  /**
   * List all conversations for a mentor.
   */
  async getConversationHistory(mentorId: string): Promise<ConversationListItem[]> {
    return listConvos(mentorId);
  }

  /**
   * Load a specific conversation with full messages.
   */
  async loadFullConversation(conversationId: string): Promise<ConversationSession | null> {
    return loadConversation(conversationId);
  }

  /**
   * Clear the active session for a mentor (e.g., when navigating away).
   */
  clearActiveSession(mentorId: string): void {
    this.activeSessions.delete(mentorId);
  }

  // ── Internal Helpers ────────────────────────────────────────────

  private createMessage(
    role: 'user' | 'assistant',
    content: string,
    emotionalState?: string,
  ): ConversationMessage {
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role,
      content,
      timestamp: Date.now(),
      emotionalState: emotionalState as any,
    };
  }
}

// ─── Singleton Export ───────────────────────────────────────────────

export const CompanionManager = new CompanionManagerClass();
