import { randomUUID } from 'crypto';
import { Message } from '@shared/schema';

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

export interface ConversationContext {
  sessionId: string;
  userId: string;
  messages: Message[];
  currentTopic?: string;
  relatedTopics: string[];
  userIntent?: 'learning' | 'troubleshooting' | 'setup' | 'reporting';
  contextSummary?: string;
  lastUpdated: Date;
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

export interface LearningInsight {
  userId: string;
  topic: string;
  frequency: number;
  lastAsked: Date;
  successfulResolutions: number;
  commonFollowUps: string[];
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

export class MemoryService {
  private userProfiles: Map<string, UserProfile> = new Map();
  private conversationContexts: Map<string, ConversationContext> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();
  private learningInsights: Map<string, LearningInsight[]> = new Map();
  private sessionUserMap: Map<string, string> = new Map();

  // User Profile Management
  async createUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const profile: UserProfile = {
      id: data.id || randomUUID(),
      name: data.name,
      company: data.company,
      industry: data.industry,
      tallyVersion: data.tallyVersion,
      preferredLanguage: data.preferredLanguage || 'english',
      experienceLevel: data.experienceLevel || 'beginner',
      commonTopics: data.commonTopics || [],
      lastActive: new Date(),
      createdAt: new Date()
    };

    this.userProfiles.set(profile.id, profile);
    
    // Initialize default preferences
    await this.initializeUserPreferences(profile.id);
    
    console.log(`👤 Created user profile: ${profile.id} (${profile.experienceLevel})`);
    return profile;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return null;

    const updatedProfile = { ...profile, ...updates, lastActive: new Date() };
    this.userProfiles.set(userId, updatedProfile);
    
    console.log(`👤 Updated user profile: ${userId}`);
    return updatedProfile;
  }

  // Conversation Context Management
  async createConversationContext(sessionId: string, userId: string): Promise<ConversationContext> {
    const context: ConversationContext = {
      sessionId,
      userId,
      messages: [],
      relatedTopics: [],
      lastUpdated: new Date()
    };

    this.conversationContexts.set(sessionId, context);
    this.sessionUserMap.set(sessionId, userId);
    
    console.log(`💬 Created conversation context: ${sessionId} for user ${userId}`);
    return context;
  }

  async getConversationContext(sessionId: string): Promise<ConversationContext | null> {
    return this.conversationContexts.get(sessionId) || null;
  }

  async updateConversationContext(sessionId: string, message: Message): Promise<void> {
    const context = this.conversationContexts.get(sessionId);
    if (!context) return;

    // Add message to context
    context.messages.push(message);
    
    // Keep only last 20 messages for performance
    if (context.messages.length > 20) {
      context.messages = context.messages.slice(-20);
    }

    // Extract and update topic information
    await this.updateTopicContext(context, message);
    
    // Update user learning insights
    const userId = this.sessionUserMap.get(sessionId);
    if (userId && message.role === 'user') {
      await this.updateLearningInsights(userId, message.content);
    }

    context.lastUpdated = new Date();
    console.log(`💬 Updated conversation context: ${sessionId} (${context.messages.length} messages)`);
  }

  private async updateTopicContext(context: ConversationContext, message: Message): Promise<void> {
    if (message.role !== 'user') return;

    // Extract topics from message content
    const topics = this.extractTopicsFromMessage(message.content);
    
    // Update current topic based on latest message
    if (topics.length > 0) {
      context.currentTopic = topics[0];
    }

    // Add to related topics
    for (const topic of topics) {
      if (!context.relatedTopics.includes(topic)) {
        context.relatedTopics.push(topic);
      }
    }

    // Keep only last 10 related topics
    if (context.relatedTopics.length > 10) {
      context.relatedTopics = context.relatedTopics.slice(-10);
    }

    // Determine user intent
    context.userIntent = this.determineUserIntent(message.content);
  }

  private extractTopicsFromMessage(content: string): string[] {
    const topics: string[] = [];
    const contentLower = content.toLowerCase();

    // TallyPrime topic keywords
    const topicMap = {
      'gst': ['gst', 'tax', 'return', 'gstr', 'filing'],
      'voucher': ['voucher', 'entry', 'transaction', 'record'],
      'inventory': ['inventory', 'stock', 'item', 'product'],
      'payroll': ['payroll', 'salary', 'employee', 'wages'],
      'reports': ['report', 'analysis', 'statement', 'summary'],
      'company': ['company', 'organization', 'business'],
      'banking': ['bank', 'reconciliation', 'payment', 'receipt'],
      'installation': ['install', 'setup', 'configure', 'upgrade']
    };

    for (const [topic, keywords] of Object.entries(topicMap)) {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  private determineUserIntent(content: string): 'learning' | 'troubleshooting' | 'setup' | 'reporting' {
    const contentLower = content.toLowerCase();

    if (contentLower.includes('how to') || contentLower.includes('learn') || contentLower.includes('tutorial')) {
      return 'learning';
    }
    if (contentLower.includes('error') || contentLower.includes('problem') || contentLower.includes('not working')) {
      return 'troubleshooting';
    }
    if (contentLower.includes('setup') || contentLower.includes('configure') || contentLower.includes('install')) {
      return 'setup';
    }
    if (contentLower.includes('report') || contentLower.includes('analysis') || contentLower.includes('summary')) {
      return 'reporting';
    }

    return 'learning'; // Default
  }

  // User Preferences Management
  private async initializeUserPreferences(userId: string): Promise<void> {
    const preferences: UserPreferences = {
      userId,
      responseStyle: 'detailed',
      showSteps: true,
      includeExamples: true,
      rememberContext: true,
      notificationPreferences: {
        newFeatures: true,
        tips: true,
        updates: true
      },
      favoriteTopics: [],
      blockedTopics: []
    };

    this.userPreferences.set(userId, preferences);
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    return this.userPreferences.get(userId) || null;
  }

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) return null;

    const updatedPreferences = { ...preferences, ...updates };
    this.userPreferences.set(userId, updatedPreferences);
    
    console.log(`⚙️ Updated user preferences: ${userId}`);
    return updatedPreferences;
  }

