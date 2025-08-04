import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  role: varchar("role", { enum: ["user", "assistant"] }).notNull(),
  type: varchar("type", { enum: ["text", "faq", "simulation", "error"] }).default("text"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category").notNull(),
  keywords: text("keywords").array(),
  steps: jsonb("steps"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client request schema (without role - server sets it)
export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,  
  role: true,  // Remove role from validation since server sets it
});

// Full message schema for storage operations
export const createMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  createdAt: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type CreateMessage = z.infer<typeof createMessageSchema>;
export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;

// Chat response types
export type ChatResponse = {
  content: string;
  type: "text" | "faq" | "simulation" | "error";
  metadata?: {
    steps?: Array<{ step: number; description: string }>;
    simulation?: string;
    faqMatch?: boolean;
    confidence?: number;
  };
};

// Memory and Personalization types
export interface UserProfile {
  id: string;
  name?: string;
  company?: string;
  industry?: string;
  tallyVersion?: string;
  preferredLanguage: 'english' | 'hindi';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  commonTopics: string[];
  lastActive: Date;
  createdAt: Date;
}

export interface UserPreferences {
  userId: string;
  responseStyle: 'concise' | 'detailed' | 'step-by-step';
  showSteps: boolean;
  includeExamples: boolean;
  rememberContext: boolean;
  notificationPreferences: {
    newFeatures: boolean;
    tips: boolean;
    updates: boolean;
  };
  favoriteTopics: string[];
  blockedTopics: string[];
}

export interface SessionInfo {
  sessionId: string;
  userId?: string;
  createdAt: Date;
}

// API request/response types for memory features
export interface CreateUserProfileRequest {
  name?: string;
  company?: string;
  industry?: string;
  tallyVersion?: string;
  preferredLanguage?: 'english' | 'hindi';
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface UpdateUserPreferencesRequest {
  responseStyle?: 'concise' | 'detailed' | 'step-by-step';
  showSteps?: boolean;
  includeExamples?: boolean;
  rememberContext?: boolean;
  notificationPreferences?: {
    newFeatures?: boolean;
    tips?: boolean;
    updates?: boolean;
  };
  favoriteTopics?: string[];
  blockedTopics?: string[];
}
