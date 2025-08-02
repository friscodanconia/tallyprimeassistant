import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/hooks/use-voice";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { isListening, isSupported: voiceSupported, toggleListening } = useVoice({
    onResult: onTranscript,
    onError: (error) => console.error("Voice recognition error:", error),
  });

  const { isSpeaking, isSupported: speechSupported, stop: stopSpeaking } = useSpeech();

  if (!voiceSupported) {
    return null;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleListening}
        className={cn(
          "relative",
          isListening && "text-red-500 animate-pulse"
        )}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
      </Button>
      
      {speechSupported && isSpeaking && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={stopSpeaking}
          className="text-blue-500"
          title="Stop speech"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}
      
      {isListening && (
        <span className="text-xs text-red-500 font-medium">Listening...</span>
      )}
    </div>
  );
}
