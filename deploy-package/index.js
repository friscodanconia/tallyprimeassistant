// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";

// server/data/extended-knowledge.ts
var extendedKnowledgeBase = [
  // COMPANY MANAGEMENT (15 items)
  {
    question: "How to alter company information in TallyPrime?",
    answer: "Go to Gateway > Alter > Company. Select the company to modify. Update name, address, financial year, or other details as needed. Save changes with Ctrl+A.",
    category: "Company Management",
    keywords: ["alter company", "modify company", "change company details"],
    steps: [
      { step: 1, description: "Go to Gateway of Tally" },
      { step: 2, description: "Select Alter > Company" },
      { step: 3, description: "Choose company to modify" },
      { step: 4, description: "Update details and save with Ctrl+A" }
    ]
  },
  {
    question: "How to delete a company in TallyPrime?",
    answer: "Go to Gateway > Alter > Company. Select company to delete. Press Alt+D to delete. Confirm deletion. Note: This permanently removes all company data.",
    category: "Company Management",
    keywords: ["delete company", "remove company", "company deletion"],
    steps: [
      { step: 1, description: "Go to Gateway > Alter > Company" },
      { step: 2, description: "Select company to delete" },
      { step: 3, description: "Press Alt+D for delete option" },
      { step: 4, description: "Confirm deletion (permanent action)" }
    ]
  },
  {
    question: "How to set financial year in TallyPrime?",
    answer: "During company creation or in F11 > Features > Set/Alter Financial Year. Enter start date (e.g., 01-Apr-2023) and TallyPrime automatically sets end date.",
    category: "Company Management",
    keywords: ["financial year", "FY", "accounting year", "year setup"],
    steps: [
      { step: 1, description: "Go to F11 > Features" },
      { step: 2, description: "Select Set/Alter Financial Year" },
      { step: 3, description: "Enter financial year start date" },
      { step: 4, description: "Save settings with Ctrl+A" }
    ]
  },
  {
    question: "How to enable multi-currency in TallyPrime?",
    answer: "Go to F11 > Features > International > Multi-Currency and set to Yes. Then create currency masters in Masters > Currency for different currencies.",
    category: "Company Management",
    keywords: ["multi-currency", "foreign currency", "international", "currency"],
    steps: [
      { step: 1, description: "Press F11 for Company Features" },
      { step: 2, description: "Go to International > Multi-Currency" },
      { step: 3, description: "Set Multi-Currency to Yes" },
      { step: 4, description: "Create currency masters as needed" }
    ]
  },
  // GST & TAXATION (20 items)
  {
    question: "How to enable GST in TallyPrime?",
    answer: "Go to F11 > Statutory & Taxation > GST and set Enable GST to Yes. Configure GSTIN, state, and other GST details for your company.",
    category: "GST & Taxation",
    keywords: ["enable GST", "GST setup", "GST configuration"],
    steps: [
      { step: 1, description: "Press F11 for Company Features" },
      { step: 2, description: "Go to Statutory & Taxation > GST" },
      { step: 3, description: "Set Enable GST to Yes" },
      { step: 4, description: "Configure GSTIN and state details" }
    ]
  },
  {
    question: "How to create GST ledger accounts?",
    answer: "Go to Masters > Ledger. Create ledgers for different GST types: CGST, SGST, IGST, CESS. Set ledger type as 'Duties & Taxes' and specify GST details.",
    category: "GST & Taxation",
    keywords: ["GST ledger", "CGST", "SGST", "IGST", "tax ledger"],
    steps: [
      { step: 1, description: "Go to Masters > Ledger" },
      { step: 2, description: "Create ledger with name (e.g., CGST)" },
      { step: 3, description: "Set Under as 'Duties & Taxes'" },
      { step: 4, description: "Configure GST type and rate" }
    ]
  },
  {
    question: "How to generate GSTR-1 report in TallyPrime?",
    answer: "Go to Display > Statutory Reports > GST > GSTR-1. Select period, review data, and generate report. You can export to Excel or JSON format.",
    category: "GST & Taxation",
    keywords: ["GSTR-1", "GST return", "sales return", "GST report"],
    steps: [
      { step: 1, description: "Go to Display > Statutory Reports > GST" },
      { step: 2, description: "Select GSTR-1" },
      { step: 3, description: "Choose reporting period" },
      { step: 4, description: "Generate and export report" }
    ]
  },
  {
    question: "How to file GSTR-3B in TallyPrime?",
    answer: "Go to Display > Statutory Reports > GST > GSTR-3B. Select month, review summary data, and export JSON file for uploading to GST portal.",
    category: "GST & Taxation",
    keywords: ["GSTR-3B", "monthly return", "GST filing", "summary return"],
    steps: [
      { step: 1, description: "Go to Display > Statutory Reports > GST" },
      { step: 2, description: "Select GSTR-3B" },
      { step: 3, description: "Choose month and review data" },
      { step: 4, description: "Export JSON for GST portal upload" }
    ]
  },
  // VOUCHER ENTRY (15 items)
  {
    question: "How to create a sales voucher in TallyPrime?",
    answer: "Press F8 or go to Vouchers > Sales. Enter party name, item details, quantity, rate, and GST information. Save with Ctrl+A.",
    category: "Voucher Entry",
    keywords: ["sales voucher", "sales entry", "invoice", "F8"],
    steps: [
      { step: 1, description: "Press F8 or go to Vouchers > Sales" },
      { step: 2, description: "Enter party name (customer)" },
      { step: 3, description: "Add item details, quantity, and rate" },
      { step: 4, description: "Save voucher with Ctrl+A" }
    ]
  },
  {
    question: "How to create a purchase voucher in TallyPrime?",
    answer: "Press F9 or go to Vouchers > Purchase. Enter supplier name, item details, and amounts. Include GST details if applicable. Save with Ctrl+A.",
    category: "Voucher Entry",
    keywords: ["purchase voucher", "purchase entry", "F9", "supplier"],
    steps: [
      { step: 1, description: "Press F9 or go to Vouchers > Purchase" },
      { step: 2, description: "Enter supplier name" },
      { step: 3, description: "Add item details and amounts" },
      { step: 4, description: "Include GST and save with Ctrl+A" }
    ]
  },
  {
    question: "How to create a payment voucher in TallyPrime?",
    answer: "Press F5 or go to Vouchers > Payment. Select cash/bank account, enter party name, amount, and narration. Save with Ctrl+A.",
    category: "Voucher Entry",
    keywords: ["payment voucher", "payment entry", "F5", "cash payment"],
    steps: [
      { step: 1, description: "Press F5 or go to Vouchers > Payment" },
      { step: 2, description: "Select cash or bank account" },
      { step: 3, description: "Enter party name and amount" },
      { step: 4, description: "Add narration and save with Ctrl+A" }
    ]
  },
  {
    question: "How to create a receipt voucher in TallyPrime?",
    answer: "Press F6 or go to Vouchers > Receipt. Select cash/bank account, enter party name, amount received, and narration. Save with Ctrl+A.",
    category: "Voucher Entry",
    keywords: ["receipt voucher", "receipt entry", "F6", "cash receipt"],
    steps: [
      { step: 1, description: "Press F6 or go to Vouchers > Receipt" },
      { step: 2, description: "Select cash or bank account" },
      { step: 3, description: "Enter party name and amount received" },
      { step: 4, description: "Add narration and save with Ctrl+A" }
    ]
  },
  // REPORTS & ANALYSIS (15 items)
  {
    question: "How to view Trial Balance in TallyPrime?",
    answer: "Go to Display > Account Books > Trial Balance or press Alt+F3. Select period and view opening, transactions, and closing balances for all ledgers.",
    category: "Reports & Analysis",
    keywords: ["trial balance", "account books", "Alt+F3", "balances"],
    steps: [
      { step: 1, description: "Go to Display > Account Books" },
      { step: 2, description: "Select Trial Balance or press Alt+F3" },
      { step: 3, description: "Choose reporting period" },
      { step: 4, description: "Review opening, transactions, closing balances" }
    ]
  },
  {
    question: "How to generate Balance Sheet in TallyPrime?",
    answer: "Go to Display > Financial Statements > Balance Sheet or press Alt+F1. Select period to view assets, liabilities, and capital position.",
    category: "Reports & Analysis",
    keywords: ["balance sheet", "financial statements", "Alt+F1", "assets", "liabilities"],
    steps: [
      { step: 1, description: "Go to Display > Financial Statements" },
      { step: 2, description: "Select Balance Sheet or press Alt+F1" },
      { step: 3, description: "Choose reporting period" },
      { step: 4, description: "Analyze assets, liabilities, and capital" }
    ]
  },
  {
    question: "How to view Profit & Loss statement in TallyPrime?",
    answer: "Go to Display > Financial Statements > Profit & Loss or press Alt+F2. Select period to view income, expenses, and net profit/loss.",
    category: "Reports & Analysis",
    keywords: ["profit loss", "P&L", "Alt+F2", "income", "expenses"],
    steps: [
      { step: 1, description: "Go to Display > Financial Statements" },
      { step: 2, description: "Select Profit & Loss or press Alt+F2" },
      { step: 3, description: "Choose reporting period" },
      { step: 4, description: "Analyze income, expenses, and profitability" }
    ]
  },
  {
    question: "How to view Day Book in TallyPrime?",
    answer: "Go to Display > Day Book or press F5 from Gateway. View all transactions for selected date range in chronological order.",
    category: "Reports & Analysis",
    keywords: ["day book", "daily transactions", "F5", "transaction list"],
    steps: [
      { step: 1, description: "Go to Display > Day Book or press F5" },
      { step: 2, description: "Select date range" },
      { step: 3, description: "View transactions chronologically" },
      { step: 4, description: "Drill down for voucher details" }
    ]
  },
  // INVENTORY MANAGEMENT (20 items)
  {
    question: "How to create stock items in TallyPrime?",
    answer: "Go to Masters > Stock Item. Enter item name, select unit of measure, set opening stock, and configure GST details. Save with Ctrl+A.",
    category: "Inventory Management",
    keywords: ["stock item", "inventory", "create item", "product master"],
    steps: [
      { step: 1, description: "Go to Masters > Stock Item" },
      { step: 2, description: "Enter item name and alias" },
      { step: 3, description: "Select appropriate unit of measure" },
      { step: 4, description: "Set opening stock and GST details" }
    ]
  },
  {
    question: "How to create stock groups in TallyPrime?",
    answer: "Go to Masters > Stock Group. Enter group name, select parent group (if any), and configure properties like GST applicability. This helps organize inventory items.",
    category: "Inventory Management",
    keywords: ["stock group", "item category", "inventory group", "product group"],
    steps: [
      { step: 1, description: "Go to Masters > Stock Group" },
      { step: 2, description: "Enter group name" },
      { step: 3, description: "Select parent group if creating sub-group" },
      { step: 4, description: "Configure GST and other properties" }
    ]
  },
  {
    question: "How to set up units of measure in TallyPrime?",
    answer: "Go to Masters > Units of Measure. Create simple units (Nos, Kgs) or compound units (Dozen = 12 Nos). Set decimal places and symbols as needed.",
    category: "Inventory Management",
    keywords: ["units", "UOM", "measure", "quantity units"],
    steps: [
      { step: 1, description: "Go to Masters > Units of Measure" },
      { step: 2, description: "Enter unit name and symbol" },
      { step: 3, description: "Set decimal places for quantity" },
      { step: 4, description: "Create compound units if needed" }
    ]
  },
  {
    question: "How to view stock summary in TallyPrime?",
    answer: "Go to Display > Inventory Books > Stock Summary or press Alt+F7. View opening stock, inward, outward, and closing stock for all items.",
    category: "Inventory Management",
    keywords: ["stock summary", "inventory report", "Alt+F7", "stock position"],
    steps: [
      { step: 1, description: "Go to Display > Inventory Books" },
      { step: 2, description: "Select Stock Summary or press Alt+F7" },
      { step: 3, description: "Choose date range for report" },
      { step: 4, description: "Analyze opening, inward, outward, closing stock" }
    ]
  },
  {
    question: "How to track stock movements in TallyPrime?",
    answer: "Go to Display > Inventory Books > Stock Item Analysis. Select item to view all transactions affecting stock levels with dates and quantities.",
    category: "Inventory Management",
    keywords: ["stock movement", "item analysis", "stock transactions", "inventory tracking"],
    steps: [
      { step: 1, description: "Go to Display > Inventory Books" },
      { step: 2, description: "Select Stock Item Analysis" },
      { step: 3, description: "Choose specific stock item" },
      { step: 4, description: "Review all stock movements and transactions" }
    ]
  },
  // PAYROLL MANAGEMENT (15 items)
  {
    question: "How to enable payroll in TallyPrime?",
    answer: "Go to F11 > Features > Payroll and set Enable Payroll to Yes. Configure statutory details like PF, ESI, and TDS as required for your organization.",
    category: "Payroll Management",
    keywords: ["enable payroll", "payroll setup", "F11", "HR management"],
    steps: [
      { step: 1, description: "Press F11 for Company Features" },
      { step: 2, description: "Go to Features > Payroll" },
      { step: 3, description: "Set Enable Payroll to Yes" },
      { step: 4, description: "Configure PF, ESI, TDS settings" }
    ]
  },
  {
    question: "How to create employee master in TallyPrime?",
    answer: "Go to Masters > Employee. Enter employee details, designation, salary structure, and statutory information like PAN, PF number, bank details.",
    category: "Payroll Management",
    keywords: ["employee master", "employee details", "staff master", "HR master"],
    steps: [
      { step: 1, description: "Go to Masters > Employee" },
      { step: 2, description: "Enter employee name and code" },
      { step: 3, description: "Add designation and department" },
      { step: 4, description: "Configure salary structure and statutory details" }
    ]
  },
  {
    question: "How to process salary in TallyPrime?",
    answer: "Go to Vouchers > Payroll Voucher or press F4. Select pay period, choose employees, and process salaries. System calculates earnings, deductions, and net pay.",
    category: "Payroll Management",
    keywords: ["salary processing", "payroll voucher", "F4", "salary calculation"],
    steps: [
      { step: 1, description: "Go to Vouchers > Payroll Voucher or press F4" },
      { step: 2, description: "Select pay period (month/year)" },
      { step: 3, description: "Choose employees for processing" },
      { step: 4, description: "Review and save salary calculations" }
    ]
  },
  // BANKING & RECONCILIATION (15 items)
  {
    question: "How to create bank ledger in TallyPrime?",
    answer: "Go to Masters > Ledger. Enter bank name, select 'Bank Accounts' group, and add bank details like account number, IFSC code, and opening balance.",
    category: "Banking & Reconciliation",
    keywords: ["bank ledger", "bank account", "bank master", "account setup"],
    steps: [
      { step: 1, description: "Go to Masters > Ledger" },
      { step: 2, description: "Enter bank name" },
      { step: 3, description: "Select 'Bank Accounts' under group" },
      { step: 4, description: "Add account number, IFSC, opening balance" }
    ]
  },
  {
    question: "How to perform bank reconciliation in TallyPrime?",
    answer: "Go to Display > Account Books > Bank Reconciliation. Select bank ledger, import bank statement, and match transactions to reconcile differences.",
    category: "Banking & Reconciliation",
    keywords: ["bank reconciliation", "bank statement", "reconcile", "bank matching"],
    steps: [
      { step: 1, description: "Go to Display > Account Books" },
      { step: 2, description: "Select Bank Reconciliation" },
      { step: 3, description: "Choose bank ledger" },
      { step: 4, description: "Import statement and match transactions" }
    ]
  },
  {
    question: "How to create cheque printing format in TallyPrime?",
    answer: "Go to Gateway > Configure > Cheque Printing. Set up cheque format with bank details, positioning, and fonts. Test print before using.",
    category: "Banking & Reconciliation",
    keywords: ["cheque printing", "cheque format", "bank cheque", "payment printing"],
    steps: [
      { step: 1, description: "Go to Gateway > Configure" },
      { step: 2, description: "Select Cheque Printing" },
      { step: 3, description: "Configure format and positioning" },
      { step: 4, description: "Test print and adjust settings" }
    ]
  },
  // ADVANCED WORKFLOWS (20 items)
  {
    question: "How to create purchase orders in TallyPrime?",
    answer: "Enable Order Processing in F11. Go to Vouchers > Purchase Order. Enter supplier details, items, quantities, and rates. Track order status and convert to purchase.",
    category: "Advanced Workflows",
    keywords: ["purchase order", "PO", "order processing", "procurement"],
    steps: [
      { step: 1, description: "Enable Order Processing in F11" },
      { step: 2, description: "Go to Vouchers > Purchase Order" },
      { step: 3, description: "Enter supplier and item details" },
      { step: 4, description: "Track order and convert to purchase" }
    ]
  },
  {
    question: "How to create sales orders in TallyPrime?",
    answer: "Enable Order Processing in F11. Go to Vouchers > Sales Order. Enter customer details, items, and delivery dates. Track order fulfillment and convert to sales.",
    category: "Advanced Workflows",
    keywords: ["sales order", "SO", "customer order", "order management"],
    steps: [
      { step: 1, description: "Enable Order Processing in F11" },
      { step: 2, description: "Go to Vouchers > Sales Order" },
      { step: 3, description: "Enter customer and item details" },
      { step: 4, description: "Set delivery dates and track fulfillment" }
    ]
  },
  {
    question: "How to set up job costing in TallyPrime?",
    answer: "Enable Job Costing in F11. Create cost centers for projects. Allocate expenses and revenues to specific jobs. Generate job-wise profit/loss reports.",
    category: "Advanced Workflows",
    keywords: ["job costing", "project costing", "cost center", "project management"],
    steps: [
      { step: 1, description: "Enable Job Costing in F11" },
      { step: 2, description: "Create cost centers for projects" },
      { step: 3, description: "Allocate transactions to cost centers" },
      { step: 4, description: "Generate job-wise reports" }
    ]
  },
  {
    question: "How to create budgets in TallyPrime?",
    answer: "Go to Gateway > Create > Budget. Set budget period, select ledgers/groups, and enter budget amounts. Compare actual vs budget in reports.",
    category: "Advanced Workflows",
    keywords: ["budget", "budget creation", "financial planning", "variance analysis"],
    steps: [
      { step: 1, description: "Go to Gateway > Create > Budget" },
      { step: 2, description: "Set budget period and name" },
      { step: 3, description: "Select ledgers and enter amounts" },
      { step: 4, description: "Monitor actual vs budget variance" }
    ]
  },
  {
    question: "How to set up multi-location inventory in TallyPrime?",
    answer: "Enable Multiple Godowns in F11. Create godown masters for different locations. Maintain location-wise stock and generate location-specific reports.",
    category: "Advanced Workflows",
    keywords: ["multi-location", "godown", "warehouse", "location-wise stock"],
    steps: [
      { step: 1, description: "Enable Multiple Godowns in F11" },
      { step: 2, description: "Create godown masters for locations" },
      { step: 3, description: "Allocate stock to specific godowns" },
      { step: 4, description: "Generate location-wise reports" }
    ]
  },
  // TROUBLESHOOTING & MAINTENANCE (10 items)
  {
    question: "How to resolve TallyPrime data corruption issues?",
    answer: "Use Alter > Rewrite Data to fix corruption. For severe issues, restore from backup. Run Data Verification from F11 > Data Configuration regularly.",
    category: "Troubleshooting & Maintenance",
    keywords: ["data corruption", "rewrite data", "data repair", "troubleshooting"],
    steps: [
      { step: 1, description: "Go to Gateway > Alter" },
      { step: 2, description: "Select Rewrite Data" },
      { step: 3, description: "Choose company and rewrite" },
      { step: 4, description: "Restore from backup if issues persist" }
    ]
  },
  {
    question: "How to optimize TallyPrime performance?",
    answer: "Regular data backup, periodic reindexing, close unused companies, increase RAM allocation, and keep TallyPrime updated to latest version.",
    category: "Troubleshooting & Maintenance",
    keywords: ["performance", "optimization", "speed", "slow tally"],
    steps: [
      { step: 1, description: "Close unused companies" },
      { step: 2, description: "Perform regular data backup" },
      { step: 3, description: "Reindex data periodically" },
      { step: 4, description: "Update to latest TallyPrime version" }
    ]
  },
  {
    question: "How to secure TallyPrime data?",
    answer: "Set user access controls, enable data encryption, regular backups, use strong passwords, and restrict physical access to TallyPrime systems.",
    category: "Troubleshooting & Maintenance",
    keywords: ["data security", "user access", "encryption", "password protection"],
    steps: [
      { step: 1, description: "Set up user access controls" },
      { step: 2, description: "Enable data encryption" },
      { step: 3, description: "Implement regular backup schedule" },
      { step: 4, description: "Use strong passwords and restrict access" }
    ]
  }
];

