
import { optimizePortfolioWithAI } from "../server/ai-mentor";
import { config } from "dotenv";

// Load environment variables
config();

async function test() {
    console.log("Testing AI Optimization...");
    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is missing in .env");
        process.exit(1);
    }

    const mockPortfolio: any = {
        title: "Junior Developer",
        bio: "I like coding.",
        skills: ["HTML", "CSS"],
        projects: [{ title: "Todo App", description: "A simple todo app in React" }]
    };

    const jobDescription = "Looking for a Senior React Developer with TypeScript and Node.js experience.";

    try {
        const result = await optimizePortfolioWithAI(mockPortfolio, jobDescription);
        console.log("Success! Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
