import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Send, Bot } from "lucide-react";

const DEFAULT_USER_ID = "user-1";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: any;
}

export function AIAssistantChat() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/chat"],
    queryParams: { userId: DEFAULT_USER_ID, limit: 20 },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/chat", {
        userId: DEFAULT_USER_ID,
        role: "user",
        content,
        metadata: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
      setMessage("");
    },
  });

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await sendMessageMutation.mutateAsync(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedQuestions = [
    "📊 Performance metrics",
    "🔍 Agent insights", 
    "⚡ Optimization tips",
  ];

  return (
    <div className="chitty-card">
      <div className="p-6 border-b border-chitty-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-blue-success rounded-full flex items-center justify-center">
              <Bot className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Chief Data Officer</h2>
              <p className="text-sm text-gray-400">Your AI reporting and data storytelling lead</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm chitty-text-success">
            <div className="w-2 h-2 bg-chitty-success rounded-full animate-pulse"></div>
            <span data-testid="text-assistant-status">Active</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 h-96 overflow-y-auto space-y-4" data-testid="chat-messages-container">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse-slow text-chitty-blue">
              <Bot className="h-8 w-8" />
            </div>
          </div>
        ) : (
          <>
            {/* Initial AI greeting */}
            <div className="flex space-x-3 animate-fade-in">
              <div className="w-8 h-8 gradient-blue-success rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <div className="bg-chitty-dark rounded-lg p-4 max-w-md">
                  <p className="text-sm">
                    Welcome! I'm analyzing your ecosystem and I've identified some interesting patterns. 
                    What would you like to explore first?
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="px-3 py-1 bg-chitty-blue bg-opacity-20 text-chitty-blue rounded-full text-xs hover:bg-opacity-30 transition-colors"
                        onClick={() => setMessage(question)}
                        data-testid={`button-suggestion-${index}`}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-1">2 minutes ago</span>
              </div>
            </div>

            {/* Chat messages */}
            {messages?.map((msg: ChatMessage, index: number) => (
              <div
                key={msg.id}
                className={cn(
                  "flex space-x-3",
                  msg.role === "user" ? "justify-end" : "",
                  "animate-slide-in"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 gradient-blue-success rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-white text-xs" />
                  </div>
                )}
                
                <div className={cn("flex-1", msg.role === "user" ? "max-w-md ml-auto" : "max-w-md")}>
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      msg.role === "user"
                        ? "bg-chitty-blue text-white ml-auto"
                        : "bg-chitty-dark"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className={cn("text-xs text-gray-400 mt-1 block", msg.role === "user" ? "text-right" : "")}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-chitty-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">JD</span>
                  </div>
                )}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-6 border-t border-chitty-border">
        <div className="flex space-x-3">
          <Input
            type="text"
            placeholder="Ask anything about your AI ecosystem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 chitty-input"
            disabled={sendMessageMutation.isPending}
            data-testid="input-chat-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="chitty-button-primary"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
