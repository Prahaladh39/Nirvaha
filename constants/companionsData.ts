export type CompanionCategory = 'Career Guidance' | 'Relationship Clarity' | 'Life Purpose';

export interface CompanionReview {
  id: string;
  userName: string;
  userInitial: string;
  rating: number;
  text: string;
}

export interface Companion {
  id: string;
  name: string;
  initials: string;
  title: string;
  category: CompanionCategory;
  rating: number;
  reviewsCount: number;
  sessionsCount: number;
  availability: string;
  isVerified: boolean;
  isCertified: boolean;
  about: string;
  tags: string[];
  imageUrl: any;
  reviews: CompanionReview[];
  suggestions: string[];
}

export const companionsData: Companion[] = [
  {
    id: "1",
    name: "Priya Sharma",
    initials: "PS",
    title: "AI Career Companion",
    category: "Career Guidance",
    rating: 4.2,
    reviewsCount: 1,
    sessionsCount: 342,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI companion focused on helping you navigate career transitions, discover your purpose, and build the confidence to explore new professional paths.",
    tags: ["Career transitions", "Purpose discovery", "Confidence building"],
    imageUrl: require("../assets/images/1.jpeg"),
    reviews: [
      {
        id: "r1",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.2,
        text: "\"Helped me refine my resume and prepare for a career shift. The structure it provides is great, though I wish there were more industry-specific templates. Still, a solid tool for career guidance.\""
      }
    ],
    suggestions: [
      "I'm confused about my career",
      "I'm afraid of interviews",
      "I'm feeling burned out at work",
      "Should I switch jobs?"
    ]
  },
  {
    id: "2",
    name: "Arjun Verma",
    initials: "AV",
    title: "AI Relationship Companion",
    category: "Relationship Clarity",
    rating: 4.1,
    reviewsCount: 1,
    sessionsCount: 215,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI companion focused on helping you navigate relationship challenges with thoughtful conversations, emotional clarity, and healthier communication.",
    tags: ["Communication", "Attachment Styles", "Boundaries"],
    imageUrl: require("../assets/images/2.jpeg"),
    reviews: [
      {
        id: "r2",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.1,
        text: "\"Provided very practical advice during a communication breakdown with my partner. It helped me step back and respond with emotional maturity rather than reacting. A helpful tool for relationship clarity.\""
      }
    ],
    suggestions: [
      "I keep overthinking my relationship",
      "We had a fight today",
      "How do I communicate better?",
      "I feel emotionally distant"
    ]
  },
  {
    id: "3",
    name: "Dr. Maya Lin",
    initials: "ML",
    title: "AI Purpose & Meaning Guide",
    category: "Life Purpose",
    rating: 4.3,
    reviewsCount: 1,
    sessionsCount: 500,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm a specialized AI wellness guide blending Eastern philosophy with modern psychology to help you clarify your values and discover your unique ikigai.",
    tags: ["Ikigai", "Mindfulness", "Existential Clarity"],
    imageUrl: require("../assets/images/3.jpeg"),
    reviews: [
      {
        id: "r3",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.3,
        text: "\"The blending of Eastern philosophy and ikigai concepts gave me a fresh perspective on my life goals. It is a peaceful space to reflect when feeling disconnected.\""
      }
    ],
    suggestions: [
      "Everything feels meaningless",
      "How do I discover my values?",
      "I feel disconnected lately",
      "How do I find inner alignment?"
    ]
  },
  {
    id: "5",
    name: "Aisha Khan",
    initials: "AK",
    title: "AI Family Dynamic Companion",
    category: "Relationship Clarity",
    rating: 4.0,
    reviewsCount: 1,
    sessionsCount: 290,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm a specialized AI companion designed to help you think through complex family dynamics, cultural expectations, and conflict resolution.",
    tags: ["Family Dynamics", "Cultural Identity", "Conflict Resolution"],
    imageUrl: require("../assets/images/4.jpeg"),
    reviews: [
      {
        id: "r5",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.0,
        text: "\"Helped me navigate a generational conflict regarding family expectations. The insights on boundaries were good, though some answers felt slightly generic. Useful for starting tough family conversations.\""
      }
    ],
    suggestions: [
      "My parents don't understand me",
      "I feel guilty saying no",
      "Family pressure is overwhelming",
      "How do I set family boundaries?"
    ]
  },
  {
    id: "6",
    name: "Liam O'Connor",
    initials: "LO",
    title: "AI Life Design Guide",
    category: "Life Purpose",
    rating: 4.2,
    reviewsCount: 1,
    sessionsCount: 180,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI life design coach here to help you prototype habits, test creative life experiments, and map out your personal growth journey.",
    tags: ["Design Thinking", "Life Planning", "Creative Block"],
    imageUrl: require("../assets/images/5.jpeg"),
    reviews: [
      {
        id: "r6",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.2,
        text: "\"Great for prototyping daily routines and building consistency. Breaking down habits into design sprints makes planning feel less overwhelming.\""
      }
    ],
    suggestions: [
      "I feel stuck in my routine",
      "How do I prototype my life?",
      "I have too many interests",
      "How do I deal with creative block?"
    ]
  },
  {
    id: "8",
    name: "Samir Hassan",
    initials: "SH",
    title: "AI Breakup Recovery Guide",
    category: "Relationship Clarity",
    rating: 4.0,
    reviewsCount: 1,
    sessionsCount: 200,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm a specialized AI companion here to provide a safe space for processing grief and supporting your emotional recovery after a relationship ends.",
    tags: ["Grief", "Breakups", "Identity Rebuilding"],
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r8",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.0,
        text: "\"Offered a supportive, non-judgmental space to process grief after a difficult breakup. It's a steady anchor when you need simple grounding and emotional clarity.\""
      }
    ],
    suggestions: [
      "I can't move on",
      "I still miss someone",
      "I feel lonely",
      "I don't know how to heal"
    ]
  },
  {
    id: "9",
    name: "Kavita Singh",
    initials: "KS",
    title: "AI Spiritual Mentor",
    category: "Life Purpose",
    rating: 4.3,
    reviewsCount: 1,
    sessionsCount: 320,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI spiritual guide here to support your mindfulness practice, help you navigate your inner landscape, and find grounding and serene reflection.",
    tags: ["Spirituality", "Meditation", "Inner Peace"],
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r9",
        userName: "Akash Kumar",
        userInitial: "A",
        rating: 4.3,
        text: "\"Very helpful for guided meditation and mindfulness when my mind starts racing. The exercises are calming and help me find quick alignment during stressful days.\""
      }
    ],
    suggestions: [
      "My mind never stops racing",
      "I feel disconnected from myself",
      "How do I cultivate inner peace?",
      "Can we do a grounding exercise?"
    ]
  }
];
