import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Download,
  Shield,
  Users,
  Settings,
  ChevronRight,
  Github,
  Cloud,
  Database
} from "lucide-react";

const DEFAULT_USER_ID = "user-1";

interface Notification {
  id: string;
  type: "warning" | "success" | "info" | "error";
  title: string;
  message: string;
  isRead: boolean;
  timestamp: Date;
}

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-4 w-4 text-chitty-success" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-chitty-warning" />;
    case "error":
      return <AlertTriangle className="h-4 w-4 text-chitty-error" />;
    default:
      return <Info className="h-4 w-4 text-chitty-blue" />;
  }
};

const getBorderColor = (type: string) => {
  switch (type) {
    case "success":
      return "border-l-chitty-success";
    case "warning":
      return "border-l-chitty-warning";
    case "error":
      return "border-l-chitty-error";
    default:
      return "border-l-chitty-blue";
  }
};

const getIntegrationIcon = (type: string) => {
  switch (type) {
    case "github":
      return <Github className="h-4 w-4 text-gray-400" />;
    case "google_workspace":
      return <i className="fab fa-google text-gray-400"></i>;
    case "cloudflare":
      return <Cloud className="h-4 w-4 text-gray-400" />;
    case "neon_db":
      return <Database className="h-4 w-4 text-gray-400" />;
    default:
      return <Settings className="h-4 w-4 text-gray-400" />;
  }
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes === 0) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  
  return "Earlier";
};

export function RightSidebar() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/notifications"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  const { data: integrations, isLoading: integrationsLoading } = useQuery({
    queryKey: ["/api/integrations"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", "/api/notifications/mark-all-read", {
        userId: DEFAULT_USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const quickActions = [
    {
      id: "export-report",
      label: "Export Report",
      icon: <Download className="h-4 w-4 text-chitty-blue" />,
    },
    {
      id: "schedule-backup",
      label: "Schedule Backup",
      icon: <Shield className="h-4 w-4 text-chitty-success" />,
    },
    {
      id: "manage-users",
      label: "Manage Users",
      icon: <Users className="h-4 w-4 text-chitty-warning" />,
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: <Settings className="h-4 w-4 text-gray-400" />,
    },
  ];

  return (
    <aside className="w-80 bg-chitty-surface border-l border-chitty-border p-6 hidden xl:block overflow-y-auto">
      {/* Notifications Panel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-chitty-blue hover:underline"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            data-testid="button-mark-all-read"
          >
            Mark all read
          </Button>
        </div>

        <ScrollArea className="h-64">
          {notificationsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-3 bg-chitty-dark rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-4 h-4 bg-chitty-border rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-chitty-border rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-chitty-border rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {notifications?.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 bg-chitty-dark rounded-lg border-l-4",
                    getBorderColor(notification.type),
                    !notification.isRead && "bg-opacity-80"
                  )}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium" data-testid={`notification-title-${notification.id}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1" data-testid={`notification-message-${notification.id}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500" data-testid={`notification-time-${notification.id}`}>
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {!notifications?.length && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">All caught up!</p>
                  <p className="text-xs text-gray-500 mt-1">No new notifications</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Integration Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Integrations</h3>
        
        {integrationsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-chitty-dark rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-chitty-border rounded"></div>
                  <div className="h-4 bg-chitty-border rounded w-20"></div>
                </div>
                <div className="h-4 bg-chitty-border rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {integrations?.map((integration: Integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-3 bg-chitty-dark rounded-lg"
                data-testid={`integration-${integration.id}`}
              >
                <div className="flex items-center space-x-3">
                  {getIntegrationIcon(integration.type)}
                  <span className="text-sm" data-testid={`integration-name-${integration.id}`}>
                    {integration.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className={cn(
                      "w-2 h-2 rounded-full",
                      integration.status === "connected" 
                        ? "bg-chitty-success" 
                        : integration.status === "error"
                        ? "bg-chitty-error"
                        : "bg-gray-400"
                    )}
                  ></div>
                  <span 
                    className={cn(
                      "text-xs",
                      integration.status === "connected" 
                        ? "chitty-text-success" 
                        : integration.status === "error"
                        ? "chitty-text-error"
                        : "text-gray-400"
                    )}
                    data-testid={`integration-status-${integration.id}`}
                  >
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}

            {!integrations?.length && (
              <div className="text-center py-8">
                <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No integrations</p>
                <p className="text-xs text-gray-500 mt-1">Connect your services</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              className="w-full justify-between p-3 bg-chitty-dark rounded-lg hover:bg-chitty-border transition-colors text-left"
              data-testid={`action-${action.id}`}
            >
              <div className="flex items-center space-x-3">
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
