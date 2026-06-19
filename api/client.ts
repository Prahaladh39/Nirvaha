/**
 * API Client
 * 
 * Utility functions for API interactions.
 * The NirvahaService has been replaced by CompanionManager.
 * Only non-companion functions remain here.
 */

/**
 * Detect if a person in an image has a beard.
 * Used by the Wisdom Selfie feature.
 */
export async function detectBeard(base64Image: string): Promise<boolean> {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) return true; // Default to true if no key
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Does the person in this image have a beard or noticeable facial hair? Answer strictly with a single word: 'yes' or 'no'." },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ],
        temperature: 0.1,
        max_tokens: 10
      })
    });
    
    const data = await response.json();
    if (data.error) {
      console.error("Vision API error:", data.error);
      return true; // Fallback
    }
    
    const reply = data.choices?.[0]?.message?.content?.trim().toLowerCase() || "";
    return reply.includes("yes");
  } catch (error) {
    console.error("Error detecting beard:", error);
    return true; // Fallback to original image if error
  }
}
