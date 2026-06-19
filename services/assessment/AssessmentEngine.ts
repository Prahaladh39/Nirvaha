import { ASSESSMENT_QUESTIONS, AssessmentQuestion, AssessmentOption } from './AssessmentQuestions';
import { CharacterScoringService } from './CharacterScoringService';
import { CharacterRecommendationEngine } from './CharacterRecommendationEngine';
import { ResultGenerator, AssessmentPayload } from './ResultGenerator';

/**
 * State machine engine for the Ancient Character Assessment.
 * Decouples navigation, state transitions, scoring, and recommendation triggers from the UI.
 */
export class AssessmentEngine {
  private currentQuestionIdx: number = 0;
  private scoringService: CharacterScoringService;
  private questions: AssessmentQuestion[] = ASSESSMENT_QUESTIONS;

  constructor() {
    this.scoringService = new CharacterScoringService();
  }

  /**
   * Gets the full list of assessment questions.
   */
  getQuestions(): AssessmentQuestion[] {
    return this.questions;
  }

  /**
   * Gets the current active question.
   */
  getCurrentQuestion(): AssessmentQuestion {
    return this.questions[this.currentQuestionIdx];
  }

  /**
   * Gets the 0-based index of the current question.
   */
  getCurrentIndex(): number {
    return this.currentQuestionIdx;
  }

  /**
   * Gets the total number of questions in the assessment (5).
   */
  getQuestionsCount(): number {
    return this.questions.length;
  }

  /**
   * Calculates the current progress percentage (0 - 100).
   */
  getProgress(): number {
    return ((this.currentQuestionIdx + 1) / this.questions.length) * 100;
  }

  /**
   * Processes selecting an option for the current question.
   * Accumulates traits, advances question state, and returns the final payload
   * if the quiz is complete, or null if there are more questions.
   * 
   * @param option The option selected by the user.
   */
  selectOption(option: AssessmentOption): AssessmentPayload | null {
    // Add weights to cumulative profile
    this.scoringService.addWeights(option.weights);

    // If this was the last question, compile the result
    if (this.currentQuestionIdx >= this.questions.length - 1) {
      const userVector = this.scoringService.getUserVector();
      const recommendation = CharacterRecommendationEngine.recommend(userVector);
      return ResultGenerator.generatePayload(
        recommendation.primary,
        recommendation.secondary,
        recommendation.primaryScore
      );
    }

    // Advance to next question
    this.currentQuestionIdx += 1;
    return null;
  }
}
