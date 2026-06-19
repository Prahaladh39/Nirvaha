import { ONBOARDING_QUESTIONS, OnboardingQuestion, OnboardingOption } from '../services/onboarding/OnboardingQuestions';

export type { OnboardingQuestion, OnboardingOption };

/**
 * Re-exporting the redesigned 3-question dataset to maintain full compatibility
 * with all existing components importing questions from this file.
 */
export const questions = ONBOARDING_QUESTIONS;
