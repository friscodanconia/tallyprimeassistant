import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Download, Settings, Calculator, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "./message";
import { VoiceInput } from "./voice-input";
import { Message as MessageType } from "@shared/schema";

// TallyPrime-specific suggested queries
const SUGGESTED_QUERIES = [
  "How to enable GST in TallyPrime?",
  "What's the difference between ERP 9 and TallyPrime?",
  "How to cancel an invoice?",
  "Show me Balance Sheet",
  "How to migrate from ERP 9?",
  "Create sales voucher",
  "Generate GST returns",
  "How to backup data?"
];

// Quick action commands
const QUICK_ACTIONS = [
  { text: "Open Balance Sheet", icon: "📊", type: "action" },
  { text: "Create Sales Invoice", icon: "🧾", type: "action" },
  { text: "View Day Book", icon: "📖", type: "action" },
  { text: "GST Filing Help", icon: "📋", type: "question" }
];

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
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", { content });
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
      sendMessageMutation.mutate(inputMessage.trim());
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(transcript);
    // Auto-focus textarea after voice input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Handle suggested query click
  const handleSuggestedQuery = (query: string) => {
    setInputMessage(query);
    textareaRef.current?.focus();
  };

  // Handle quick action click
  const handleQuickAction = (action: any) => {
    if (action.type === "action") {
      // For actions, we'll simulate them
      sendMessageMutation.mutate(action.text);
    } else {
      // For questions, set as input
      setInputMessage(action.text);
      textareaRef.current?.focus();
    }
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Calculator className="text-white h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">TallyPrime AI Assistant</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">Online • Ready to help with accounting</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              AI Powered
            </Badge>
            <Button variant="ghost" size="sm" title="Export Chat">
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              title="Clear Chat"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calculator className="text-white h-4 w-4" />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl rounded-tl-sm p-4 max-w-md border border-blue-100">
                    <div className="flex items-center mb-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">TallyPrime Assistant</Badge>
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
                      💬 Type a question or click "Ask Question" to get started!
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white h-4 w-4" />
                  </div>
                  <div className="bg-purple-50 rounded-2xl rounded-tl-sm p-4 max-w-md border border-purple-100">
                    <div className="flex items-center mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">Quick Actions</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.text}
                          onClick={() => handleQuickAction(action)}
                          className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                          disabled={sendMessageMutation.isPending}
                        >
                          <span className="text-lg">{action.icon}</span>
                          <span className="text-xs text-gray-700 font-medium">{action.text}</span>
                        </button>
                      ))}
                    </div>
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calculator className="text-white h-4 w-4" />
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
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
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about TallyPrime... (e.g., 'How to enable GST?' or 'Show balance sheet')"
                  className="resize-none pr-20 max-h-32 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                  
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Input Suggestions */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">💡 Try these common TallyPrime questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUERIES.map((query) => (
              <Button
                key={query}
                variant="outline"
                size="sm"
                className="text-xs bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors"
                onClick={() => handleSuggestedQuery(query)}
                disabled={sendMessageMutation.isPending}
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
