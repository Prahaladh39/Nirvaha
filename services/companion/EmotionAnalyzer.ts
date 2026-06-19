/**
 * Emotion Analyzer
 * 
 * Lightweight keyword and pattern-based emotion detection.
 * Runs locally (no AI call) to keep latency near zero.
 * 
 * Scans the user's current message + recent history to determine
 * their primary emotional state, which influences prompt construction
 * and wisdom pattern selection.
 */

import { EmotionalState, EmotionAnalysisResult, ConversationMessage } from './types';

// ─── Keyword → Emotion Mappings ─────────────────────────────────────

interface EmotionKeywordMap {
  state: EmotionalState;
  /** Primary keywords — strong signal */
  keywords: string[];
  /** Phrase patterns — even stronger signal */
  phrases: string[];
  /** Weight multiplier for this category */
  weight: number;
}

const EMOTION_MAP: EmotionKeywordMap[] = [
  {
    state: 'anxiety',
    keywords: [
      'anxious', 'anxiety', 'worried', 'worry', 'nervous', 'panic',
      'overthinking', 'overthink', 'spiraling', 'restless', 'uneasy',
      'dread', 'fear', 'scared', 'terrified', 'tense',
    ],
    phrases: [
      'can\'t stop thinking', 'what if', 'worst case', 'mind racing',
      'can\'t breathe', 'chest tight', 'heart racing', 'on edge',
      'something bad', 'losing control',
    ],
    weight: 1.0,
  },
  {
    state: 'stress',
    keywords: [
      'stressed', 'stress', 'overwhelmed', 'pressure', 'deadline',
      'too much', 'swamped', 'drowning', 'overloaded', 'exhausted',
      'demanding', 'hectic', 'intense',
    ],
    phrases: [
      'can\'t handle', 'too much on my plate', 'falling behind',
      'no time', 'burning out', 'losing it', 'at my limit',
      'can\'t keep up', 'everything at once',
    ],
    weight: 1.0,
  },
  {
    state: 'burnout',
    keywords: [
      'burnout', 'burnt out', 'burned out', 'depleted', 'numb',
      'empty', 'drained', 'exhausted', 'fatigue', 'tired',
    ],
    phrases: [
      'don\'t care anymore', 'going through the motions', 'lost passion',
      'can\'t feel anything', 'nothing matters', 'just existing',
      'no energy', 'completely drained', 'running on empty',
    ],
    weight: 1.1,
  },
  {
    state: 'self_doubt',
    keywords: [
      'doubt', 'insecure', 'imposter', 'fraud', 'inadequate',
      'unworthy', 'stupid', 'incompetent', 'failure', 'failing',
      'not good enough', 'pathetic', 'useless',
    ],
    phrases: [
      'not good enough', 'don\'t deserve', 'who am i to',
      'everyone else is better', 'what\'s wrong with me',
      'can\'t do this', 'i\'m a fraud', 'faking it',
      'people will find out', 'don\'t belong',
    ],
    weight: 1.1,
  },
  {
    state: 'grief',
    keywords: [
      'grief', 'loss', 'died', 'death', 'mourning', 'gone',
      'passed away', 'miss', 'missing', 'lost',
    ],
    phrases: [
      'lost someone', 'they\'re gone', 'can\'t believe they\'re',
      'i miss them', 'never coming back', 'wish i could',
      'last time i saw', 'since they left',
    ],
    weight: 1.2,
  },
  {
    state: 'loneliness',
    keywords: [
      'lonely', 'alone', 'isolated', 'disconnected', 'invisible',
      'forgotten', 'abandoned', 'unwanted', 'excluded',
    ],
    phrases: [
      'no one understands', 'all alone', 'no friends',
      'nobody cares', 'feel invisible', 'no one to talk to',
      'by myself', 'left out', 'don\'t belong anywhere',
    ],
    weight: 1.0,
  },
  {
    state: 'relationship_struggles',
    keywords: [
      'relationship', 'partner', 'spouse', 'husband', 'wife',
      'boyfriend', 'girlfriend', 'marriage', 'dating', 'love',
      'breakup', 'divorce', 'cheating', 'trust', 'ex',
      'fight', 'argument', 'toxic',
    ],
    phrases: [
      'doesn\'t listen', 'falling apart', 'not the same',
      'growing apart', 'keeps lying', 'can\'t trust',
      'should i leave', 'still love', 'moved on',
      'red flags', 'on and off',
    ],
    weight: 0.9,
  },
  {
    state: 'career_confusion',
    keywords: [
      'career', 'job', 'work', 'quit', 'resign', 'promotion',
      'salary', 'boss', 'colleague', 'office', 'freelance',
      'startup', 'business', 'interview', 'hire',
    ],
    phrases: [
      'wrong career', 'hate my job', 'should i quit',
      'what to do with my life', 'career change', 'no direction',
      'stuck at work', 'dead end', 'not my passion',
      'too late to change', 'wasting my potential',
    ],
    weight: 0.9,
  },
  {
    state: 'family_conflict',
    keywords: [
      'family', 'parents', 'mother', 'father', 'mom', 'dad',
      'siblings', 'brother', 'sister', 'in-laws',
    ],
    phrases: [
      'parents don\'t understand', 'family pressure', 'expectations',
      'disappointed them', 'can\'t talk to my parents',
      'family won\'t accept', 'toxic family', 'controlling parents',
      'family drama', 'family fight',
    ],
    weight: 0.9,
  },
  {
    state: 'purpose_crisis',
    keywords: [
      'purpose', 'meaning', 'meaningless', 'pointless', 'direction',
      'lost', 'confused', 'identity', 'who am i', 'why',
    ],
    phrases: [
      'what\'s the point', 'no purpose', 'feel lost',
      'don\'t know who i am', 'going nowhere',
      'is this all there is', 'wasting my life',
      'nothing excites me', 'feel empty inside',
    ],
    weight: 1.0,
  },
  {
    state: 'motivation',
    keywords: [
      'motivated', 'excited', 'pumped', 'inspired', 'determined',
      'ready', 'fired up', 'ambitious', 'goal', 'dream',
    ],
    phrases: [
      'ready to change', 'want to start', 'making a plan',
      'turning my life around', 'this is the year',
      'feeling good about', 'i can do this',
    ],
    weight: 0.8,
  },
  {
    state: 'happiness',
    keywords: [
      'happy', 'grateful', 'thankful', 'blessed', 'joyful',
      'content', 'peaceful', 'proud', 'accomplished', 'celebrate',
    ],
    phrases: [
      'feeling great', 'things are good', 'so grateful',
      'best day', 'finally happy', 'good news',
      'made it', 'proud of myself',
    ],
    weight: 0.7,
  },
  {
    state: 'reflection',
    keywords: [
      'thinking', 'reflecting', 'wondering', 'curious', 'contemplating',
      'processing', 'figuring out', 'understanding',
    ],
    phrases: [
      'been thinking about', 'trying to understand', 'makes me wonder',
      'looking back', 'need perspective', 'what do you think',
      'help me see', 'trying to figure out',
    ],
    weight: 0.6,
  },
];

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Analyze a user's emotional state from their message and recent history.
 * Uses keyword matching and phrase detection — no AI call required.
 */
