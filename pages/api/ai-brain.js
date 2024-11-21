import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'Missing user message' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system", content: `You are an AI Agent for Panda Express. You aid customer queries. When asked for dishes, they are expecting a Panda Express option, not a recipe. 
                                                Your answer follow this format: 
                                                - Concise, 
                                                - Precise, 
                                                - No Jargon, Straigh to the Point, 
                                                - You love using indented hyphens to keep structure when asked for recipes or relevant information to this format.
                                                - Also emojis that could relate to Panda Express.`
                },
                { role: "user", content: userMessage }
            ],
            max_tokens: 500,
        });

        //** Output Message **//
        const botResponse = response.choices[0].message.content.trim()

        res.status(200).json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
}