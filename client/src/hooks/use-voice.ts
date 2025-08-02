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

      // Configure recognition with Chrome-optimized settings
      recognition.continuous = false;  // Single utterance mode
      recognition.interimResults = false;  // Final results only
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;
      
      // Add service hints for better recognition
      if ('serviceURI' in recognition) {
        recognition.serviceURI = 'wss://www.google.com/speech-api/full-duplex/v1/down?key=';
      }

      let finalTranscript = "";
      let hasResult = false;

      recognition.onstart = () => {
        console.log("Voice recognition started - speak now! (Say something clearly)");
        setIsListening(true);
        
        // Shorter timeout for single utterance
        timeoutRef.current = setTimeout(() => {
          console.log("Voice recognition timeout - stopping");
          recognition.stop();
        }, 15000);
        
        // Force a brief delay to ensure mic is ready
        setTimeout(() => {
          console.log("Microphone should be active now - please speak");
        }, 500);
      };

      recognition.onresult = (event: any) => {
        console.log("🎤 SPEECH DETECTED! Processing results...", event);
        hasResult = true;
        
        let bestTranscript = "";
        let confidence = 0;

        // Get the best result from all alternatives
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          for (let j = 0; j < result.length; j++) {
            const alternative = result[j];
            console.log(`Alternative ${j}: "${alternative.transcript}" (confidence: ${alternative.confidence})`);
            
            if (alternative.confidence > confidence || j === 0) {
              bestTranscript = alternative.transcript;
              confidence = alternative.confidence;
            }
          }
        }

        console.log(`✅ Best transcript: "${bestTranscript}" (confidence: ${confidence})`);
        setTranscript(bestTranscript);

        if (bestTranscript.trim()) {
          console.log("🚀 Sending result to callback:", bestTranscript.trim());
          if (options.onResult) {
            options.onResult(bestTranscript.trim());
          }
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
