import OpenAI from "openai";
import { ChatResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "demo_key"
});

export async function processUserQuery(query: string, faqResults: any[]): Promise<ChatResponse> {
  try {
    // Check if we have FAQ matches
    const hasFaqMatch = faqResults.length > 0;
    
    let systemPrompt = `You are an expert TallyPrime accounting software assistant. You help users with accounting queries, provide step-by-step guidance, and can simulate TallyPrime actions.

IMPORTANT: Always respond in JSON format with the following structure:
{
  "content": "your response text",
  "type": "text|faq|simulation|error",
  "metadata": {
    "steps": [{"step": 1, "description": "step description"}], // optional for step-by-step guides
    "simulation": "simulation content", // optional for TallyPrime simulations
    "faqMatch": true/false,
    "confidence": 0.0-1.0
  }
}

Response Types:
- "faq": When answering based on FAQ knowledge
- "simulation": When demonstrating TallyPrime interface/actions
- "text": For general responses
- "error": When query cannot be understood

For TallyPrime simulations, create ASCII-style interfaces that show what the user would see in TallyPrime.`;

    if (hasFaqMatch) {
      systemPrompt += `\n\nRelevant FAQ found: ${JSON.stringify(faqResults[0])}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      content: result.content || "I couldn't process your request. Please try again.",
      type: result.type || "text",
      metadata: {
        ...result.metadata,
        faqMatch: hasFaqMatch,
        confidence: result.metadata?.confidence || (hasFaqMatch ? 0.9 : 0.7)
      }
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      content: "I'm having trouble processing your request right now. Please try again later.",
      type: "error",
      metadata: { confidence: 0.1 }
    };
  }
}

export async function generateTallySimulation(action: string): Promise<ChatResponse> {
  try {
    const prompt = `Create a TallyPrime simulation for the action: "${action}". 
    Show what the user interface would look like in ASCII format, including menus, forms, and navigation instructions.
    
    Respond in JSON format:
    {
      "content": "Description of the simulation",
      "type": "simulation",
      "metadata": {
        "simulation": "ASCII interface content",
        "confidence": 0.95
      }
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      content: result.content || `Simulation for ${action}`,
      type: "simulation",
      metadata: {
        simulation: result.metadata?.simulation || "Simulation not available",
        confidence: 0.95
      }
    };
  } catch (error) {
    console.error("Simulation generation error:", error);
    return {
      content: "Unable to generate simulation at the moment.",
      type: "error",
      metadata: { confidence: 0.1 }
    };
  }
}
