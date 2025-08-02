import { Calculator, Settings, HelpCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FaqSearch } from "@/components/sidebar/faq-search";
import { QuickActions } from "@/components/sidebar/quick-actions";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="text-white h-4 w-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TallyPrime AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-3 w-3" />
              </Button>
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-6 lg:grid-cols-4 gap-3 h-[calc(100vh-4rem)]">
          
          {/* Compact Sidebar */}
          <div className="xl:col-span-1 lg:col-span-1 hidden lg:block overflow-hidden">
            <div className="space-y-2 overflow-y-auto h-full">
              <FaqSearch />
              <QuickActions />
            </div>
          </div>
          
          {/* Chat Interface - Maximum space */}
          <div className="xl:col-span-5 lg:col-span-3 col-span-1 min-w-0">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
