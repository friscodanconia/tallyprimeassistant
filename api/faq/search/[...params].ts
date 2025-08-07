import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../server/storage.js';

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
      // Get search query from various sources
      let query = '';
      
      // Check query parameters
      if (req.query.q) {
        query = String(req.query.q);
      } else if (req.query.query) {
        query = String(req.query.query);
      } else if (req.query.params && Array.isArray(req.query.params)) {
        // Handle dynamic route parameters
        query = req.query.params.join(' ');
      } else if (req.query.params) {
        query = String(req.query.params);
      }
      
      if (!query || query.trim() === '') {
        // Return empty results for empty query
        return res.json([]);
      }

      // Use storage's built-in search functionality
      const searchResults = await storage.searchFaq(query);
      
      return res.json(searchResults);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('FAQ search API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
