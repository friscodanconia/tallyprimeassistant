import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Keyboard } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { toast } = useToast();
  const [manualText, setManualText] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  
  const { isListening, isSupported, startListening, stopListening } = useVoice({
    onResult: (text) => {
      console.log("Voice input result:", text);
      onTranscript(text);
      toast({
        title: "Voice input received",
        description: `"${text}"`,
      });
    },
    onError: (error) => {
      console.error("Voice input error:", error);
      toast({
        title: "Voice input issue",
        description: "Try speaking louder or use the Type button below",
        variant: "destructive",
      });
    },
  });

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      onTranscript(manualText.trim());
      setManualText("");
      setShowManualInput(false);
      toast({
        title: "Question received",
        description: `"${manualText.trim()}"`,
      });
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {isSupported && (
        <Button
          type="button"
          variant={isListening ? "secondary" : "outline"}
          size="sm"
          onClick={handleVoiceClick}
          className={`${
            isListening 
              ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" 
              : "hover:bg-blue-50"
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-1" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-1" />
              Voice
            </>
          )}
        </Button>
      )}
      
      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hover:bg-green-50"
          >
            <Keyboard className="w-4 h-4 mr-1" />
            Type
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Type your TallyPrime question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="e.g., How do I create a sales invoice in TallyPrime?"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={4}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleManualSubmit();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowManualInput(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleManualSubmit}
                disabled={!manualText.trim()}
              >
                Send Question
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Tip: Press Ctrl+Enter to send quickly
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}