import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AIAssistantChat } from "@/components/dashboard/ai-assistant-chat";
import { SystemOverview } from "@/components/dashboard/system-overview";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PerformanceMetrics } from "@/components/dashboard/performance-metrics";
import { AgentManagementTable } from "@/components/dashboard/agent-management-table";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_USER_ID = "user-1";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chitty-dark text-white flex items-center justify-center">
        <div className="animate-pulse-slow text-chitty-blue">
          <i className="fas fa-brain text-4xl"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chitty-dark text-white font-inter antialiased">
      <NavigationHeader />
      
      <div className="flex h-screen pt-16">
        <Sidebar />
        
        <main className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI Chat and System Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <AIAssistantChat />
              </div>
              <SystemOverview />
            </div>

            {/* Activity Feed and Performance Metrics */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ActivityFeed />
              <PerformanceMetrics />
            </div>

            {/* Agent Management Table */}
            <AgentManagementTable />

            {/* Footer */}
            <div className="chitty-card p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-chitty-blue rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold">ChittyData</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Powered by Chitty Corp LLC • Your AI Learns Everything You Know</p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-chitty-blue transition-colors" data-testid="link-privacy">Privacy</a>
                <a href="#" className="hover:text-chitty-blue transition-colors" data-testid="link-security">Security</a>
                <a href="#" className="hover:text-chitty-blue transition-colors" data-testid="link-support">Support</a>
                <a href="#" className="hover:text-chitty-blue transition-colors" data-testid="link-docs">Documentation</a>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500">
                <span>🚀 NEVER SH*TTY™</span>
                <span>•</span>
                <span>Enterprise-Grade AI Intelligence</span>
              </div>
            </div>
          </div>

          <RightSidebar />
        </main>
      </div>
    </div>
  );
}
