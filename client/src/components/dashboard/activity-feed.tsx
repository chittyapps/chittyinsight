import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useWebSocket } from "@/hooks/use-websocket";
import { Activity, CheckCircle, AlertTriangle, Cog, UserPlus, Shield } from "lucide-react";

const DEFAULT_USER_ID = "user-1";

interface ActivityItem {
  id: string;
  agentId?: string;
  type: "processing" | "completed" | "warning" | "error" | "info";
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: any;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-white" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-white" />;
    case "processing":
      return <Cog className="h-4 w-4 text-white animate-spin" />;
    case "info":
      return <Activity className="h-4 w-4 text-white" />;
    default:
      return <Activity className="h-4 w-4 text-white" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "completed":
      return "bg-chitty-success";
    case "warning":
      return "bg-chitty-warning";
    case "processing":
      return "bg-chitty-blue";
    case "error":
      return "bg-chitty-error";
    default:
      return "bg-chitty-blue";
  }
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes === 0) return "Just now";
  if (minutes === 1) return "1m ago";
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1h ago";
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
    queryParams: { userId: DEFAULT_USER_ID, limit: 20 },
  });

  // WebSocket for real-time activity updates
  useWebSocket({
    onMessage: (message) => {
      if (message.type === "activity_update") {
        // Handle real-time activity updates
        console.log("New activity:", message.data);
      }
    },
  });

  return (
    <Card className="chitty-card">
      <CardHeader className="border-b border-chitty-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Live Activity</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-chitty-success rounded-full animate-pulse"></div>
            <span className="text-sm chitty-text-success" data-testid="text-activity-status">Real-time</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-80 p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3 p-3 bg-chitty-dark rounded-lg">
                  <div className="w-8 h-8 bg-chitty-border rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-chitty-border rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-chitty-border rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {activities?.map((activity: ActivityItem) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 p-3 bg-chitty-dark rounded-lg animate-slide-in hover:bg-opacity-80 transition-colors"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", getActivityColor(activity.type))}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" data-testid={`activity-title-${activity.id}`}>
                      {activity.title}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-gray-400" data-testid={`activity-description-${activity.id}`}>
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400" data-testid={`activity-time-${activity.id}`}>
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              ))}

              {!activities?.length && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
