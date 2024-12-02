import { OpenAI } from "openai";
import database from "../../utils/database";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Generates a conversational AI response based on user input, chat context, and menu item retrieval.
 *
 * @api {post} /api/ai-brain
 * @apiName ChatContext
 * @apiGroup AI
 *
 * @apiParam {Array} chatContext Optional array of previous chat messages. Each message should be an object containing `role` and `content`.
 * @apiParam {String} userMessage The user's query or message to the AI.
 *
 * @apiSuccess {String} response AI-generated response based on user input and retrieved menu context.
 * 
 * @apiError (400) {Object} Response object with an error message when `userMessage` is missing.
 * @apiError (500) {Object} Response object with an error message for AI generation or database issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/chat-context \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "chatContext": [
 *             { "role": "user", "content": "Tell me about Orange Chicken" }
 *           ],
 *           "userMessage": "What is Kung Pao Chicken?"
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "response": "Kung Pao Chicken: A classic spicy dish with chicken, peanuts, and vegetables - $10.99, 600 calories."
 *     }
 *
 * @apiErrorExample {json} Error response for missing user message:
 *     {
 *       "error": "Missing user message"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error generating response"
 *     }
 */

export default async function handler(req, res) {
    const { chatContext = [], userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'Missing user message' });
    }

    try {
        
        //** Validate Chat Context **// - Chat History RAG
        const validChatContext = chatContext.filter(
            (msg) => msg && typeof msg === "object" && "role" in msg && "content" in msg
          );
        
        //** Get Menu Items **// - Database RAG
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
            `${item.name}: ${item.description} - $${item.price}, ${item.calories} calories ${
            item.designation === "premium" ? "(Premium)" : ""
            }`
        );

        const menuContext =
        menuItems.length > 0
            ? `Here are some menu items related to your query:\n\n${menuItems.join(
                "\n"
            )}`
            : "No relevant menu items found.";

        //** Generate Response **// - FINE-TUNNING
        const response = await openai.chat.completions.create({
            model: "ft:gpt-4o-mini-2024-07-18:personal:pos-system-model1:AWFW78N3", 
            messages: [
                ...validChatContext,
                {
                    role: "system", content: `You are an AI Agent for Panda Express. You aid customer queries. When asked for dishes, they are expecting a Panda Express option, not a recipe.
                                                This is your relevant menu context: ${menuContext} 
                                                Your answer follow this format: 
                                                - Concise, 
                                                - Precise, 
                                                - No Jargon, Straigh to the Point, 
                                                - You love using indented hyphens to keep structure when asked for recipes or relevant information to this format.
                                                - Also emojis that could relate to Panda Express.`
                },
                { role: "user", content: userMessage }
            ],
            max_tokens: 100,
        });

        //** Output Message **//
        const botResponse = response.choices[0].message.content.trim()

        res.status(200).json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
}