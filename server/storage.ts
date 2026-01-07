import { 
  type User, 
  type InsertUser,
  type AiAgent,
  type InsertAiAgent,
  type Activity,
  type InsertActivity,
  type SystemMetric,
  type InsertSystemMetric,
  type ChatMessage,
  type InsertChatMessage,
  type Notification,
  type InsertNotification,
  type Integration,
  type InsertIntegration
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // AI Agents
  getAgents(userId: string): Promise<AiAgent[]>;
  getAgent(id: string): Promise<AiAgent | undefined>;
  createAgent(agent: InsertAiAgent): Promise<AiAgent>;
  updateAgent(id: string, updates: Partial<AiAgent>): Promise<AiAgent | undefined>;
  deleteAgent(id: string): Promise<boolean>;
  
  // Activities
  getActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // System Metrics
  getSystemMetrics(type?: string, limit?: number): Promise<SystemMetric[]>;
  createSystemMetric(metric: InsertSystemMetric): Promise<SystemMetric>;
  
  // Chat Messages
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Notifications
  getNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<boolean>;
  markAllNotificationsRead(userId: string): Promise<boolean>;
  
  // Integrations
  getIntegrations(userId: string): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private agents: Map<string, AiAgent> = new Map();
  private activities: Map<string, Activity> = new Map();
  private systemMetrics: Map<string, SystemMetric> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private integrations: Map<string, Integration> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: "user-1",
      username: "admin",
      email: "admin@chitty.cc",
      role: "admin",
      chittyIdScore: 847,
      isVerified: true,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create sample agents
    const agents: AiAgent[] = [
      {
        id: "agent-1",
        name: "Content Analyzer v2.1",
        type: "analyzer",
        status: "active",
        performance: "94.00",
        version: "2.1.0",
        description: "Advanced content analysis and processing",
        configuration: { maxMemory: "4GB", threads: 8 },
        userId: defaultUser.id,
        lastActive: new Date(),
        createdAt: new Date(),
      },
      {
        id: "agent-2",
        name: "Data Processor Alpha",
        type: "processor",
        status: "active",
        performance: "87.00",
        version: "1.5.2",
        description: "High-performance data processing engine",
        configuration: { batchSize: 1000, timeout: 30 },
        userId: defaultUser.id,
        lastActive: new Date(),
        createdAt: new Date(),
      },
      {
        id: "agent-3",
        name: "Report Generator",
        type: "generator",
        status: "processing",
        performance: "76.00",
        version: "3.0.1",
        description: "Automated report generation system",
        configuration: { format: "pdf", templates: 12 },
        userId: defaultUser.id,
        lastActive: new Date(),
        createdAt: new Date(),
      }
    ];
    
    agents.forEach(agent => this.agents.set(agent.id, agent));

    // Create sample activities
    const activities: Activity[] = [
      {
        id: "activity-1",
        agentId: "agent-1",
        type: "completed",
        title: "Data Processor Alpha completed batch analysis",
        description: "Processed 1,247 records in 2.3 seconds",
        metadata: { records: 1247, duration: 2.3 },
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: "activity-2",
        agentId: "agent-3",
        type: "completed",
        title: "Report Generator finished monthly summary",
        description: "Generated 34-page comprehensive report",
        metadata: { pages: 34, format: "pdf" },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: "activity-3",
        agentId: "agent-1",
        type: "warning",
        title: "Content Analyzer requires attention",
        description: "Memory usage at 85% capacity",
        metadata: { memoryUsage: 85, threshold: 80 },
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      }
    ];
    
    activities.forEach(activity => this.activities.set(activity.id, activity));

    // Create sample system metrics
    const metrics: SystemMetric[] = [
      {
        id: "metric-1",
        metricType: "health_score",
        value: "94.70",
        unit: "percentage",
        timestamp: new Date(),
      },
      {
        id: "metric-2",
        metricType: "processing_speed",
        value: "1247.00",
        unit: "requests_per_minute",
        timestamp: new Date(),
      },
      {
        id: "metric-3",
        metricType: "memory_usage",
        value: "74.20",
        unit: "percentage",
        timestamp: new Date(),
      }
    ];
    
    metrics.forEach(metric => this.systemMetrics.set(metric.id, metric));

    // Create sample notifications
    const notifications: Notification[] = [
      {
        id: "notif-1",
        userId: defaultUser.id,
        type: "warning",
        title: "Memory Warning",
        message: "Content Analyzer approaching memory limit",
        isRead: false,
        metadata: { agent: "agent-1", level: "warning" },
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: "notif-2",
        userId: defaultUser.id,
        type: "success",
        title: "Batch Processing Complete",
        message: "Monthly reports generated successfully",
        isRead: false,
        metadata: { reportCount: 12 },
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
      }
    ];
    
    notifications.forEach(notif => this.notifications.set(notif.id, notif));

    // Create sample integrations
    const integrations: Integration[] = [
      {
        id: "integration-1",
        name: "GitHub",
        type: "github",
        status: "connected",
        configuration: { repos: ["chitty-corp/main"], webhook: true },
        userId: defaultUser.id,
        lastSync: new Date(),
        createdAt: new Date(),
      },
      {
        id: "integration-2",
        name: "Google Workspace",
        type: "google_workspace",
        status: "connected",
        configuration: { domain: "chitty.cc", syncCalendar: true },
        userId: defaultUser.id,
        lastSync: new Date(),
        createdAt: new Date(),
      }
    ];
    
    integrations.forEach(integration => this.integrations.set(integration.id, integration));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || "user",
      chittyIdScore: insertUser.chittyIdScore || 0,
      isVerified: insertUser.isVerified || false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // AI Agent methods
  async getAgents(userId: string): Promise<AiAgent[]> {
    return Array.from(this.agents.values()).filter(agent => agent.userId === userId);
  }

  async getAgent(id: string): Promise<AiAgent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAiAgent): Promise<AiAgent> {
    const id = randomUUID();
    const agent: AiAgent = { 
      ...insertAgent, 
      id, 
      createdAt: new Date(),
      lastActive: new Date(),
      status: insertAgent.status || "active",
      description: insertAgent.description || null,
      userId: insertAgent.userId || null,
      performance: insertAgent.performance || "0.00",
      configuration: insertAgent.configuration || {}
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, updates: Partial<AiAgent>): Promise<AiAgent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updates, lastActive: new Date() };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Activity methods
  async getActivities(userId: string, limit: number = 50): Promise<Activity[]> {
    const userAgents = await this.getAgents(userId);
    const agentIds = userAgents.map(agent => agent.id);
    
    return Array.from(this.activities.values())
      .filter(activity => activity.agentId && agentIds.includes(activity.agentId))
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      timestamp: new Date(),
      metadata: insertActivity.metadata || {},
      description: insertActivity.description || null,
      agentId: insertActivity.agentId || null
    };
    this.activities.set(id, activity);
    return activity;
  }

  // System Metrics methods
  async getSystemMetrics(type?: string, limit: number = 100): Promise<SystemMetric[]> {
    let metrics = Array.from(this.systemMetrics.values());
    
    if (type) {
      metrics = metrics.filter(metric => metric.metricType === type);
    }
    
    return metrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createSystemMetric(insertMetric: InsertSystemMetric): Promise<SystemMetric> {
    const id = randomUUID();
    const metric: SystemMetric = { 
      ...insertMetric, 
      id, 
      timestamp: new Date(),
      metadata: insertMetric.metadata || {}
    };
    this.systemMetrics.set(id, metric);
    return metric;
  }

  // Chat Message methods
  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Notification methods
  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId && (!unreadOnly || !notif.isRead))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      timestamp: new Date() 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  async markAllNotificationsRead(userId: string): Promise<boolean> {
    const userNotifications = Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId);
    
    userNotifications.forEach(notif => {
      notif.isRead = true;
      this.notifications.set(notif.id, notif);
    });
    
    return true;
  }

  // Integration methods
  async getIntegrations(userId: string): Promise<Integration[]> {
    return Array.from(this.integrations.values())
      .filter(integration => integration.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = randomUUID();
    const integration: Integration = { 
      ...insertIntegration, 
      id, 
      createdAt: new Date() 
    };
    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration | undefined> {
    const integration = this.integrations.get(id);
    if (!integration) return undefined;
    
    const updatedIntegration = { ...integration, ...updates, lastSync: new Date() };
    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }
}

export const storage = new MemStorage();
