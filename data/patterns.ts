/**
 * Expanded Emotional Wisdom Patterns
 * 
 * Refactored from the original HUMAN_PATTERNS with:
 * - Emotional state tags for selective injection
 * - ~20 patterns (expanded from original 10)
 * - Mentor alignment hints
 * 
 * The original patterns are preserved and enhanced with tags.
 */

import { EmotionalState } from '../services/companion/types';

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

export const WISDOM_PATTERNS: WisdomPattern[] = [
  // ── Original Patterns (preserved & tagged) ──────────────────────

  {
    id: 'responsibility-over-blame',
    name: 'Ownership of Action',
    description: 'The recognition that while you cannot control external events, you have absolute authority over your response.',
    reflectionPrompt: 'What part of this situation is within your direct control right now?',
    relevantEmotions: ['stress', 'family_conflict', 'relationship_struggles', 'career_confusion'],
  },
  {
    id: 'structure-over-confusion',
    name: 'First Principles',
    description: 'Breaking a complex problem down into its most basic, undeniable truths to find a path forward.',
    reflectionPrompt: 'If we strip away the stories and the noise, what are the three basic facts of this situation?',
    relevantEmotions: ['career_confusion', 'purpose_crisis', 'anxiety', 'stress'],
    alignedMentors: [],
  },
  {
    id: 'discipline-over-impulse',
    name: 'The Gap of Choice',
    description: 'The discipline to pause between a feeling and an action, choosing the response that aligns with your integrity.',
    reflectionPrompt: 'Is this action a reaction to a temporary feeling, or a choice based on your long-term aim?',
    relevantEmotions: ['anxiety', 'stress', 'relationship_struggles', 'family_conflict'],
  },
  {
    id: 'clarity-over-comfort',
    name: 'Unflinching Truth',
    description: 'The willingness to see things as they are, rather than how you wish they were, even if it is uncomfortable.',
    reflectionPrompt: 'What is the one truth about this situation you are currently trying to avoid?',
    relevantEmotions: ['self_doubt', 'relationship_struggles', 'career_confusion', 'purpose_crisis'],
    alignedMentors: ['3'], // Maya
  },
  {
    id: 'action-over-rumination',
    name: 'The Duty of the Moment',
    description: 'The understanding that thinking without acting leads to paralysis. Clarity is found in the doing.',
    reflectionPrompt: 'What is the single most effective action you can take in the next ten minutes?',
    relevantEmotions: ['anxiety', 'career_confusion', 'self_doubt', 'purpose_crisis'],
    alignedMentors: ['6'], // Liam
  },
  {
    id: 'process-over-outcome',
    name: "The Effort's Reward",
    description: 'Focusing entirely on the quality of your action, letting go of the anxiety about the final result.',
    reflectionPrompt: "If the result was guaranteed to be invisible, would you still find value in the effort you're making right now?",
    relevantEmotions: ['anxiety', 'self_doubt', 'stress', 'burnout'],
  },
  {
    id: 'equanimity-over-reaction',
    name: 'The Steady Center',
    description: 'Maintaining your inner calm regardless of whether things are going "well" or "badly" in the outside world.',
    reflectionPrompt: 'How much of your current peace is dependent on things going exactly your way?',
    relevantEmotions: ['stress', 'anxiety', 'family_conflict', 'relationship_struggles'],
    alignedMentors: ['3', '9'], // Maya, Kavita
  },
  {
    id: 'nature-over-comparison',
    name: 'Your Own Path',
    description: 'Understanding your unique strengths instead of trying to meet external expectations or compare yourself to others.',
    reflectionPrompt: 'Are you trying to be a better version of yourself, or a second-rate version of someone else?',
    relevantEmotions: ['self_doubt', 'career_confusion', 'purpose_crisis', 'family_conflict'],
  },
  {
    id: 'contribution-over-ego',
    name: 'The Bigger Picture',
    description: 'Shifting focus from "What do I get?" to "How can I contribute?", which naturally dissolves personal anxiety.',
    reflectionPrompt: 'If you stepped outside your own story for a moment, how could you be of use to the situation at hand?',
    relevantEmotions: ['purpose_crisis', 'loneliness', 'burnout', 'self_doubt'],
    alignedMentors: ['3'], // Maya
  },
  {
    id: 'flow-over-resistance',
    name: "The River's Wisdom",
    description: 'Accepting the current moment as it is, rather than fighting against reality, allowing for more effective action.',
    reflectionPrompt: 'What would happen if you stopped fighting the current and started using its energy to move forward?',
    relevantEmotions: ['stress', 'grief', 'anxiety', 'burnout'],
    alignedMentors: ['9', '3'], // Kavita, Maya
  },

  // ── New Expanded Patterns ───────────────────────────────────────

  {
    id: 'comparison-trap',
    name: 'The Comparison Mirror',
    description: 'Recognizing that comparing your behind-the-scenes to someone else\'s highlight reel creates false suffering.',
    reflectionPrompt: 'Whose life are you comparing yours to, and what part of their struggle are you not seeing?',
    relevantEmotions: ['self_doubt', 'anxiety', 'career_confusion', 'loneliness'],
  },
  {
    id: 'rejection-as-redirection',
    name: 'The Closed Door',
    description: 'Understanding that rejection often redirects you toward something more aligned with who you are becoming.',
    reflectionPrompt: 'Looking back at past rejections, did any of them end up leading you somewhere better?',
    relevantEmotions: ['grief', 'self_doubt', 'relationship_struggles', 'career_confusion'],
    alignedMentors: ['1', '8'], // Priya, Samir
  },
  {
    id: 'burnout-as-signal',
    name: 'The Body\'s Whisper',
    description: 'Burnout is not a failure of discipline — it is your body telling you that something fundamental needs to change.',
    reflectionPrompt: 'If your exhaustion could speak, what would it be asking you to stop doing?',
    relevantEmotions: ['burnout', 'stress', 'anxiety'],
    alignedMentors: [],
  },
  {
    id: 'fear-as-compass',
    name: 'The Edge of Growth',
    description: 'The things that scare you the most are often the things that matter the most. Fear is a compass, not a stop sign.',
    reflectionPrompt: 'What would you attempt today if you knew fear was a sign you were on the right track?',
    relevantEmotions: ['anxiety', 'self_doubt', 'career_confusion', 'purpose_crisis'],
    alignedMentors: ['1', '6'], // Priya, Liam
  },
  {
    id: 'overthinking-spiral',
    name: 'The Thought Loop',
    description: 'Overthinking disguises itself as problem-solving but actually keeps you stuck in the same loop.',
    reflectionPrompt: 'Are you truly analyzing the problem, or are you just rehearsing your worry?',
    relevantEmotions: ['anxiety', 'stress', 'self_doubt', 'career_confusion'],
  },
  {
    id: 'loneliness-as-invitation',
    name: 'The Quiet Room',
    description: 'Loneliness is not about being alone — it is about feeling unseen. It\'s an invitation to reconnect, starting with yourself.',
    reflectionPrompt: 'When was the last time you were fully present with yourself, without distraction?',
    relevantEmotions: ['loneliness', 'grief', 'relationship_struggles'],
    alignedMentors: ['9', '2', '8'], // Kavita, Arjun, Samir
  },
  {
    id: 'perfectionism-prison',
    name: 'The Perfect Trap',
    description: 'Perfectionism is not high standards — it is fear wearing a mask of excellence. Done is better than perfect.',
    reflectionPrompt: 'What would "good enough" look like here, and why does that feel scary?',
    relevantEmotions: ['self_doubt', 'anxiety', 'stress', 'burnout'],
    alignedMentors: ['6'], // Liam
  },
  {
    id: 'guilt-as-teacher',
    name: 'The Weight You Carry',
    description: 'Guilt shows you what you value. Instead of drowning in it, ask what it is trying to teach you.',
    reflectionPrompt: 'What is this guilt actually telling you about what matters to you?',
    relevantEmotions: ['family_conflict', 'relationship_struggles', 'self_doubt', 'grief'],
    alignedMentors: ['5', '2'], // Aisha, Arjun
  },
  {
    id: 'procrastination-as-fear',
    name: 'The Avoidance Signal',
    description: 'Procrastination is rarely about laziness. It is usually about fear — of failure, of judgment, of not being enough.',
    reflectionPrompt: 'What are you actually afraid will happen if you start?',
    relevantEmotions: ['self_doubt', 'anxiety', 'career_confusion', 'purpose_crisis'],
  },
  {
    id: 'uncertainty-as-freedom',
    name: 'The Open Road',
    description: 'Not knowing what comes next is uncomfortable, but it also means anything is possible.',
    reflectionPrompt: 'What if this uncertainty is actually the most free you have been in a long time?',
    relevantEmotions: ['career_confusion', 'purpose_crisis', 'anxiety', 'reflection'],
    alignedMentors: ['6', '1', '3'], // Liam, Priya, Maya
  },
];

// Keep backward compatibility: export as HUMAN_PATTERNS too
export const HUMAN_PATTERNS = WISDOM_PATTERNS;
