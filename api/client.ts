export class NirvahaService {
  async generateReflection(
    message: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
    lengthPreference: "short" | "long" = "short",
  ) {
    try {
      console.log("Calling frontend /api/chat endpoint");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history,
          lengthPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data);
        throw new Error(data.error || "API request failed");
      }

      console.log("API response received");

      return data.reply;
    } catch (error) {
      console.error("Error generating reflection:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      return "There was a moment of static in the reflection. Could you share that again?";
    }
  }
}
