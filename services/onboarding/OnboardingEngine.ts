import { ONBOARDING_QUESTIONS, OnboardingQuestion, OnboardingOption, OnboardingOptionWeights } from './OnboardingQuestions';

export interface OnboardingRecommendation {
  focus: string; // e.g. "stress", "sleep", "productivity", "mood", "balance"
  tool: string;  // e.g. "chat", "journaling", "meditation", "holistic"
}

/**
 * State machine and scoring calculator for the onboarding assessment.
 * Evaluates multi-dimensional option weights to generate custom user focus and tool recommendations.
 */
export class OnboardingEngine {
  private currentStep: number = 0;
  private answers: number[] = [];
  private accumulatedScores: Record<string, number> = {};
  private questions: OnboardingQuestion[] = ONBOARDING_QUESTIONS;

  constructor(initialAnswers?: number[]) {
    if (initialAnswers) {
      initialAnswers.forEach((optIdx) => {
        this.answers.push(optIdx);
      });
      this.recalculateScores();
    }
  }

  /**
   * Returns all onboarding questions.
   */
  getQuestions(): OnboardingQuestion[] {
    return this.questions;
  }

  /**
   * Returns the current active question.
   */
  getCurrentQuestion(): OnboardingQuestion {
    return this.questions[this.currentStep];
  }

  /**
   * Returns the 0-based active step index.
   */
  getCurrentIndex(): number {
    return this.currentStep;
  }

  /**
   * Returns the total question count (3).
   */
  getQuestionsCount(): number {
    return this.questions.length;
  }

  /**
   * Returns progress percentage (0 - 100).
   */
  getProgress(): number {
    return ((this.currentStep + 1) / this.questions.length) * 100;
  }

  /**
   * Moves back one question and pops the last answered option, recalculating scores.
   * Returns true if successful, false if already at step 0.
   */
  goBack(): boolean {
    if (this.currentStep > 0) {
      this.currentStep -= 1;
      this.answers.pop();
      this.recalculateScores();
      return true;
    }
    return false;
  }

  /**
   * Selects an option for the current question. Accumulates option weights.
   * Returns true if the assessment is finished, false otherwise.
   * 
   * @param optionIndex Selected option index (0 to 3).
   */
  selectOption(optionIndex: number): boolean {
    this.answers.push(optionIndex);
    const chosenOption = this.questions[this.currentStep]?.options[optionIndex];
    
    // Accumulate weights
    if (chosenOption && chosenOption.weights) {
      Object.entries(chosenOption.weights).forEach(([key, val]) => {
        this.accumulatedScores[key] = (this.accumulatedScores[key] || 0) + (val || 0);
      });
    }

    if (this.currentStep >= this.questions.length - 1) {
      return true; // Complete!
    }

    this.currentStep += 1;
    return false;
  }

  /**
   * Gets a copy of the selected answer indexes.
   */
  getAnswers(): number[] {
    return [...this.answers];
  }

  /**
   * Evaluates the personality scores to compile recommendations.
   */
  getRecommendation(): OnboardingRecommendation {
    // 1. Calculate focus recommendation (find focus with the highest score)
    const focusKeys = [
      { key: 'focus_stress', value: 'stress' },
      { key: 'focus_sleep', value: 'sleep' },
      { key: 'focus_productivity', value: 'productivity' },
      { key: 'focus_mood', value: 'mood' },
      { key: 'focus_balance', value: 'balance' },
    ];
    let maxFocusVal = -1;
    let recommendedFocus = 'balance';
    focusKeys.forEach((f) => {
      const score = this.accumulatedScores[f.key] || 0;
      if (score > maxFocusVal) {
        maxFocusVal = score;
        recommendedFocus = f.value;
      }
    });

    // 2. Calculate tool recommendation (find coping mechanism with the highest score)
    const copingKeys = [
      { key: 'coping_chat', value: 'chat' },
      { key: 'coping_journaling', value: 'journaling' },
      { key: 'coping_meditation', value: 'meditation' },
      { key: 'coping_holistic', value: 'holistic' },
    ];
    let maxCopingVal = -1;
    let recommendedTool = 'holistic';
    copingKeys.forEach((c) => {
      const score = this.accumulatedScores[c.key] || 0;
      if (score > maxCopingVal) {
        maxCopingVal = score;
        recommendedTool = c.value;
      }
    });

    return {
      focus: recommendedFocus,
      tool: recommendedTool,
    };
  }

  /**
   * Recalculates accumulated scores from the answers array.
   */
  private recalculateScores(): void {
    this.accumulatedScores = {};
    this.answers.forEach((optIdx, qIdx) => {
      const option = this.questions[qIdx]?.options[optIdx];
      if (option && option.weights) {
        Object.entries(option.weights).forEach(([key, val]) => {
          this.accumulatedScores[key] = (this.accumulatedScores[key] || 0) + (val || 0);
        });
      }
    });
  }
}
