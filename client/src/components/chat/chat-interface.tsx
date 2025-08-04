import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TallyLogo } from "@/components/ui/tally-logo";
import { SuggestedPrompts } from "./suggested-prompts";
import { apiRequest } from "@/lib/queryClient";
import { Message } from "./message";
import { Message as MessageType } from "@shared/schema";

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
    <div className="tally-chat-container h-[calc(100vh-4rem)] flex flex-col">
      {/* Premium TallyPrime Chat Header - Mobile Optimized */}
      <div className="tally-chat-header">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <TallyLogo size="sm" showText={false} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-white leading-tight">TallyPrime Assistant</h2>
              <p className="text-white/80 text-sm md:text-xs mt-1">AI-Powered Business Intelligence</p>
            </div>
          </div>
          <div className="flex items-center justify-between md:justify-end space-x-2">
            <div className="px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-white text-xs font-medium">✨ Smart Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearChatMutation.mutate()}
              disabled={clearChatMutation.isPending}
              className="text-xs text-white/70 hover:text-white px-3 py-1.5"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white">
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="tally-fade-in">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-600 mt-3 text-center">AI is thinking...</p>
            </div>
          </div>
        )}
        
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 tally-fade-in">
            <div className="tally-card-premium p-8 max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="tally-heading-lg mb-2">Welcome to TallyPrime Assistant</h3>
                <p className="tally-text text-center">Your AI-powered business intelligence companion with memory and semantic search</p>
              </div>
              <div className="flex justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Always Available</span>
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Instant Answers</span>
                </div>
                <div className="flex items-center space-x-1 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Expert Knowledge</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} tally-slide-up`} style={{animationDelay: `${index * 100}ms`}}>
            <div className={`max-w-[85%] ${
              message.role === 'user' 
                ? 'tally-chat-message tally-chat-message-user' 
                : 'tally-chat-message tally-chat-message-assistant'
            }`}>
              <div className="flex items-start space-x-3">
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TallyLogo size="sm" showText={false} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  {message.metadata?.steps && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center">
                        <span className="mr-2">📋</span>
                        Step-by-Step Guide:
                      </div>
                      <ol className="text-sm space-y-2">
                        {message.metadata.steps.map((step: any, stepIndex: number) => (
                          <li key={stepIndex} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">
                              {step.step}
                            </span>
                            <span className="text-gray-700">{step.description}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {message.metadata?.faqMatch && (
                    <div className="mt-2 flex items-center text-xs text-green-600">
                      <span className="mr-1">✅</span>
                      <span>Found in knowledge base</span>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    U
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Chat Input Area - Mobile Optimized */}
      <div className="tally-chat-input-area border-t border-white/20 bg-white/10 backdrop-blur-sm">
        <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Type your TallyPrime question here and press Enter to send..."
            className="flex-1 bg-white/90 border border-white/30 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent tally-card-shadow transition-all duration-200"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={() => handleSubmit(new Event('submit') as any)}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-3 md:px-6 py-2.5 md:py-3 font-medium transition-all duration-200 tally-card-shadow disabled:opacity-50 flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
