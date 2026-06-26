export interface PersonalityVector {
  courage: number;
  wisdom: number;
  compassion: number;
  discipline: number;
  adaptability: number;
  duty: number;
  resilience: number;
  curiosity: number;
  leadership: number;
}

export interface AssessmentOption {
  text: string;
  weights: Partial<PersonalityVector>;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: AssessmentOption[];
}

/**
 * Predefined ideal profiles for the 6 ancient characters.
 * Each value reflects the relative dominance of that personality dimension (scale of 1-5).
 */
export const CHARACTER_PROFILES: Record<string, PersonalityVector> = {
  rama: {
    courage: 4,
    wisdom: 4,
    compassion: 3,
    discipline: 5,
    adaptability: 2,
    duty: 5,
    resilience: 4,
    curiosity: 2,
    leadership: 5,
  },
  krishna: {
    courage: 4,
    wisdom: 5,
    compassion: 4,
    discipline: 2,
    adaptability: 5,
    duty: 3,
    resilience: 3,
    curiosity: 5,
    leadership: 5,
  },
  hanuman: {
    courage: 5,
    wisdom: 4,
    compassion: 5,
    discipline: 4,
    adaptability: 2,
    duty: 5,
    resilience: 5,
    curiosity: 2,
    leadership: 3,
  },
  arjuna: {
    courage: 4,
    wisdom: 4,
    compassion: 2,
    discipline: 5,
    adaptability: 3,
    duty: 3,
    resilience: 4,
    curiosity: 5,
    leadership: 4,
  },
  sita: {
    courage: 3,
    wisdom: 5,
    compassion: 5,
    discipline: 4,
    adaptability: 3,
    duty: 4,
    resilience: 5,
    curiosity: 2,
    leadership: 3,
  },
  karna: {
    courage: 5,
    wisdom: 3,
    compassion: 5,
    discipline: 3,
    adaptability: 2,
    duty: 4,
    resilience: 4,
    curiosity: 3,
    leadership: 4,
  },
};

/**
 * The 5 optimized assessment questions.
 * Each answer represents a complex scenario, adding weight to multiple core personality dimensions.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1_crisis_of_truth',
    text: "A friend broke the law to save their family. Do you expose them or protect them?",
    options: [
      {
        text: "Report them to uphold the law, but support them through the aftermath.",
        weights: { duty: 3, discipline: 2, courage: 1 }
      },
      {
        text: "Hide their mistake to protect their family, carrying the secret myself.",
        weights: { compassion: 3, resilience: 2, duty: 1 }
      },
      {
        text: "Solve the issue quietly behind the scenes to avoid public exposure.",
        weights: { adaptability: 3, wisdom: 2, curiosity: 1 }
      },
      {
        text: "Stand by them completely, questioning a law that destroys lives.",
        weights: { courage: 3, compassion: 2, resilience: 1 }
      }
    ]
  },
  {
    id: 'q2_path_of_uncertainty',
    text: "You hit a dead end on your goal. Will you stick to your path or risk a new one?",
    options: [
      {
        text: "Stay the course. Double my discipline and wait for progress.",
        weights: { discipline: 3, resilience: 2, duty: 1 }
      },
      {
        text: "Take the new path. Growth comes from trying new things.",
        weights: { curiosity: 3, adaptability: 2, courage: 1 }
      },
      {
        text: "Stop and analyze the problem, asking mentors for advice before moving.",
        weights: { wisdom: 3, curiosity: 2, discipline: 1 }
      },
      {
        text: "Accept the setback calmly and find peace in my honest effort.",
        weights: { resilience: 3, compassion: 2, wisdom: 1 }
      }
    ]
  },
  {
    id: 'q3_shadow_of_defeat',
    text: "A major project fails, and you are unfairly blamed. How do you react?",
    options: [
      {
        text: "Accept the situation silently, focusing on inner peace instead of defending myself.",
        weights: { resilience: 3, discipline: 2, duty: 1 }
      },
      {
        text: "Speak up clearly and calmly to set the record straight, no matter what.",
        weights: { courage: 3, duty: 2, discipline: 1 }
      },
      {
        text: "Move on to a new project immediately without letting the failure affect me.",
        weights: { adaptability: 3, resilience: 2, curiosity: 1 }
      },
      {
        text: "Take full blame if it protects my team from unfair criticism.",
        weights: { compassion: 3, courage: 2, resilience: 1 }
      }
    ]
  },
  {
    id: 'q4_burden_of_leadership',
    text: "In a crisis, your team is split between a safe path and a risky charge. How do you decide?",
    options: [
      {
        text: "Choose the safe path to ensure no one is left behind or hurt.",
        weights: { compassion: 3, duty: 2, discipline: 1 }
      },
      {
        text: "Choose the bold path and lead the charge, taking full responsibility.",
        weights: { courage: 3, leadership: 2, duty: 1 }
      },
      {
        text: "Create a compromise that combines both approaches to bring everyone together.",
        weights: { wisdom: 3, adaptability: 2, leadership: 1 }
      },
      {
        text: "Let the team experts decide and execute, supporting them from behind the scenes.",
        weights: { duty: 3, discipline: 2, wisdom: 1 }
      }
    ]
  },
  {
    id: 'q5_call_of_destiny',
    text: "A unique opportunity calls you to leave your comfortable life for something unknown. How do you respond?",
    options: [
      {
        text: "Politely decline and prioritize my duties to my family and community.",
        weights: { duty: 3, discipline: 2, resilience: 1 }
      },
      {
        text: "Leap forward with absolute trust, leaving all safety and comfort behind.",
        weights: { resilience: 3, courage: 2, wisdom: 1 }
      },
      {
        text: "Research and analyze this opportunity deeply before making a careful decision.",
        weights: { curiosity: 3, wisdom: 2, discipline: 1 }
      },
      {
        text: "Gradually adapt my lifestyle to include this new path, balancing the old with the new.",
        weights: { adaptability: 3, compassion: 2, discipline: 1 }
      }
    ]
  }
];
