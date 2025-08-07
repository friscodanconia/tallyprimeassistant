import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get search query from query parameters
      const query = req.query.q || req.query.query;
      
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      // Use storage service to search FAQs
      const searchResults = await storage.searchFaq(query.trim());
      
      return res.json(searchResults);
    }

    if (req.method === 'POST') {
      // Support POST requests with query in body
      const { query } = req.body;
      
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ message: 'Search query is required' });
      }

      // Use storage service to search FAQs
      const searchResults = await storage.searchFaq(query.trim());
      
      return res.json(searchResults);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('FAQ search API error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
}
