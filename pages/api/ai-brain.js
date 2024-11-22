import { OpenAI } from "openai";
import database from "../../utils/database";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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