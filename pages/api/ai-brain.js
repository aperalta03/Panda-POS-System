import { OpenAI } from "openai";
import database from "../../utils/database";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Brain Handler
 *
 * This handler processes requests for generating AI responses using OpenAI's GPT model.
 * It supports two modes:
 * - Text-to-Speech (TTS) mode for summarizing text content.
 * - Regular chat mode for answering user queries, including menu item retrieval.
 *
 * @author Alonso Peralta Espinoza, Anson Thai
 * 
 * @module api/ai-brain
 * 
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request payload.
 * @param {Array} [req.body.chatContext=[]] - Optional chat history for the conversation. Each message should have:
 *    - `role` {string}: The speaker's role (`"user"`, `"assistant"`, or `"system"`).
 *    - `content` {string}: The message text.
 * @param {string} req.body.userMessage - The user's current message or query.
 * @param {boolean} [req.body.isTextToSpeech=false] - Flag indicating if the request is for Text-to-Speech mode.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {Promise<void>} Sends a JSON response with the AI-generated message or an error.
 *
 * @throws {Object} Sends a 400 error if `userMessage` is missing.
 * @throws {Object} Sends a 500 error if there is an issue with AI generation or database operations.
 * 
 * @example Request Example (Chat Mode):
 * curl -X POST \
 *   http://localhost:3000/api/ai-brain \
 *   -H 'Content-Type: application/json' \
 *   -d '{
 *         "chatContext": [
 *           { "role": "user", "content": "Tell me about Orange Chicken" }
 *         ],
 *         "userMessage": "What is Kung Pao Chicken?"
 *       }'
 * 
 * @example Request Example (Text-to-Speech Mode):
 * curl -X POST \
 *   http://localhost:3000/api/ai-brain \
 *   -H 'Content-Type: application/json' \
 *   -d '{
 *         "chatContext": [],
 *         "userMessage": "Summarize the following page content for accessibility...",
 *         "isTextToSpeech": true
 *       }'
 * 
 * @example Success Response:
 * {
 *   "response": "Kung Pao Chicken: A classic spicy dish with chicken, peanuts, and vegetables - $10.99, 600 calories."
 * }
 * 
 * @example Error Response (Missing userMessage):
 * {
 *   "error": "Missing user message"
 * }
 * 
 * @example Error Response (Server Error):
 * {
 *   "error": "Error generating response"
 * }
 */
export default async function handler(req, res) {
    const { chatContext = [], userMessage, isTextToSpeech = false } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'Missing user message' });
    }

    try {

        let systemPrompt = "";

        if (isTextToSpeech) {

            //** Text-to-Speech Request Context **//
            systemPrompt = `You are an assistant that summarizes and corrects grammatical errors in the provided text. 
                            Provide a clear, concise summary, and correct any grammatical mistakes. 
                            The summary should be suitable for reading aloud to a user who may have visual impairments.`;

        } else {

            //** Chat Context **// - RAG
            const validChatContext = chatContext.filter(
                (msg) => msg && typeof msg === "object" && "role" in msg && "content" in msg
            );

            //** Database Retrieval **// - RAG
            const menuQuery = `
                SELECT name, description, price, calories, designation
                FROM menu
                WHERE LOWER(name) LIKE $1
                LIMIT 5;
            `;

            const searchTerm = `%${userMessage.toLowerCase()}%`;
            const result = await database.query(menuQuery, [searchTerm]);

            const menuItems = result.rows.map(
                (item) =>
                    `${item.name}: ${item.description} - $${item.price}, ${item.calories} calories ${item.designation === "premium" ? "(Premium)" : ""
                    }`
            );

            const menuContext =
                menuItems.length > 0
                    ? `Here are some menu items related to your query:\n\n${menuItems.join(
                        "\n"
                    )}`
                    : "No relevant menu items found.";

            systemPrompt = `You are an AI Agent for Panda Express. You aid customer queries. When asked for dishes, they are expecting a Panda Express option, not a recipe.
            This is your relevant menu context: ${menuContext}
            This is the user's chat context: ${JSON.stringify(validChatContext)}
            Your answers should be:
            - Concise
            - Precise
            - No jargon, straight to the point
            - Use indented hyphens to structure information when appropriate
            - Include emojis related to Panda Express when suitable.`;
        }

        //** Generate Response **// - Fine-Tunned Model
        const response = await openai.chat.completions.create({
            model: "ft:gpt-4o-mini-2024-07-18:personal:pos-system-model1:AWFW78N3",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            
            max_tokens: 1000,
        });

        //** Output Message **//
        const botResponse = response.choices[0].message.content.trim();

        res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
}