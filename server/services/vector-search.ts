import { pipeline, env } from '@xenova/transformers';
import { FaqItem } from '@shared/schema';

// Configure transformers for server-side usage
env.allowLocalModels = false;
env.allowRemoteModels = true;

interface EmbeddedFaqItem extends FaqItem {
  embedding?: number[];
  combinedText?: string;
}

interface SearchResult {
  item: FaqItem;
  score: number;
  similarity: number;
  matchType: 'semantic' | 'keyword' | 'hybrid';
}

export class VectorSearchService {
  private embeddingModel: any = null;
  private embeddedItems: Map<string, EmbeddedFaqItem> = new Map();
  private isInitialized = false;

  async initialize(faqItems: FaqItem[]): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Vector Search with embeddings...');
      
      // Load lightweight embedding model
      this.embeddingModel = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        { 
          revision: 'main',
          quantized: true // Use quantized model for better performance
        }
      );

      console.log('✅ Embedding model loaded successfully');

      // Generate embeddings for all FAQ items
      await this.generateEmbeddings(faqItems);
      
      this.isInitialized = true;
      console.log(`🎯 Vector search initialized with ${this.embeddedItems.size} embedded items`);
      
    } catch (error) {
      console.error('❌ Failed to initialize vector search:', error);
      // Fallback to keyword search if vector search fails
      this.isInitialized = false;
    }
  }

  private async generateEmbeddings(faqItems: FaqItem[]): Promise<void> {
    console.log('📊 Generating embeddings for FAQ items...');
    
    for (const item of faqItems) {
      try {
        // Combine question, answer, and keywords for better semantic understanding
        const combinedText = this.createCombinedText(item);
        
        // Generate embedding
        const embedding = await this.generateEmbedding(combinedText);
        
        const embeddedItem: EmbeddedFaqItem = {
          ...item,
          embedding,
          combinedText
        };
        
        this.embeddedItems.set(item.id, embeddedItem);
        
      } catch (error) {
        console.error(`❌ Failed to generate embedding for item ${item.id}:`, error);
        // Store item without embedding as fallback
        this.embeddedItems.set(item.id, { ...item });
      }
    }
    
    console.log(`✅ Generated embeddings for ${this.embeddedItems.size} items`);
  }

  private createCombinedText(item: FaqItem): string {
    // Create rich text representation for better embeddings
    const parts = [
      `Question: ${item.question}`,
      `Answer: ${item.answer}`,
      `Category: ${item.category}`
    ];

    if (item.keywords && item.keywords.length > 0) {
      parts.push(`Keywords: ${item.keywords.join(', ')}`);
    }

    if (item.steps && Array.isArray(item.steps)) {
      const stepsText = item.steps
        .map((step: any) => `Step ${step.step}: ${step.description}`)
        .join(' ');
      parts.push(`Steps: ${stepsText}`);
    }

    return parts.join(' ');
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    if (!this.embeddingModel) {
      throw new Error('Embedding model not initialized');
    }

    const output = await this.embeddingModel(text, {
      pooling: 'mean',
      normalize: true
    });

    return Array.from(output.data);
  }

  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  private performKeywordSearch(query: string, items: FaqItem[]): SearchResult[] {
    const queryLower = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const item of items) {
      let score = 0;

      // Exact question match gets highest score
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      // Keyword matches
      if (item.keywords) {
        for (const keyword of item.keywords) {
          if (queryLower.includes(keyword.toLowerCase())) {
            score += 5;
          }
        }
      }

      // Category match
      if (item.category.toLowerCase().includes(queryLower)) {
        score += 3;
      }

      // Answer content match
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 2;
      }

      // Common Tally terms boost
      const tallyTerms = ['tally', 'gst', 'invoice', 'voucher', 'ledger', 'company', 'report'];
      for (const term of tallyTerms) {
        if (queryLower.includes(term)) {
          score += 1;
        }
      }

      if (score > 0) {
        results.push({
          item,
          score,
          similarity: 0,
          matchType: 'keyword'
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    const allItems = Array.from(this.embeddedItems.values());

    // If vector search is not initialized, fall back to keyword search
    if (!this.isInitialized || !this.embeddingModel) {
      console.log('🔍 Using keyword search (vector search not available)');
      return this.performKeywordSearch(query, allItems).slice(0, limit);
    }

    try {
      console.log(`🔍 Performing hybrid search for: "${query}"`);

      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // Perform semantic search
      const semanticResults: SearchResult[] = [];
      
      for (const item of this.embeddedItems.values()) {
        if (item.embedding) {
          const similarity = this.calculateCosineSimilarity(queryEmbedding, item.embedding);
          
          if (similarity > 0.3) { // Threshold for semantic relevance
            semanticResults.push({
              item: item as FaqItem,
              score: similarity * 10, // Scale for comparison with keyword scores
              similarity,
              matchType: 'semantic'
            });
          }
        }
      }

      // Perform keyword search
      const keywordResults = this.performKeywordSearch(query, allItems);

      // Combine and deduplicate results
      const combinedResults = new Map<string, SearchResult>();

      // Add semantic results
      for (const result of semanticResults) {
        combinedResults.set(result.item.id, result);
      }

      // Add or enhance with keyword results
      for (const result of keywordResults) {
        const existing = combinedResults.get(result.item.id);
        if (existing) {
          // Combine scores for hybrid approach
          existing.score = Math.max(existing.score, result.score) + (existing.similarity * 5);
          existing.matchType = 'hybrid';
        } else {
          combinedResults.set(result.item.id, result);
        }
      }

      // Sort by combined score and return top results
      const finalResults = Array.from(combinedResults.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      console.log(`✅ Found ${finalResults.length} results (${semanticResults.length} semantic, ${keywordResults.length} keyword)`);
      
      return finalResults;

    } catch (error) {
      console.error('❌ Vector search failed, falling back to keyword search:', error);
      return this.performKeywordSearch(query, allItems).slice(0, limit);
    }
  }

  getStats(): { totalItems: number, embeddedItems: number, isInitialized: boolean } {
    const embeddedCount = Array.from(this.embeddedItems.values())
      .filter(item => item.embedding).length;
    
    return {
      totalItems: this.embeddedItems.size,
      embeddedItems: embeddedCount,
      isInitialized: this.isInitialized
    };
  }
}

// Export singleton instance
export const vectorSearchService = new VectorSearchService();
