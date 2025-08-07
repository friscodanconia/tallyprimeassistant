// Extended TallyPrime Knowledge Base
// This file contains comprehensive TallyPrime FAQ data to be integrated

export const extendedKnowledgeBase = [
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
