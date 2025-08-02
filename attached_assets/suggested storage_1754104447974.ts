import { type Message, type InsertMessage, type FaqItem, type InsertFaqItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  clearMessages(): Promise<void>;

  // FAQ
  getFaqItems(): Promise<FaqItem[]>;
  searchFaq(query: string): Promise<FaqItem[]>;
  createFaqItem(faqItem: InsertFaqItem): Promise<FaqItem>;
}

export class MemStorage implements IStorage {
  private messages: Map<string, Message>;
  private faqItems: Map<string, FaqItem>;

  constructor() {
    this.messages = new Map();
    this.faqItems = new Map();
    this.initializeFAQ();
  }

  private initializeFAQ() {
    const faqData = [
      {
        question: "What are the differences between Tally.ERP 9 and TallyPrime?",
        answer: "TallyPrime has a redesigned interface with improved navigation, consistent shortcuts, a new Go To feature for global search, removed bottom toolbar (later reintroduced), and simplified Gateway of Tally. All your data from ERP 9 can be migrated seamlessly.",
        category: "Installation & Upgrade",
        keywords: ["differences", "ERP 9", "TallyPrime", "comparison", "upgrade"],
        steps: [
          { step: 1, description: "TallyPrime has a redesigned interface with better navigation" },
          { step: 2, description: "Consistent shortcuts across the application" },
          { step: 3, description: "New Go To feature (Alt+G) for global search" },
          { step: 4, description: "Data migration from ERP 9 is automatic and seamless" }
        ]
      },
      {
        question: "Is it compulsory to upgrade to TallyPrime?",
        answer: "No, it's not compulsory. You can continue using Tally.ERP 9, but TallyPrime offers improved features and interface. However, newer features and updates will only be available in TallyPrime.",
        category: "Installation & Upgrade",
        keywords: ["compulsory", "upgrade", "mandatory", "ERP 9"],
        steps: [
          { step: 1, description: "Upgrading to TallyPrime is optional, not mandatory" },
          { step: 2, description: "You can continue using Tally.ERP 9 if preferred" },
          { step: 3, description: "New features and updates are only in TallyPrime" },
          { step: 4, description: "Consider upgrade benefits vs. current needs" }
        ]
      },
      {
        question: "Can I use Tally.ERP 9 and TallyPrime simultaneously on the same PC?",
        answer: "Yes, you can install and use both versions on the same computer. They use different installation directories and can run independently.",
        category: "Installation & Upgrade",
        keywords: ["simultaneous", "same PC", "both versions", "install"],
        steps: [
          { step: 1, description: "Install TallyPrime in a different directory than ERP 9" },
          { step: 2, description: "Both versions can coexist without conflicts" },
          { step: 3, description: "You can run either version independently" },
          { step: 4, description: "Data files are compatible between versions" }
        ]
      },
      {
        question: "How do I cancel an invoice in TallyPrime?",
        answer: "Open the invoice and press Alt+X to cancel it. Confirm when prompted.",
        category: "Features & Functionality",
        keywords: ["cancel", "invoice", "Alt+X"],
        steps: [
          { step: 1, description: "Open the invoice you want to cancel" },
          { step: 2, description: "Press Alt+X while viewing the invoice" },
          { step: 3, description: "Confirm the cancellation when prompted" },
          { step: 4, description: "The invoice will be marked as cancelled" }
        ]
      },
      {
        question: "How do I enable GST in TallyPrime?",
        answer: "Enable GST in company features (F11), then create GST ledgers. Use sales/purchase vouchers with appropriate tax ledgers for GST transactions.",
        category: "Taxation & Compliance",
        keywords: ["GST", "enable", "tax", "F11", "ledgers"],
        steps: [
          { step: 1, description: "Press F11 to access Company Features" },
          { step: 2, description: "Enable 'Enable Goods & Services Tax (GST)'" },
          { step: 3, description: "Create GST ledgers for different tax rates" },
          { step: 4, description: "Use these ledgers in sales/purchase vouchers" }
        ]
      },
      {
        question: "Where is the bottom toolbar in TallyPrime?",
        answer: "The bottom toolbar was initially removed in TallyPrime to streamline the UI, but was reintroduced in Release 2.0.1. Most functions are accessible via the top menu or keyboard shortcuts.",
        category: "User Interface",
        keywords: ["bottom toolbar", "missing", "UI", "shortcuts"],
        steps: [
          { step: 1, description: "Bottom toolbar was removed in initial TallyPrime release" },
          { step: 2, description: "It was reintroduced in Release 2.0.1" },
          { step: 3, description: "Most functions available via top menu" },
          { step: 4, description: "Use keyboard shortcuts for quick access" }
        ]
      },
      {
        question: "What is the Go To button in TallyPrime?",
        answer: "Go To is a global search feature to navigate to any report/voucher without closing the current screen. Press Alt+G to access it. It's different from Switch To which closes the current screen.",
        category: "User Interface",
        keywords: ["Go To", "search", "navigate", "Alt+G"],
        steps: [
          { step: 1, description: "Press Alt+G to open Go To dialog" },
          { step: 2, description: "Type the name of report/voucher you want to access" },
          { step: 3, description: "Select from the search results" },
          { step: 4, description: "The feature opens without closing current screen" }
        ]
      },
      {
        question: "How do I create a ledger on the fly during entry?",
        answer: "Use Alt+C when in a ledger field to create a new ledger or group without leaving the voucher screen.",
        category: "Features & Functionality",
        keywords: ["create", "ledger", "Alt+C", "on the fly"],
        steps: [
          { step: 1, description: "While in a voucher entry screen" },
          { step: 2, description: "Place cursor in the ledger field" },
          { step: 3, description: "Press Alt+C to create new ledger" },
          { step: 4, description: "Fill details and save without leaving voucher" }
        ]
      },
      {
        question: "How do I delete a voucher in TallyPrime?",
        answer: "Use Alt+D when viewing the voucher to delete it. The delete function is now a hidden shortcut rather than a visible button.",
        category: "Features & Functionality",
        keywords: ["delete", "voucher", "Alt+D", "remove"],
        steps: [
          { step: 1, description: "Open the voucher you want to delete" },
          { step: 2, description: "Press Alt+D while viewing the voucher" },
          { step: 3, description: "Confirm the deletion when prompted" },
          { step: 4, description: "Voucher will be permanently deleted" }
        ]
      },
      {
        question: "How do I migrate data from Tally.ERP 9 to TallyPrime?",
        answer: "TallyPrime automatically converts ERP 9 data when you open it. Simply open your company data in TallyPrime and it will migrate automatically. Always take a backup before migration.",
        category: "Data Management",
        keywords: ["migrate", "data", "ERP 9", "convert", "backup"],
        steps: [
          { step: 1, description: "Take a complete backup of your ERP 9 data" },
          { step: 2, description: "Install and open TallyPrime" },
          { step: 3, description: "Select your existing company data file" },
          { step: 4, description: "TallyPrime will automatically migrate the data" }
        ]
      },
      {
        question: "How do I generate GST returns from TallyPrime?",
        answer: "TallyPrime can generate GSTR-1, GSTR-3B reports which can be exported to JSON format for upload to government portals.",
        category: "Taxation & Compliance",
        keywords: ["GST", "returns", "GSTR", "export", "JSON"],
        steps: [
          { step: 1, description: "Go to Gateway > Display > Statutory Reports > GST > Returns" },
          { step: 2, description: "Select the return type (GSTR-1, GSTR-3B, etc.)" },
          { step: 3, description: "Choose the filing period" },
          { step: 4, description: "Export as JSON for government portal upload" }
        ]
      },
      {
        question: "Where can I find Chart of Accounts in TallyPrime?",
        answer: "Chart of Accounts is available under the main menu, showing all groups, ledgers, and account structures. This replaced multiple menus from earlier versions.",
        category: "Reporting",
        keywords: ["chart of accounts", "ledgers", "groups"],
        steps: [
          { step: 1, description: "From Gateway of Tally, click on Chart of Accounts" },
          { step: 2, description: "View all groups and ledgers in tree structure" },
          { step: 3, description: "Use filters to find specific accounts" },
          { step: 4, description: "Double-click to view ledger details" }
        ]
      },
      {
        question: "How do I view Day Book while looking at another report?",
        answer: "Use Alt+G (Go To) to open Day Book without closing the current report. This allows you to navigate between reports seamlessly.",
        category: "Reporting",
        keywords: ["day book", "Alt+G", "multiple reports"],
        steps: [
          { step: 1, description: "While viewing any report" },
          { step: 2, description: "Press Alt+G to open Go To dialog" },
          { step: 3, description: "Type 'Day Book' and select it" },
          { step: 4, description: "Day Book opens without closing current report" }
        ]
      },
      {
        question: "What is Stripe View in TallyPrime?",
        answer: "Stripe View shades alternate lines for better readability in reports and vouchers. Enable it via F12 > Stripe View. It doesn't print on dot matrix printers.",
        category: "Reporting",
        keywords: ["stripe view", "shading", "readability", "F12"],
        steps: [
          { step: 1, description: "Press F12 in any report or voucher" },
          { step: 2, description: "Find 'Stripe View' option" },
          { step: 3, description: "Set it to 'Yes' to enable shading" },
          { step: 4, description: "Alternate lines will be shaded for better reading" }
        ]
      },
      {
        question: "How do I print or export reports to PDF/Excel?",
        answer: "Use Alt+E for export or Alt+P for print in any report. You can export to Excel/PDF from Day Book or specific reports.",
        category: "Reporting",
        keywords: ["print", "export", "PDF", "Excel", "Alt+E", "Alt+P"],
        steps: [
          { step: 1, description: "Open the report you want to export/print" },
          { step: 2, description: "Press Alt+E for export options" },
          { step: 3, description: "Choose PDF, Excel, or other formats" },
          { step: 4, description: "Or press Alt+P for direct printing" }
        ]
      },
      {
        question: "How do I enable Payroll features in TallyPrime?",
        answer: "Enable 'Maintain Payroll' in F11 Features during or after company creation. This activates payroll functionality.",
        category: "Features & Functionality",
        keywords: ["payroll", "enable", "F11", "features"],
        steps: [
          { step: 1, description: "Press F11 to access Company Features" },
          { step: 2, description: "Find 'Maintain Payroll' option" },
          { step: 3, description: "Set it to 'Yes' to enable payroll" },
          { step: 4, description: "Payroll menus will now be available" }
        ]
      },
      {
        question: "Can TallyPrime be accessed remotely?",
        answer: "Yes, remote access exists via Tally.NET IDs. You can also view reports in browser using Tally Reports in Browser feature.",
        category: "Integration",
        keywords: ["remote access", "Tally.NET", "browser", "reports"],
        steps: [
          { step: 1, description: "Set up Tally.NET ID for remote access" },
          { step: 2, description: "Configure user permissions for remote users" },
          { step: 3, description: "Use browser-based reports feature" },
          { step: 4, description: "Access TallyPrime data from anywhere with internet" }
        ]
      },
      {
        question: "Does TallyPrime have an API for integration?",
        answer: "Yes, TallyPrime provides both HTTP (XML) API and ODBC connectivity for integration with other software and databases.",
        category: "Integration",
        keywords: ["API", "HTTP", "XML", "ODBC", "integration"],
        steps: [
          { step: 1, description: "Enable ODBC server in TallyPrime configuration" },
          { step: 2, description: "Use HTTP API for XML-based data exchange" },
          { step: 3, description: "Configure integration with third-party software" },
          { step: 4, description: "Test connectivity and data flow" }
        ]
      },
      {
        question: "How do I fix Out of memory errors in TallyPrime?",
        answer: "Large data can slow TallyPrime. Solutions include splitting company data or increasing system RAM. Consider data archiving for better performance.",
        category: "Troubleshooting",
        keywords: ["out of memory", "performance", "split data", "RAM"],
        steps: [
          { step: 1, description: "Check system RAM and increase if needed" },
          { step: 2, description: "Split large company data by year" },
          { step: 3, description: "Archive old transaction data" },
          { step: 4, description: "Close unnecessary programs while using TallyPrime" }
        ]
      },
      {
        question: "Why can't I find my company data after installing TallyPrime?",
        answer: "TallyPrime may look at a different data directory. Use Select Company and point to the folder where ERP 9 data is located, then migrate.",
        category: "Troubleshooting",
        keywords: ["company data", "missing", "select company", "directory"],
        steps: [
          { step: 1, description: "Click on 'Select Company' from startup screen" },
          { step: 2, description: "Browse to your ERP 9 data directory" },
          { step: 3, description: "Select the company folder" },
          { step: 4, description: "TallyPrime will migrate and open the data" }
        ]
      },
      {
        question: "How do I change date format in TallyPrime?",
        answer: "Go to F1 (Help) > Settings > Country > Date Format and choose your preferred format (e.g., DD-MM-YYYY).",
        category: "Configuration",
        keywords: ["date format", "settings", "country", "F1"],
        steps: [
          { step: 1, description: "Press F1 to access Help menu" },
          { step: 2, description: "Go to Settings > Country" },
          { step: 3, description: "Select Date Format option" },
          { step: 4, description: "Choose your preferred format (DD-MM-YYYY, etc.)" }
        ]
      },
      {
        question: "Is TallyPrime supported on 32-bit Windows?",
        answer: "No, TallyPrime requires 64-bit Windows 7 or later. It is not supported on 32-bit operating systems.",
        category: "Installation & Upgrade",
        keywords: ["32-bit", "64-bit", "Windows", "system requirements"],
        steps: [
          { step: 1, description: "Check your Windows version and architecture" },
          { step: 2, description: "TallyPrime requires 64-bit Windows 7 or later" },
          { step: 3, description: "Upgrade your operating system if needed" },
          { step: 4, description: "Or continue using Tally.ERP 9 on 32-bit systems" }
        ]
      },
      {
        question: "How do I create a new company in TallyPrime?",
        answer: "Go to Create Company in the startup screen or use the Company menu. Follow the setup wizard to configure your company details.",
        category: "Features & Functionality",
        keywords: ["create", "company", "new", "setup"],
        steps: [
          { step: 1, description: "From TallyPrime startup screen, click 'Create Company'" },
          { step: 2, description: "Enter company name and address details" },
          { step: 3, description: "Set financial year and currency" },
          { step: 4, description: "Configure features like GST, Payroll as needed" }
        ]
      }
    ];

    // Initialize FAQ items in storage
    faqData.forEach((item, index) => {
      const faqItem: FaqItem = {
        id: randomUUID(),
        question: item.question,
        answer: item.answer,
        category: item.category,
        keywords: item.keywords,
        steps: item.steps,
        createdAt: new Date()
      };
      this.faqItems.set(faqItem.id, faqItem);
    });

    console.log(`Initialized ${this.faqItems.size} FAQ items for TallyPrime`);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: randomUUID(),
      ...message,
      createdAt: new Date()
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort(
      (a, b) => a.createdAt!.getTime() - b.createdAt!.getTime()
    );
  }

