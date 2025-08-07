import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage.js';
import { generateTallySimulation } from '../server/services/openai.js';

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
      
      // Add the simulation message to chat
      const message = await storage.createMessage({
        content: simulationResponse.content,
        role: 'assistant',
        type: 'simulation',
        metadata: simulationResponse.metadata,
      });

      return res.json(message);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Simulate API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
