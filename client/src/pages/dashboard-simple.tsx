import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DEFAULT_USER_ID = "user-1";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    meta: { queryParams: { userId: DEFAULT_USER_ID } },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-chitty-dark text-white flex items-center justify-center">
        <div className="animate-pulse text-chitty-blue">
          <div className="text-4xl mb-4">🧠</div>
          <div>Loading ChittyData...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chitty-dark text-white">
      <header className="bg-chitty-surface border-b border-chitty-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-chitty-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">ChittyData</h1>
              <p className="text-sm text-gray-400">AI Activity Intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-chitty-success rounded-full animate-pulse"></div>
            <span className="text-chitty-success text-sm">Live</span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-chitty-surface border-chitty-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Agents</p>
                  <p className="text-2xl font-bold text-chitty-success">
                    {stats?.activeAgents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-chitty-blue rounded-lg flex items-center justify-center">
                  <span className="text-white">🤖</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chitty-surface border-chitty-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Agents</p>
                  <p className="text-2xl font-bold">
                    {stats?.totalAgents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-chitty-success rounded-lg flex items-center justify-center">
                  <span className="text-white">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chitty-surface border-chitty-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Health</p>
                  <p className="text-2xl font-bold text-chitty-success">
                    {stats?.systemHealth || '0'}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-chitty-warning rounded-lg flex items-center justify-center">
                  <span className="text-white">❤️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-chitty-surface border-chitty-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Integrations</p>
                  <p className="text-2xl font-bold text-chitty-blue">
                    {stats?.connectedIntegrations || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-chitty-error rounded-lg flex items-center justify-center">
                  <span className="text-white">🔗</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Assistant */}
          <Card className="bg-chitty-surface border-chitty-border">
            <CardHeader className="border-b border-chitty-border">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-chitty-blue to-chitty-success rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🧠</span>
                </div>
                <span>Chief Data Officer</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-chitty-dark rounded-lg p-4">
                  <p className="text-sm mb-3">
                    Welcome to ChittyData! I'm analyzing your AI ecosystem and have identified several optimization opportunities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-chitty-blue/20 text-chitty-blue">
                      📊 Performance metrics
                    </Badge>
                    <Badge variant="secondary" className="bg-chitty-success/20 text-chitty-success">
                      🔍 Agent insights
                    </Badge>
                    <Badge variant="secondary" className="bg-chitty-warning/20 text-chitty-warning">
                      ⚡ Optimization tips
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <input 
                    type="text" 
                    placeholder="Ask anything about your AI ecosystem..."
                    className="flex-1 bg-chitty-dark border border-chitty-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-chitty-blue"
                  />
                  <Button className="bg-chitty-blue hover:bg-chitty-blue/80 text-white">
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Types Distribution */}
          <Card className="bg-chitty-surface border-chitty-border">
            <CardHeader className="border-b border-chitty-border">
              <CardTitle>Agent Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {stats?.agentsByType && Object.entries(stats.agentsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-chitty-blue rounded-full"></div>
                      <span className="capitalize">{type}s</span>
                    </div>
                    <Badge variant="secondary" className="bg-chitty-border text-white">
                      {count as number}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-chitty-blue rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="text-xl font-bold">ChittyData</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Powered by Chitty Corp LLC • Your AI Learns Everything You Know
          </p>
          <p className="text-xs text-gray-500">
            🚀 NEVER SH*TTY™ • Enterprise-Grade AI Intelligence
          </p>
        </div>
      </main>
    </div>
  );
}