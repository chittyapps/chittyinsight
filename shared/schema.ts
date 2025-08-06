import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"), // admin, user, viewer
  chittyIdScore: integer("chitty_id_score").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const aiAgents = pgTable("ai_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // analyzer, processor, generator, orchestrator, worker
  status: text("status").notNull().default("active"), // active, idle, processing, error, paused
  performance: decimal("performance", { precision: 5, scale: 2 }).default("0.00"),
  version: text("version").notNull(),
  description: text("description"),
  configuration: jsonb("configuration").default("{}"),
  userId: varchar("user_id").references(() => users.id),
  lastActive: timestamp("last_active").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").references(() => aiAgents.id),
  type: text("type").notNull(), // processing, completed, warning, error, info
  title: text("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata").default("{}"),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: text("metric_type").notNull(), // health_score, processing_speed, memory_usage, error_rate, latency
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit"), // percentage, requests_per_minute, milliseconds, etc.
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  metadata: jsonb("metadata").default("{}"),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // warning, success, info, error
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  metadata: jsonb("metadata").default("{}"),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const integrations = pgTable("integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // github, google_workspace, cloudflare, neon_db
  status: text("status").notNull().default("connected"), // connected, disconnected, error
  configuration: jsonb("configuration").default("{}"),
  userId: varchar("user_id").references(() => users.id),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAiAgentSchema = createInsertSchema(aiAgents).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  lastSync: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AiAgent = typeof aiAgents.$inferSelect;
export type InsertAiAgent = z.infer<typeof insertAiAgentSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
