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
  imageUrl: string;
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
    rating: 4.9,
    reviewsCount: 127,
    sessionsCount: 342,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI companion focused on helping you navigate career transitions, discover your purpose, and build the confidence to explore new professional paths.",
    tags: ["Career transitions", "Purpose discovery", "Confidence building"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r1",
        userName: "Arun K.",
        userInitial: "A",
        rating: 5,
        text: "\"Priya's AI guidance was exactly what I needed. It helped me structure my career transition plan step-by-step and reduce my career anxiety.\""
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
    rating: 4.8,
    reviewsCount: 89,
    sessionsCount: 215,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI companion focused on helping you navigate relationship challenges with thoughtful conversations, emotional clarity, and healthier communication.",
    tags: ["Communication", "Attachment Styles", "Boundaries"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r2",
        userName: "Neha S.",
        userInitial: "N",
        rating: 5,
        text: "\"Arjun's responses gave me the space to think through my relationship boundaries without feeling guilty. Incredibly grounding AI conversation.\""
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
    rating: 5.0,
    reviewsCount: 204,
    sessionsCount: 500,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm a specialized AI wellness guide blending Eastern philosophy with modern psychology to help you clarify your values and discover your unique ikigai.",
    tags: ["Ikigai", "Mindfulness", "Existential Clarity"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r3",
        userName: "Sam T.",
        userInitial: "S",
        rating: 5,
        text: "\"This guide helped me find quiet and clarity after a severe phase of burnout. A very profound AI reflection experience.\""
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
    id: "4",
    name: "Rohan Desai",
    initials: "RD",
    title: "AI Startup Mentor",
    category: "Career Guidance",
    rating: 4.7,
    reviewsCount: 65,
    sessionsCount: 150,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI startup mentor designed to support founders with practical execution strategies, leadership habits, and navigation through imposter syndrome.",
    tags: ["Startups", "Imposter Syndrome", "Leadership"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r4",
        userName: "Vikram P.",
        userInitial: "V",
        rating: 4,
        text: "\"Practical, direct prompts that cut through my overthinking. An excellent AI sounding board for founders.\""
      }
    ],
    suggestions: [
      "My startup is stressing me out",
      "I'm afraid of failing",
      "I'm losing motivation",
      "How do I handle imposter syndrome?"
    ]
  },
  {
    id: "5",
    name: "Aisha Khan",
    initials: "AK",
    title: "AI Family Dynamic Companion",
    category: "Relationship Clarity",
    rating: 4.9,
    reviewsCount: 112,
    sessionsCount: 290,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm a specialized AI companion designed to help you think through complex family dynamics, cultural expectations, and conflict resolution.",
    tags: ["Family Dynamics", "Cultural Identity", "Conflict Resolution"],
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r5",
        userName: "Zara B.",
        userInitial: "Z",
        rating: 5,
        text: "\"The AI understood cultural dynamics and generational gaps immediately. Gave me great ideas for having difficult family talks.\""
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
    rating: 4.8,
    reviewsCount: 78,
    sessionsCount: 180,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI life design coach here to help you prototype habits, test creative life experiments, and map out your personal growth journey.",
    tags: ["Design Thinking", "Life Planning", "Creative Block"],
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r6",
        userName: "Elena R.",
        userInitial: "E",
        rating: 5,
        text: "\"Prototyping my daily habits through this AI took away so much pressure. Truly creative and helpful tool.\""
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
    id: "7",
    name: "Dr. Ananya Rao",
    initials: "AR",
    title: "AI Executive Companion",
    category: "Career Guidance",
    rating: 5.0,
    reviewsCount: 156,
    sessionsCount: 410,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI executive companion designed to help leadership professionals prevent burnout, build resilience, and make high-stakes decisions with clarity.",
    tags: ["Executive Coaching", "Resilience", "Decision Making"],
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r7",
        userName: "Karan M.",
        userInitial: "K",
        rating: 5,
        text: "\"It provided an incredibly poised and strategic sounding board for team conflicts. Highly professional AI companion.\""
      }
    ],
    suggestions: [
      "I'm feeling burned out at work",
      "I have to make a tough decision",
      "How do I build resilience?",
      "How do I show vulnerability?"
    ]
  },
  {
    id: "8",
    name: "Samir Hassan",
    initials: "SH",
    title: "AI Breakup Recovery Guide",
    category: "Relationship Clarity",
    rating: 4.7,
    reviewsCount: 92,
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
        userName: "Rahul D.",
        userInitial: "R",
        rating: 5,
        text: "\"A patient and non-judgmental space to process my breakup grief. It felt like a steady, calm anchor.\""
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
    rating: 4.9,
    reviewsCount: 134,
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
        userName: "Anjali T.",
        userInitial: "A",
        rating: 5,
        text: "\"The AI is a quiet, calming garden. It really helps me ground myself and quiet my racing mind.\""
      }
    ],
    suggestions: [
      "My mind never stops racing",
      "I feel disconnected from myself",
      "How do I cultivate inner peace?",
      "Can we do a grounding exercise?"
    ]
  },
  {
    id: "10",
    name: "David Chen",
    initials: "DC",
    title: "AI Freelance Coach",
    category: "Career Guidance",
    rating: 4.8,
    reviewsCount: 88,
    sessionsCount: 190,
    availability: "Available 24/7",
    isVerified: true,
    isCertified: false,
    about: "I'm an AI companion built to help freelancers manage client relationships, set healthy pricing structures, and maintain a sustainable work-life balance.",
    tags: ["Freelancing", "Pricing Strategy", "Boundaries"],
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r10",
        userName: "Marc L.",
        userInitial: "M",
        rating: 5,
        text: "\"Helped me calculate sustainable rates and structure client boundaries. A fantastic tool for freelancers.\""
      }
    ],
    suggestions: [
      "I can't stop saying yes to clients",
      "How do I price my services?",
      "I'm afraid the work will dry up",
      "How do I prevent client burnout?"
    ]
  }
];
