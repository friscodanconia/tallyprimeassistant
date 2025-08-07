import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const faqs = await storage.getFaqItems();
      return res.json(faqs);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('FAQ API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
