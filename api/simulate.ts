import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Create optimized OpenAI instance outside handler
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "demo_key",
  maxRetries: 1, // Reduce retries for faster response
  timeout: 25 * 1000, // 25 second timeout (simulations are longer)
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const { action } = req.body;
      
      if (!action) {
        return res.status(400).json({ message: 'Action is required' });
      }

      // Generate simulation response
      const simulationResponse = await generateTallySimulation(action);
      
      // Return the simulation message
      const message = {
        id: `sim-${Date.now()}`,
        content: simulationResponse.content,
        role: 'assistant',
        type: 'simulation',
        createdAt: new Date(),
        metadata: simulationResponse.metadata
      };

      return res.json(message);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Simulate API error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}

async function generateTallySimulation(action: string) {
  try {
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
