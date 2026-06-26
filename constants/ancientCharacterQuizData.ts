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
    text: "When sudden pressure or chaos rises, what keeps you grounded?",
    options: [
      {
        text: "Following my duties and code of conduct.",
        weight: { rama: 3, sita: 1 },
        trait: "Duty-Driven"
      },
      {
        text: "Stepping back to analyze the situation and find a clever solution.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Analytical"
      },
      {
        text: "Protecting and supporting the people around me.",
        weight: { hanuman: 3, karna: 1 },
        trait: "Protector"
      },
      {
        text: "Focusing entirely on my goal and pushing through with willpower.",
        weight: { arjuna: 3, karna: 1 },
        trait: "Driven"
      }
    ]
  },
  {
    text: "How do you naturally lead or influence the people around you?",
    options: [
      {
        text: "By setting a quiet example and holding high standards.",
        weight: { rama: 3, sita: 2 },
        trait: "Exemplary"
      },
      {
        text: "By listening, using diplomacy, and bringing people together.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Diplomatic"
      },
      {
        text: "By serving others, doing the hard work, and supporting the team.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Altruistic"
      },
      {
        text: "By setting high goals and helping others improve their skills.",
        weight: { arjuna: 3, karna: 2 },
        trait: "Benchmark-Setter"
      }
    ]
  },
  {
    text: "How do you react if someone who let you down asks for help?",
    options: [
      {
        text: "I help politely while keeping clear, firm boundaries.",
        weight: { rama: 3, sita: 1 },
        trait: "Measured"
      },
      {
        text: "I help them in a way that helps them grow and learn.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Clever Guide"
      },
      {
        text: "I forgive them immediately and help without holding a grudge.",
        weight: { hanuman: 3, sita: 2 },
        trait: "Deeply Caring"
      },
      {
        text: "I give my full support, prioritizing generosity over pride.",
        weight: { karna: 3, hanuman: 1 },
        trait: "Magnanimous"
      }
    ]
  },
  {
    text: "How do you find clarity when you feel deep doubt or confusion?",
    options: [
      {
        text: "I rely on my daily routines, values, and rules.",
        weight: { rama: 3, sita: 1 },
        trait: "Disciplined"
      },
      {
        text: "I look at the situation from different angles to find a creative solution.",
        weight: { krishna: 3, arjuna: 2 },
        trait: "Holistic"
      },
      {
        text: "I stay busy and focus on helping others or doing practical work.",
        weight: { hanuman: 3, rama: 1 },
        trait: "Action-Oriented"
      },
      {
        text: "I look inward, analyzing my fears and areas for growth.",
        weight: { arjuna: 3, karna: 2 },
        trait: "Introspective"
      }
    ]
  },
  {
    text: "When you think of absolute loyalty, what does it mean to you?",
    options: [
      {
        text: "Keeping my promises, even at a high personal cost.",
        weight: { rama: 3, sita: 1 },
        trait: "Fulfilling"
      },
      {
        text: "Supporting a vision or person and finding creative ways to help them succeed.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Strategic Ally"
      },
      {
        text: "Serving others with pure devotion, expecting nothing in return.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Pure Devotion"
      },
      {
        text: "Standing by my allies and choices, even when I see their flaws.",
        weight: { karna: 3, rama: 1 },
        trait: "Unbreakable"
      }
    ]
  },
  {
    text: "How do you naturally respond when facing unfair struggles or deep hardships?",
    options: [
      {
        text: "Stay calm on the outside and quietly do what needs to be done.",
        weight: { rama: 3, sita: 2 },
        trait: "Poised"
      },
      {
        text: "Stay flexible and adapt quickly to find a strategic advantage.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Versatile"
      },
      {
        text: "Hold onto my integrity and quiet inner strength, refusing to break.",
        weight: { sita: 3, hanuman: 2 },
        trait: "Silent Force"
      },
      {
        text: "Keep my pride high and work hard to prove my strength.",
        weight: { karna: 3, arjuna: 2 },
        trait: "Proud Fortitude"
      }
    ]
  },
  {
    text: "What drives your desire to improve yourself and master your skills?",
    options: [
      {
        text: "The responsibility to protect and support the people around me.",
        weight: { rama: 3, hanuman: 1 },
        trait: "Protective"
      },
      {
        text: "The joy of understanding complex ideas and how things work.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Inquisitive"
      },
      {
        text: "The desire for perfect focus, skill mastery, and unmatched excellence.",
        weight: { arjuna: 3, karna: 1 },
        trait: "Precision-focused"
      },
      {
        text: "The drive to overcome obstacles and prove my true potential.",
        weight: { karna: 3, arjuna: 1 },
        trait: "Tenacious Rise"
      }
    ]
  },
  {
    text: "How do you handle tension or conflict in a close relationship?",
    options: [
      {
        text: "Talk about the issue directly while keeping clear boundaries.",
        weight: { rama: 3, sita: 2 },
        trait: "Constructive"
      },
      {
        text: "Calm things down with humor, empathy, and gentle advice.",
        weight: { krishna: 3, hanuman: 1 },
        trait: "Harmonizing"
      },
      {
        text: "Reflect inward first, willing to carry the emotional weight to keep peace.",
        weight: { hanuman: 3, sita: 2 },
        trait: "Self-sacrificing"
      },
      {
        text: "Stand my ground, demanding clear mutual respect and direct honesty.",
        weight: { arjuna: 3, karna: 1 },
        trait: "Direct"
      }
    ]
  },
  {
    text: "How do you view the role of personal ambition and success in life?",
    options: [
      {
        text: "Ambition should always follow moral values and help the common good.",
        weight: { rama: 3, sita: 1 },
        trait: "Ethical-drive"
      },
      {
        text: "A dynamic journey of strategy, learning, and interesting choices.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Playful Planner"
      },
      {
        text: "I don't need personal trophies; I prefer supporting a cause or others.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Selfless Carrier"
      },
      {
        text: "An inner drive to challenge my limits and achieve greatness.",
        weight: { arjuna: 3, karna: 2 },
        trait: "Limit-challenger"
      }
    ]
  },
  {
    text: "What is your most reliable strength during a major crisis?",
    options: [
      {
        text: "A clear conscience and staying true to what is honorable.",
        weight: { rama: 3, sita: 2 },
        trait: "Honorable"
      },
      {
        text: "A flexible mind that finds opportunities and strategies in dark times.",
        weight: { krishna: 3, arjuna: 1 },
        trait: "Illuminated"
      },
      {
        text: "My loyalty and deep trust in a purpose larger than myself.",
        weight: { hanuman: 3, sita: 1 },
        trait: "Faith-centered"
      },
      {
        text: "An unyielding pride that keeps my head held high through setbacks.",
        weight: { karna: 3, arjuna: 1 },
        trait: "Noble Dignity"
      }
    ]
  }
];
