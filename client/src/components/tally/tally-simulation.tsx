import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Calculator, 
  Calendar, 
  DollarSign, 
  Building, 
  User,
  Settings,
  Save,
  X
} from "lucide-react";

interface TallySimulationProps {
  simulationType: "voucher" | "report" | "balance_sheet" | "invoice";
  metadata?: any;
}

export function TallySimulation({ simulationType, metadata }: TallySimulationProps) {
  const renderVoucherEntry = () => (
    <div className="bg-white border border-gray-300 rounded-sm font-sans">
      {/* TallyPrime Header - Dark Blue */}
      <div className="bg-[#1e3a8a] text-white px-3 py-1 text-sm font-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>TallyPrime</span>
            <span className="text-gray-300">|</span>
            <span>EDU</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span>K:Company</span>
            <span>Y:Data</span>
            <span>Z:Exchange</span>
            <span className="bg-white text-black px-2 py-0.5 rounded">Gateway of Tally</span>
            <span>O:Import</span>
            <span>E:Export</span>
            <span>M:Share</span>
            <span>P:Print</span>
            <span>F1:Help</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#4a5568] text-white px-3 py-1 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-300">Gateway of Tally</span>
          <span>&gt;</span>
          <span className="text-yellow-300">Vouchers</span>
          <span>&gt;</span>
          <span className="text-yellow-300">F8: Sales</span>
        </div>
      </div>

      {/* Main Content Area with TallyPrime styling */}
      <div className="bg-gray-50 min-h-[500px] p-4">
        {/* Yellow Header Section */}
        <div className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold border border-gray-400">
          Sales Voucher
        </div>
        
        {/* Form Area */}
        <div className="bg-white border-l border-r border-b border-gray-400 p-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700">Date:</label>
                <div className="border-b border-gray-400 flex-1 pb-1">
                  <span className="text-sm">1-Jan-24</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700">Voucher No:</label>
                <div className="border-b border-gray-400 flex-1 pb-1">
                  <span className="text-sm">1</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700">Party A/c Name:</label>
                <div className="border-b border-gray-400 flex-1 pb-1">
                  <span className="text-sm text-blue-600 cursor-pointer">Customer ABC</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="bg-gray-100 border border-gray-400 p-3">
                  <div className="text-xs font-bold mb-2">Sales Account Details</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Sales Account</span>
                      <span>10,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST @ 9%</span>
                      <span>900.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST @ 9%</span>
                      <span>900.00</span>
                    </div>
                    <div className="border-t border-gray-400 pt-1 flex justify-between font-bold">
                      <span>Total</span>
                      <span>11,800.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700">Reference:</label>
                <div className="border-b border-gray-400 flex-1 pb-1">
                  <span className="text-sm">Invoice ABC123</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700">Due Date:</label>
                <div className="border-b border-gray-400 flex-1 pb-1">
                  <span className="text-sm">31-Jan-24</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="text-xs font-bold mb-2">Ledger Account</div>
                <div className="border border-gray-400 bg-white">
                  <div className="bg-gray-200 px-2 py-1 text-xs font-bold border-b border-gray-400">
                    Particulars
                  </div>
                  <div className="p-2 space-y-1 text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-blue-600 cursor-pointer">Sales Account</span>
                      <span>10,000.00</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-blue-600 cursor-pointer">Output CGST 9%</span>
                      <span>900.00</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-blue-600 cursor-pointer">Output SGST 9%</span>
                      <span>900.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Narration */}
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700">Narration:</label>
                <div className="border-b border-gray-400 flex-1 pb-1">
                  <span className="text-sm">Being goods sold as per invoice</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm">
                <div className="mb-1">Total Amount: <span className="font-bold">₹ 11,800.00</span></div>
              </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="mt-8 bg-gray-200 border border-gray-400 px-3 py-1 text-xs flex justify-between">
            <span>Ctrl+A: Accept | ESC: Quit | F12: Config</span>
            <span>Company: Demo Company Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className="bg-white border border-gray-300 rounded-sm font-sans">
      {/* TallyPrime Header */}
      <div className="bg-[#1e3a8a] text-white px-3 py-1 text-sm font-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>TallyPrime</span>
            <span className="text-gray-300">|</span>
            <span>EDU</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span>K:Company</span>
            <span>Y:Data</span>
            <span>Z:Exchange</span>
            <span className="bg-white text-black px-2 py-0.5 rounded">Display</span>
            <span>O:Import</span>
            <span>E:Export</span>
            <span>M:Share</span>
            <span>P:Print</span>
            <span>F1:Help</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#4a5568] text-white px-3 py-1 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-300">Gateway of Tally</span>
          <span>&gt;</span>
          <span className="text-yellow-300">Display</span>
          <span>&gt;</span>
          <span className="text-yellow-300">Balance Sheet</span>
        </div>
      </div>

      {/* Balance Sheet Content */}
      <div className="bg-gray-50 min-h-[500px] p-4">
        <div className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold border border-gray-400">
          Balance Sheet
        </div>
        
        <div className="bg-white border-l border-r border-b border-gray-400 p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">Demo Company Pvt Ltd</h2>
            <p className="text-sm">Balance Sheet as on 31-Mar-2024</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Liabilities */}
            <div>
              <div className="bg-gray-200 px-2 py-1 text-sm font-bold border border-gray-400 mb-2">
                LIABILITIES
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-blue-600 cursor-pointer">Share Capital</span>
                  <span>5,00,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-blue-600 cursor-pointer">Reserves & Surplus</span>
                  <span>2,50,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-blue-600 cursor-pointer">Current Liabilities</span>
                  <span>1,25,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-t-2 border-gray-400 font-bold">
                  <span>Total</span>
                  <span>8,75,000.00</span>
                </div>
              </div>
            </div>

            {/* Assets */}
            <div>
              <div className="bg-gray-200 px-2 py-1 text-sm font-bold border border-gray-400 mb-2">
                ASSETS
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-blue-600 cursor-pointer">Fixed Assets</span>
                  <span>6,00,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-blue-600 cursor-pointer">Current Assets</span>
                  <span>2,50,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-blue-600 cursor-pointer">Cash & Bank</span>
                  <span>25,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-t-2 border-gray-400 font-bold">
                  <span>Total</span>
                  <span>8,75,000.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-200 border border-gray-400 px-3 py-1 text-xs flex justify-between">
            <span>Alt+F2: Period | F12: Config | ESC: Quit</span>
            <span>Company: Demo Company Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => (
    <div className="bg-white border border-gray-300 rounded-sm font-sans">
      {/* TallyPrime Header */}
      <div className="bg-[#1e3a8a] text-white px-3 py-1 text-sm font-medium">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>TallyPrime</span>
            <span className="text-gray-300">|</span>
            <span>EDU</span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span>K:Company</span>
            <span>Y:Data</span>
            <span>Z:Exchange</span>
            <span className="bg-white text-black px-2 py-0.5 rounded">List of Reports</span>
            <span>O:Import</span>
            <span>E:Export</span>
            <span>M:Share</span>
            <span>P:Print</span>
            <span>F1:Help</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#4a5568] text-white px-3 py-1 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-300">Go To</span>
          <span>&gt;</span>
          <span className="text-yellow-300">List of Reports</span>
        </div>
      </div>

      {/* List of Reports matching the actual TallyPrime style */}
      <div className="bg-gray-50 min-h-[500px] p-4">
        <div className="bg-[#4169e1] text-white px-3 py-1 text-sm font-bold">
          List of Reports
        </div>
        
        <div className="bg-white border-l border-r border-b border-gray-400">
          <div className="grid grid-cols-2 gap-0">
            {/* Left Column */}
            <div className="border-r border-gray-400">
              {/* Saved Views Section */}
              <div className="bg-orange-400 text-black px-2 py-1 text-xs font-bold border-b border-gray-400">
                Saved Views
              </div>
              <div className="p-2 space-y-1 text-xs">
                <div className="text-blue-600 cursor-pointer">Bills Payable - GST</div>
                <div className="text-blue-600 cursor-pointer">Bills Payable - GST - Sundry Creditors</div>
                <div className="text-blue-600 cursor-pointer">Bills Payable - GST - Sundry Debtors</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable - GST</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable - GST - Sundry Creditors</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable - GST - Sundry Debtors</div>
                <div className="text-blue-600 cursor-pointer">GST Outward Supplies - Filed Invoices</div>
                <div className="text-blue-600 cursor-pointer">Ledger Vouchers - GST Details</div>
              </div>

              {/* Common Reports Section */}
              <div className="bg-orange-400 text-black px-2 py-1 text-xs font-bold border-b border-t border-gray-400 mt-4">
                Common Reports
              </div>
              <div className="p-2 space-y-1 text-xs">
                <div className="text-blue-600 cursor-pointer">Daybook</div>
                <div className="text-blue-600 cursor-pointer">Cashbook</div>
                <div className="text-blue-600 cursor-pointer">Profit & Loss A/c</div>
                <div className="text-blue-600 cursor-pointer">Cash/Bank Book</div>
                <div className="text-blue-600 cursor-pointer">Balance Sheet</div>
                <div className="text-blue-600 cursor-pointer">Ledger Vouchers</div>
                <div className="text-blue-600 cursor-pointer">Ledger Vouchers - GST</div>
                <div className="text-blue-600 cursor-pointer">Trial Balance</div>
                <div className="text-blue-600 cursor-pointer">Bills Payable</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable</div>
                <div className="text-blue-600 cursor-pointer">Bills Payable</div>
                <div className="text-blue-600 cursor-pointer">Group Summary</div>
                <div className="text-blue-600 cursor-pointer">Ratio Analysis</div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="bg-orange-400 text-black px-2 py-1 text-xs font-bold border-b border-gray-400">
                Data Payable (All Companies)
              </div>
              <div className="p-2 space-y-1 text-xs">
                <div className="text-blue-600 cursor-pointer">Create Master</div>
                <div className="text-blue-600 cursor-pointer">Alter Master</div>
                <div className="text-blue-600 cursor-pointer">Display Master</div>
                <div className="text-blue-600 cursor-pointer">Show More</div>
              </div>

              <div className="bg-orange-400 text-black px-2 py-1 text-xs font-bold border-b border-t border-gray-400 mt-4">
                Bills Payable (All Companies)
              </div>
              <div className="p-2 space-y-1 text-xs">
                <div className="text-blue-600 cursor-pointer">Bills Payable (All Companies)</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable (All Companies)</div>
                <div className="text-blue-600 cursor-pointer">Bank Statement (All Companies)</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable (All Companies)</div>
                <div className="text-blue-600 cursor-pointer">Bills Receivable (All Comp)</div>
                <div className="text-blue-600 cursor-pointer">Period Daily Summary (All Comp)</div>
                <div className="text-blue-600 cursor-pointer">IMS Report Supplies (All Companies)</div>
                <div className="text-blue-600 cursor-pointer">Ledger Vouchers (All Companies)</div>
                <div className="text-blue-600 cursor-pointer">MIS Payable - Book A/c Detail (All Companies)</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-200 border-t border-gray-400 px-3 py-1 text-xs flex justify-between">
            <span>Enter: Select | F12: Config | ESC: Quit</span>
            <span>Company: Demo Company Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );

  switch (simulationType) {
    case "voucher":
      return renderVoucherEntry();
    case "balance_sheet":
      return renderBalanceSheet();
    case "report":
      return renderReport();
    case "invoice":
      return renderVoucherEntry(); // Use voucher for invoice simulation
    default:
      return renderVoucherEntry();
  }
}