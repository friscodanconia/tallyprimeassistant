import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "./message";
import { VoiceInput } from "./voice-input";
import { Message as MessageType } from "@shared/schema";

const SUGGESTED_QUERIES = [
  "How to backup data?",
  "GST filing process",
  "Create purchase invoice",
  "Generate reports"
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

  // Handle textarea auto-resize
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + "px";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-12rem)] flex flex-col">
      
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-500">Online • Ready to help with TallyPrime</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="Voice Settings">
              <Settings className="h-4 w-4" />
            </Button>
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
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 max-w-md">
                  <div className="flex items-center mb-2">
                    <Badge variant="secondary">AI Assistant</Badge>
                  </div>
                  <p className="text-gray-800">
                    Welcome to TallyPrime AI Assistant! I can help you with accounting queries, 
                    simulate TallyPrime actions, and provide step-by-step guidance. How can I assist you today?
                  </p>
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
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    </div>
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about TallyPrime..."
                  className="resize-none pr-20 max-h-32"
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
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Input Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((query) => (
            <Button
              key={query}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestedQuery(query)}
              disabled={sendMessageMutation.isPending}
            >
              {query}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
