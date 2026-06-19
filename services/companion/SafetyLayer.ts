/**
 * Safety Layer
 * 
 * Detects off-topic messages and generates warm redirects
 * in the active mentor's personality style.
 * 
 * Mentors are emotional wellness companions — not general assistants.
 * Programming, math, general knowledge, and technical requests
 * are politely redirected.
 */

import { getMentorPersonality } from './PersonalityEngine';

// ─── Off-Topic Detection ────────────────────────────────────────────

const OFF_TOPIC_KEYWORDS = [
  // Programming & Technical
  'javascript', 'python', 'java', 'code', 'coding', 'programming',
  'api', 'database', 'server', 'html', 'css', 'react', 'angular',
  'vue', 'node', 'npm', 'git', 'deploy', 'debug', 'compile',
  'algorithm', 'function', 'variable', 'array', 'loop',
  'machine learning', 'ai model', 'neural network', 'chatgpt',
  'software', 'app development', 'website', 'backend', 'frontend',

  // Math & Science
  'calculate', 'equation', 'formula', 'integral', 'derivative',
  'algebra', 'geometry', 'trigonometry', 'physics', 'chemistry',
  'solve for x', 'math problem', 'theorem',

  // General Knowledge
  'capital of', 'who invented', 'what year', 'how many',
  'distance between', 'population of', 'president of',
  'world war', 'history of', 'geography',

  // Recipes & How-to (non-emotional)
  'recipe', 'how to cook', 'ingredients for',

  // Other utility requests
  'translate', 'summarize this article', 'write an essay',
  'write a poem about', 'tell me a joke',
  'weather', 'stock price', 'news today',
];

const OFF_TOPIC_PHRASES = [
  'write code', 'fix my code', 'help me code',
  'build a website', 'build an app',
  'what is the capital', 'how far is',
  'convert celsius', 'convert fahrenheit',
  'write me a', 'generate a',
  'explain how computers', 'how does wifi',
];

// ─── Redirect Messages (per-personality tone) ───────────────────────

interface RedirectTemplates {
  [mentorId: string]: string[];
}

const REDIRECT_TEMPLATES: RedirectTemplates = {
  '1': [ // Priya
    'Ha, I wish I could help with that, but my world is really about navigating life\'s big transitions. What\'s going on in your inner world right now?',
    'That\'s a bit outside my lane — I\'m more of a "what do you want from life" kind of person. Is there something deeper stirring behind that question?',
  ],
  '2': [ // Arjun
    'That\'s not really my thing, but I appreciate you asking. I\'m much better at the heart stuff — relationships, feelings, all of that. What\'s really going on with you?',
    'I\'m more of a feelings person than a facts person, honestly. Is there something on your heart you want to talk about?',
  ],
  '3': [ // Maya
    'That\'s not where I live. I\'m here for the questions that keep you up at night — the meaning ones. Is there something like that beneath the surface?',
    'I think there are better places for that answer. But if there\'s something deeper you\'re sitting with, I\'m here.',
  ],
  '4': [ // Rohan
    'Not my area, friend. I\'m the "what are you building with your life" guy, not Google. What\'s actually on your mind?',
    'I\'d love to help but that\'s way outside my zone. Talk to me about what\'s keeping you up at night — the real stuff.',
  ],
  '5': [ // Aisha
    'I\'m not the right person for that, but I\'m definitely the right person if you need to talk about family, belonging, or finding your voice. What\'s going on?',
    'That\'s outside what I do, but I\'m here and listening. Is there something about your family or relationships that needs attention?',
  ],
  '6': [ // Liam
    'Ooh, that\'s a different kind of design challenge — and not the kind I work on! I\'m more about designing your life. What\'s the current project there?',
    'Ha, I\'m more of a life architect than a technical one. But if you\'re feeling stuck or curious about your next chapter, I\'m your guy.',
  ],
  '7': [ // Ananya
    'That\'s not my domain, but I appreciate you being here. My world is leadership, resilience, and the human side of high-stakes work. What\'s the real question?',
    'I\'m better at coaching leaders through tough moments than answering that. What\'s actually weighing on you?',
  ],
  '8': [ // Samir
    'I wish I could help with that, but I\'m really here for the hard emotional stuff — the endings, the rebuilding. Is there something like that going on?',
    'Not my area, but I\'m not going anywhere. If you need to talk about loss, healing, or starting over, that\'s where I live.',
  ],
  '9': [ // Kavita
    'That question lives in a different space than where I am. I\'m here for the quieter questions — the ones about peace, presence, and what your heart is trying to tell you.',
    'I don\'t have that answer, but I might have something better. Take a breath. What does your inner world need right now?',
  ],
  '10': [ // David
    'That\'s not my world — I\'m the freelance and career guy. But if you\'re struggling with work-life balance, pricing, or burnout, let\'s talk.',
    'Outside my area, I\'m afraid. But hey, if you\'re dealing with the emotional side of work or business, that\'s exactly what I\'m here for.',
  ],
  'nirvaha': [
    'I\'m more of a friend for the heart than a search engine. But I\'m here — what\'s really on your mind today?',
    'That one\'s a bit outside my world. I\'m better at the stuff that sits heavy on your chest. Want to talk about that instead?',
  ],
};

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Check if a message is off-topic for emotional wellness companions.
 * Returns null if on-topic, or a redirect message if off-topic.
 */
export function checkSafety(message: string, mentorId: string): string | null {
  const lowerMessage = message.toLowerCase().trim();

  // Very short messages are probably not off-topic requests
  if (lowerMessage.length < 8) return null;

  // Check for off-topic keywords
  let offTopicScore = 0;

  for (const keyword of OFF_TOPIC_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      offTopicScore += 1;
    }
  }

  for (const phrase of OFF_TOPIC_PHRASES) {
    if (lowerMessage.includes(phrase)) {
      offTopicScore += 2;
    }
  }

  // Only redirect if strong signal (multiple keywords or a phrase match)
  if (offTopicScore < 2) return null;

  // Check if emotional context might override (e.g., "stressed about coding")
  const emotionalOverrides = [
    'stressed', 'anxious', 'overwhelmed', 'burned out', 'scared',
    'feeling', 'struggle', 'help me cope', 'can\'t handle',
    'depressed', 'lonely', 'confused about life',
  ];

  for (const override of emotionalOverrides) {
    if (lowerMessage.includes(override)) {
      return null; // Emotional context present — let it through
    }
  }

  // Generate a redirect in the mentor's voice
  return getRedirectMessage(mentorId);
}

/**
 * Get a redirect message in the mentor's personality style.
 */
function getRedirectMessage(mentorId: string): string {
  const templates = REDIRECT_TEMPLATES[mentorId] || REDIRECT_TEMPLATES['nirvaha'];
  return templates[Math.floor(Math.random() * templates.length)];
}
