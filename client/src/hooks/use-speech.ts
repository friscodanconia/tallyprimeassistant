import { useState, useCallback } from "react";

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  preferredLanguage?: string;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);

  // Detect if text contains Hindi characters
  const containsHindi = useCallback((text: string) => {
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(text);
  }, []);

  // Find best voice for the given language
  const findBestVoice = useCallback((language: string) => {
    const voices = window.speechSynthesis.getVoices();
    
    // Log all available voices for debugging
    console.log('All available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // Priority order for Hindi voices
    const hindiPriorities = ['hi-IN', 'hi'];
    const englishPriorities = ['en-IN', 'en-US', 'en-GB', 'en'];
    
    const priorities = language === 'hi' ? hindiPriorities : englishPriorities;
    
    for (const priority of priorities) {
      const voice = voices.find(v => v.lang.startsWith(priority));
      if (voice) return voice;
    }
    
    // Fallback to first voice of the language family
    const fallbackVoice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
    
    // If no Hindi voice found, log a warning
    if (language === 'hi' && !fallbackVoice) {
      console.warn('No Hindi voices available. Available languages:', 
        Array.from(new Set(voices.map(v => v.lang))).sort());
    }
    
    return fallbackVoice;
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Determine target language
    const isHindi = containsHindi(text);
    const targetLanguage = options.preferredLanguage || (isHindi ? 'hi' : 'en');
    
    // Debug logging
    console.log('Speech synthesis debug:', {
      text: text.substring(0, 50) + '...',
      preferredLanguage: options.preferredLanguage,
      isHindi,
      targetLanguage
    });
    
    // Set language
    utterance.lang = targetLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    
    // Find and set the best voice
    const bestVoice = findBestVoice(targetLanguage);
    console.log('Selected voice:', bestVoice ? `${bestVoice.name} (${bestVoice.lang})` : 'None found');
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utterance.rate = options.rate ?? (targetLanguage === 'hi' ? 0.8 : 1.0); // Slower for Hindi
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
  }, [isSupported, options, containsHindi, findBestVoice]);

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

  const getAvailableLanguages = useCallback(() => {
    const voices = getVoices();
    const languages = new Set<string>();
    
    voices.forEach(voice => {
      if (voice.lang.startsWith('hi')) {
        languages.add('Hindi');
      } else if (voice.lang.startsWith('en')) {
        languages.add('English');
      }
    });
    
    return Array.from(languages);
  }, [getVoices]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    getVoices,
    getAvailableLanguages,
  };
}
