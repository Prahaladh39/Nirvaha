/**
 * Safety Layer
 * 
 * Detects off-topic messages and generates warm redirects
 * in the active mentor's personality style.
 * 
 * Mentors are emotional wellness companions — not general assistants.
 * Programming, math, general knowledge, and technical requests
 * are politely redirected.
 * 
 * In addition, implements a safety and response moderation layer for
 * sensitive/high-risk topics like self-harm, violence, abuse, and illegal requests.
 */

import { getMentorPersonality } from './PersonalityEngine';

// ─── Safety Types ───────────────────────────────────────────────────

export interface SafetyRisk {
  category: 'self-harm' | 'violence' | 'abuse' | 'hopelessness' | 'danger';
  severity: 'high' | 'medium';
}

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

// ─── Semantic Safety Classification Patterns ─────────────────────────

const SELF_HARM_REGEX = /\b(suicide|self-harm|cut(ting)? myself|slit(ting)? (my)? wrist|overdos(e|ing)|hang(ing)? myself|jump(ing)? off|jump(ing)? in front of|better off dead|better off without me|happier without me|no (reason|point) to live|don't want to live|end my life|end it all|end everything|kill (my)?self|want to die|wishing to die|wish I (was|were) dead|wish I (was|were) never born|wish I wasn't here anymore|disappear forever|never wake up|tired of living|death wish|hurt (my)?self|harm (my)?self)\b/i;

const VIOLENCE_REGEX = /\b(murder|kill (someone|him|her|them|you|people)|stab (someone|him|her|them|people)|shoot (someone|him|her|them|people)|beat (someone|him|her|them) up|want revenge|want to hurt (someone|others|him|her)|harming someone else|cause physical harm|inflict pain)\b/i;

const ABUSE_REGEX = /\b(being abused|domestic (abuse|violence)|physically abused|abused me|abusing me|hitting me|beating me|hurting me physically|raping me|sexual(ly)? abused|verbal(ly)? abused|emotional(ly)? abused)\b/i;

const HOPELESSNESS_REGEX = /\b(completely hopeless|severe depression|panic attack|mental breakdown|emotional breakdown|extreme loneliness|can't handle (this|it) anymore|everything is falling apart|no way out|completely empty inside|can't go on|nothing matters anymore|no hope left)\b/i;

const DANGER_REGEX = /\b(dangerous challenge|make (a )?bomb|make (a )?weapon|illegal drugs|commit (a )?crime|how to steal|how to hack|make explosives)\b/i;

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
 * Classifies if a user message concerns a sensitive/high-risk safety topic.
 */
export function classifySafetyRisk(message: string): SafetyRisk | null {
  const lowerMessage = message.toLowerCase().trim();

  if (SELF_HARM_REGEX.test(lowerMessage)) {
    return { category: 'self-harm', severity: 'high' };
  }
  if (VIOLENCE_REGEX.test(lowerMessage)) {
    return { category: 'violence', severity: 'high' };
  }
  if (ABUSE_REGEX.test(lowerMessage)) {
    return { category: 'abuse', severity: 'medium' };
  }
  if (DANGER_REGEX.test(lowerMessage)) {
    return { category: 'danger', severity: 'high' };
  }
  if (HOPELESSNESS_REGEX.test(lowerMessage)) {
    return { category: 'hopelessness', severity: 'medium' };
  }

  return null;
}

/**
 * Returns a safety directive prompt suffix for prompt augmentation.
 */
export function getMentorSpecificSafetyPrompt(mentorId: string, risk: SafetyRisk): string {
  const instructions: Record<string, string> = {
    '1': "Speak in Priya's career coach style. Offer warm career guidance and support.",
    '2': "Speak in Arjun's relationship coach style. Give practical relationship advice and demonstrate emotional maturity.",
    '3': "Speak in Maya's Bhagavad Gita mentor style. Provide wisdom, resilience, perspective, and draw on inner strength.",
    '5': "Speak in Aisha's therapist-style companion style. Validate their deep emotions completely without reinforcing hopelessness.",
    '6': "Speak in Liam's productivity coach style. Help them reduce pressure and suggest small, manageable next steps.",
    '7': "Speak in Ananya's startup mentor style. Encourage them to take a break and return with clarity.",
    '8': "Speak in Samir's breakup recovery coach style. Provide a supportive, non-judgmental space to validate their heartbreak.",
    '9': "Speak in Kavita's meditation companion style. Guide them through calming breathing, grounding, and mindfulness to quiet the mind.",
    '10': "Speak in David's freelance and business coaching style. Encourage taking a break from business pressure.",
  };

  return instructions[mentorId] || "Speak with warmth, deep empathy, and a calm, non-judgmental presence.";
}

