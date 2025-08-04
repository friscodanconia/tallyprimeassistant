import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Download, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "./message";
import { SuggestedPrompts } from "./suggested-prompts";
import { Message as MessageType } from "@shared/schema";
import { TallyLogo } from "@/components/ui/tally-logo";

export function ChatInterface() {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<MessageType[]>({
    queryKey: ["/api/messages"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: { content: string; type?: string }) => {
      const response = await apiRequest("POST", "/api/messages", message);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setInputMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate({
        content: inputMessage.trim(),
        type: "text"
      });
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInputMessage(prompt);
    // Submit the prompt automatically after a small delay
    setTimeout(() => {
      if (prompt.trim() && !sendMessageMutation.isPending) {
        sendMessageMutation.mutate({
          content: prompt.trim(),
          type: "text"
        });
      }
    }, 50);
  };

  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  };

  return (
    <div className="bg-white rounded-lg tally-card-shadow border border-gray-200 h-[calc(100vh-4rem)] flex flex-col">
      
      {/* TallyPrime Chat Header */}
      <div className="p-3 border-b border-gray-200 bg-tally-blue-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TallyLogo size="sm" showText={false} />
            <div>
              <h2 className="text-sm font-semibold tally-blue-dark">TallyPrime Assistant</h2>
            </div>
            <div className="w-1.5 h-1.5 bg-tally-green rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              title="Clear Chat"
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="space-y-4">
                {/* Welcome Message */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <TallyLogo size="md" showText={false} />
                  </div>
                  <div className="bg-tally-blue-light rounded-2xl rounded-tl-sm p-4 max-w-md border border-tally-blue">
                    <div className="flex items-center mb-2">
                      <Badge variant="secondary" className="bg-tally-blue-light tally-blue-dark border-tally-blue">TallyPrime Assistant</Badge>
                    </div>
                    <p className="text-gray-800 mb-3">
                      Welcome to TallyPrime AI Assistant! 🎉 I can help you with:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 mb-3">
                      <li>• Accounting queries and troubleshooting</li>
                      <li>• Step-by-step TallyPrime guidance</li>
                      <li>• GST, invoicing, and reporting help</li>
                      <li>• Simulated TallyPrime actions</li>
                    </ul>
                    <p className="text-sm text-gray-600">
                      Use the sidebar for quick actions or type your question below.
                    </p>
                  </div>
                </div>


              </div>
            ) : (
              messages.map((message) => (
                <Message key={message.id} message={message} />
              ))
            )}
            
            {/* Typing indicator */}
            {sendMessageMutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <TallyLogo size="md" showText={false} />
                </div>
                <div className="bg-tally-blue-light rounded-2xl rounded-tl-sm p-4 border border-tally-blue">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-tally-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-tally-green rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-tally-blue rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    </div>
                    <span className="text-sm text-gray-600">TallyPrime AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-tally-sidebar">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Type your TallyPrime question here and press Enter to send..."
                  className="resize-none pr-24 max-h-32 bg-white border-gray-300 focus:border-tally-blue focus:ring-tally-blue"
                  rows={1}
                  value={inputMessage}
                  onChange={handleTextareaChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                    className="p-1.5 rounded-full text-gray-400 hover:text-tally-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {messages.length === 0 && (
          <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
        )}
      </div>
    </div>
  );
}
