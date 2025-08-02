import { Calculator, Settings, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FaqSearch } from "@/components/sidebar/faq-search";
import { QuickActions } from "@/components/sidebar/quick-actions";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">TallyPrime AI Assistant</h1>
                <p className="text-sm text-gray-500">Your Smart Accounting Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FaqSearch />
            <QuickActions />
          </div>
          
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
