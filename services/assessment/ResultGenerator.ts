export interface AssessmentPayload {
  primary: string;
  secondary: string;
  percentage: number;
}

/**
 * Service to format the final assessment result payload.
 * Maps similarity scores (0.0 to 1.0) into the natural percentage range (76% to 94%)
 * required by the result screen, ensuring full backward compatibility.
 */
export class ResultGenerator {
  /**
   * Generates the assessment payload, mapping similarity to the target percentage range.
   * 
   * @param primary Primary matching character ID.
   * @param secondary Secondary matching character ID.
   * @param primaryScore Cosine similarity score of the primary match.
   */
  static generatePayload(
    primary: string,
    secondary: string,
    primaryScore: number
  ): AssessmentPayload {
    const minTypicalScore = 0.65;
    const maxTypicalScore = 0.95;
    
    // Linearly interpolate the similarity score ratio between minTypicalScore and maxTypicalScore
    let ratio = (primaryScore - minTypicalScore) / (maxTypicalScore - minTypicalScore);
    ratio = Math.max(0, Math.min(1, ratio)); // Clamp ratio between 0 and 1
    
    // Map to the 76% - 94% range
    const percentage = Math.round(76 + ratio * (94 - 76));

    return {
      primary,
      secondary,
      percentage,
    };
  }
}
