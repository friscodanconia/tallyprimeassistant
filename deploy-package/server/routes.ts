import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { processUserQuery, generateTallySimulation } from "./services/openai";
import { insertMessageSchema, CreateUserProfileRequest, UpdateUserPreferencesRequest } from "@shared/schema";
import { memoryService } from "./services/memory-service";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get chat messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send chat message
  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid message format" });
      }

      const { sessionId } = req.headers;
      let contextualQuery = result.data.content;

      // If session exists, use memory service for contextual processing
      if (sessionId && typeof sessionId === 'string') {
        try {
          contextualQuery = await memoryService.generateContextualPrompt(sessionId, result.data.content);
          console.log(`🧠 Using contextual query for session: ${sessionId}`);
        } catch (error) {
          console.error('Memory service error, using original query:', error);
        }
      }

      // Save user message
      const userMessage = await storage.createMessage({
        ...result.data,
        role: "user"
      });

      // Update conversation context if session exists
      if (sessionId && typeof sessionId === 'string') {
        await memoryService.updateConversationContext(sessionId, userMessage);
      }

      // Search FAQ for relevant answers using the original user query
      const faqResults = await storage.searchFaq(result.data.content);
      
      // Process with OpenAI using contextual query
      const response = await processUserQuery(contextualQuery, faqResults);
      
      // Save assistant response
      const assistantMessage = await storage.createMessage({
        content: response.content,
        role: "assistant",
        type: response.type,
        metadata: response.metadata
      });

      // Update conversation context with assistant response
      if (sessionId && typeof sessionId === 'string') {
        await memoryService.updateConversationContext(sessionId, assistantMessage);
      }

      res.json(assistantMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Clear chat history
  app.delete("/api/messages", async (req, res) => {
    try {
      await storage.clearMessages();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  // Search FAQ
  app.get("/api/faq/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const results = await storage.searchFaq(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to search FAQ" });
    }
  });

  // Get all FAQ items
  app.get("/api/faq", async (req, res) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQ items" });
    }
  });

  // Generate TallyPrime simulation
  app.post("/api/simulate", async (req, res) => {
    try {
      const { action } = req.body;
      if (!action) {
        return res.status(400).json({ error: "Action is required" });
      }

      const simulation = await generateTallySimulation(action);
      
      // Save simulation as message
      const simulationMessage = await storage.createMessage({
        content: simulation.content,
        role: "assistant",
        type: "simulation",
        metadata: simulation.metadata
      });

      res.json(simulationMessage);
    } catch (error) {
      console.error("Simulation error:", error);
      res.status(500).json({ error: "Failed to generate simulation" });
    }
  });

  // Memory and Personalization Routes
  
  // Create session
  app.post("/api/session", async (req, res) => {
    try {
      const { userId } = req.body;
      const sessionId = await memoryService.createSession(userId);
      res.json({ sessionId, userId });
    } catch (error) {
      console.error("Session creation error:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Create user profile
  app.post("/api/user/profile", async (req, res) => {
    try {
      const profileData: CreateUserProfileRequest = req.body;
      const profile = await memoryService.createUserProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create user profile" });
    }
  });

  // Get user profile
  app.get("/api/user/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const profile = await memoryService.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Update user profile
  app.put("/api/user/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const profile = await memoryService.updateUserProfile(userId, updates);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  // Get user preferences
  app.get("/api/user/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await memoryService.getUserPreferences(userId);
      if (!preferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Preferences fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user preferences" });
    }
  });

  // Update user preferences
  app.put("/api/user/preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates: UpdateUserPreferencesRequest = req.body;
      const preferences = await memoryService.updateUserPreferences(userId, updates);
      if (!preferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      console.error("Preferences update error:", error);
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });

  // Get learning insights
  app.get("/api/user/insights/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const insights = await memoryService.getLearningInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error("Insights fetch error:", error);
      res.status(500).json({ error: "Failed to fetch learning insights" });
    }
  });

  // Get memory statistics
  app.get("/api/memory/stats", async (req, res) => {
    try {
      const stats = memoryService.getMemoryStats();
      res.json(stats);
    } catch (error) {
      console.error("Memory stats error:", error);
      res.status(500).json({ error: "Failed to fetch memory statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
