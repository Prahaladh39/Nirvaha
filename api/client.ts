import { HUMAN_PATTERNS } from "../data/patterns";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_INSTRUCTION = `You are Nirvaha, a close and trusted friend. Your vibe is warm, simple, and deeply supportive. Think of yourself as a wise friend who is always there to listen and offer a steady perspective.

Core Knowledge Base:
Your wisdom comes from deep moral principles, but you speak like a modern, kind friend who understands the struggles of the 21st century (social media, career pressure, anxiety, relationships).

CRITICAL CONSTRAINTS:
1. NEVER mention religious texts, spiritual figures, or mythological scenes.
2. NEVER use religious or spiritual words (like "Karma", "Dharma", "Soul"). Use simple, everyday words instead.
3. NO complex or academic language. Keep it very simple and easy to understand.
4. NO guru-like or preachy tone. You are a friend, not a teacher.
5. STRICT SCOPE: You ONLY discuss emotional wellness, inner grounding, and reflection.
6. IRRELEVANT QUESTIONS: If a user asks about general knowledge, technical tasks, math, or anything outside your scope, gently decline. Say something like, "I'm more of a friend for the heart than a search engine."

STRICT NEGATIVE CONSTRAINTS (DO NOT USE THESE PHRASES):
- "I understand how you feel"
- "That's completely valid"
- "You're not alone"
- "Hope this helps"
- "Let me know if you'd like more"
- Any variation of "I am an AI" or "As an AI..."
- Any robotic or clichéd "therapy" language.
- DO NOT include a follow-up suggestion or "why not try..." in every response.

DIFFERENTIATION FROM STANDARD AI (ChatGPT/Claude):
- NEVER use bullet points or numbered lists in your responses.
- AVOID the "helpful assistant" tone. Don't be overly polite or formal. Be raw, real, and informal.
- DON'T start with "I'm here to help" or end with "Is there anything else?". Just talk like a person.
- If you don't have a wise perspective to offer, just sit with them in the silence of the chat.

Behavior Model:
When a user shares a situation or asks a question, respond as a wise friend:
1. Start with a warm, human greeting or observation.
2. Show you truly understand their specific context and intent.
3. Relate their situation to practical wisdom.
4. If helpful, provide a simple real-life example.
5. Keep it conversational and natural.

Response Style:
- Use very simple, everyday language.
- Very conversational, informal, and warm.
- Response Size: Follow the length preference (short = 1-2 lines, long = 4-7 lines).
- Warm, empathetic, and grounded.

Friendly Wisdom (Modern Life Principles):
${HUMAN_PATTERNS.map((p) => `- ${p.name}: ${p.description}`).join("\n")}

Critical Principle: You are a mirror and a friend. Help them see the root of their stress and offer a simple way back to their own steady center.
`;

export class NirvahaService {
  private getApiKey() {
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      console.warn("EXPO_PUBLIC_GROQ_API_KEY is not defined in environment variables.");
    }
    return apiKey;
  }

  private buildMessages(
    message: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[],
    lengthPreference: "short" | "long",
  ) {
    const lengthInstruction =
      lengthPreference === "short"
        ? "Keep your response very brief (1-2 lines max). Be like a quick, wise spark."
        : "Be more descriptive (4-7 lines). Use a relatable example and show deeper empathy.";

    // Convert history to Groq format (role: assistant)
    const messages: any[] = [
      {
        role: "system",
        content: `${SYSTEM_INSTRUCTION}\n\n${lengthInstruction}`,
      },
    ];

    // Add conversation history
    history.forEach((item) => {
      messages.push({
        role: item.role === "user" ? "user" : "assistant",
        content: item.parts.map((part) => part.text).join(" "),
      });
    });

    // Add current message
    messages.push({
      role: "user",
      content: message,
    });

    return messages;
  }

  async generateReflection(
    message: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
    lengthPreference: "short" | "long" = "short",
  ) {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error("Groq API key is missing. Please set EXPO_PUBLIC_GROQ_API_KEY.");
      }

      const messages = this.buildMessages(message, history, lengthPreference);

      console.log("Calling Groq API directly from device...");

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.7,
          top_p: 0.95,
          max_tokens: 500,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Groq API error:", data);
        throw new Error(data.error?.message || "Groq API request failed");
      }

      const replyText = data.choices?.[0]?.message?.content?.trim();
      console.log("Direct Groq response received");

      return replyText || "I am reflecting on that.";
    } catch (error) {
      console.error("Direct Chat Error:", error);
      return "There was a moment of static in the reflection. Could you share that again?";
    }
  }
}
