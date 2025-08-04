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
    
    // Check if this is a simulation request
    const isSimulationRequest = query.toLowerCase().includes('simulation') || 
                              query.toLowerCase().includes('show me how to') ||
                              query.toLowerCase().includes('generate a tallyprime') ||
                              query.toLowerCase().includes('simulate');
    
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
- "simulation": When demonstrating TallyPrime interface/actions (USE THIS when user asks for simulations, demonstrations, or "show me how to")
- "text": For general responses
- "error": When query cannot be understood

For TallyPrime simulations, create detailed step-by-step guides with realistic TallyPrime interface descriptions. Always set type to "simulation" when user asks for demonstrations.`;

    if (hasFaqMatch) {
      systemPrompt += `\n\nRelevant FAQ found: ${JSON.stringify(faqResults[0])}`;
    }

    if (isSimulationRequest) {
      systemPrompt += `\n\nIMPORTANT: This is a simulation request. Set "type": "simulation" and provide detailed TallyPrime interface simulation.`;
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
    
    // Force simulation type if we detected it's a simulation request
    if (isSimulationRequest && result.type !== "simulation") {
      result.type = "simulation";
    }
    
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
    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }

    const systemPrompt = `You are a TallyPrime expert creating authentic, interface-accurate simulations. Generate content that EXACTLY mirrors the real TallyPrime interface, terminology, and user experience.

**CRITICAL: Use AUTHENTIC TallyPrime Interface Elements:**

**Navigation Patterns:**
- Gateway of Tally → [Main Menu] → [Sub Menu]
- Use exact TallyPrime menu names: "Accounts Info", "Inventory Info", "Vouchers", "Display"
- Function keys: F1 (Help), F2 (Date), F3 (Company), F4 (Contra), F5 (Payment), F6 (Receipt), F7 (Journal), F8 (Sales), F9 (Purchase), F10 (Reversing Journal), F11 (Features), F12 (Configure)

**Screen Layout Simulation:**
- Show actual TallyPrime screen headers with company name and date
- Use TallyPrime's distinctive blue headers and white forms
- Include status bar information (Tally.ERP 9, Company: [Name], Date: [DD-MMM-YYYY])
- Show field labels exactly as they appear: "Party A/c Name", "Dr/Cr", "Amount", "Narration"

**Authentic TallyPrime Elements:**
- Use TallyPrime's specific terminology: "Ledger", "Group", "Voucher Type", "Stock Item", "Godown"
- Show actual field formats: Date (DD-MMM-YYYY), Amount (₹ with commas)
- Include TallyPrime's validation messages and prompts
- Use TallyPrime's keyboard shortcuts and navigation patterns

**Sample Data Requirements:**
- Use realistic Indian business names, GST numbers (15-digit format)
- Include proper HSN codes, tax rates (5%, 12%, 18%, 28%)
- Show authentic accounting entries with proper Dr/Cr format
- Use real TallyPrime voucher numbers and reference formats

**Visual Formatting:**
- Use ASCII-style tables to represent TallyPrime screens
- Show field boundaries with | and - characters
- Highlight selected fields with [ ] brackets
- Include TallyPrime's distinctive prompt messages

IMPORTANT: Make simulations so authentic that users feel they're looking at actual TallyPrime screens. Include exact button names, field labels, and navigation paths as they appear in the software.`;

    const userPrompt = `Create a detailed TallyPrime simulation for: "${action}"

Provide comprehensive step-by-step instructions with sample data and expected results. Make it practical and actionable for someone using TallyPrime software.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || "Unable to generate simulation.";

    return {
      content,
      type: "simulation",
      metadata: {
        simulation: action.toLowerCase().replace(/\s+/g, '_'),
        confidence: 0.95,
        generated_by: "openai",
        action: action
      }
    };

  } catch (error) {
    console.error("Error generating TallyPrime simulation:", error);
    return {
      content: "I apologize, but I encountered an error while generating the TallyPrime simulation. Please try again.",
      type: "error",
      metadata: {
        error: "simulation_failed",
        confidence: 0.0
      }
    };
  }
}