import type { VercelRequest, VercelResponse } from '@vercel/node';

// Sample FAQ data
const faqData = [
  {
    id: '1',
    question: "What are the differences between Tally.ERP 9 and TallyPrime?",
    answer: "TallyPrime has a redesigned interface with improved navigation, consistent shortcuts, a new Go To feature for global search, and simplified Gateway of Tally. All your data from ERP 9 can be migrated seamlessly.",
    category: "Installation & Upgrade",
    keywords: ["differences", "ERP 9", "TallyPrime", "comparison", "upgrade"],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    question: "How do I enable GST in TallyPrime?",
    answer: "Enable GST in company features (F11), then create GST ledgers. Use sales/purchase vouchers with appropriate tax ledgers for GST transactions.",
    category: "Taxation & Compliance",
    keywords: ["GST", "enable", "tax", "F11", "ledgers"],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    question: "How do I create a voucher in TallyPrime?",
    answer: "Press F7 for Journal, F8 for Sales, F9 for Purchase, or F5 for Payment voucher. Fill the details and press Enter to save.",
    category: "Features & Functionality",
    keywords: ["create", "voucher", "F7", "F8", "F9", "journal", "sales", "purchase"],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    question: "What is the Go To button in TallyPrime?",
    answer: "Go To is a global search feature to navigate to any report/voucher without closing the current screen. Press Alt+G to access it.",
    category: "User Interface",
    keywords: ["Go To", "search", "navigate", "Alt+G"],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '5',
    question: "How do I generate GST returns from TallyPrime?",
    answer: "TallyPrime can generate GSTR-1, GSTR-3B reports which can be exported to JSON format for upload to government portals.",
    category: "Taxation & Compliance",
    keywords: ["GST", "returns", "GSTR", "export", "JSON"],
    createdAt: new Date('2024-01-01')
  }
];

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
      return res.json(faqData);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('FAQ API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
