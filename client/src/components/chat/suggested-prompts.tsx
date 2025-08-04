import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  "How do I create a new company in TallyPrime?",
  "Show me how to generate a balance sheet",
  "How to record a payment from a customer?",
  "Generate a sales report for this month",
  "How to set up GST in TallyPrime?",
  "Show me how to create a voucher entry",
  "How to check stock summary?",
  "Generate a profit and loss statement"
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="bg-gradient-to-r from-tally-blue-light via-white to-tally-blue-light border-2 border-tally-blue rounded-xl p-3 md:p-4 mx-0 md:mx-3 mb-3 tally-card-shadow">
      <div className="mb-3">
        <p className="text-sm font-bold tally-blue-dark flex items-center">
          💡 <span className="ml-2">Try these common questions:</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs h-auto py-3 px-4 rounded-lg border-2 border-tally-blue bg-gradient-to-r from-white to-tally-blue-light hover:bg-gradient-to-r hover:from-tally-blue-light hover:to-tally-blue hover:text-white hover:border-tally-blue-dark text-gray-700 whitespace-normal text-left transition-all duration-200 tally-card-shadow font-medium"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
