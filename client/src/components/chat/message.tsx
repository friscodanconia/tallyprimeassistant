import { Message as MessageType } from "@shared/schema";
import { Bot, User, FileText, Play, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  const { speak, isSpeaking } = useSpeech();
  const isUser = message.role === "user";
  const metadata = message.metadata as any;

  const handleSpeak = () => {
    if (message.content) {
      speak(message.content);
    }
  };

  const getTypeIcon = () => {
    switch (message.type) {
      case "faq":
        return <FileText className="h-3 w-3" />;
      case "simulation":
        return <Play className="h-3 w-3" />;
      case "error":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    switch (message.type) {
      case "faq":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">FAQ Match</Badge>;
      case "simulation":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Simulation</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex items-start space-x-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "rounded-2xl p-4 max-w-2xl",
        isUser 
          ? "bg-blue-600 text-white rounded-tr-sm" 
          : "bg-gray-50 rounded-tl-sm"
      )}>
        {!isUser && message.type !== "text" && (
          <div className="flex items-center space-x-2 mb-3">
            {getTypeBadge()}
            {metadata?.confidence && (
              <span className="text-xs text-gray-500">
                Confidence: {Math.round(metadata.confidence * 100)}%
              </span>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          <p className={cn(
            isUser ? "text-white" : "text-gray-800"
          )}>
            {message.content}
          </p>
          
          {/* Steps for FAQ responses */}
          {metadata?.steps && Array.isArray(metadata.steps) && (
            <div className="space-y-2 mt-3">
              <p className="font-medium text-gray-800">Step-by-step Guide:</p>
              {metadata.steps.map((step: any, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.step}
                  </span>
                  <p className="text-sm text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Simulation content */}
          {metadata?.simulation && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm mt-3">
              <div className="text-center mb-4 text-blue-600 font-bold">
                ═══ TALLYPRIME SIMULATION ═══
              </div>
              <pre className="whitespace-pre-wrap text-gray-700">
                {metadata.simulation}
              </pre>
            </div>
          )}
        </div>
        
        {!isUser && (
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="text-xs"
            >
              <span className="mr-1">🔊</span>
              {isSpeaking ? "Speaking..." : "Read aloud"}
            </Button>
            
            <span className="text-xs text-gray-500">
              {new Date(message.createdAt!).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
}
