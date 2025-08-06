import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, Activity, IdCard } from "lucide-react";

const DEFAULT_USER_ID = "user-1";

export function SystemOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/metrics"],
    queryParams: { type: "health_score", limit: 1 },
  });

  const { data: integrations } = useQuery({
    queryKey: ["/api/integrations"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="chitty-card p-6 animate-pulse">
            <div className="h-4 bg-chitty-border rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-chitty-border rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const healthScore = metrics?.[0]?.value || "94.7";

  return (
    <div className="space-y-6">
      {/* System Health Card */}
      <Card className="chitty-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">System Health</CardTitle>
            <div className="flex items-center space-x-2 chitty-text-success">
              <div className="w-2 h-2 bg-chitty-success rounded-full"></div>
              <span className="text-sm" data-testid="text-system-status">Optimal</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-4xl font-bold chitty-text-success mb-2" data-testid="text-health-score">
            {parseFloat(healthScore).toFixed(1)}
          </div>
          <p className="text-sm text-gray-400">Health Score</p>
          <Progress 
            value={parseFloat(healthScore)} 
            className="w-full h-2 mt-4 bg-chitty-border"
          />
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="chitty-card p-4">
          <CardContent className="p-0">
            <div className="text-2xl font-bold" data-testid="text-active-agents">
              {stats?.activeAgents || 40}
            </div>
            <p className="text-sm text-gray-400">Active Agents</p>
            <div className="text-xs chitty-text-success mt-1">+3 this week</div>
          </CardContent>
        </Card>

        <Card className="chitty-card p-4">
          <CardContent className="p-0">
            <div className="text-2xl font-bold" data-testid="text-data-processed">2.4TB</div>
            <p className="text-sm text-gray-400">Data Processed</p>
            <div className="text-xs chitty-text-success mt-1">+12% vs last week</div>
          </CardContent>
        </Card>

        <Card className="chitty-card p-4">
          <CardContent className="p-0">
            <div className="text-2xl font-bold" data-testid="text-uptime">99.9%</div>
            <p className="text-sm text-gray-400">Uptime</p>
            <div className="text-xs chitty-text-success mt-1">7 days</div>
          </CardContent>
        </Card>

        <Card className="chitty-card p-4">
          <CardContent className="p-0">
            <div className="text-2xl font-bold" data-testid="text-efficiency">87%</div>
            <p className="text-sm text-gray-400">Efficiency</p>
            <div className="text-xs chitty-text-warning mt-1">-2% vs last week</div>
          </CardContent>
        </Card>
      </div>

      {/* ChittyID Integration Status */}
      <Card className="chitty-card">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-chitty-blue rounded-lg flex items-center justify-center">
              <IdCard className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="font-semibold">ChittyID</CardTitle>
              <p className="text-xs text-gray-400">Identity & Access</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Trust Score</span>
              <span className="chitty-text-success" data-testid="text-chittyid-trust-score">847</span>
            </div>
            <div className="flex justify-between">
              <span>Verified Users</span>
              <span data-testid="text-verified-users">23</span>
            </div>
            <div className="flex justify-between">
              <span>Security Level</span>
              <Badge variant="secondary" className="chitty-text-success bg-transparent">
                Bank-Grade
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
