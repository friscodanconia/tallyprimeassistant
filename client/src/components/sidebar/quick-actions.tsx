import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, BarChart3, Eraser, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function QuickActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Simulation mutation
  const simulationMutation = useMutation({
    mutationFn: async (action: string) => {
      const response = await apiRequest("POST", "/api/simulate", { action });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Simulation Generated",
        description: "TallyPrime simulation has been added to the chat.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate simulation.",
        variant: "destructive",
      });
    },
  });

  // Clear chat mutation
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/messages");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Success",
        description: "Chat history cleared.",
      });
    },
  });

  const handleSimulateVoucher = () => {
    simulationMutation.mutate("Create a new voucher entry");
  };

  const handleGenerateReport = () => {
    simulationMutation.mutate("Generate a sample financial report");
  };

  const handleClearChat = () => {
    clearChatMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Zap className="h-5 w-5 text-green-600 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleSimulateVoucher}
          disabled={simulationMutation.isPending}
          className="w-full flex items-center justify-start bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Play className="h-4 w-4 mr-3" />
          Simulate Voucher Entry
        </Button>
        
        <Button
          onClick={handleGenerateReport}
          disabled={simulationMutation.isPending}
          className="w-full flex items-center justify-start bg-green-600 hover:bg-green-700 text-white"
        >
          <BarChart3 className="h-4 w-4 mr-3" />
          Generate Sample Report
        </Button>
        
        <Button
          onClick={handleClearChat}
          disabled={clearChatMutation.isPending}
          variant="outline"
          className="w-full flex items-center justify-start border-gray-300 hover:bg-gray-50"
        >
          <Eraser className="h-4 w-4 mr-3" />
          Clear Chat History
        </Button>
      </CardContent>
    </Card>
  );
}