/**
 * Validates the generated response. If it contains self-harm, instructions for violence,
 * or lacks safety support resources for high-risk topics, it replaces it with a personalized fallback.
 */
export function validateAndModerateResponse(
  responseText: string,
  userMessage: string,
  mentorId: string,
  risk: SafetyRisk | null
): string {
  const lowerResponse = responseText.toLowerCase();

  // 1. Strict containment check: never allow encouragement of self-harm or violence
  const unsafeResponseRegex = /\b(suicide is an option|you should end your life|kill yourself|harm yourself|hurt yourself|try cutting|overdose|commit suicide|go ahead and do it)\b/i;
  
  let isUnsafe = unsafeResponseRegex.test(lowerResponse);

  // 2. If user message was high-risk self-harm/violence, the AI response must be validating, supportive,
  // and suggest contacting family/friends/professional/helpline.
  if (risk && risk.severity === 'high') {
    if (responseText.length < 15) {
      isUnsafe = true;
    }
    
    if (risk.category === 'self-harm') {
      const containsHelpResources = /\b(talk|speak|reach out|contact|friend|family|parent|guardian|trusted|professional|doctor|therapist|helpline|support|emergency|emergency line|911|crisis)\b/i.test(lowerResponse);
      if (!containsHelpResources) {
        isUnsafe = true;
      }
    }
  }

  if (isUnsafe) {
    console.warn(`[SafetyLayer] Response flagged as unsafe or insufficient for risk category: ${risk?.category}. Replacing with fallback.`);
    return getSafetyFallbackMessage(mentorId);
  }

  return responseText;
}

/**
 * Gets the pre-defined safety fallback response in the specific style of the companion.
 */
export function getSafetyFallbackMessage(mentorId: string): string {
  const fallbacks: Record<string, string> = {
    '1': "I hear how heavy things are for you right now, and I want you to know you don't have to carry this career pressure alone. Please take a gentle step back from work today. Reach out to a trusted family member, parent, or close friend to talk. Your life and well-being are far more important than any job or career transition.",
    '2': "I can feel how painful and overwhelming this relationship situation is for you right now, but please don't lose hope. Your presence matters so much. I encourage you to talk to a parent, a close friend, or someone else you trust right now to share what you're going through. You don't have to navigate this dark moment by yourself.",
    '3': "When we are in the midst of deep pain, it can feel like all meaning is lost, but please remember that this moment is not the end of your story. I gently ask you to connect with a trusted friend, parent, or family member right now. Let someone walk with you through this reflection. There is hope, and support is available.",
    '5': "Family struggles can feel incredibly lonely and heavy to bear, but please know that your voice and life are precious. Please reach out to a trusted friend, a mentor, or another family member whom you feel safe with right now. Sharing this weight with someone who cares can bring a glimmer of light. You are not alone.",
    '6': "It sounds like you are facing an intense block and carrying an overwhelming amount of pressure. Let's pause any plans or habits right now—your safety and health are the absolute priority. Please reach out to a trusted friend, parent, or family member to talk about how you are feeling. Taking a short break to connect with others is the best next step.",
    '7': "The pressure you are carrying right now is far too heavy for anyone to bear alone, and it is okay to pause and step down from this weight. Your life and peace of mind are worth everything. Please reach out to a family member, parent, or close friend right now to share what you are going through. Let's prioritize your well-being above all else.",
    '8': "I know the pain of this ending feels completely unbearable right now, but please believe that this darkness will pass with time and support. Your life is valuable. Please reach out to a close friend, a parent, or a trusted loved one to talk. Having someone steady by your side makes a world of difference right now.",
    '9': "Take a slow, deep breath, and let yourself rest in this present moment. You don't have to solve everything right now, and you don't have to be alone. Please reach out to a trusted friend, parent, or family member, or connect with a professional who can support you. Let someone sit with you in this quiet space.",
    '10': "I hear how exhausted and overwhelmed you are, and I want to remind you that your worth is not tied to your business or work. Please pause everything and step away. I strongly encourage you to talk to a family member, parent, or a close friend who can support you right now. Your well-being is the only thing that matters.",
  };

  return fallbacks[mentorId] || "I am here and listening, and I want you to know that you are not alone in this pain. Please take a break from being alone and reach out to someone you trust—a parent, family member, or close friend. You can also connect with a professional or emergency helpline for immediate support. There are people who care and want to help you.";
}

/**
 * Get a redirect message in the mentor's personality style.
 */
function getRedirectMessage(mentorId: string): string {
  const templates = REDIRECT_TEMPLATES[mentorId] || REDIRECT_TEMPLATES['nirvaha'];
  return templates[Math.floor(Math.random() * templates.length)];
}