  async clearMessages(): Promise<void> {
    this.messages.clear();
  }

  async getFaqItems(): Promise<FaqItem[]> {
    return Array.from(this.faqItems.values());
  }

  async searchFaq(query: string): Promise<FaqItem[]> {
    const queryLower = query.toLowerCase();
    const results: Array<{ item: FaqItem; score: number }> = [];

    for (const item of this.faqItems.values()) {
      let score = 0;

      // Exact question match gets highest score
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      // Keyword matches
      if (item.keywords) {
        for (const keyword of item.keywords) {
          if (queryLower.includes(keyword.toLowerCase())) {
            score += 5;
          }
        }
      }

      // Category match
      if (item.category.toLowerCase().includes(queryLower)) {
        score += 3;
      }

      // Answer content match
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      // Common Tally terms boost
      const tallyTerms = ['tally', 'gst', 'invoice', 'voucher', 'ledger', 'company', 'report'];
      for (const term of tallyTerms) {
        if (queryLower.includes(term)) {
          score += 1;
        }
      }

      if (score > 0) {
        results.push({ item, score });
      }
    }

    // Sort by score (highest first) and return top 10
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(result => result.item);
  }

  async createFaqItem(faqItem: InsertFaqItem): Promise<FaqItem> {
    const newFaqItem: FaqItem = {
      id: randomUUID(),
      ...faqItem,
      createdAt: new Date()
    };
    this.faqItems.set(newFaqItem.id, newFaqItem);
    return newFaqItem;
  }
}

export const storage = new MemStorage();