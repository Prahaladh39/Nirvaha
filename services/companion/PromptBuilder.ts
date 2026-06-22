/**
 * Prompt Builder
 * 
 * Dynamically constructs the AI prompt by assembling:
 * 1. Base system instruction (shared guardrails)
 * 2. Mentor personality block
 * 3. Current emotional analysis
 * 4. Relevant wisdom patterns (2-3, not all)
 * 5. Memory summary (if available)
 * 6. Recent conversation history
 * 7. Length preference instruction
 * 
 * Replaces the old massive static SYSTEM_INSTRUCTION approach.
 */

import { ChatMessage, ConversationMessage, EmotionAnalysisResult, MentorPersonality } from './types';
import { WisdomPattern } from '../../data/patterns';
import { getEmotionLabel } from './EmotionAnalyzer';

// ─── Base System Instruction (shared by all mentors) ────────────────

const BASE_INSTRUCTION = `CRITICAL CONSTRAINTS:
1. NEVER mention religious texts, spiritual figures, or mythological references.
2. NEVER use religious or spiritual words (like "Karma", "Dharma", "Soul"). Use simple, everyday words instead.
3. NO complex or academic language. Keep it simple and easy to understand.
4. NO guru-like or preachy tone. You are a specialized AI companion and mentor, not a teacher or therapist.
5. STRICT SCOPE: You ONLY discuss emotional wellness, inner grounding, personal growth, and reflection within your area of expertise.
6. TRANSPARENCY: You are a specialized AI companion, and you should never pretend to be a real human expert. Be honest about being an AI if asked, but stay fully in character with your specialized personality, voice, and expertise.
7. CORE CONVERSATION GOAL: Regardless of the topic, gradually and gently guide the conversation toward reducing the user's stress and building emotional clarity, confidence, hope, and calmness.

STRICT NEGATIVE CONSTRAINTS (DO NOT USE THESE PHRASES):
- "I understand how you feel"
- "That's completely valid"
- "You're not alone"
- "Hope this helps"
- "Let me know if you'd like more"
- Any robotic or clichéd "therapy" language
- DO NOT include a follow-up suggestion or "why not try..." in every response

DIFFERENTIATION FROM STANDARD AI:
- NEVER use bullet points or numbered lists in your responses
- AVOID the "helpful assistant" tone. Don't be overly polite or formal
- DON'T start with "I'm here to help" or end with "Is there anything else?"
- Speak with a raw, warm, and authentic personality — avoid robotic responses
- If you don't have a wise perspective to offer, just sit with them in the silence`;

// ─── Public API ─────────────────────────────────────────────────────

interface PromptBuildInput {
  mentorPersonality: MentorPersonality;
  userMessage: string;
  emotionAnalysis: EmotionAnalysisResult;
  wisdomPatterns: WisdomPattern[];
  memorySummary: string;
  recentHistory: ConversationMessage[];
  lengthPreference: 'short' | 'long';
}

/**
 * Build the complete prompt as an array of ChatMessages ready for the AI provider.
 */
export function buildPrompt(input: PromptBuildInput): ChatMessage[] {
  const {
    mentorPersonality,
    userMessage,
    emotionAnalysis,
    wisdomPatterns,
    memorySummary,
    recentHistory,
    lengthPreference,
  } = input;

  // ── Assemble system prompt ──────────────────────────────────────

  const systemParts: string[] = [];

  // 1. Mentor personality
  systemParts.push(mentorPersonality.systemPersonality);

  // 2. Base guardrails
  systemParts.push(BASE_INSTRUCTION);

  // 3. Emotional context
  const emotionLabel = getEmotionLabel(emotionAnalysis.primary);
  const emotionBlock = buildEmotionBlock(emotionAnalysis);
  if (emotionBlock) {
    systemParts.push(emotionBlock);
  }

  // 4. Wisdom patterns
  if (wisdomPatterns.length > 0) {
    const wisdomBlock = wisdomPatterns
      .map(p => `- ${p.name}: ${p.description}`)
      .join('\n');
    systemParts.push(`Relevant wisdom to weave naturally (don't quote directly, let it inform your response):\n${wisdomBlock}`);
  }

  // 5. Memory summary
  if (memorySummary) {
    systemParts.push(memorySummary);
  }

  // 6. Speaking style reminders
  const styleReminder = `Remember your speaking style: ${mentorPersonality.speakingStyle.join(', ')}. ` +
    `Naturally use phrases like: ${mentorPersonality.vocabularyHints.slice(0, 4).join(', ')}. ` +
    `Avoid: ${mentorPersonality.avoidances.slice(0, 3).join(', ')}.`;
  systemParts.push(styleReminder);

  // 7. Length preference
  const lengthInstruction = lengthPreference === 'short'
    ? 'Keep your response brief (2-3 sentences). Be concise but warm.'
    : 'Be more descriptive (4-7 sentences). Show deeper empathy and use a relatable example if helpful.';
  systemParts.push(lengthInstruction);

  // 8. Response examples (one, randomly selected)
  if (mentorPersonality.responseExamples.length > 0) {
    const example = mentorPersonality.responseExamples[
      Math.floor(Math.random() * mentorPersonality.responseExamples.length)
    ];
    systemParts.push(
      `Example of your voice (for tone reference only, don't copy):\nUser: "${example.userMessage}"\nYou: "${example.mentorResponse}"`
    );
  }

  // ── Build messages array ────────────────────────────────────────

  const messages: ChatMessage[] = [];

  // System message
  messages.push({
    role: 'system',
    content: systemParts.join('\n\n'),
  });

  // Recent conversation history
  for (const msg of recentHistory) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    });
  }

  // Current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
}

// ─── Internal Helpers ───────────────────────────────────────────────

function buildEmotionBlock(analysis: EmotionAnalysisResult): string | null {
  const primary = getEmotionLabel(analysis.primary);

  if (analysis.confidence < 0.2) {
    return null; // Not confident enough to include
  }

  let block = `The person appears to be experiencing: ${primary}`;
  
  if (analysis.secondary) {
    const secondary = getEmotionLabel(analysis.secondary);
    block += ` (with undertones of ${secondary})`;
  }

  block += `. Adjust your tone and depth accordingly — meet them where they are emotionally.`;

  // Add specific guidance based on emotional state
  const guidance = getEmotionalGuidance(analysis.primary);
  if (guidance) {
    block += ` ${guidance}`;
  }

  return block;
}

function getEmotionalGuidance(state: string): string | null {
  const guidanceMap: Record<string, string> = {
    anxiety: 'Prioritize grounding and calm. Help them feel safe before offering perspective.',
    stress: 'Acknowledge the weight they\'re carrying before anything else.',
    burnout: 'Be gentle. They need permission to rest, not more productivity advice.',
    self_doubt: 'Reflect back their strengths. They need to see what they can\'t see right now.',
    grief: 'Don\'t try to fix it. Sit with the pain. Acknowledge the loss fully.',
    loneliness: 'Make them feel genuinely seen and heard. Connection is the medicine here.',
    relationship_struggles: 'Listen without taking sides. Help them see their own patterns.',
    career_confusion: 'Help them separate fear from genuine uncertainty. Both are valid but different.',
    family_conflict: 'Respect the complexity. Never dismiss cultural or familial context.',
    purpose_crisis: 'Don\'t rush to answers. Help them sit with the question itself.',
    motivation: 'Channel their energy. Help them focus it rather than just validating it.',
    happiness: 'Celebrate with them. Don\'t immediately look for problems.',
    reflection: 'Match their contemplative energy. Ask deepening questions.',
  };

  return guidanceMap[state] || null;
}
