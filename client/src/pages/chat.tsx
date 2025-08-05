import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FaqSearch } from "@/components/sidebar/faq-search";
import { QuickActions } from "@/components/sidebar/quick-actions";
import { TallyLogo } from "@/components/ui/tally-logo";
import { useState } from "react";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 50%, #2E5F8F 100%)'}}>
      {/* TallyPrime Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <TallyLogo size="sm" showText={false} />
              <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">TallyPrime AI Assistant</h1>
              <h1 className="text-base font-semibold text-gray-900 sm:hidden">TallyPrime AI</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <FaqSearch />
                <QuickActions />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-6 lg:grid-cols-4 gap-3 h-[calc(100vh-4rem)]">
          
          {/* Desktop Sidebar */}
          <div className="xl:col-span-1 lg:col-span-1 hidden lg:block overflow-hidden">
            <div className="space-y-4 overflow-y-auto h-full">
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
