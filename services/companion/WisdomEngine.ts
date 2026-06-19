/**
 * Wisdom Engine
 * 
 * Selects relevant wisdom patterns based on the user's emotional state
 * and the active mentor. Only 2-3 patterns are injected per prompt,
 * not the entire knowledge base.
 */

import { EmotionalState } from './types';
import { WISDOM_PATTERNS, WisdomPattern } from '../../data/patterns';

const MAX_PATTERNS_PER_PROMPT = 3;

/**
 * Select the most relevant wisdom patterns for a given emotional state and mentor.
 * Returns at most MAX_PATTERNS_PER_PROMPT patterns, sorted by relevance.
 */
export function selectRelevantWisdom(
  emotionalState: EmotionalState,
  mentorId?: string,
  secondaryEmotion?: EmotionalState,
): WisdomPattern[] {
  // Score each pattern based on relevance
  const scored = WISDOM_PATTERNS.map(pattern => {
    let score = 0;

    // Primary emotion match (strongest signal)
    if (pattern.relevantEmotions.includes(emotionalState)) {
      score += 3;
    }

    // Secondary emotion match
    if (secondaryEmotion && pattern.relevantEmotions.includes(secondaryEmotion)) {
      score += 1.5;
    }

    // Mentor alignment bonus
    if (mentorId && pattern.alignedMentors?.includes(mentorId)) {
      score += 2;
    }

    // Penalty if the pattern has no match at all
    if (score === 0) {
      score = -1;
    }

    return { pattern, score };
  });

  // Filter out patterns with no relevance, sort by score
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PATTERNS_PER_PROMPT)
    .map(item => item.pattern);
}

/**
 * Format selected wisdom patterns into a string block for prompt injection.
 */
export function formatWisdomForPrompt(patterns: WisdomPattern[]): string {
  if (patterns.length === 0) {
    return '';
  }

  const lines = patterns.map(p =>
    `- ${p.name}: ${p.description} (Reflection: "${p.reflectionPrompt}")`
  );

  return `Relevant Wisdom for this conversation:\n${lines.join('\n')}`;
}
