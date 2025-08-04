import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { toast } = useToast();
  const [manualText, setManualText] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

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
    <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 p-0 ${className}`}
          title="Voice input"
        >
          <Mic className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ask a TallyPrime question</DialogTitle>
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
            autoFocus
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
  );
}