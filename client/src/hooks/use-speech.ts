import { useState, useCallback } from "react";

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);

  // Find best English voice
  const findBestVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for English voices
    const englishPriorities = ['en-IN', 'en-US', 'en-GB', 'en'];
    
    for (const priority of englishPriorities) {
      const voice = voices.find(v => v.lang.startsWith(priority));
      if (voice) return voice;
    }
    
    // Fallback to first English voice
    return voices.find(v => v.lang.startsWith('en'));
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use English language
    utterance.lang = 'en-US';
    
    // Find and set the best English voice
    const bestVoice = findBestVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    
    // Override with custom voice if provided
    if (options.voice) {
      utterance.voice = options.voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, options, findBestVoice]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const getVoices = useCallback(() => {
    if (isSupported) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    getVoices,
  };
}
