import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const SUGGESTED_PROMPTS = [
  "How do I create a new company in TallyPrime?",
  "Show me how to generate a balance sheet",
  "How to record a payment from a customer?",
  "Generate a sales report for this month",
  "How to set up GST in TallyPrime?",
  "Show me how to create a voucher entry",
  "How to check stock summary?",
  "Generate a profit and loss statement",
];

// Top 4 prompts for mobile priority
const MOBILE_PRIORITY_PROMPTS = SUGGESTED_PROMPTS.slice(0, 4);
const ADDITIONAL_PROMPTS = SUGGESTED_PROMPTS.slice(4);

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      if (!scrollRef.current || isAutoScrolling) return;
      
      setIsAutoScrolling(true);
      const container = scrollRef.current;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      
      if (scrollWidth > 0) {
        let currentScroll = 0;
        const scrollStep = scrollWidth / 3;
        
        const scroll = () => {
          currentScroll += scrollStep;
          if (currentScroll >= scrollWidth) {
            currentScroll = 0;
          }
          
          container.scrollTo({
            left: currentScroll,
            behavior: 'smooth'
          });
        };
        
        autoScrollRef.current = setInterval(scroll, 3000);
      }
    };

    const timer = setTimeout(startAutoScroll, 5000);

    return () => {
      clearTimeout(timer);
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling]);

  const handleUserInteraction = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      setIsAutoScrolling(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-tally-blue-light via-white to-tally-blue-light border-2 border-tally-blue rounded-xl p-3 md:p-4 mx-0 md:mx-3 mb-3 tally-card-shadow">
      <div className="mb-3">
        <p className="text-sm font-bold tally-blue-dark flex items-center">
          💡 <span className="ml-2">Try these common questions:</span>
        </p>
      </div>
      
      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* First Row - Horizontal Scroll */}
        <div className="relative mb-3">
          <div 
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2"
            onTouchStart={handleUserInteraction}
            onScroll={handleUserInteraction}
          >
            {MOBILE_PRIORITY_PROMPTS.slice(0, 2).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-16 py-3 px-4 rounded-lg border-2 border-tally-blue bg-gradient-to-r from-white to-tally-blue-light hover:bg-gradient-to-r hover:from-tally-blue-light hover:to-tally-blue hover:text-white hover:border-tally-blue-dark text-gray-700 text-center flex items-center justify-center leading-tight transition-all duration-200 tally-card-shadow font-medium whitespace-nowrap min-w-[280px]"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 150}ms both`
                }}
                onClick={() => onSelectPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
        
        {/* Second Row */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
          {MOBILE_PRIORITY_PROMPTS.slice(2, 4).map((prompt, index) => (
            <Button
              key={index + 2}
              variant="outline"
              size="sm"
              className="text-xs h-16 py-3 px-4 rounded-lg border-2 border-tally-blue bg-gradient-to-r from-white to-tally-blue-light hover:bg-gradient-to-r hover:from-tally-blue-light hover:to-tally-blue hover:text-white hover:border-tally-blue-dark text-gray-700 text-center flex items-center justify-center leading-tight transition-all duration-200 tally-card-shadow font-medium whitespace-nowrap min-w-[280px]"
              style={{
                animation: `fadeInUp 0.6s ease-out ${(index + 2) * 150}ms both`
              }}
              onClick={() => onSelectPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
        
        {/* More Prompts */}
        {ADDITIONAL_PROMPTS.length > 0 && (
          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-tally-blue hover:text-tally-blue-dark transition-all duration-200"
              style={{
                animation: 'fadeInUp 0.6s ease-out 600ms both'
              }}
              onClick={() => setShowAllPrompts(!showAllPrompts)}
            >
              {showAllPrompts ? '⋯ Show less' : '⋯ More prompts'}
            </Button>
            
            {showAllPrompts && (
              <div className="grid grid-cols-1 gap-2 mt-3">
                {ADDITIONAL_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index + 4}
                    variant="outline"
                    size="sm"
                    className="text-xs h-16 py-3 px-4 rounded-lg border-2 border-tally-blue bg-gradient-to-r from-white to-tally-blue-light hover:bg-gradient-to-r hover:from-tally-blue-light hover:to-tally-blue hover:text-white hover:border-tally-blue-dark text-gray-700 text-center flex items-center justify-center leading-tight transition-all duration-200 tally-card-shadow font-medium"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
                    }}
                    onClick={() => onSelectPrompt(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-16 py-3 px-4 rounded-lg border-2 border-tally-blue bg-gradient-to-r from-white to-tally-blue-light hover:bg-gradient-to-r hover:from-tally-blue-light hover:to-tally-blue hover:text-white hover:border-tally-blue-dark text-gray-700 text-center flex items-center justify-center leading-tight transition-all duration-200 tally-card-shadow font-medium"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`
              }}
              onClick={() => onSelectPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
