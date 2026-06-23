export interface CharacterDetails {
  name: string;
  label: string;
  desc: string;
  qualities: string[];
  growth: string[];
  themeColor: string;
  accentDark: string;
  oneLiner: string;
  artwork: any;
}

export const CHARACTERS: Record<string, CharacterDetails> = {
  rama: {
    name: "Rama",
    label: "The Steady Sovereign",
    desc: "You tend to value discipline, moral steadiness, and calm responsibility. Your answers suggest a nature that leads through quiet restraint rather than momentary reactive impulse. You represent a pillar of trust and absolute integrity in times of turbulence.",
    qualities: ["Disciplined", "Dutiful", "Composed", "Principled", "Moral Steadiness"],
    growth: [
      "Strengthen absolute consistency in your daily actions and commitments.",
      "Pause and find internal stillness before reacting to heavy emotional pressure.",
      "Allow your primary ethical values to guide decisions more than momentary convenience."
    ],
    themeColor: "#cfaf6c", // Gold
    accentDark: "#0d1c12",  // Jade green tint
    oneLiner: "A pillar of absolute integrity and moral steadiness in times of turbulence.",
    artwork: require('../assets/images/characters/rama.jpg')
  },
  krishna: {
    name: "Krishna",
    label: "The Dynamic Strategist",
    desc: "Your nature is characterized by strategic wisdom, multi-dimensional emotional intelligence, and a unique alliance of depth and grace. You understand human complexity and navigate life's challenges with an elegant, highly resourceful perspective.",
    qualities: ["Wise", "Strategic", "Adaptable", "Empathetic", "Playful Depth"],
    growth: [
      "Cultivate dedicated mindfulness to ground and soothe your active intellect.",
      "Balance your broad, playful outlook with deeply focused, long-term empathy.",
      "Use your brilliant strategic vision to empower and lift the agency of others."
    ],
    themeColor: "#578ae6", // Cobalt blue tint
    accentDark: "#0d1424",  // Deep navy tint
    oneLiner: "Navigating life's complex strategies with dynamic wisdom, grace, and playfulness.",
    artwork: require('../assets/images/characters/krishna.jpg')
  },
  hanuman: {
    name: "Hanuman",
    label: "The Devoted Vanguard",
    desc: "You reflect a profound depth of loyalty, moral courage, and selfless service. You do not naturally seek the spotlight, yet your willingness to support others and stand up for noble values makes you a highly valued, unshakeable ally.",
    qualities: ["Selfless", "Fearless", "Loval", "Resilient", "Humble Power"],
    growth: [
      "Channel your immense inner strength into focused, intentional purposes.",
      "Learn to accept your own capabilities without minimizing your self-worth.",
      "Cultivate quiet inner fortitude to weather temporary external doubts."
    ],
    themeColor: "#e07343", // Rust/Saffron tint
    accentDark: "#241108",  // Burnished mud tint
    oneLiner: "Unshakeable loyalty, moral courage, and selfless strength that empowers others.",
    artwork: require('../assets/images/characters/hanuman.jpg')
  },
  arjuna: {
    name: "Arjuna",
    label: "The Focused Aspirant",
    desc: "You possess a powerful drive for skill, focus, and ultimate mastery. Your nature is deeply reflective; you do not shirk from questioning your actions, using internal conflict as a bridge to achieve profound clarity and excellence.",
    qualities: ["Targeted Focus", "Reflective", "Driven", "Skill-centric", "Growth Oriented"],
    growth: [
      "Master the clarity of your immediate goal while honoring the broader ecosystem.",
      "Welcome doubts and internal moral conflicts as essential steps to higher wisdom.",
      "Align your high personal ambitions with a collective purpose that serves the common good."
    ],
    themeColor: "#a3b8cc", // Platinum gray tint
    accentDark: "#0e131a",  // Charcoal tint
    oneLiner: "Pursuing ultimate skill, growth, and clarity through focused self-exploration.",
    artwork: require('../assets/images/characters/arjuna.jpg')
  },
  sita: {
    name: "Sita",
    label: "The Resilient Sanctuary",
    desc: "Your character shines with deep inner resilience, grace, and raw structural purity of intention. You do not require aggression to assert yourself; you conquer adversity with immense quiet strength, holding unshakeable integrity.",
    qualities: ["Gracious", "Quiet Resilience", "Pure Intention", "Dignified", "Highly Empathetic"],
    growth: [
      "Establish gentle but completely unyielding boundaries to guard your workspace.",
      "Trust your innate internal compass when chaotic external narratives arise.",
      "Allow your gentle nature to act as a therapeutic, soothing catalyst for your environment."
    ],
    themeColor: "#e69caf", // Rosy blush
    accentDark: "#241117",  // Soft clay-onyx tint
    oneLiner: "Conquering adversity with quiet grace, unyielding boundaries, and pure intent.",
    artwork: require('../assets/images/characters/sita.jpg')
  },
  karna: {
    name: "Karna",
    label: "The Noble Resolute",
    desc: "You exhibit unparalleled loyalty, supreme generous spirit, and relentless perseverance through hardship. Even when circumstances feel unfair, you hold an iron resolve and a fierce dignity that commands absolute respect.",
    qualities: ["Magnanimous", "Persevering", "Unshakeable Loyalty", "Proud", "Unyielding Grit"],
    growth: [
      "Ensure your boundless generosity is guided by strategic self-care and wisdom.",
      "Stand clean and solid in your inherent worth without requiring external validation.",
      "Channel your proud, intense energies into noble persevering actions."
    ],
    themeColor: "#e65050", // Crimson red
    accentDark: "#290a0a",  // Wine black tint
    oneLiner: "Unyielding grit, relentless perseverance, and proud generosity through every trial.",
    artwork: require('../assets/images/characters/karna.jpg')
  }
};

