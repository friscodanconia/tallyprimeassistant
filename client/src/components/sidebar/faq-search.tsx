import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, MessageSquare, FileText, BarChart3, Receipt, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FaqItem } from "@shared/schema";

const CATEGORY_ICONS = {
  "GST": FileText,
  "Financial Reports": BarChart3,
  "Invoice Management": Receipt,
  "Data Management": Database,
  "Company Management": FileText,
};

export function FaqSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all FAQ items
  const { data: allFaqItems = [], isLoading } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq"],
  });

  // Search FAQ items
  const { data: searchResults = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const displayItems = searchQuery ? searchResults : allFaqItems.slice(0, 6);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Question sent",
        description: "FAQ question added to chat",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getIconForCategory = (category: string) => {
    const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || FileText;
    return IconComponent;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">FAQ Search</h3>
      
      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
        <Input
          placeholder="Search TallyPrime topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 h-8 text-xs"
        />
      </div>
      
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-500 py-4 text-xs">Loading FAQs...</div>
        ) : displayItems.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-xs">
            {searchQuery ? "No FAQs found" : "No FAQs available"}
          </div>
        ) : (
          displayItems.map((item) => {
            const IconComponent = getIconForCategory(item.category);
            return (
              <button
                key={item.id}
                onClick={() => sendMessageMutation.mutate(item.question)}
                disabled={sendMessageMutation.isPending}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-green-50 hover:text-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <IconComponent className="h-3.5 w-3.5 text-green-600 flex-shrink-0 group-hover:text-green-700" />
                <div className="flex-1 min-w-0">
                  <span className="truncate block font-medium">{item.question}</span>
                  <span className="text-gray-500 text-xs truncate block">
                    {item.category}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}