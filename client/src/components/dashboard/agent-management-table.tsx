import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  List, 
  Eye, 
  Settings, 
  Pause, 
  Play,
  Brain,
  Database,
  FileText,
  ServerCog,
  Users
} from "lucide-react";

const DEFAULT_USER_ID = "user-1";

interface Agent {
  id: string;
  name: string;
  type: "analyzer" | "processor" | "generator" | "orchestrator" | "worker";
  status: "active" | "idle" | "processing" | "error" | "paused";
  performance: string;
  version: string;
  description?: string;
  lastActive: Date;
  userId: string;
}

const getAgentIcon = (type: string) => {
  switch (type) {
    case "analyzer":
      return <Brain className="h-4 w-4 text-white" />;
    case "processor":
      return <Database className="h-4 w-4 text-white" />;
    case "generator":
      return <FileText className="h-4 w-4 text-white" />;
    case "orchestrator":
      return <ServerCog className="h-4 w-4 text-white" />;
    case "worker":
      return <Users className="h-4 w-4 text-white" />;
    default:
      return <Brain className="h-4 w-4 text-white" />;
  }
};

const getAgentTypeColor = (type: string) => {
  switch (type) {
    case "analyzer":
      return "bg-chitty-blue";
    case "processor":
      return "bg-chitty-success";
    case "generator":
      return "bg-chitty-warning";
    case "orchestrator":
      return "bg-purple-500";
    case "worker":
      return "bg-green-500";
    default:
      return "bg-chitty-blue";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "chitty-text-success";
    case "processing":
      return "chitty-text-warning";
    case "error":
      return "chitty-text-error";
    case "paused":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
};

const getStatusIndicator = (status: string) => {
  switch (status) {
    case "active":
      return <div className="w-2 h-2 bg-chitty-success rounded-full"></div>;
    case "processing":
      return <div className="w-2 h-2 bg-chitty-warning rounded-full animate-pulse"></div>;
    case "error":
      return <div className="w-2 h-2 bg-chitty-error rounded-full"></div>;
    case "paused":
      return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    default:
      return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
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
  
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

export function AgentManagementTable() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const queryClient = useQueryClient();

  const { data: agents, isLoading } = useQuery({
    queryKey: ["/api/agents"],
    queryParams: { userId: DEFAULT_USER_ID },
  });

  const pauseAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      return apiRequest("PUT", `/api/agents/${agentId}`, {
        status: "paused"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
    },
  });

  const resumeAgentMutation = useMutation({
    mutationFn: async (agentId: string) => {
      return apiRequest("PUT", `/api/agents/${agentId}`, {
        status: "active"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
    },
  });

  const handleToggleAgent = async (agent: Agent) => {
    if (agent.status === "paused") {
      await resumeAgentMutation.mutateAsync(agent.id);
    } else {
      await pauseAgentMutation.mutateAsync(agent.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="chitty-card">
        <CardHeader className="border-b border-chitty-border">
          <div className="animate-pulse">
            <div className="h-6 bg-chitty-border rounded w-1/3"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-chitty-border rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-chitty-border rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-chitty-border rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-chitty-border rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chitty-card">
      <CardHeader className="border-b border-chitty-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">AI Agents Overview</CardTitle>
          <div className="flex items-center space-x-3">
            <Button
              className="chitty-button-primary"
              data-testid="button-add-agent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg border border-chitty-border hover:bg-chitty-border transition-colors"
              onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              data-testid="button-toggle-view"
            >
              <List className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-chitty-dark border-b border-chitty-border hover:bg-chitty-dark">
                <TableHead className="text-left p-4 text-sm font-medium text-gray-400">Agent</TableHead>
                <TableHead className="text-left p-4 text-sm font-medium text-gray-400">Status</TableHead>
                <TableHead className="text-left p-4 text-sm font-medium text-gray-400">Type</TableHead>
                <TableHead className="text-left p-4 text-sm font-medium text-gray-400">Performance</TableHead>
                <TableHead className="text-left p-4 text-sm font-medium text-gray-400">Last Active</TableHead>
                <TableHead className="text-left p-4 text-sm font-medium text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents?.map((agent: Agent) => (
                <TableRow 
                  key={agent.id} 
                  className="hover:bg-chitty-dark transition-colors border-b border-chitty-border"
                  data-testid={`agent-row-${agent.id}`}
                >
                  <TableCell className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", getAgentTypeColor(agent.type))}>
                        {getAgentIcon(agent.type)}
                      </div>
                      <div>
                        <p className="font-medium" data-testid={`agent-name-${agent.id}`}>
                          {agent.name}
                        </p>
                        <p className="text-xs text-gray-400" data-testid={`agent-id-${agent.id}`}>
                          ID: {agent.id.slice(0, 12)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIndicator(agent.status)}
                      <span className={cn("text-sm", getStatusColor(agent.status))} data-testid={`agent-status-${agent.id}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge 
                      variant="secondary"
                      className={cn("text-xs text-white bg-opacity-20", getAgentTypeColor(agent.type))}
                      data-testid={`agent-type-${agent.id}`}
                    >
                      {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={parseFloat(agent.performance)} 
                        className="w-16 h-1 bg-chitty-border"
                      />
                      <span 
                        className={cn("text-sm", 
                          parseFloat(agent.performance) > 80 
                            ? "chitty-text-success" 
                            : parseFloat(agent.performance) > 60 
                            ? "chitty-text-warning" 
                            : "chitty-text-error"
                        )}
                        data-testid={`agent-performance-${agent.id}`}
                      >
                        {agent.performance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="text-sm text-gray-400" data-testid={`agent-last-active-${agent.id}`}>
                      {formatTimeAgo(agent.lastActive)}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-chitty-border rounded transition-colors"
                        data-testid={`button-view-agent-${agent.id}`}
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-chitty-border rounded transition-colors"
                        data-testid={`button-configure-agent-${agent.id}`}
                      >
                        <Settings className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 hover:bg-chitty-border rounded transition-colors"
                        onClick={() => handleToggleAgent(agent)}
                        disabled={pauseAgentMutation.isPending || resumeAgentMutation.isPending}
                        data-testid={`button-toggle-agent-${agent.id}`}
                      >
                        {agent.status === "paused" ? (
                          <Play className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Pause className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!agents?.length && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No AI agents found</p>
              <p className="text-gray-500 text-sm mt-2">Create your first agent to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
