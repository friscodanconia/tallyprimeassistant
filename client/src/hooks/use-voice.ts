import { useState, useCallback, useRef } from "react";

// Declare global types for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseVoiceOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useVoice(options: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startListening = useCallback(async () => {
    if (!isSupported) {
      console.error("Speech recognition not supported");
      return;
    }

    if (isListening) {
      console.log("Already listening");
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");

      // Create fresh recognition instance each time
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      // Configure recognition with more permissive settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 3;

      let finalTranscript = "";
      let hasResult = false;

      recognition.onstart = () => {
        console.log("Voice recognition started - speak now!");
        setIsListening(true);
        
        // Set timeout to stop listening after 10 seconds
        timeoutRef.current = setTimeout(() => {
          console.log("Voice recognition timeout");
          recognition.stop();
        }, 10000);
      };

      recognition.onresult = (event: any) => {
        console.log("Voice recognition result received:", event);
        hasResult = true;
        
        let interimTranscript = "";
        finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            console.log("Final result:", transcript);
          } else {
            interimTranscript += transcript;
            console.log("Interim result:", transcript);
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        // If we have a final result, process it and stop
        if (finalTranscript.trim()) {
          console.log("Processing final transcript:", finalTranscript.trim());
          if (options.onResult) {
            options.onResult(finalTranscript.trim());
          }
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Don't stop on 'no-speech' error, just log it and continue
        if (event.error === 'no-speech') {
          console.log("No speech detected, but will use any captured audio...");
          // Don't set listening to false or show error - let onend handle it
          return;
        }
        
        setIsListening(false);
        
        let errorMessage = "Voice input failed: ";
        switch (event.error) {
          case 'not-allowed':
            errorMessage += "Microphone access denied";
            break;
          case 'audio-capture':
            errorMessage += "No microphone found";
            break;
          case 'network':
            errorMessage += "Network error";
            break;
          case 'aborted':
            console.log("Speech recognition was aborted");
            return; // Don't show error for manual abort
          default:
            errorMessage += event.error;
        }
        
        if (options.onError) {
          options.onError(errorMessage);
        }
      };

      recognition.onend = () => {
        console.log("Voice recognition ended");
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setIsListening(false);
        
        // If we got interim results but no final result, use what we have
        if (!hasResult && transcript.trim() && options.onResult) {
          console.log("Using interim transcript:", transcript.trim());
          options.onResult(transcript.trim());
        } else if (!hasResult || !transcript.trim()) {
          console.log("No speech captured. Please try speaking louder or closer to the microphone.");
          if (options.onError) {
            options.onError("No speech detected. Please speak louder and try again.");
          }
        }
      };

      recognitionRef.current = recognition;
      setTranscript("");
      recognition.start();

    } catch (error) {
      console.error("Failed to start voice recognition:", error);
      if (options.onError) {
        options.onError("Microphone access denied. Please allow microphone permissions.");
      }
    }
  }, [isListening, isSupported, options, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      console.log("Stopping voice recognition");
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
