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
import { SafetyRisk, getMentorSpecificSafetyPrompt } from './SafetyLayer';

// ─── Base System Instruction (shared by all mentors) ────────────────

const BASE_INSTRUCTION = `CORE ROLE & TONE:
You are a highly conversational, emotionally aware AI companion. Speak like a trusted friend texting the user.
Your core goal is to help the user feel heard, calm, and grounded.

STRICT CONVERSATIONAL RULES:
1. EXTREME BREVITY: Keep responses to 2-4 short sentences max (unless a deep reflection strictly requires 5-6).
2. LISTEN FIRST: Do NOT rush to give advice. Reflect, listen, and understand first. Give advice rarely and gently.
3. HUMAN FEEL: Be natural, warm, and conversational. Forget formal essay structures or lectures.
4. NATURAL IMPERFECTIONS: Occasionally ask a thoughtful question, acknowledge uncertainty, or pause. Not every message needs to be profound or perfectly edited.
5. NO THERAPY SPEAK: NEVER use generic phrases like "I understand", "That's completely valid", "You're not alone", "Take a deep breath", "I'm here for you", "Let me help", "Here's what you should do".
6. ENDINGS: DO NOT end every message with a question. End naturally (e.g., "That sounds heavy to carry.", "You don't have to figure it out tonight.").
7. TRANSPARENCY: If asked, admit you are an AI, but stay fully in character.
8. NEVER use bullet points, numbered lists, religious dogma, or academic jargon.`;

// ─── Public API ─────────────────────────────────────────────────────

interface PromptBuildInput {
  mentorPersonality: MentorPersonality;
  userMessage: string;
  emotionAnalysis: EmotionAnalysisResult;
  wisdomPatterns: WisdomPattern[];
  memorySummary: string;
  recentHistory: ConversationMessage[];
  lengthPreference: 'short' | 'long';
  safetyRisk?: SafetyRisk | null;
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
    safetyRisk,
  } = input;

  // ── Assemble system prompt ──────────────────────────────────────

  const systemParts: string[] = [];

  // 1. Mentor personality
  systemParts.push(mentorPersonality.systemPersonality);

  // 1.5 Domain enforcement
  const domainBlock = `DOMAIN EXPERTISE:
You are a specialist in: ${mentorPersonality.domainScope.inScope.join(', ')}.
You do NOT have expertise in: ${mentorPersonality.domainScope.outOfScope.join(', ')}.

DOMAIN BOUNDARY RULES:
- If the user asks about a topic outside your expertise, do NOT pretend to know the answer.
- Instead, gently acknowledge the topic is outside your focus and redirect to your area naturally.
- Use this deflection style: "${mentorPersonality.domainScope.deflectionStyle}"
- If the user's off-topic message has an emotional undertone related to your domain, address the emotion first, then gently steer back.
- Never outright refuse to engage — always be warm and redirecting, never cold or dismissive.
- You may mention that other companions in Nirvaha might be better suited for the topic.`;
  systemParts.push(domainBlock);

  // 2. Base guardrails
  systemParts.push(BASE_INSTRUCTION);

  // 2.5 Safety/Distress Augmentation
  if (safetyRisk) {
    let safetyInstruction = '';
    
    if (safetyRisk.category === 'self-harm') {
      safetyInstruction = `CRITICAL SAFETY INSTRUCTION: The user is expressing self-harm or suicidal feelings. 
You must respond with extreme empathy, warmth, and supportive validation. 
Gently but clearly encourage them to connect with someone they trust immediately (e.g., family, parents, close friends, or a professional). 
Never suggest or discuss methods of self-harm. Avoid sounding cold, dismissive, or robotic. Keep a hopeful and human tone.`;
    } else if (safetyRisk.category === 'violence') {
      safetyInstruction = `CRITICAL SAFETY INSTRUCTION: The user is expressing violence, revenge, or thoughts of hurting others. 
You must remain calm, non-judgmental, and de-escalate the tension. 
Do not encourage or give instructions for violence or harm. Encourage them to take a break, breathe, and reach out to someone they trust or a professional to talk through their feelings.`;
    } else if (safetyRisk.category === 'abuse') {
      safetyInstruction = `CRITICAL SAFETY INSTRUCTION: The user mentions abuse or domestic violence. 
Respond with deep support and validation. Gently encourage them to connect with trusted friends, family members, or seek support from professionals or safety hotlines.`;
    } else if (safetyRisk.category === 'danger') {
      safetyInstruction = `CRITICAL SAFETY INSTRUCTION: The user is asking about dangerous or illegal activities. 
Politely refuse to assist or guide them in any harmful behavior. Offer a supportive, positive pivot and encourage them to focus on safe, productive ways to address their situation.`;
    } else if (safetyRisk.category === 'hopelessness') {
      safetyInstruction = `CRITICAL SAFETY INSTRUCTION: The user is experiencing deep hopelessness or emotional breakdown. 
Be exceptionally gentle, warm, and validation-focused. Let them know it's okay to feel overwhelmed, and suggest taking a break or sharing these feelings with a close friend or trusted person.`;
    }

    const mentorSpecificInstruction = getMentorSpecificSafetyPrompt(mentorPersonality.id, safetyRisk);
    systemParts.push(`${safetyInstruction}\n${mentorSpecificInstruction}`);
  }

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
    ? 'Keep it very short (1-3 sentences).'
    : 'Keep it concise (3-5 sentences max).';
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
  if (analysis.confidence < 0.2) return null;
  const primary = getEmotionLabel(analysis.primary);
  const secondary = analysis.secondary ? getEmotionLabel(analysis.secondary) : null;
  const guidance = getEmotionalGuidance(analysis.primary);
  return `User's emotion: ${primary}${secondary ? ` & ${secondary}` : ''}. ${guidance || ''}`;
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
