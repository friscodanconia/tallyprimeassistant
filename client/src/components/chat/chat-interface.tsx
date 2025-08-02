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

// Removed suggested queries and quick actions since they're now in the sidebar

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

  // Removed handlers for suggested queries and quick actions since they're now in the sidebar

  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-4rem)] flex flex-col">
      
      {/* Minimal Chat Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Calculator className="text-white h-3 w-3" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">AI Assistant</h2>
            </div>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
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
                      Use the sidebar for quick actions or type your question below.
                    </p>
                  </div>
                </div>

                {/* Streamlined guidance */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white h-4 w-4" />
                  </div>
                  <div className="bg-purple-50 rounded-2xl rounded-tl-sm p-4 max-w-md border border-purple-100">
                    <div className="flex items-center mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">Getting Started</Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Use the sidebar to access Quick Actions and search FAQs, or simply type your question below.
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
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Type your TallyPrime question here and press Enter to send..."
                  className="resize-none pr-12 max-h-32 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Removed input suggestions - now handled by sidebar */}
      </div>
    </div>
  );
}
