export interface ChatBotQA {
  keywords: string[];
  answer: string;
}

export const chatBotData: ChatBotQA[] = [
  {
    keywords: ["hi", "hello", "hey", "greetings"],
    answer: "Hello there. I'm here to listen. What's on your mind today?"
  },
  {
    keywords: ["purpose", "meaning", "lost", "direction"],
    answer: "Feeling lost is often the first step to finding a new direction. Can you tell me more about what's missing for you lately?"
  },
  {
    keywords: ["career", "job", "work", "boss", "colleague"],
    answer: "Work challenges can be incredibly draining. Are you feeling unfulfilled by the work itself, or is it the environment?"
  },
  {
    keywords: ["relationship", "partner", "spouse", "dating", "breakup", "divorce"],
    answer: "Relationships require so much of our emotional energy. Take a deep breath. What is the hardest part about your situation right now?"
  },
  {
    keywords: ["anxious", "anxiety", "stress", "stressed", "overwhelmed"],
    answer: "It's completely normal to feel overwhelmed. Let's ground ourselves for a second. What is the one thing causing the most pressure right now?"
  },
  {
    keywords: ["sad", "depressed", "down", "unhappy", "cry"],
    answer: "I hear you, and it's okay to not be okay. You don't have to carry this alone. Do you want to talk about what triggered this feeling?"
  },
  {
    keywords: ["family", "parents", "mother", "father", "siblings"],
    answer: "Family dynamics are often our most complex relationships. How are boundaries holding up between you and them?"
  },
  {
    keywords: ["lonely", "alone", "isolated", "friend", "friends"],
    answer: "Loneliness can feel so isolating, even in a crowded room. Have you felt disconnected for a while, or is this a recent feeling?"
  },
  {
    keywords: ["stuck", "trapped", "habit", "motivation", "procrastinate"],
    answer: "When we feel stuck, it's usually because a part of us is afraid of the next step. What does the next step look like for you?"
  },
  {
    keywords: ["thank you", "thanks", "helpful", "appreciate"],
    answer: "You're very welcome. Remember, the answers are already inside you. I'm just here to help you hear them."
  }
];

export const defaultBotAnswer = "I'm sorry, I might not have the right words for that right now. But I am here, and I am listening. Tell me more.";
