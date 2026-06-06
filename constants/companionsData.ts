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
}

export const companionsData: Companion[] = [
  {
    id: "1",
    name: "Priya Sharma",
    initials: "PS",
    title: "Career Transition Coach",
    category: "Career Guidance",
    rating: 4.9,
    reviewsCount: 127,
    sessionsCount: 342,
    availability: "Tomorrow 6pm",
    isVerified: true,
    isCertified: true,
    about: "I left corporate law at 35 because I felt empty despite success. That painful pivot taught me more about purpose than any degree. Now I help others navigate that same crossroads — with less suffering and more clarity.",
    tags: ["Career transitions", "Purpose discovery", "Age 28-45"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r1",
        userName: "Arun K.",
        userInitial: "A",
        rating: 5,
        text: "\"Priya helped me see that my restlessness wasn't a problem — it was a compass. I changed careers 6 months ago and haven't looked back.\""
      }
    ]
  },
  {
    id: "2",
    name: "Arjun Verma",
    initials: "AV",
    title: "Relationship Clarity Expert",
    category: "Relationship Clarity",
    rating: 4.8,
    reviewsCount: 89,
    sessionsCount: 215,
    availability: "Today 8pm",
    isVerified: true,
    isCertified: true,
    about: "Relationships are mirrors. I help individuals understand their attachment styles and communication patterns to build healthier, more fulfilling connections.",
    tags: ["Communication", "Attachment Styles", "Boundaries"],
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r2",
        userName: "Neha S.",
        userInitial: "N",
        rating: 5,
        text: "\"Arjun gave me the tools to set boundaries without feeling guilty. Truly transformative sessions.\""
      }
    ]
  },
  {
    id: "3",
    name: "Dr. Maya Lin",
    initials: "ML",
    title: "Purpose & Meaning Guide",
    category: "Life Purpose",
    rating: 5.0,
    reviewsCount: 204,
    sessionsCount: 500,
    availability: "Thursday 10am",
    isVerified: true,
    isCertified: true,
    about: "Blending Eastern philosophy with modern psychology, I guide seekers toward uncovering their unique 'ikigai' and aligning their daily lives with their deepest values.",
    tags: ["Ikigai", "Mindfulness", "Existential Coaching"],
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r3",
        userName: "Sam T.",
        userInitial: "S",
        rating: 5,
        text: "\"Dr. Lin is incredibly insightful. She helped me find meaning after a severe burnout phase.\""
      }
    ]
  },
  {
    id: "4",
    name: "Rohan Desai",
    initials: "RD",
    title: "Startup & Career Mentor",
    category: "Career Guidance",
    rating: 4.7,
    reviewsCount: 65,
    sessionsCount: 150,
    availability: "Tomorrow 2pm",
    isVerified: true,
    isCertified: false,
    about: "Built and sold two startups. I know the stress, the imposter syndrome, and the late nights. I mentor ambitious folks trying to scale their careers or businesses.",
    tags: ["Startups", "Imposter Syndrome", "Leadership"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r4",
        userName: "Vikram P.",
        userInitial: "V",
        rating: 4,
        text: "\"Straightforward and practical advice that actually works in the real world.\""
      }
    ]
  },
  {
    id: "5",
    name: "Aisha Khan",
    initials: "AK",
    title: "Family Dynamic Specialist",
    category: "Relationship Clarity",
    rating: 4.9,
    reviewsCount: 112,
    sessionsCount: 290,
    availability: "Friday 5pm",
    isVerified: true,
    isCertified: true,
    about: "Specializing in navigating complex family dynamics, cultural expectations, and helping individuals find their voice within their communities.",
    tags: ["Family Dynamics", "Cultural Identity", "Conflict Resolution"],
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r5",
        userName: "Zara B.",
        userInitial: "Z",
        rating: 5,
        text: "\"Aisha understood my cultural background instantly. She gave me the courage to have the hard conversations with my parents.\""
      }
    ]
  },
  {
    id: "6",
    name: "Liam O'Connor",
    initials: "LO",
    title: "Life Design Coach",
    category: "Life Purpose",
    rating: 4.8,
    reviewsCount: 78,
    sessionsCount: 180,
    availability: "Next Week",
    isVerified: true,
    isCertified: false,
    about: "Using design thinking principles, I help people prototype their lives. We test, iterate, and build a life that feels authentic to you.",
    tags: ["Design Thinking", "Life Planning", "Creative Block"],
    imageUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r6",
        userName: "Elena R.",
        userInitial: "E",
        rating: 5,
        text: "\"The concept of 'prototyping' my life took away so much pressure. Liam is a genius.\""
      }
    ]
  },
  {
    id: "7",
    name: "Dr. Ananya Rao",
    initials: "AR",
    title: "Executive Coach",
    category: "Career Guidance",
    rating: 5.0,
    reviewsCount: 156,
    sessionsCount: 410,
    availability: "Tomorrow 9am",
    isVerified: true,
    isCertified: true,
    about: "I help leaders navigate high-stakes environments with empathy and resilience. Let's elevate your leadership style without sacrificing your wellbeing.",
    tags: ["Executive Coaching", "Resilience", "Empathy"],
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r7",
        userName: "Karan M.",
        userInitial: "K",
        rating: 5,
        text: "\"Dr. Rao completely changed my approach to managing my team.\""
      }
    ]
  },
  {
    id: "8",
    name: "Samir Hassan",
    initials: "SH",
    title: "Divorce & Breakup Recovery",
    category: "Relationship Clarity",
    rating: 4.7,
    reviewsCount: 92,
    sessionsCount: 200,
    availability: "Today 6pm",
    isVerified: true,
    isCertified: true,
    about: "Endings are just brutal beginnings. I provide a safe, non-judgmental space to process grief and rebuild your identity after a major relationship ends.",
    tags: ["Grief", "Breakups", "Identity Reboot"],
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r8",
        userName: "Rahul D.",
        userInitial: "R",
        rating: 5,
        text: "\"Samir was my anchor during the toughest year of my life.\""
      }
    ]
  },
  {
    id: "9",
    name: "Kavita Singh",
    initials: "KS",
    title: "Spiritual Mentor",
    category: "Life Purpose",
    rating: 4.9,
    reviewsCount: 134,
    sessionsCount: 320,
    availability: "Wednesday 4pm",
    isVerified: true,
    isCertified: false,
    about: "I guide individuals exploring their spirituality outside of traditional religious frameworks, finding connection to the self and the universe.",
    tags: ["Spirituality", "Meditation", "Inner Peace"],
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r9",
        userName: "Anjali T.",
        userInitial: "A",
        rating: 5,
        text: "\"Kavita brings such a calming, grounding presence to every session.\""
      }
    ]
  },
  {
    id: "10",
    name: "David Chen",
    initials: "DC",
    title: "Freelance Success Coach",
    category: "Career Guidance",
    rating: 4.8,
    reviewsCount: 88,
    sessionsCount: 190,
    availability: "Tomorrow 11am",
    isVerified: true,
    isCertified: true,
    about: "The gig economy is tough. I help freelancers structure their business, price their services, and maintain boundaries so they don't burn out.",
    tags: ["Freelancing", "Pricing Strategy", "Boundaries"],
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
    reviews: [
      {
        id: "r10",
        userName: "Marc L.",
        userInitial: "M",
        rating: 5,
        text: "\"David helped me double my rates and work fewer hours. Worth every penny.\""
      }
    ]
  }
];