// server/services/vector-search.ts
import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;
env.allowRemoteModels = true;
var VectorSearchService = class {
  embeddingModel = null;
  embeddedItems = /* @__PURE__ */ new Map();
  isInitialized = false;
  async initialize(faqItems2) {
    if (this.isInitialized) return;
    try {
      console.log("\u{1F680} Initializing Vector Search with embeddings...");
      this.embeddingModel = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        {
          revision: "main",
          quantized: true
          // Use quantized model for better performance
        }
      );
      console.log("\u2705 Embedding model loaded successfully");
      await this.generateEmbeddings(faqItems2);
      this.isInitialized = true;
      console.log(`\u{1F3AF} Vector search initialized with ${this.embeddedItems.size} embedded items`);
    } catch (error) {
      console.error("\u274C Failed to initialize vector search:", error);
      this.isInitialized = false;
    }
  }
  async generateEmbeddings(faqItems2) {
    console.log("\u{1F4CA} Generating embeddings for FAQ items...");
    for (const item of faqItems2) {
      try {
        const combinedText = this.createCombinedText(item);
        const embedding = await this.generateEmbedding(combinedText);
        const embeddedItem = {
          ...item,
          embedding,
          combinedText
        };
        this.embeddedItems.set(item.id, embeddedItem);
      } catch (error) {
        console.error(`\u274C Failed to generate embedding for item ${item.id}:`, error);
        this.embeddedItems.set(item.id, { ...item });
      }
    }
    console.log(`\u2705 Generated embeddings for ${this.embeddedItems.size} items`);
  }
  createCombinedText(item) {
    const parts = [
      `Question: ${item.question}`,
      `Answer: ${item.answer}`,
      `Category: ${item.category}`
    ];
    if (item.keywords && item.keywords.length > 0) {
      parts.push(`Keywords: ${item.keywords.join(", ")}`);
    }
    if (item.steps && Array.isArray(item.steps)) {
      const stepsText = item.steps.map((step) => `Step ${step.step}: ${step.description}`).join(" ");
      parts.push(`Steps: ${stepsText}`);
    }
    return parts.join(" ");
  }
  async generateEmbedding(text2) {
    if (!this.embeddingModel) {
      throw new Error("Embedding model not initialized");
    }
    const output = await this.embeddingModel(text2, {
      pooling: "mean",
      normalize: true
    });
    return Array.from(output.data);
  }
  calculateCosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same length");
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    if (normA === 0 || normB === 0) {
      return 0;
    }
    return dotProduct / (normA * normB);
  }
  performKeywordSearch(query, items) {
    const queryLower = query.toLowerCase();
    const results = [];
    for (const item of items) {
      let score = 0;
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      if (item.keywords) {
        for (const keyword of item.keywords) {
          if (queryLower.includes(keyword.toLowerCase())) {
            score += 5;
          }
        }
      }
      if (item.category.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      const tallyTerms = ["tally", "gst", "invoice", "voucher", "ledger", "company", "report"];
      for (const term of tallyTerms) {
        if (queryLower.includes(term)) {
          score += 1;
        }
      }
      if (score > 0) {
        results.push({
          item,
          score,
          similarity: 0,
          matchType: "keyword"
        });
      }
    }
    return results.sort((a, b) => b.score - a.score);
  }
  async search(query, limit = 10) {
    if (!query.trim()) {
      return [];
    }
    const allItems = Array.from(this.embeddedItems.values());
    if (!this.isInitialized || !this.embeddingModel) {
      console.log("\u{1F50D} Using keyword search (vector search not available)");
      return this.performKeywordSearch(query, allItems).slice(0, limit);
    }
    try {
      console.log(`\u{1F50D} Performing hybrid search for: "${query}"`);
      const queryEmbedding = await this.generateEmbedding(query);
      const semanticResults = [];
      for (const item of this.embeddedItems.values()) {
        if (item.embedding) {
          const similarity = this.calculateCosineSimilarity(queryEmbedding, item.embedding);
          if (similarity > 0.3) {
            semanticResults.push({
              item,
              score: similarity * 10,
              // Scale for comparison with keyword scores
              similarity,
              matchType: "semantic"
            });
          }
        }
      }
      const keywordResults = this.performKeywordSearch(query, allItems);
      const combinedResults = /* @__PURE__ */ new Map();
      for (const result of semanticResults) {
        combinedResults.set(result.item.id, result);
      }
      for (const result of keywordResults) {
        const existing = combinedResults.get(result.item.id);
        if (existing) {
          existing.score = Math.max(existing.score, result.score) + existing.similarity * 5;
          existing.matchType = "hybrid";
        } else {
          combinedResults.set(result.item.id, result);
        }
      }
      const finalResults = Array.from(combinedResults.values()).sort((a, b) => b.score - a.score).slice(0, limit);
      console.log(`\u2705 Found ${finalResults.length} results (${semanticResults.length} semantic, ${keywordResults.length} keyword)`);
      return finalResults;
    } catch (error) {
      console.error("\u274C Vector search failed, falling back to keyword search:", error);
      return this.performKeywordSearch(query, allItems).slice(0, limit);
    }
  }
  getStats() {
    const embeddedCount = Array.from(this.embeddedItems.values()).filter((item) => item.embedding).length;
    return {
      totalItems: this.embeddedItems.size,
      embeddedItems: embeddedCount,
      isInitialized: this.isInitialized
    };
  }
};
var vectorSearchService = new VectorSearchService();

