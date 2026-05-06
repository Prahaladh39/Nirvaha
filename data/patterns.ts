export interface HumanPattern {

  id: string;

  name: string;

  description: string;

  reflectionPrompt: string;

}

export const HUMAN_PATTERNS: HumanPattern[] = [

  {

    id: 'responsibility-over-blame',

    name: 'Ownership of Action',

    description: 'The recognition that while you cannot control external events, you have absolute authority over your response.',

    reflectionPrompt: 'What part of this situation is within your direct control right now?'

  },

  {

    id: 'structure-over-confusion',

    name: 'First Principles',

    description: 'Breaking a complex problem down into its most basic, undeniable truths to find a path forward.',

    reflectionPrompt: 'If we strip away the stories and the noise, what are the three basic facts of this situation?'

  },

  {

    id: 'discipline-over-impulse',

    name: 'The Gap of Choice',

    description: 'The discipline to pause between a feeling and an action, choosing the response that aligns with your integrity.',

    reflectionPrompt: 'Is this action a reaction to a temporary feeling, or a choice based on your long-term aim?'

  },

  {

    id: 'clarity-over-comfort',

    name: 'Unflinching Truth',

    description: 'The willingness to see things as they are, rather than how you wish they were, even if it is uncomfortable.',

    reflectionPrompt: 'What is the one truth about this situation you are currently trying to avoid?'

  },

  {

    id: 'action-over-rumination',

    name: 'The Duty of the Moment',

    description: 'The understanding that thinking without acting leads to paralysis. Clarity is found in the doing.',

    reflectionPrompt: 'What is the single most effective action you can take in the next ten minutes?'

  },

  {

    id: 'process-over-outcome',

    name: 'The Effort\'s Reward',

    description: 'Focusing entirely on the quality of your action, letting go of the anxiety about the final result.',

    reflectionPrompt: 'If the result was guaranteed to be invisible, would you still find value in the effort you\'re making right now?'

  },

  {

    id: 'equanimity-over-reaction',

    name: 'The Steady Center',

    description: 'Maintaining your inner calm regardless of whether things are going "well" or "badly" in the outside world.',

    reflectionPrompt: 'How much of your current peace is dependent on things going exactly your way?'

  },

  {

    id: 'nature-over-comparison',

    name: 'Your Own Path',

    description: 'Understanding your unique strengths instead of trying to meet external expectations or compare yourself to others.',

    reflectionPrompt: 'Are you trying to be a better version of yourself, or a second-rate version of someone else?'

  },

  {

    id: 'contribution-over-ego',

    name: 'The Bigger Picture',

    description: 'Shifting focus from "What do I get?" to "How can I contribute?", which naturally dissolves personal anxiety.',

    reflectionPrompt: 'If you stepped outside your own story for a moment, how could you be of use to the situation at hand?'

  },

  {

    id: 'flow-over-resistance',

    name: 'The River\'s Wisdom',

    description: 'Accepting the current moment as it is, rather than fighting against reality, allowing for more effective action.',

    reflectionPrompt: 'What would happen if you stopped fighting the current and started using its energy to move forward?'

  }

];
