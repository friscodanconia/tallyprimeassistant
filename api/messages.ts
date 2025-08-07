import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createStorage } from '../server/storage.js';
import { OpenAIService } from '../server/services/openai.js';

const storage = createStorage();
const openai = new OpenAIService();

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
      const messages = await storage.getMessages();
      return res.json(messages);
    }

    if (req.method === 'POST') {
      // Send a new message
      const { content, type = 'text' } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      // Add user message
      const userMessage = await storage.addMessage({
        content,
        role: 'user',
        type,
      });

      // Generate AI response
      const aiResponse = await openai.generateResponse(content);
      
      // Add AI message
      const aiMessage = await storage.addMessage({
        content: aiResponse.content,
        role: 'assistant',
        type: aiResponse.type || 'text',
        metadata: aiResponse.metadata,
      });

      return res.json({ userMessage, aiMessage });
    }

    if (req.method === 'DELETE') {
      // Clear all messages
      await storage.clearMessages();
      return res.json({ success: true });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Messages API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