// server/storage.ts
var MemStorage = class {
  messages;
  faqItems;
  constructor() {
    this.messages = /* @__PURE__ */ new Map();
    this.faqItems = /* @__PURE__ */ new Map();
    this.initializeFAQ();
  }
  initializeFAQ() {
    const faqData = [
      // INSTALLATION & UPGRADE (10 items)
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
      },
      {
        question: "How to install TallyPrime on Windows?",
        answer: "Download TallyPrime from official Tally website. Run the installer as administrator. Follow setup wizard, choose installation directory, and complete installation. Activate with license key.",
        category: "Installation & Upgrade",
        keywords: ["install", "windows", "setup", "download"],
        steps: [
          { step: 1, description: "Download TallyPrime installer from tally.com" },
          { step: 2, description: "Run installer as administrator" },
          { step: 3, description: "Follow setup wizard and choose directory" },
          { step: 4, description: "Activate with valid license key" }
        ]
      },
      {
        question: "What are TallyPrime system requirements?",
        answer: "Windows 7/8/10/11, 4GB RAM minimum (8GB recommended), 2GB free disk space, .NET Framework 4.7.2 or higher, and internet connection for activation and updates.",
        category: "Installation & Upgrade",
        keywords: ["system requirements", "minimum requirements", "hardware"],
        steps: [
          { step: 1, description: "Check Windows version (7/8/10/11 supported)" },
          { step: 2, description: "Ensure 4GB+ RAM available" },
          { step: 3, description: "Verify 2GB+ free disk space" },
          { step: 4, description: "Install .NET Framework 4.7.2+" }
        ]
      },
      {
        question: "How to backup TallyPrime data?",
        answer: "Go to Gateway > Backup. Select companies to backup, choose backup location, and click Backup. You can also use F11 > Data Configuration > Backup for advanced options.",
        category: "Installation & Upgrade",
        keywords: ["backup", "data backup", "restore", "data safety"],
        steps: [
          { step: 1, description: "Go to Gateway of Tally" },
          { step: 2, description: "Select Backup option" },
          { step: 3, description: "Choose companies and backup location" },
          { step: 4, description: "Click Backup to complete process" }
        ]
      },
      {
        question: "How to restore TallyPrime data from backup?",
        answer: "Go to Gateway > Restore. Select backup file location, choose companies to restore, and click Restore. Ensure TallyPrime is closed during restoration.",
        category: "Installation & Upgrade",
        keywords: ["restore", "data restore", "backup restore"],
        steps: [
          { step: 1, description: "Close TallyPrime completely" },
          { step: 2, description: "Go to Gateway > Restore" },
          { step: 3, description: "Select backup file location" },
          { step: 4, description: "Choose companies and click Restore" }
        ]
      },
      {
        question: "How to update TallyPrime to latest version?",
        answer: "Go to Help > TallyPrime Updates or press Ctrl+Alt+T. Download and install the latest update. Your data and settings will be preserved.",
        category: "Installation & Upgrade",
        keywords: ["update", "latest version", "upgrade", "patch"],
        steps: [
          { step: 1, description: "Press Ctrl+Alt+T or go to Help menu" },
          { step: 2, description: "Select TallyPrime Updates" },
          { step: 3, description: "Download latest update" },
          { step: 4, description: "Install update (data preserved)" }
        ]
      },
      {
        question: "How to migrate data from Tally.ERP 9 to TallyPrime?",
        answer: "Data migration is automatic. Install TallyPrime, and it will detect ERP 9 data. Select companies to migrate during first startup. All masters, transactions, and configurations are preserved.",
        category: "Installation & Upgrade",
        keywords: ["migrate", "ERP 9", "data migration", "transfer"],
        steps: [
          { step: 1, description: "Install TallyPrime on same system" },
          { step: 2, description: "Launch TallyPrime for first time" },
          { step: 3, description: "Select companies to migrate" },
          { step: 4, description: "Migration completes automatically" }
        ]
      },
      {
        question: "How to activate TallyPrime license?",
        answer: "Go to Help > Activate License. Enter Serial Number and Activation Key received from Tally. Ensure internet connection for online activation.",
        category: "Installation & Upgrade",
        keywords: ["activate", "license", "serial number", "activation key"],
        steps: [
          { step: 1, description: "Go to Help > Activate License" },
          { step: 2, description: "Enter Serial Number" },
          { step: 3, description: "Enter Activation Key" },
          { step: 4, description: "Complete online activation" }
        ]
      },
      {
        question: "How to resolve TallyPrime activation issues?",
        answer: "Check internet connection, verify license details, ensure system date is correct, and contact Tally support if issues persist. Use offline activation if online fails.",
        category: "Installation & Upgrade",
        keywords: ["activation issues", "license problems", "troubleshooting"],
        steps: [
          { step: 1, description: "Verify internet connection" },
          { step: 2, description: "Check license details accuracy" },
          { step: 3, description: "Ensure correct system date/time" },
          { step: 4, description: "Try offline activation or contact support" }
        ]
      },
      {
        question: "How do I create a new company in TallyPrime?",
        answer: "Go to Gateway of Tally > Create Company. Enter company name, mailing name, address, and other details. Set the financial year, base currency, and enable features like GST if required.",
        category: "Company Management",
        keywords: ["create company", "new company", "setup"],
        steps: [
          { step: 1, description: "From Gateway, select Create Company" },
          { step: 2, description: "Enter company name and mailing details" },
          { step: 3, description: "Set financial year and currency" },
          { step: 4, description: "Configure features like GST, Payroll as needed" }
        ]
      }
    ];
    const allKnowledgeData = [...faqData, ...extendedKnowledgeBase];
    allKnowledgeData.forEach((item, index) => {
      const faqItem = {
        id: randomUUID(),
        question: item.question,
        answer: item.answer,
        category: item.category,
        keywords: item.keywords,
        steps: item.steps,
        createdAt: /* @__PURE__ */ new Date()
      };
      this.faqItems.set(faqItem.id, faqItem);
    });
    console.log(`Initialized ${this.faqItems.size} FAQ items for TallyPrime`);
    const faqItemsArray = Array.from(this.faqItems.values());
    vectorSearchService.initialize(faqItemsArray).catch((error) => {
      console.error("Vector search initialization failed:", error);
    });
  }
  async createMessage(message) {
    const newMessage = {
      id: randomUUID(),
      ...message,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }
  async getMessages() {
    return Array.from(this.messages.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }
  async clearMessages() {
    this.messages.clear();
  }
  async getFaqItems() {
    return Array.from(this.faqItems.values());
  }
  async searchFaq(query) {
    try {
      const searchResults = await vectorSearchService.search(query, 10);
      const stats = vectorSearchService.getStats();
      console.log(`\u{1F50D} FAQ Search: "${query}" - Found ${searchResults.length} results (Vector: ${stats.isInitialized ? "ON" : "OFF"})`);
      return searchResults.map((result) => result.item);
    } catch (error) {
      console.error("Vector search failed, using fallback:", error);
      return this.fallbackKeywordSearch(query);
    }
  }
  fallbackKeywordSearch(query) {
    const queryLower = query.toLowerCase();
    const results = [];
    for (const item of this.faqItems.values()) {
      let score = 0;
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      if (item.keywords) {
        for (const keyword of item.keywords) {
          if (queryLower.includes(keyword.toLowerCase())) {
            score += 5;
          }
        }
      }
      if (item.category.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      const tallyTerms = ["tally", "gst", "invoice", "voucher", "ledger", "company", "report"];
      for (const term of tallyTerms) {
        if (queryLower.includes(term)) {
          score += 1;
        }
      }
      if (score > 0) {
        results.push({ item, score });
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 10).map((result) => result.item);
  }
  async createFaqItem(faqItem) {
    const newFaqItem = {
      id: randomUUID(),
      ...faqItem,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.faqItems.set(newFaqItem.id, newFaqItem);
    return newFaqItem;
  }
};
var storage = new MemStorage();

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "demo_key"
});
async function processUserQuery(query, faqResults) {
  try {
    const hasFaqMatch = faqResults.length > 0;
    const isSimulationRequest = query.toLowerCase().includes("simulation") || query.toLowerCase().includes("show me how to") || query.toLowerCase().includes("generate a tallyprime") || query.toLowerCase().includes("simulate");
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
- "simulation": When demonstrating TallyPrime interface/actions (USE THIS when user asks for simulations, demonstrations, or "show me how to")
- "text": For general responses
- "error": When query cannot be understood

For TallyPrime simulations, create detailed step-by-step guides with realistic TallyPrime interface descriptions. Always set type to "simulation" when user asks for demonstrations.`;
    if (hasFaqMatch) {
      systemPrompt += `

Relevant FAQ found: ${JSON.stringify(faqResults[0])}`;
    }
    if (isSimulationRequest) {
      systemPrompt += `

IMPORTANT: This is a simulation request. Set "type": "simulation" and provide detailed TallyPrime interface simulation.`;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    if (isSimulationRequest && result.type !== "simulation") {
      result.type = "simulation";
    }
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
async function generateTallySimulation(action) {
  try {
    if (!openai) {
      throw new Error("OpenAI client not initialized");
    }
    const systemPrompt = `You are a TallyPrime expert creating authentic, interface-accurate simulations. Generate content that EXACTLY mirrors the real TallyPrime interface, terminology, and user experience.

**CRITICAL: Use AUTHENTIC TallyPrime Interface Elements:**

**Navigation Patterns:**
- Gateway of Tally \u2192 [Main Menu] \u2192 [Sub Menu]
- Use exact TallyPrime menu names: "Accounts Info", "Inventory Info", "Vouchers", "Display"
- Function keys: F1 (Help), F2 (Date), F3 (Company), F4 (Contra), F5 (Payment), F6 (Receipt), F7 (Journal), F8 (Sales), F9 (Purchase), F10 (Reversing Journal), F11 (Features), F12 (Configure)

**Screen Layout Simulation:**
- Show actual TallyPrime screen headers with company name and date
- Use TallyPrime's distinctive blue headers and white forms
- Include status bar information (Tally.ERP 9, Company: [Name], Date: [DD-MMM-YYYY])
- Show field labels exactly as they appear: "Party A/c Name", "Dr/Cr", "Amount", "Narration"

**Authentic TallyPrime Elements:**
- Use TallyPrime's specific terminology: "Ledger", "Group", "Voucher Type", "Stock Item", "Godown"
- Show actual field formats: Date (DD-MMM-YYYY), Amount (\u20B9 with commas)
- Include TallyPrime's validation messages and prompts
- Use TallyPrime's keyboard shortcuts and navigation patterns

**Sample Data Requirements:**
- Use realistic Indian business names, GST numbers (15-digit format)
- Include proper HSN codes, tax rates (5%, 12%, 18%, 28%)
- Show authentic accounting entries with proper Dr/Cr format
- Use real TallyPrime voucher numbers and reference formats

**Visual Formatting:**
- Use ASCII-style tables to represent TallyPrime screens
- Show field boundaries with | and - characters
- Highlight selected fields with [ ] brackets
- Include TallyPrime's distinctive prompt messages

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
      max_tokens: 2e3
    });
    const content = completion.choices[0]?.message?.content || "Unable to generate simulation.";
    return {
      content,
      type: "simulation",
      metadata: {
        simulation: action.toLowerCase().replace(/\s+/g, "_"),
        confidence: 0.95,
        generated_by: "openai",
        action
      }
    };
  } catch (error) {
    console.error("Error generating TallyPrime simulation:", error);
    return {
      content: "I apologize, but I encountered an error while generating the TallyPrime simulation. Please try again.",
      type: "error",
      metadata: {
        error: "simulation_failed",
        confidence: 0
      }
    };
  }
}

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  type: varchar("type", { enum: ["text", "faq", "simulation", "error"] }).default("text"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});
var faqItems = pgTable("faq_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category").notNull(),
  keywords: text("keywords").array(),
  steps: jsonb("steps"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  role: true
  // Remove role from validation since server sets it
});
var createMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});
var insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  createdAt: true
});

