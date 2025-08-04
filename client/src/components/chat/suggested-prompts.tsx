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
    <div className="px-3 pb-3">
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs h-auto py-1.5 px-3 rounded-full border-gray-200 bg-white hover:bg-gray-50 text-gray-700 whitespace-normal text-left"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
