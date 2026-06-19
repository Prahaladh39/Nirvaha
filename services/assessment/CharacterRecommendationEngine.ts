import { PersonalityVector, CHARACTER_PROFILES } from './AssessmentQuestions';

export interface RecommendationResult {
  primary: string;
  secondary: string;
  primaryScore: number;
}

/**
 * Service that calculates character similarity scores and recommendations.
 * Utilizes multidimensional Cosine Similarity on personality vectors.
 */
export class CharacterRecommendationEngine {
  /**
   * Calculates the Cosine Similarity between two personality vectors.
   * Returns a value between 0.0 (completely dissimilar) and 1.0 (identical profile).
   */
  static calculateCosineSimilarity(vecA: PersonalityVector, vecB: PersonalityVector): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    const keys = Object.keys(vecB) as Array<keyof PersonalityVector>;
    keys.forEach((key) => {
      const valA = vecA[key] || 0;
      const valB = vecB[key] || 0;
      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    });
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Recommends characters based on similarity scores.
   * Sorts character profiles and returns the primary and secondary matches.
   * 
   * @param userVector The user's accumulated personality vector.
   */
  static recommend(userVector: PersonalityVector): RecommendationResult {
    const similarityScores: Record<string, number> = {};

    // Calculate similarity against each character profile
    Object.keys(CHARACTER_PROFILES).forEach((charId) => {
      const charVector = CHARACTER_PROFILES[charId];
      similarityScores[charId] = this.calculateCosineSimilarity(userVector, charVector);
    });

    // Sort by descending similarity score
    const sortedChars = Object.keys(similarityScores).sort(
      (a, b) => similarityScores[b] - similarityScores[a]
    );

    const primary = sortedChars[0] || 'rama';
    const secondary = sortedChars[1] || 'sita';
    const primaryScore = similarityScores[primary] || 0.8;

    return {
      primary,
      secondary,
      primaryScore,
    };
  }
}
