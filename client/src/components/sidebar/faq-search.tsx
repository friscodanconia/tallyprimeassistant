import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, FileText, BarChart3, Receipt, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { data: allFaqItems = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq"],
  });

  // Search FAQ items
  const { data: searchResults = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/faq/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  const displayItems = searchQuery ? searchResults : allFaqItems.slice(0, 3);

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
    return <IconComponent className="h-4 w-4" />;
  };

  const getColorForCategory = (category: string) => {
    const colors = {
      "GST": "text-green-600",
      "Financial Reports": "text-blue-600", 
      "Invoice Management": "text-green-600",
      "Data Management": "text-blue-600",
      "Company Management": "text-green-600",
    };
    return colors[category as keyof typeof colors] || "text-blue-600";
  };

  return (
    <Card className="text-xs">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="flex items-center text-sm">
          <Search className="h-3 w-3 text-blue-600 mr-1" />
          FAQ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search TallyPrime topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {searchQuery ? "Search Results" : "Popular Topics"}
          </h4>
          
          {displayItems.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              {searchQuery ? "No results found" : "Loading topics..."}
            </p>
          ) : (
            displayItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  console.log("FAQ item clicked:", item);
                  sendMessageMutation.mutate(item.question);
                }}
                disabled={sendMessageMutation.isPending}
              >
                <span className={`mr-2 flex-shrink-0 ${getColorForCategory(item.category)}`}>
                  {getIconForCategory(item.category)}
                </span>
                <div className="text-left min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {item.question}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.category}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
