import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed. Use GET." });
    }

    try {
        //** AI Fortune Cookie **// - Using FINETUNED MODEL
        const response = await openai.chat.completions.create({
            model: "ft:gpt-4o-mini-2024-07-18:personal:pos-system-model1:AWFW78N3",
            messages: [
                {
                    role: "system",
                    content: `You are a wise fortune cookie AI. Your task is to create short, positive, and inspiring fortunes. 
                                Fortunes should be concise and similar to those found in real fortune cookies.`,
                },
                { role: "user", content: "Generate a fortune cookie fortune." },
            ],
            max_tokens: 50,
            temperature: 0.7,
        });

        const fortune = response.choices[0]?.message?.content.trim();
        if (!fortune) {
            throw new Error("No fortune generated by the AI.");
        }

        res.status(200).json({ fortune });
    } catch (error) {
        console.error("Error generating fortune:", error);
        res.status(500).json({ error: "Failed to generate fortune. Please try again." });
    }
}