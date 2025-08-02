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
    // Create pre-built simulations for common actions
    const simulationMap: { [key: string]: ChatResponse } = {
      "Create a new voucher entry": {
        content: "Here's a TallyPrime voucher entry simulation. This shows how to create a sales voucher with GST calculations, item details, and proper accounting entries.",
        type: "simulation",
        metadata: {
          simulation: "voucher_entry",
          confidence: 0.95
        }
      },
      "Generate a sample financial report": {
        content: "Here's a TallyPrime Day Book report simulation. This shows daily transaction summaries with voucher details and amounts.",
        type: "simulation", 
        metadata: {
          simulation: "day_book",
          confidence: 0.95
        }
      },
      "Open Balance Sheet": {
        content: "Here's a TallyPrime Balance Sheet simulation. This shows the company's financial position with assets and liabilities properly categorized.",
        type: "simulation",
        metadata: {
          simulation: "balance_sheet",
          confidence: 0.95
        }
      },
      "Create Sales Invoice": {
        content: "Here's a TallyPrime Sales Invoice simulation. This shows how to generate a GST-compliant invoice with proper formatting and tax calculations.",
        type: "simulation",
        metadata: {
          simulation: "sales_invoice",
          confidence: 0.95
        }
      },
      "Open ledger account view": {
        content: "Here's a TallyPrime Ledger Account simulation. This displays account transactions with running balances and detailed entries.",
        type: "simulation",
        metadata: {
          simulation: "day_book",
          confidence: 0.95
        }
      },
      "Generate trial balance report": {
        content: "Here's a TallyPrime Trial Balance simulation. This shows all account balances to verify that debits equal credits.",
        type: "simulation",
        metadata: {
          simulation: "balance_sheet",
          confidence: 0.95
        }
      },
      "View customer master data": {
        content: "Here's a TallyPrime Customer Master simulation. This displays customer information, outstanding balances, and contact details.",
        type: "simulation",
        metadata: {
          simulation: "day_book",
          confidence: 0.95
        }
      },
      "Display stock summary report": {
        content: "Here's a TallyPrime Stock Summary simulation. This shows inventory levels, stock values, and item details.",
        type: "simulation",
        metadata: {
          simulation: "day_book",
          confidence: 0.95
        }
      },
      "Create payment voucher": {
        content: "Here's a TallyPrime Payment Voucher simulation. This shows how to record payments with proper accounting entries.",
        type: "simulation",
        metadata: {
          simulation: "voucher_entry",
          confidence: 0.95
        }
      },
      "Generate profit and loss statement": {
        content: "Here's a TallyPrime Profit & Loss Statement simulation. This displays revenue, expenses, and net profit calculations.",
        type: "simulation",
        metadata: {
          simulation: "balance_sheet",
          confidence: 0.95
        }
      },
      "View company information": {
        content: "Here's a TallyPrime Company Information simulation. This shows company details, configuration settings, and master data.",
        type: "simulation",
        metadata: {
          simulation: "day_book",
          confidence: 0.95
        }
      },
      "Open TallyPrime configuration": {
        content: "Here's a TallyPrime Configuration simulation. This displays various settings and customization options for the software.",
        type: "simulation",
        metadata: {
          simulation: "day_book",
          confidence: 0.95
        }
      }
    };

    // Check if we have a pre-built simulation
    if (simulationMap[action]) {
      return simulationMap[action];
    }

    // Fallback for other actions
    const lowerAction = action.toLowerCase();
    let simulationType = "voucher";
    let content = `Here's a TallyPrime simulation for: ${action}`;

    if (lowerAction.includes("balance") || lowerAction.includes("balance sheet")) {
      simulationType = "balance_sheet";
      content = "Here's a TallyPrime Balance Sheet simulation showing your company's financial position.";
    } else if (lowerAction.includes("invoice") || lowerAction.includes("sales")) {
      simulationType = "invoice";
      content = "Here's a TallyPrime Sales Invoice simulation with GST calculations.";
    } else if (lowerAction.includes("report") || lowerAction.includes("day book")) {
      simulationType = "report";
      content = "Here's a TallyPrime Day Book report showing daily transactions.";
    }

    return {
      content,
      type: "simulation",
      metadata: {
        simulation: simulationType,
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
