const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const genai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

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

    const reply =
      response.text ||
      "There was a moment of static in the reflection. Could you share that again?";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      reply:
        "There was a moment of static in the reflection. Could you share that again?",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📍 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
