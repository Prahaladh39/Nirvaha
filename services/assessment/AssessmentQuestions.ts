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
    text: "A close ally has made a grave error in judgment to protect their family. Exposing the truth will uphold the community's law but ruin their life. Concealing it protects them but compromises your integrity. What do you do?",
    options: [
      {
        text: "Uphold the law and truth immediately, providing personal support to your ally through the fallout.",
        weights: { duty: 3, discipline: 2, courage: 1 }
      },
      {
        text: "Conceal the error to shield your ally's family, willingly bearing the moral burden of the secret.",
        weights: { compassion: 3, resilience: 2, duty: 1 }
      },
      {
        text: "Pivot to mediate quietly, correcting the harm without public exposure, satisfying both justice and safety.",
        weights: { adaptability: 3, wisdom: 2, curiosity: 1 }
      },
      {
        text: "Stand by your ally completely, challenging the rigidity of the law if it is used to destroy rather than heal.",
        weights: { courage: 3, compassion: 2, resilience: 1 }
      }
    ]
  },
  {
    id: 'q2_path_of_uncertainty',
    text: "You are pursuing a life goal but hit an unyielding plateau. A new, untested path promises a breakthrough but requires discarding your current progress. What is your approach?",
    options: [
      {
        text: "Stay the course. Double your discipline and master the basics, trusting that patience will yield clarity.",
        weights: { discipline: 3, resilience: 2, duty: 1 }
      },
      {
        text: "Embrace the untested path immediately. Growth lies in constant experimentation and testing your boundaries.",
        weights: { curiosity: 3, adaptability: 2, courage: 1 }
      },
      {
        text: "Step back to analyze why the plateau occurred, seeking wisdom from mentors before taking any action.",
        weights: { wisdom: 3, curiosity: 2, discipline: 1 }
      },
      {
        text: "Accept the limitation with grace, finding peace in the effort rather than force-driving the outcome.",
        weights: { resilience: 3, compassion: 2, wisdom: 1 }
      }
    ]
  },
  {
    id: 'q3_shadow_of_defeat',
    text: "A project you dedicated months to fails publicly. The blame is unfairly cast on you, and your reputation is compromised. How do you respond?",
    options: [
      {
        text: "Accept the situation in silence, focusing your energy on self-correction and inner peace rather than defense.",
        weights: { resilience: 3, discipline: 2, duty: 1 }
      },
      {
        text: "Speak out with absolute clarity and calm dignity to set the record straight, regardless of the consequences.",
        weights: { courage: 3, duty: 2, discipline: 1 }
      },
      {
        text: "Pivot your focus immediately to a new endeavor, adapting to the loss without letting it affect your self-worth.",
        weights: { adaptability: 3, resilience: 2, curiosity: 1 }
      },
      {
        text: "Stand tall and defend the team, claiming full responsibility if it shields others from unfair scrutiny.",
        weights: { compassion: 3, courage: 2, resilience: 1 }
      }
    ]
  },
  {
    id: 'q4_burden_of_leadership',
    text: "In a high-stakes crisis, your group is divided. Half demand a cautious, safe path; the other half demand a bold, risky charge. You have the deciding vote. How do you choose?",
    options: [
      {
        text: "Uphold the collective safety, choosing the cautious path to ensure no one is left behind or harmed.",
        weights: { compassion: 3, duty: 2, discipline: 1 }
      },
      {
        text: "Take the bold path, leading the charge from the front while taking full accountability for the outcome.",
        weights: { courage: 3, leadership: 2, duty: 1 }
      },
      {
        text: "Synthesize both views into a strategic compromise, using diplomacy to align everyone before moving.",
        weights: { wisdom: 3, adaptability: 2, leadership: 1 }
      },
      {
        text: "Delegate the execution to those with the most specific expertise, supporting them quietly from the background.",
        weights: { duty: 3, discipline: 2, wisdom: 1 }
      }
    ]
  },
  {
    id: 'q5_call_of_destiny',
    text: "You encounter a profound mystery or calling that challenges everything you have been taught about yourself. It demands you leave your comfortable life behind. What is your reaction?",
    options: [
      {
        text: "Respect the mystery but prioritize your tangible duties and commitments to your family and community.",
        weights: { duty: 3, discipline: 2, resilience: 1 }
      },
      {
        text: "Step forward with absolute devotion and faith, trusting the universe and leaving all security behind.",
        weights: { resilience: 3, courage: 2, wisdom: 1 }
      },
      {
        text: "Inquire deeply, investigating the science and philosophy of this calling before making a calculated move.",
        weights: { curiosity: 3, wisdom: 2, discipline: 1 }
      },
      {
        text: "Incorporate the calling's wisdom into your daily lifestyle gradually, blending the ancient with the modern.",
        weights: { adaptability: 3, compassion: 2, discipline: 1 }
      }
    ]
  }
];
