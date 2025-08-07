import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Create OpenAI instance outside handler for reuse
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "demo_key",
  maxRetries: 1, // Reduce retries for faster response
  timeout: 20 * 1000, // 20 second timeout
});

// In-memory storage for demo (shared across function calls)
const messages: any[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all messages
      return res.json(messages);
    }

    if (req.method === 'POST') {
      // Send a new message
      const { content, type = 'text' } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      // Add user message
      const userMessage = {
        id: `msg-${Date.now()}-user`,
        content,
        role: 'user',
        type,
        createdAt: new Date(),
        metadata: null
      };
      messages.push(userMessage);

      // Generate AI response using OpenAI
      const aiResponse = await generateAIResponse(content);
      
      // Add AI message
      const aiMessage = {
        id: `msg-${Date.now()}-assistant`,
        content: aiResponse.content,
        role: 'assistant',
        type: aiResponse.type || 'text',
        createdAt: new Date(),
        metadata: aiResponse.metadata
      };
      messages.push(aiMessage);

      return res.json({ userMessage, aiMessage });
    }

    if (req.method === 'DELETE') {
      // Clear all messages
      messages.length = 0;
      return res.json({ success: true });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Messages API error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}

async function generateAIResponse(query: string) {
  try {
    const systemPrompt = `You are an expert TallyPrime accounting software assistant. You help users with accounting queries and provide step-by-step guidance.

Provide helpful, accurate information about TallyPrime features, shortcuts, and best practices. Format your response as clear, actionable advice.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "I couldn't process your request. Please try again.";
    
    return {
      content,
      type: "text",
      metadata: {
        confidence: 0.8
      }
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      content: "I'm having trouble processing your request right now. Please try again later.",
      type: "error",
      metadata: { confidence: 0.1, error: String(error) }
    };
  }
}
