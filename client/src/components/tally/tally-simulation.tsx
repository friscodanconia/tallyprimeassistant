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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      {/* TallyPrime Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span className="font-semibold">TallyPrime - Voucher Entry</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-600 p-1">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-blue-600 p-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-100 border-b px-4 py-1">
        <div className="flex space-x-6 text-sm">
          <span className="text-blue-600 font-medium">Gateway of Tally</span>
          <span>Vouchers</span>
          <span className="text-blue-600 font-medium">Sales</span>
        </div>
      </div>

      {/* Voucher Form */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <Label className="font-semibold text-blue-800">Sales Voucher</Label>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Voucher No.</Label>
                <Input className="mt-1" value="SV001" readOnly />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Date</Label>
                <div className="flex items-center mt-1">
                  <Input value="01-Jan-2024" readOnly />
                  <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Party Name</Label>
                <Input className="mt-1" placeholder="Select Customer" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <Label className="font-semibold text-yellow-800">Amount Details</Label>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Taxable Value:</span>
                  <span className="font-mono">₹ 10,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST @ 9%:</span>
                  <span className="font-mono">₹ 900.00</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST @ 9%:</span>
                  <span className="font-mono">₹ 900.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="font-mono">₹ 11,800.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-6">
          <Label className="font-semibold mb-2 block">Item Details</Label>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-sm">
                  <th className="text-left p-3 font-medium">Item Name</th>
                  <th className="text-left p-3 font-medium">Quantity</th>
                  <th className="text-left p-3 font-medium">Rate</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">Product ABC</td>
                  <td className="p-3">10 Nos</td>
                  <td className="p-3">₹ 1,000.00</td>
                  <td className="p-3 font-mono">₹ 10,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="h-4 w-4" />
            <span>Company: Demo Company Ltd.</span>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save Voucher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span className="font-semibold">TallyPrime - Balance Sheet</span>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-green-800">Demo Company Ltd.</h2>
          <p className="text-sm text-gray-600">Balance Sheet as on 31st March, 2024</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Liabilities */}
          <div>
            <h3 className="font-semibold text-green-700 mb-4 border-b pb-2">LIABILITIES</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1">
                <span>Share Capital</span>
                <span className="font-mono">₹ 5,00,000.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Reserves & Surplus</span>
                <span className="font-mono">₹ 2,50,000.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Current Liabilities</span>
                <span className="font-mono">₹ 1,25,000.00</span>
              </div>
              <div className="flex justify-between py-1 border-t font-semibold">
                <span>Total</span>
                <span className="font-mono">₹ 8,75,000.00</span>
              </div>
            </div>
          </div>

          {/* Assets */}
          <div>
            <h3 className="font-semibold text-green-700 mb-4 border-b pb-2">ASSETS</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1">
                <span>Fixed Assets</span>
                <span className="font-mono">₹ 6,00,000.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Current Assets</span>
                <span className="font-mono">₹ 2,50,000.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Cash & Bank</span>
                <span className="font-mono">₹ 25,000.00</span>
              </div>
              <div className="flex justify-between py-1 border-t font-semibold">
                <span>Total</span>
                <span className="font-mono">₹ 8,75,000.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Report Generated Successfully
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderInvoice = () => (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span className="font-semibold">TallyPrime - Sales Invoice</span>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-orange-800">INVOICE</h2>
            <p className="text-sm text-gray-600">Invoice No: INV-2024-001</p>
            <p className="text-sm text-gray-600">Date: 01-Jan-2024</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold">Demo Company Ltd.</h3>
            <p className="text-sm text-gray-600">123 Business Street</p>
            <p className="text-sm text-gray-600">City, State - 123456</p>
            <p className="text-sm text-gray-600">GSTIN: 27ABCDE1234F1Z5</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded p-4 mb-6">
          <h4 className="font-semibold mb-2">Bill To:</h4>
          <div className="text-sm">
            <p>Customer Name</p>
            <p>Customer Address Line 1</p>
            <p>Customer Address Line 2</p>
            <p>GSTIN: 27XYZAB1234C1D2</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-orange-100">
              <tr className="text-sm">
                <th className="text-left p-3 font-medium">Description</th>
                <th className="text-center p-3 font-medium">Qty</th>
                <th className="text-right p-3 font-medium">Rate</th>
                <th className="text-right p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Product ABC - Premium Quality</td>
                <td className="p-3 text-center">10</td>
                <td className="p-3 text-right font-mono">₹ 1,000.00</td>
                <td className="p-3 text-right font-mono">₹ 10,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span className="font-mono">₹ 10,000.00</span>
            </div>
            <div className="flex justify-between py-1">
              <span>CGST @ 9%:</span>
              <span className="font-mono">₹ 900.00</span>
            </div>
            <div className="flex justify-between py-1">
              <span>SGST @ 9%:</span>
              <span className="font-mono">₹ 900.00</span>
            </div>
            <div className="flex justify-between py-1 border-t-2 border-orange-300 font-bold text-lg">
              <span>Total:</span>
              <span className="font-mono">₹ 11,800.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDayBook = () => (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span className="font-semibold">TallyPrime - Day Book</span>
        </div>
      </div>

      {/* Day Book Content */}
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-purple-800">Demo Company Ltd.</h2>
          <p className="text-sm text-gray-600">Day Book for 01-Jan-2024</p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-100">
              <tr className="text-sm">
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Particulars</th>
                <th className="text-left p-3 font-medium">Vch Type</th>
                <th className="text-left p-3 font-medium">Vch No.</th>
                <th className="text-right p-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">01-Jan-24</td>
                <td className="p-3">Customer A/c</td>
                <td className="p-3">Sales</td>
                <td className="p-3">S001</td>
                <td className="p-3 text-right font-mono">₹ 11,800.00</td>
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="p-3">01-Jan-24</td>
                <td className="p-3">Cash A/c</td>
                <td className="p-3">Receipt</td>
                <td className="p-3">R001</td>
                <td className="p-3 text-right font-mono">₹ 5,000.00</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">01-Jan-24</td>
                <td className="p-3">Purchase A/c</td>
                <td className="p-3">Purchase</td>
                <td className="p-3">P001</td>
                <td className="p-3 text-right font-mono">₹ 8,500.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            3 Transactions Found
          </Badge>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Total Value: ₹ 25,300.00</span>
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
    case "invoice":
      return renderInvoice();
    case "report":
      return renderDayBook();
    default:
      return renderVoucherEntry();
  }
}