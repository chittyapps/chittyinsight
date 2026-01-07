import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function PerformanceMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/metrics"],
    queryParams: { limit: 50 },
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryParams: { userId: "user-1" },
  });

  if (isLoading) {
    return (
      <Card className="chitty-card">
        <CardHeader className="border-b border-chitty-border">
          <div className="animate-pulse">
            <div className="h-6 bg-chitty-border rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-chitty-border rounded w-1/3"></div>
                  <div className="h-4 bg-chitty-border rounded w-1/4"></div>
                </div>
                <div className="h-2 bg-chitty-border rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceData = [
    {
      name: "Processing Speed",
      value: "1,247 req/min",
      percentage: 87,
      trend: "up",
      color: "chitty-success",
    },
    {
      name: "Memory Usage",
      value: "74.2%",
      percentage: 74.2,
      trend: "stable",
      color: "chitty-warning",
    },
    {
      name: "Error Rate",
      value: "0.03%",
      percentage: 3,
      trend: "down",
      color: "chitty-success",
    },
    {
      name: "Network Latency",
      value: "12ms",
      percentage: 92,
      trend: "up",
      color: "chitty-success",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-chitty-success" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-chitty-error" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getProgressColor = (color: string) => {
    return color === "chitty-success"
      ? "bg-chitty-success"
      : color === "chitty-warning"
      ? "bg-chitty-warning"
      : "bg-chitty-blue";
  };

  return (
    <Card className="chitty-card">
      <CardHeader className="border-b border-chitty-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Performance Metrics</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-sm text-chitty-blue hover:underline"
            data-testid="button-view-detailed-metrics"
          >
            View Details
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {performanceData.map((metric, index) => (
          <div key={metric.name} data-testid={`metric-${index}`}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metric.name}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <span 
                className={`text-sm ${
                  metric.color === "chitty-success"
                    ? "chitty-text-success"
                    : metric.color === "chitty-warning"
                    ? "chitty-text-warning"
                    : "text-white"
                }`}
                data-testid={`metric-value-${index}`}
              >
                {metric.value}
              </span>
            </div>
            <Progress 
              value={metric.percentage} 
              className={`w-full h-2 bg-chitty-border`}
            />
          </div>
        ))}

        {/* Agent Distribution */}
        <div className="bg-chitty-dark rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium mb-3">Agent Distribution</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-chitty-blue" data-testid="text-agents-active">
                {stats?.activeAgents || 12}
              </div>
              <p className="text-xs text-gray-400">Active</p>
            </div>
            <div>
              <div className="text-lg font-bold chitty-text-warning" data-testid="text-agents-idle">
                5
              </div>
              <p className="text-xs text-gray-400">Idle</p>
            </div>
            <div>
              <div className="text-lg font-bold chitty-text-success" data-testid="text-agents-optimized">
                23
              </div>
              <p className="text-xs text-gray-400">Optimized</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
