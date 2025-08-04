import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  BarChart3, 
  Calculator, 
  Receipt,
  Building2,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  PieChart,
  BookOpen,
  Settings,
  Eraser
} from "lucide-react";

export function QuickActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const simulateMutation = useMutation({
    mutationFn: async (action: string) => {
      const response = await apiRequest("POST", "/api/simulate", { 
        action: action
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh the chat
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      // Ensure immediate refresh of the chat interface
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["/api/messages"] });
      }, 100);
      
      toast({
        title: "Simulation completed",
        description: "TallyPrime action simulation has been added to your chat.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to generate simulation. Please try again.",
        variant: "destructive",
      });
    }
  });

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/messages");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.refetchQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Success",
        description: "Chat history cleared.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear chat history.",
        variant: "destructive",
      });
    }
  });

  const quickActions = [
    {
      id: "voucher",
      title: "Create Voucher",
      icon: FileText,
      action: "Create a new voucher entry"
    },
    {
      id: "reports",
      title: "Day Book Report",
      icon: BarChart3,
      action: "Generate a sample financial report"
    },
    {
      id: "balance-sheet",
      title: "Balance Sheet",
      icon: Calculator,
      action: "Open Balance Sheet"
    },
    {
      id: "invoice",
      title: "Sales Invoice",
      icon: Receipt,
      action: "Create Sales Invoice"
    },
    {
      id: "ledger",
      title: "Ledger Account",
      icon: BookOpen,
      action: "Open ledger account view"
    },
    {
      id: "trial-balance",
      title: "Trial Balance",
      icon: PieChart,
      action: "Generate trial balance report"
    },
    {
      id: "customers",
      title: "Customer Master",
      icon: Users,
      action: "View customer master data"
    },
    {
      id: "inventory",
      title: "Stock Summary",
      icon: Package,
      action: "Display stock summary report"
    },
    {
      id: "payment",
      title: "Payment Voucher",
      icon: CreditCard,
      action: "Create payment voucher"
    },
    {
      id: "profit-loss",
      title: "Profit & Loss",
      icon: TrendingUp,
      action: "Generate profit and loss statement"
    },
    {
      id: "company",
      title: "Company Info",
      icon: Building2,
      action: "View company information"
    },
    {
      id: "config",
      title: "Configuration",
      icon: Settings,
      action: "Open TallyPrime configuration"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <Calculator className="h-4 w-4 mr-2 text-blue-600" />
        Quick Actions
      </h3>
      
      <div className="space-y-2">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => simulateMutation.mutate(action.action)}
              disabled={simulateMutation.isPending}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs bg-gray-50 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <IconComponent className="h-3.5 w-3.5 text-blue-600 flex-shrink-0 group-hover:text-blue-700" />
              <span className="truncate">{action.title}</span>
              {simulateMutation.isPending && (
                <div className="ml-auto">
                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          );
        })}
        
        {/* Clear Chat Button */}
        <div className="border-t border-gray-200 mt-4 pt-3">
          <button
            onClick={() => clearChatMutation.mutate()}
            disabled={clearChatMutation.isPending}
            className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Eraser className="h-3.5 w-3.5 text-red-600 flex-shrink-0 group-hover:text-red-700" />
            <span className="truncate">Clear Chat History</span>
            {clearChatMutation.isPending && (
              <div className="ml-auto">
                <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}