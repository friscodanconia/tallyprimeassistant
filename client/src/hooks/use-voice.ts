import { useState, useCallback, useRef, useEffect } from "react";

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
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      try {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        
        // Simple configuration without problematic settings
        recognition.continuous = false; // Set to false for single recognition
        recognition.interimResults = false; // Set to false for simpler handling
        recognition.lang = "en-US";
        
        // Set longer timeout for speech detection
        let speechTimeout: NodeJS.Timeout;

        recognition.onstart = () => {
          console.log("Voice recognition started - speak now!");
          setIsListening(true);
          
          // Set a timeout to keep listening for 8 seconds
          speechTimeout = setTimeout(() => {
            console.log("Speech timeout reached, stopping...");
            recognition.stop();
          }, 8000);
        };

        recognition.onresult = (event: any) => {
          clearTimeout(speechTimeout);
          console.log("Voice recognition result received:", event);
          
          let finalTranscript = "";

          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            console.log(`Result ${i}: "${transcript}" (final: ${event.results[i].isFinal})`);
            finalTranscript += transcript;
          }

          setTranscript(finalTranscript);
          console.log("Final transcript:", finalTranscript);

          if (finalTranscript.trim() && options.onResult) {
            console.log("Calling onResult with transcript:", finalTranscript.trim());
            options.onResult(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error, event);
          clearTimeout(speechTimeout);
          setIsListening(false);
          
          let errorMessage = "Voice recognition error: ";
          switch (event.error) {
            case 'not-allowed':
              errorMessage += "Microphone access denied. Please allow microphone permissions.";
              break;
            case 'no-speech':
              errorMessage += "No speech detected. Please try speaking again.";
              break;
            case 'audio-capture':
              errorMessage += "No microphone found. Please check your microphone.";
              break;
            case 'network':
              errorMessage += "Network error. Please check your connection.";
              break;
            default:
              errorMessage += event.error;
          }
          
          if (options.onError) {
            options.onError(errorMessage);
          }
        };

        recognition.onend = () => {
          console.log("Voice recognition ended");
          clearTimeout(speechTimeout);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (error) {
        console.error("Error creating speech recognition:", error);
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [options.onResult, options.onError]);

  const startListening = useCallback(async () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted");
        
        setTranscript("");
        recognitionRef.current.start();
      } catch (error) {
        console.error("Microphone permission denied or error:", error);
        if (options.onError) {
          options.onError("Microphone permission denied. Please allow microphone access and try again.");
        }
      }
    }
  }, [isListening, options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
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
