import { PersonalityVector } from './AssessmentQuestions';

/**
 * Service to manage the user's personality vector state.
 * Accumulates weights across the 9 key traits during the quiz.
 */
export class CharacterScoringService {
  private userVector: PersonalityVector;

  constructor() {
    this.userVector = {
      courage: 0,
      wisdom: 0,
      compassion: 0,
      discipline: 0,
      adaptability: 0,
      duty: 0,
      resilience: 0,
      curiosity: 0,
      leadership: 0,
    };
  }

  /**
   * Adds the selected option's weights to the user's cumulative personality vector.
   * @param weights The weights mapping from the selected answer.
   */
  addWeights(weights: Partial<PersonalityVector>): void {
    Object.keys(weights).forEach((k) => {
      const key = k as keyof PersonalityVector;
      this.userVector[key] = (this.userVector[key] || 0) + (weights[key] || 0);
    });
  }

  /**
   * Returns a copy of the current user personality vector.
   */
  getUserVector(): PersonalityVector {
    return { ...this.userVector };
  }
}