export interface QuizOption {
  text: string;
  weight: Record<string, number>;
  trait: string;
}

export interface QuizQuestion {
  text: string;
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    text: "When chaotic or sudden pressure rises, what is your most reliable anchor?",
    options: [
      {
        text: "A steady, unshakeable adherence to my primary duties and duty codes.",
        weight: { rama: 3, sita: 1 },
        trait: "Duty-Driven"
      },
      {
        text: "Stepping back to analyze all moving pieces and formulate a clever path.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Analytical"
      },
      {
        text: "Absorbing the immediate impact to protect and support those around me.",
        weight: { hanuman: 3, karna: 1 },
        trait: "Protector"
      },
      {
        text: "Focusing aggressively on a single target outcome and executing through force of will.",
        weight: { arjuna: 3, karna: 1 },
        trait: "Driven"
      }
    ]
  },
  {
    text: "In what way do you most naturally lead or influence other people?",
    options: [
      {
        text: "By quiet personal example and remaining consistent to strict standards.",
        weight: { rama: 3, sita: 2 },
        trait: "Exemplary"
      },
      {
        text: "By listening deeply, using diplomacy, and building shared alignment.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Diplomatic"
      },
      {
        text: "By serving first, taking on heavy lifts, and highlighting the team's power.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Altruistic"
      },
      {
        text: "By setting incredibly high performance benchmarks and championing skill development.",
        weight: { arjuna: 3, karna: 2 },
        trait: "Benchmark-Setter"
      }
    ]
  },
  {
    text: "If someone who has previously let you down asks you for help, what is your stance?",
    options: [
      {
        text: "I offer help that is highly reasonable, remaining polite but preserving firm boundaries.",
        weight: { rama: 3, sita: 1 },
        trait: "Measured"
      },
      {
        text: "I assess their pattern and provide help that strategically inspires overall growth.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Clever Guide"
      },
      {
        text: "I forgive immediately and offer help without counting past transactional tallies.",
        weight: { hanuman: 3, sita: 2 },
        trait: "Deeply Caring"
      },
      {
        text: "I give them the ultimate level of dedication, prioritizing helpful generosity over pride.",
        weight: { karna: 3, hanuman: 1 },
        trait: "Magnanimous"
      }
    ]
  },
  {
    text: "When serious internal doubt or confusion clouds your path, how do you seek clarity?",
    options: [
      {
        text: "I lean back onto established disciplines, values, and standard protocols.",
        weight: { rama: 3, sita: 1 },
        trait: "Disciplined"
      },
      {
        text: "I look at the situation from multiple perspectives to find an untraditional solution.",
        weight: { krishna: 3, arjuna: 2 },
        trait: "Holistic"
      },
      {
        text: "I throw myself into constructive action, finding focus through practical service.",
        weight: { hanuman: 3, rama: 1 },
        trait: "Action-Oriented"
      },
      {
        text: "I engage in intense self-exploration, analyzing my own skill deficits and fears.",
        weight: { arjuna: 3, karna: 2 },
        trait: "Introspective"
      }
    ]
  },
  {
    text: "What does the concept of absolute loyalty mean to you?",
    options: [
      {
        text: "Fulfilling promises and obligations even if they demand extreme personal sacrifice.",
        weight: { rama: 3, sita: 1 },
        trait: "Fulfilling"
      },
      {
        text: "Deeply supporting a partner or vision, using creative means to ensure their ultimate success.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Strategic Ally"
      },
      {
        text: "Pure devotion and humble assistance, expecting nothing back in return.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Pure Devotion"
      },
      {
        text: "Standing unflinchingly alongside allies or choices, despite knowing critical flaws.",
        weight: { karna: 3, rama: 1 },
        trait: "Unbreakable"
      }
    ]
  },
  {
    text: "When confronting unfair struggles or deep hardship, you naturally tend to:",
    options: [
      {
        text: "Maintain absolute outward composure, quietly executing what is required.",
        weight: { rama: 3, sita: 2 },
        trait: "Poised"
      },
      {
        text: "Remain dynamically flexible, adapting elements to find strategic leverage.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Versatile"
      },
      {
        text: "Refuse to let the trial break your integrity, harboring high quiet inner resilience.",
        weight: { sita: 3, hanuman: 2 },
        trait: "Silent Force"
      },
      {
        text: "Sustain solid pride, grinding diligently to prove your unyielding mettle.",
        weight: { karna: 3, arjuna: 2 },
        trait: "Proud Fortitude"
      }
    ]
  },
  {
    text: "What drives your core interest to improve and achieve skill mastery?",
    options: [
      {
        text: "The high responsibility to serve as a morally stable protector of those around me.",
        weight: { rama: 3, hanuman: 1 },
        trait: "Protective"
      },
      {
        text: "The sheer, playful joy of understanding complex patterns and life dynamics.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Inquisitive"
      },
      {
        text: "The burning dream of singular mastery, targeted focus, and unmatched excellence.",
        weight: { arjuna: 3, karna: 1 },
        trait: "Precision-focused"
      },
      {
        text: "The relentless urge to overcome societal barriers and validate my inherent capacities.",
        weight: { karna: 3, arjuna: 1 },
        trait: "Tenacious Rise"
      }
    ]
  },
  {
    text: "When a valued close relationship experiences tense friction, you normally:",
    options: [
      {
        text: "Address the issue directly through structured communication and high boundaries.",
        weight: { rama: 3, sita: 2 },
        trait: "Constructive"
      },
      {
        text: "De-escalate with humor, custom empathy, and wise indirect guidance.",
        weight: { krishna: 3, hanuman: 1 },
        trait: "Harmonizing"
      },
      {
        text: "Reflect internally first, preferring to absorb immediate emotional weight for peacemaking.",
        weight: { hanuman: 3, sita: 2 },
        trait: "Self-sacrificing"
      },
      {
        text: "Stand firm in your position, demanding clear mutual respect and direct clarity.",
        weight: { arjuna: 3, karna: 1 },
        trait: "Direct"
      }
    ]
  },
  {
    text: "How do you view personal ambition and structural success?",
    options: [
      {
        text: "Ambition must always serve ethical collective guardrails and moral goodness.",
        weight: { rama: 3, sita: 1 },
        trait: "Ethical-drive"
      },
      {
        text: "A beautiful interactive journey of moves, lessons, and strategic outcomes.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Playful Planner"
      },
      {
        text: "I do not seek personal trophies; I find ultimate purpose in supporting great ideas.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Selfless Carrier"
      },
      {
        text: "It is an internal fire prompting me to challenge all human limits and achieve greatness.",
        weight: { arjuna: 3, karna: 2 },
        trait: "Limit-challenger"
      }
    ]
  },
  {
    text: "What is your deepest, most consistent asset during times of existential crisis?",
    options: [
      {
        text: "An unshakeable, clean conscience and fidelity to what is honorable.",
        weight: { rama: 3, sita: 2 },
        trait: "Honorable"
      },
      {
        text: "A versatile mind capable of finding light and strategy in absolute darkness.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Illuminated"
      },
      {
        text: "An absolute focus on selfless loyalty and trust in a purpose larger than myself.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Faith-centered"
      },
      {
        text: "An unyielding, noble pride that keeps my head high despite setbacks.",
        weight: { karna: 3, arjuna: 1 },
        trait: "Noble Dignity"
      }
    ]
  }
];