// server/services/memory-service.ts
import { randomUUID as randomUUID2 } from "crypto";
var MemoryService = class {
  userProfiles = /* @__PURE__ */ new Map();
  conversationContexts = /* @__PURE__ */ new Map();
  userPreferences = /* @__PURE__ */ new Map();
  learningInsights = /* @__PURE__ */ new Map();
  sessionUserMap = /* @__PURE__ */ new Map();
  // User Profile Management
  async createUserProfile(data) {
    const profile = {
      id: data.id || randomUUID2(),
      name: data.name,
      company: data.company,
      industry: data.industry,
      tallyVersion: data.tallyVersion,
      preferredLanguage: data.preferredLanguage || "english",
      experienceLevel: data.experienceLevel || "beginner",
      commonTopics: data.commonTopics || [],
      lastActive: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
    this.userProfiles.set(profile.id, profile);
    await this.initializeUserPreferences(profile.id);
    console.log(`\u{1F464} Created user profile: ${profile.id} (${profile.experienceLevel})`);
    return profile;
  }
  async getUserProfile(userId) {
    return this.userProfiles.get(userId) || null;
  }
  async updateUserProfile(userId, updates) {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;
    const updatedProfile = { ...profile, ...updates, lastActive: /* @__PURE__ */ new Date() };
    this.userProfiles.set(userId, updatedProfile);
    console.log(`\u{1F464} Updated user profile: ${userId}`);
    return updatedProfile;
  }
  // Conversation Context Management
  async createConversationContext(sessionId, userId) {
    const context = {
      sessionId,
      userId,
      messages: [],
      relatedTopics: [],
      lastUpdated: /* @__PURE__ */ new Date()
    };
    this.conversationContexts.set(sessionId, context);
    this.sessionUserMap.set(sessionId, userId);
    console.log(`\u{1F4AC} Created conversation context: ${sessionId} for user ${userId}`);
    return context;
  }
  async getConversationContext(sessionId) {
    return this.conversationContexts.get(sessionId) || null;
  }
  async updateConversationContext(sessionId, message) {
    const context = this.conversationContexts.get(sessionId);
    if (!context) return;
    context.messages.push(message);
    if (context.messages.length > 20) {
      context.messages = context.messages.slice(-20);
    }
    await this.updateTopicContext(context, message);
    const userId = this.sessionUserMap.get(sessionId);
    if (userId && message.role === "user") {
      await this.updateLearningInsights(userId, message.content);
    }
    context.lastUpdated = /* @__PURE__ */ new Date();
    console.log(`\u{1F4AC} Updated conversation context: ${sessionId} (${context.messages.length} messages)`);
  }
  async updateTopicContext(context, message) {
    if (message.role !== "user") return;
    const topics = this.extractTopicsFromMessage(message.content);
    if (topics.length > 0) {
      context.currentTopic = topics[0];
    }
    for (const topic of topics) {
      if (!context.relatedTopics.includes(topic)) {
        context.relatedTopics.push(topic);
      }
    }
    if (context.relatedTopics.length > 10) {
      context.relatedTopics = context.relatedTopics.slice(-10);
    }
    context.userIntent = this.determineUserIntent(message.content);
  }
  extractTopicsFromMessage(content) {
    const topics = [];
    const contentLower = content.toLowerCase();
    const topicMap = {
      "gst": ["gst", "tax", "return", "gstr", "filing"],
      "voucher": ["voucher", "entry", "transaction", "record"],
      "inventory": ["inventory", "stock", "item", "product"],
      "payroll": ["payroll", "salary", "employee", "wages"],
      "reports": ["report", "analysis", "statement", "summary"],
      "company": ["company", "organization", "business"],
      "banking": ["bank", "reconciliation", "payment", "receipt"],
      "installation": ["install", "setup", "configure", "upgrade"]
    };
    for (const [topic, keywords] of Object.entries(topicMap)) {
      if (keywords.some((keyword) => contentLower.includes(keyword))) {
        topics.push(topic);
      }
    }
    return topics;
  }
  determineUserIntent(content) {
    const contentLower = content.toLowerCase();
    if (contentLower.includes("how to") || contentLower.includes("learn") || contentLower.includes("tutorial")) {
      return "learning";
    }
    if (contentLower.includes("error") || contentLower.includes("problem") || contentLower.includes("not working")) {
      return "troubleshooting";
    }
    if (contentLower.includes("setup") || contentLower.includes("configure") || contentLower.includes("install")) {
      return "setup";
    }
    if (contentLower.includes("report") || contentLower.includes("analysis") || contentLower.includes("summary")) {
      return "reporting";
    }
    return "learning";
  }
  // User Preferences Management
  async initializeUserPreferences(userId) {
    const preferences = {
      userId,
      responseStyle: "detailed",
      showSteps: true,
      includeExamples: true,
      rememberContext: true,
      notificationPreferences: {
        newFeatures: true,
        tips: true,
        updates: true
      },
      favoriteTopics: [],
      blockedTopics: []
    };
    this.userPreferences.set(userId, preferences);
  }
  async getUserPreferences(userId) {
    return this.userPreferences.get(userId) || null;
  }
  async updateUserPreferences(userId, updates) {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) return null;
    const updatedPreferences = { ...preferences, ...updates };
    this.userPreferences.set(userId, updatedPreferences);
    console.log(`\u2699\uFE0F Updated user preferences: ${userId}`);
    return updatedPreferences;
  }
  // Learning Insights Management
  async updateLearningInsights(userId, query) {
    const topics = this.extractTopicsFromMessage(query);
    const userInsights = this.learningInsights.get(userId) || [];
    for (const topic of topics) {
      let insight = userInsights.find((i) => i.topic === topic);
      if (insight) {
        insight.frequency++;
        insight.lastAsked = /* @__PURE__ */ new Date();
      } else {
        insight = {
          userId,
          topic,
          frequency: 1,
          lastAsked: /* @__PURE__ */ new Date(),
          successfulResolutions: 0,
          commonFollowUps: [],
          difficultyLevel: "medium"
        };
        userInsights.push(insight);
      }
    }
    this.learningInsights.set(userId, userInsights);
  }
  async getLearningInsights(userId) {
    return this.learningInsights.get(userId) || [];
  }
  // Context-Aware Response Generation
  async generateContextualPrompt(sessionId, userQuery) {
    const context = await this.getConversationContext(sessionId);
    const userId = this.sessionUserMap.get(sessionId);
    if (!context || !userId) {
      return userQuery;
    }
    const profile = await this.getUserProfile(userId);
    const preferences = await this.getUserPreferences(userId);
    const insights = await this.getLearningInsights(userId);
    let contextualPrompt = `User Query: ${userQuery}

`;
    if (profile) {
      contextualPrompt += `User Profile:
`;
      contextualPrompt += `- Experience Level: ${profile.experienceLevel}
`;
      if (profile.company) contextualPrompt += `- Company: ${profile.company}
`;
      if (profile.tallyVersion) contextualPrompt += `- Tally Version: ${profile.tallyVersion}
`;
      contextualPrompt += `- Preferred Language: ${profile.preferredLanguage}

`;
    }
    if (context.currentTopic) {
      contextualPrompt += `Current Topic: ${context.currentTopic}
`;
    }
    if (context.relatedTopics.length > 0) {
      contextualPrompt += `Related Topics: ${context.relatedTopics.join(", ")}
`;
    }
    if (context.userIntent) {
      contextualPrompt += `User Intent: ${context.userIntent}
`;
    }
    if (context.messages.length > 0) {
      contextualPrompt += `
Recent Conversation:
`;
      const recentMessages = context.messages.slice(-3);
      for (const msg of recentMessages) {
        contextualPrompt += `${msg.role}: ${msg.content.substring(0, 100)}...
`;
      }
    }
    if (preferences) {
      contextualPrompt += `
User Preferences:
`;
      contextualPrompt += `- Response Style: ${preferences.responseStyle}
`;
      contextualPrompt += `- Show Steps: ${preferences.showSteps}
`;
      contextualPrompt += `- Include Examples: ${preferences.includeExamples}
`;
    }
    if (insights.length > 0) {
      const topTopics = insights.sort((a, b) => b.frequency - a.frequency).slice(0, 3).map((i) => `${i.topic} (${i.frequency}x)`);
      contextualPrompt += `
User's Common Topics: ${topTopics.join(", ")}
`;
    }
    contextualPrompt += `
Please provide a personalized response based on this context.`;
    return contextualPrompt;
  }
  // Session Management
  async createSession(userId) {
    const sessionId = randomUUID2();
    if (userId) {
      await this.createConversationContext(sessionId, userId);
    }
    console.log(`\u{1F3AF} Created session: ${sessionId}${userId ? ` for user ${userId}` : ""}`);
    return sessionId;
  }
  async getSessionUserId(sessionId) {
    return this.sessionUserMap.get(sessionId) || null;
  }
  // Analytics and Insights
  getMemoryStats() {
    const totalUsers = this.userProfiles.size;
    const activeSessions = this.conversationContexts.size;
    let totalInsights = 0;
    const topicFrequency = /* @__PURE__ */ new Map();
    for (const insights of this.learningInsights.values()) {
      totalInsights += insights.length;
      for (const insight of insights) {
        const current = topicFrequency.get(insight.topic) || 0;
        topicFrequency.set(insight.topic, current + insight.frequency);
      }
    }
    const topTopics = Array.from(topicFrequency.entries()).map(([topic, frequency]) => ({ topic, frequency })).sort((a, b) => b.frequency - a.frequency).slice(0, 5);
    return {
      totalUsers,
      activeSessions,
      totalInsights,
      topTopics
    };
  }
};
var memoryService = new MemoryService();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/messages", async (req, res) => {
    try {
      const messages2 = await storage.getMessages();
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid message format" });
      }
      const { sessionId } = req.headers;
      let contextualQuery = result.data.content;
      if (sessionId && typeof sessionId === "string") {
        try {
          contextualQuery = await memoryService.generateContextualPrompt(sessionId, result.data.content);
          console.log(`\u{1F9E0} Using contextual query for session: ${sessionId}`);
        } catch (error) {
          console.error("Memory service error, using original query:", error);
        }
      }
      const userMessage = await storage.createMessage({
        ...result.data,
        role: "user"
      });
      if (sessionId && typeof sessionId === "string") {
        await memoryService.updateConversationContext(sessionId, userMessage);
      }
      const faqResults = await storage.searchFaq(result.data.content);
      const response = await processUserQuery(contextualQuery, faqResults);
      const assistantMessage = await storage.createMessage({
        content: response.content,
        role: "assistant",
        type: response.type,
        metadata: response.metadata
      });
      if (sessionId && typeof sessionId === "string") {
        await memoryService.updateConversationContext(sessionId, assistantMessage);
      }
      res.json(assistantMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });
  app2.delete("/api/messages", async (req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });
  app2.get("/api/faq/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const results = await storage.searchFaq(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search FAQ" });
    }
  });
  app2.get("/api/faq", async (req, res) => {
    try {
      const faqItems2 = await storage.getFaqItems();
      res.json(faqItems2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQ items" });
    }
  });
  app2.post("/api/simulate", async (req, res) => {
    try {
      const { action } = req.body;
      if (!action) {
        return res.status(400).json({ error: "Action is required" });
      }
      const simulation = await generateTallySimulation(action);
      const simulationMessage = await storage.createMessage({
        content: simulation.content,
        role: "assistant",
        type: "simulation",
        metadata: simulation.metadata
      });
      res.json(simulationMessage);
    } catch (error) {
      console.error("Simulation error:", error);
      res.status(500).json({ error: "Failed to generate simulation" });
    }
  });
  app2.post("/api/session", async (req, res) => {
    try {
      const { userId } = req.body;
      const sessionId = await memoryService.createSession(userId);
      res.json({ sessionId, userId });
    } catch (error) {
      console.error("Session creation error:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });
  app2.post("/api/user/profile", async (req, res) => {
    try {
      const profileData = req.body;
      const profile = await memoryService.createUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create user profile" });
    }
  });
  app2.get("/api/user/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await memoryService.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  app2.put("/api/user/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const profile = await memoryService.updateUserProfile(userId, updates);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });
  app2.get("/api/user/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await memoryService.getUserPreferences(userId);
      if (!preferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Preferences fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });
  app2.put("/api/user/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const preferences = await memoryService.updateUserPreferences(userId, updates);
      if (!preferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Preferences update error:", error);
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });
  app2.get("/api/user/insights/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const insights = await memoryService.getLearningInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Insights fetch error:", error);
      res.status(500).json({ error: "Failed to fetch learning insights" });
    }
  });
  app2.get("/api/memory/stats", async (req, res) => {
    try {
      const stats = memoryService.getMemoryStats();
      res.json(stats);
    } catch (error) {
      console.error("Memory stats error:", error);
      res.status(500).json({ error: "Failed to fetch memory statistics" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    log(`Server is running on port ${port}`);
  });
})();
