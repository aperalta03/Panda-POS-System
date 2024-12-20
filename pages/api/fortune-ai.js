import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @description
 * Generates a fortune cookie-style message using a fine-tuned AI model. The language of the fortune is determined by the `currentLanguage` parameter.
 *
 * @author Alonso Peralta Espinoza
 * @module api/fortune-ai
 *
 * @requestBody
 * The `currentLanguage` parameter is required in the query string.
 *
 * @response
 * The response is a JSON object with the generated fortune cookie message.
 *
 * @example
 * curl -X GET \
 *   http://localhost:3000/api/fortune-ai?currentLanguage=en
 * 
 * // Example response:
 * {
 *   "fortune": "Great things are on the horizon for you!"
 * }
 *
 * @errorExample {json} Error response for method not allowed:
 * {
 *   "error": "Method not allowed. Use GET."
 * }
 *
 * @errorExample {json} Error response for missing language:
 * {
 *   "error": "Missing 'currentLanguage' parameter."
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Failed to generate fortune. Please try again."
 * }
 *
 * @errorExample {json} Error response for unsupported language:
 * {
 *   "error": "Unsupported language. Please use one of the supported languages."
 * }
 *
 * @errorExample {json} Error response for AI generation issues:
 * {
 *   "error": "Failed to generate fortune. Please try again."
 * }
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    // Retrieve the currentLanguage from the query parameters
    const { currentLanguage } = req.query;

    if (!currentLanguage) {
      return res.status(400).json({ error: "Missing 'currentLanguage' parameter." });
    }

    // AI prompt with language-specific instruction
    const response = await openai.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:personal:pos-system-model1:AWFW78N3",
      messages: [
        {
          role: "system",
          content: `You are a wise fortune cookie AI. Your task is to create short, positive, and inspiring fortunes in the user's preferred language: ${currentLanguage}.
                    Fortunes should be concise and similar to those found in real fortune cookies.`,
        },
        { role: "user", content: "Generate a fortune cookie fortune." },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    // Extract the generated fortune
    const fortune = response.choices[0]?.message?.content.trim();
    if (!fortune) {
      throw new Error("No fortune generated by the AI.");
    }

    // Send the fortune as a response
    res.status(200).json({ fortune });
  } catch (error) {
    console.error("Error generating fortune:", error);
    res.status(500).json({ error: "Failed to generate fortune. Please try again." });
  }
}