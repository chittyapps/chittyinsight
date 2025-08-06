import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DEFAULT_USER_ID = "user-1";

export function Sidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fas fa-tachometer-alt",
      href: "/dashboard",
    },
    {
      id: "agents",
      label: "AI Agents",
      icon: "fas fa-project-diagram",
      href: "/agents",
      badge: stats?.agentsByType ? Object.values(stats.agentsByType).reduce((a, b) => a + b, 0) : 12,
    },
    {
      id: "orchestrators",
      label: "Orchestrators", 
      icon: "fas fa-cogs",
      href: "/orchestrators",
      badge: stats?.agentsByType?.orchestrators || 5,
    },
    {
      id: "workers",
      label: "Workers",
      icon: "fas fa-users",
      href: "/workers", 
      badge: stats?.agentsByType?.workers || 23,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "fas fa-chart-line",
      href: "/analytics",
    },
    {
      id: "security",
      label: "Security",
      icon: "fas fa-shield-alt",
      href: "/security",
    },
  ];

  const quickActions = [
    {
      id: "new-agent",
      label: "New Agent",
      icon: "fas fa-plus",
    },
    {
      id: "export-data",
      label: "Export Data", 
      icon: "fas fa-download",
    },
  ];

  return (
    <aside className="w-64 bg-chitty-surface border-r border-chitty-border hidden lg:block">
      <div className="p-6">
        {/* AI Assistant Status */}
        <div className="mb-6 p-4 bg-chitty-dark rounded-lg border border-chitty-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 gradient-blue-success rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Chief Data Officer</h3>
              <p className="text-xs text-gray-400" data-testid="text-ai-status">Analyzing ecosystem</p>
            </div>
          </div>
          <Progress value={75} className="w-full h-1 bg-chitty-border">
            <div className="h-full bg-chitty-blue rounded-full transition-all duration-300" style={{width: "75%"}} />
          </Progress>
          <p className="text-xs text-gray-400 mt-2">Processing 47 data streams</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start space-x-3 px-3 py-2 rounded-lg transition-colors text-left",
                activeItem === item.id
                  ? "bg-chitty-blue bg-opacity-20 text-chitty-blue"
                  : "text-gray-400 hover:bg-chitty-border"
              )}
              onClick={() => setActiveItem(item.id)}
              data-testid={`nav-${item.id}`}
            >
              <i className={item.icon}></i>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="bg-chitty-border text-white text-xs px-2 py-0.5"
                  data-testid={`badge-${item.id}-count`}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h4>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="w-full justify-start space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-chitty-border transition-colors"
                data-testid={`action-${action.id}`}
              >
                <i className={action.icon}></i>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
