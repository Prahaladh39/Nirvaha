import { OnboardingEngine } from '../services/onboarding/OnboardingEngine';

const engine = new OnboardingEngine();
console.log('Step 0 Question:', engine.getCurrentQuestion().question);
engine.selectOption(0);
console.log('Step 1 Index:', engine.getCurrentIndex());
console.log('Step 1 Question:', engine.getCurrentQuestion().question);
engine.selectOption(0);
console.log('Step 2 Index:', engine.getCurrentIndex());
console.log('Step 2 Question:', engine.getCurrentQuestion().question);
