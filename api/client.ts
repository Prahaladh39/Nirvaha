const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";

export class NirvahaService {
  async generateReflection(
    message: string,
    history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
    lengthPreference: "short" | "long" = "short",
  ) {
    try {
      const endpoint = `${API_BASE_URL}/api/chat`;
      console.log("Calling backend endpoint:", endpoint);
      const response = await fetch(endpoint, {
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(
        "API response received:",
        data.reply ? "success" : "no reply",
      );

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