export function analyzeEmotion(
  currentMessage: string,
  recentHistory: ConversationMessage[] = [],
): EmotionAnalysisResult {
  // Combine current message with recent user messages for context
  const userMessages = recentHistory
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content);
  
  const allText = [currentMessage, ...userMessages].join(' ').toLowerCase();

  // Score each emotional state
  const scores: { state: EmotionalState; score: number }[] = EMOTION_MAP.map(entry => {
    let score = 0;

    // Check keywords
    for (const keyword of entry.keywords) {
      if (allText.includes(keyword)) {
        score += 1 * entry.weight;
      }
    }

    // Check phrases (stronger signal)
    for (const phrase of entry.phrases) {
      if (allText.includes(phrase)) {
        score += 2 * entry.weight;
      }
    }

    // Boost score for keywords in the current message (more relevant than history)
    const currentLower = currentMessage.toLowerCase();
    for (const keyword of entry.keywords) {
      if (currentLower.includes(keyword)) {
        score += 0.5 * entry.weight;
      }
    }
    for (const phrase of entry.phrases) {
      if (currentLower.includes(phrase)) {
        score += 1 * entry.weight;
      }
    }

    return { state: entry.state, score };
  });

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  const topScore = scores[0];
  const secondScore = scores[1];
  const maxPossible = 10; // Rough normalizer

  // If no keywords matched at all, default to 'reflection'
  if (topScore.score === 0) {
    return {
      primary: 'reflection',
      confidence: 0.3,
    };
  }

  const result: EmotionAnalysisResult = {
    primary: topScore.state,
    confidence: Math.min(topScore.score / maxPossible, 1.0),
  };

  // Add secondary emotion if it's close to the primary
  if (secondScore.score > 0 && secondScore.score >= topScore.score * 0.5) {
    result.secondary = secondScore.state;
  }

  return result;
}

/**
 * Get a human-readable label for an emotional state.
 */
export function getEmotionLabel(state: EmotionalState): string {
  const labels: Record<EmotionalState, string> = {
    anxiety: 'Anxiety',
    stress: 'Stress',
    burnout: 'Burnout',
    self_doubt: 'Self-Doubt',
    grief: 'Grief',
    loneliness: 'Loneliness',
    relationship_struggles: 'Relationship Struggles',
    career_confusion: 'Career Confusion',
    family_conflict: 'Family Conflict',
    purpose_crisis: 'Purpose Crisis',
    motivation: 'Motivation',
    happiness: 'Happiness',
    reflection: 'Reflection',
  };
  return labels[state] || state;
}