  // Learning Insights Management
  private async updateLearningInsights(userId: string, query: string): Promise<void> {
    const topics = this.extractTopicsFromMessage(query);
    const userInsights = this.learningInsights.get(userId) || [];

    for (const topic of topics) {
      let insight = userInsights.find(i => i.topic === topic);
      
      if (insight) {
        insight.frequency++;
        insight.lastAsked = new Date();
      } else {
        insight = {
          userId,
          topic,
          frequency: 1,
          lastAsked: new Date(),
          successfulResolutions: 0,
          commonFollowUps: [],
          difficultyLevel: 'medium'
        };
        userInsights.push(insight);
      }
    }

    this.learningInsights.set(userId, userInsights);
  }

  async getLearningInsights(userId: string): Promise<LearningInsight[]> {
    return this.learningInsights.get(userId) || [];
  }

  // Context-Aware Response Generation
  async generateContextualPrompt(sessionId: string, userQuery: string): Promise<string> {
    const context = await this.getConversationContext(sessionId);
    const userId = this.sessionUserMap.get(sessionId);
    
    if (!context || !userId) {
      return userQuery; // Return original query if no context
    }

    const profile = await this.getUserProfile(userId);
    const preferences = await this.getUserPreferences(userId);
    const insights = await this.getLearningInsights(userId);

    // Build contextual prompt
    let contextualPrompt = `User Query: ${userQuery}\n\n`;

    // Add user profile context
    if (profile) {
      contextualPrompt += `User Profile:\n`;
      contextualPrompt += `- Experience Level: ${profile.experienceLevel}\n`;
      if (profile.company) contextualPrompt += `- Company: ${profile.company}\n`;
      if (profile.tallyVersion) contextualPrompt += `- Tally Version: ${profile.tallyVersion}\n`;
      contextualPrompt += `- Preferred Language: ${profile.preferredLanguage}\n\n`;
    }

    // Add conversation context
    if (context.currentTopic) {
      contextualPrompt += `Current Topic: ${context.currentTopic}\n`;
    }
    if (context.relatedTopics.length > 0) {
      contextualPrompt += `Related Topics: ${context.relatedTopics.join(', ')}\n`;
    }
    if (context.userIntent) {
      contextualPrompt += `User Intent: ${context.userIntent}\n`;
    }

    // Add recent conversation history (last 3 messages)
    if (context.messages.length > 0) {
      contextualPrompt += `\nRecent Conversation:\n`;
      const recentMessages = context.messages.slice(-3);
      for (const msg of recentMessages) {
        contextualPrompt += `${msg.role}: ${msg.content.substring(0, 100)}...\n`;
      }
    }

    // Add user preferences
    if (preferences) {
      contextualPrompt += `\nUser Preferences:\n`;
      contextualPrompt += `- Response Style: ${preferences.responseStyle}\n`;
      contextualPrompt += `- Show Steps: ${preferences.showSteps}\n`;
      contextualPrompt += `- Include Examples: ${preferences.includeExamples}\n`;
    }

    // Add learning insights
    if (insights.length > 0) {
      const topTopics = insights
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 3)
        .map(i => `${i.topic} (${i.frequency}x)`);
      contextualPrompt += `\nUser's Common Topics: ${topTopics.join(', ')}\n`;
    }

    contextualPrompt += `\nPlease provide a personalized response based on this context.`;

    return contextualPrompt;
  }

  // Session Management
  async createSession(userId?: string): Promise<string> {
    const sessionId = randomUUID();
    
    if (userId) {
      await this.createConversationContext(sessionId, userId);
    }
    
    console.log(`🎯 Created session: ${sessionId}${userId ? ` for user ${userId}` : ''}`);
    return sessionId;
  }

  async getSessionUserId(sessionId: string): Promise<string | null> {
    return this.sessionUserMap.get(sessionId) || null;
  }

  // Analytics and Insights
  getMemoryStats(): {
    totalUsers: number;
    activeSessions: number;
    totalInsights: number;
    topTopics: Array<{ topic: string; frequency: number }>;
  } {
    const totalUsers = this.userProfiles.size;
    const activeSessions = this.conversationContexts.size;
    
    // Calculate total insights and top topics
    let totalInsights = 0;
    const topicFrequency: Map<string, number> = new Map();
    
    for (const insights of this.learningInsights.values()) {
      totalInsights += insights.length;
      for (const insight of insights) {
        const current = topicFrequency.get(insight.topic) || 0;
        topicFrequency.set(insight.topic, current + insight.frequency);
      }
    }

    const topTopics = Array.from(topicFrequency.entries())
      .map(([topic, frequency]) => ({ topic, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return {
      totalUsers,
      activeSessions,
      totalInsights,
      topTopics
    };
  }
}

// Export singleton instance
export const memoryService = new MemoryService();
