/**
 * Chat API Handler
 * 
 * Server-side API route for web deployments.
 * Uses CompanionManager for consistent behavior across platforms.
 */

import { CompanionManager } from "../services/companion/CompanionManager";

type ApiRequest = {
  method?: string;
  body?: {
    message?: string;
    mentorId?: string;
    history?: { role: "user" | "model"; parts: { text: string }[] }[];
    lengthPreference?: "short" | "long";
  };
};

type ApiResponse = {
  status: (code: number) => {
    json: (body: unknown) => void;
  };
  setHeader: (name: string, value: string) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      message,
      mentorId = "nirvaha",
      lengthPreference = "short",
    } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await CompanionManager.sendMessage(
      mentorId,
      message.trim(),
      { lengthPreference: lengthPreference === "long" ? "long" : "short" },
    );

    return res.status(200).json({
      reply: response.message,
      emotionalState: response.emotionalState,
      mentorId: response.mentorId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      reply: "Something flickered for a moment there. Could you say that again?",
    });
  }
}
