export interface OnboardingOptionWeights {
  // Focus Areas
  focus_stress?: number;
  focus_sleep?: number;
  focus_productivity?: number;
  focus_mood?: number;
  focus_balance?: number;
  
  // Preferred Mediums
  coping_chat?: number;
  coping_journaling?: number;
  coping_meditation?: number;
  coping_holistic?: number;
  
  // Time Commitment
  time_low?: number;
  time_medium?: number;
  time_high?: number;
  time_flow?: number;
}

export interface OnboardingOption {
  label: string;
  description: string;
  microcopy: string;
  weights: OnboardingOptionWeights;
}

export interface OnboardingQuestion {
  question: string;
  subtitle?: string;
  progressLabel: string;
  options: OnboardingOption[];
}

/**
 * The 3 optimized scenario-based onboarding questions.
 * Designed to capture goals, stress coping, tool preferences, and availability.
 */
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    question: "You have had an exceptionally demanding week, and your mind is racing with uncompleted tasks. How do you find your anchor?",
    subtitle: "Select the option that resonates most with your immediate reaction.",
    progressLabel: "Analyzing mental anchors...",
    options: [
      {
        label: "Write down my thoughts",
        description: "Clear the mental clutter, then focus on resting.",
        microcopy: "",
        weights: { focus_productivity: 3, focus_sleep: 2, coping_journaling: 3, focus_stress: 1 }
      },
      {
        label: "Breathe or meditate",
        description: "Quiet the nervous system and dissolve physical stress.",
        microcopy: "",
        weights: { focus_stress: 3, focus_balance: 2, coping_meditation: 3, focus_sleep: 1 }
      },
      {
        label: "Talk through my feelings",
        description: "Connect with a guide or trusted voice to process.",
        microcopy: "",
        weights: { focus_mood: 3, focus_balance: 2, coping_chat: 3, focus_stress: 1 }
      },
      {
        label: "Decompress in flow",
        description: "Listen to calming sounds and let the pressure fade.",
        microcopy: "",
        weights: { focus_sleep: 3, focus_stress: 2, coping_holistic: 3 }
      }
    ]
  },
  {
    question: "You stand at a crossroads in your life, seeking a deeper sense of alignment. Which path calls to you most?",
    subtitle: "Choose the practice style you are drawn to.",
    progressLabel: "Mapping your spiritual path...",
    options: [
      {
        label: "Ancient wisdom & breath",
        description: "A guided route of silent reflection and breathing techniques.",
        microcopy: "",
        weights: { focus_balance: 3, coping_meditation: 3, focus_stress: 2 }
      },
      {
        label: "Interactive guidance",
        description: "Collaborative dialogue and modern self-discovery exercises.",
        microcopy: "",
        weights: { focus_mood: 3, coping_chat: 3, focus_productivity: 1 }
      },
      {
        label: "Written self-exploration",
        description: "A blank slate to journal insights and quiet your thoughts.",
        microcopy: "",
        weights: { focus_productivity: 3, coping_journaling: 3, focus_balance: 1 }
      },
      {
        label: "Holistic wellness mix",
        description: "A complete integration of modern and ancient wisdom.",
        microcopy: "",
        weights: { focus_balance: 3, coping_holistic: 3, focus_sleep: 1 }
      }
    ]
  },
  {
    question: "A rare, quiet window of 15 minutes opens in your busy schedule. How do you choose to invest it in yourself?",
    subtitle: "Select the pacing that matches your lifestyle.",
    progressLabel: "Shaping your daily commitment...",
    options: [
      {
        label: "A quick 2–5 min reset",
        description: "Quick mindful checks, returning to work with clarity.",
        microcopy: "",
        weights: { time_low: 3, focus_productivity: 2 }
      },
      {
        label: "A structured 10-min pause",
        description: "A perfect daily practice to sink into deep stillness.",
        microcopy: "",
        weights: { time_medium: 3, focus_balance: 2 }
      },
      {
        label: "Full 15 minutes of space",
        description: "Dedicated unhurried wellness time for deep integration.",
        microcopy: "",
        weights: { time_high: 3, focus_sleep: 2 }
      },
      {
        label: "No structure, just flow",
        description: "Listen to my mind and let it take me where I need.",
        microcopy: "",
        weights: { time_flow: 3, focus_stress: 2 }
      }
    ]
  }
];
