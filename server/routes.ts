import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processUserQuery, generateTallySimulation } from "./services/openai";
import { insertMessageSchema } from "@shared/schema";

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

  // Send message and get AI response
  app.post("/api/messages", async (req, res) => {
    try {
      const { content, type = "text", metadata } = insertMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage({
        content,
        role: "user",
        type: type || "text",
        metadata
      });

      // Search FAQ for relevant answers
      const faqResults = await storage.searchFaq(content);
      
      // Process with OpenAI
      const aiResponse = await processUserQuery(content, faqResults);
      
      // Save AI response
      const assistantMessage = await storage.createMessage({
        content: aiResponse.content,
        role: "assistant",
        type: aiResponse.type,
        metadata: aiResponse.metadata
      });

      res.json({ userMessage, assistantMessage });
    } catch (error) {
      console.error("Message processing error:", error);
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

  const httpServer = createServer(app);
  return httpServer;
}
