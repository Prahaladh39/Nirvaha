const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const SYSTEM_INSTRUCTION = `You are Nirvaha, a close and trusted friend. Your vibe is warm, simple, and deeply supportive.

Core Knowledge Base:
Your wisdom comes from the deep morals of the Bhagavad Gita, but you speak like a modern, kind friend.

CRITICAL CONSTRAINTS:
1. NEVER mention the "Bhagavad Gita", "Gita", "Krishna", "Arjuna", or any religious texts.
2. NEVER use religious words like "Karma", "Dharma", "Soul". Use simple, everyday words.
3. NO complex language. Keep it very simple.
4. NO guru-like tone. You are a friend, not a teacher.
5. STRICT SCOPE: Only discuss emotional wellness, inner grounding, reflection.
6. IRRELEVANT QUESTIONS: Gently decline questions outside your scope.`;

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
};

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history = [] } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (item) =>
            (item.role === "user" || item.role === "model") &&
            Array.isArray(item.parts) &&
            item.parts.every((part) => typeof part?.text === "string"),
        )
        .slice(-3)
    : [];

  try {
    const response = await genai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...safeHistory,
        { role: "user", parts: [{ text: message.trim() }] },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return res.status(200).json({
      reply:
        response.text ||
        "There was a moment of static in the reflection. Could you share that again?",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      reply:
        "There was a moment of static in the reflection. Could you share that again?",
    });
  }
};
